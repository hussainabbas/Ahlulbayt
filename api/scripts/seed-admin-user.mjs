/**
 * Seeds the default local super-admin account.
 * Safe to re-run — updates password and role if the user already exists.
 *
 * Defaults (override via env):
 *   ADMIN_SEED_EMAIL=admin@ahlulbayt.com
 *   ADMIN_SEED_PASSWORD=Ahlulbayt@512
 */
import bcrypt from 'bcrypt';
import pg from 'pg';

import { loadEnv } from './load-env.mjs';

loadEnv();

const { Client } = pg;

const email = (process.env.ADMIN_SEED_EMAIL ?? 'admin@ahlulbayt.com').toLowerCase().trim();
const password = process.env.ADMIN_SEED_PASSWORD ?? 'Ahlulbayt@512';
const displayName = process.env.ADMIN_SEED_DISPLAY_NAME ?? 'Admin';
const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://ahlulbayt:ahlulbayt@localhost:5432/ahlulbayt';

function describeDatabaseTarget(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}:${parsed.port || '5432'}${parsed.pathname}`;
  } catch {
    return '(invalid DATABASE_URL)';
  }
}

const BCRYPT_ROUNDS = 12;

function pgSsl(url) {
  return /sslmode=require|ssl=true/i.test(url) ? { rejectUnauthorized: false } : undefined;
}

const client = new Client({ connectionString, ssl: pgSsl(connectionString) });

console.log(`Connecting to PostgreSQL at ${describeDatabaseTarget(connectionString)} ...`);

try {
  await client.connect();
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const existing = await client.query(
    `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1`,
    [email],
  );

  let userId;

  if (existing.rows[0]) {
    userId = existing.rows[0].id;
    await client.query(
      `UPDATE users
       SET password_hash = $1,
           role = 'super_admin',
           display_name = COALESCE(display_name, $2),
           email_verified = TRUE,
           updated_at = NOW()
       WHERE id = $3`,
      [passwordHash, displayName, userId],
    );
    console.log(`Updated existing admin user: ${email}`);
  } else {
    const inserted = await client.query(
      `INSERT INTO users (email, password_hash, display_name, role, email_verified, locale)
       VALUES ($1, $2, $3, 'super_admin', TRUE, 'en')
       RETURNING id`,
      [email, passwordHash, displayName],
    );
    userId = inserted.rows[0].id;
    console.log(`Created admin user: ${email}`);
  }

  await client.query(
    `INSERT INTO admin_users (user_id, title, department)
     VALUES ($1, 'Super Admin', 'Platform')
     ON CONFLICT (user_id) DO NOTHING`,
    [userId],
  );

  const roleRow = await client.query(
    `SELECT id FROM roles WHERE slug = 'super_admin' LIMIT 1`,
  );

  if (roleRow.rows[0]) {
    await client.query(
      `INSERT INTO admin_user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, role_id) DO NOTHING`,
      [userId, roleRow.rows[0].id],
    );
  }

  console.log('Default admin ready.');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     super_admin`);
} catch (err) {
  const code = err?.code ?? '';
  const message = err?.message?.trim() || String(err);
  console.error('Failed to seed admin user:', message || '(no details)');
  console.error(`Target: ${describeDatabaseTarget(connectionString)}`);
  console.error(`Loaded api/.env: ${process.env.DATABASE_URL ? 'yes' : 'no (using default localhost:5432)'}`);

  if (code === 'ECONNREFUSED' || message.includes('ECONNREFUSED')) {
    console.error('');
    console.error('PostgreSQL is not reachable. From the repo root run:');
    console.error('  docker compose up -d');
    console.error('Then apply migrations:');
    console.error('  cd api && node scripts/apply-migrations.mjs');
    console.error('Then seed again:');
    console.error('  npm run db:seed:admin');
  } else if (message.includes('relation "users" does not exist')) {
    console.error('Run migrations first: node scripts/apply-migrations.mjs');
  } else if (message.includes('relation "admin_users" does not exist')) {
    console.error('Run migration 0012_admin_platform.sql (or apply-migrations.mjs).');
  }
  process.exitCode = 1;
} finally {
  await client.end();
}

if (process.exitCode) process.exit(process.exitCode);
