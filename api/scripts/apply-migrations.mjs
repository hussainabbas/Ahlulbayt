import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

import { loadEnv } from './load-env.mjs';

loadEnv();

const { Client } = pg;
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

function pgSsl(url) {
  return /sslmode=require|ssl=true/i.test(url) ? { rejectUnauthorized: false } : undefined;
}

const client = new Client({ connectionString, ssl: pgSsl(connectionString) });

console.log(`Connecting to PostgreSQL at ${describeDatabaseTarget(connectionString)} ...`);

try {
  await client.connect();
} catch (err) {
  const message = err?.message?.trim() || String(err);
  console.error('Cannot connect to PostgreSQL:', message || 'ECONNREFUSED');
  console.error('');
  console.error('1. Start Docker Desktop, then from the REPO ROOT (not your home folder):');
  console.error('     cd D:\\Offices\\Personal\\Ahlulbayt+');
  console.error('     docker compose up -d');
  console.error('');
  console.error('2. Set api/.env to match Docker (port 5432):');
  console.error('     DATABASE_URL=postgresql://ahlulbayt:ahlulbayt@localhost:5432/ahlulbayt');
  console.error('');
  console.error('3. Retry:');
  console.error('     cd api && node scripts/apply-migrations.mjs');
  process.exit(1);
}

await client.query("SET client_encoding TO 'UTF8'");

const dir = join(process.cwd(), 'drizzle', 'migrations');
const from = process.argv[2] ?? '0000';

function prepareSql(file, sql) {
  let out = sql.replace(/\u2192/g, '->');
  if (file === '0005_ai_extended.sql') {
    out = out
      .replace(/CREATE EXTENSION IF NOT EXISTS vector;\s*/g, '')
      .replace(/embedding\s+vector\(1536\),/g, 'embedding REAL[],');
  }
  if (file === '0007_analytics_mosques.sql') {
    out = out
      .replace(/CREATE EXTENSION IF NOT EXISTS cube;\s*/g, '')
      .replace(/CREATE EXTENSION IF NOT EXISTS earthdistance;\s*/g, '')
      .replace(
        /CREATE INDEX IF NOT EXISTS idx_mosques_geo[\s\S]*?;/m,
        'CREATE INDEX IF NOT EXISTS idx_mosques_lat_lon ON mosques(latitude, longitude);',
      );
  }
  if (file === '0011_hadith_corpus.sql') {
    out = out.replace(/embedding\s+VECTOR\(1536\)/gi, 'embedding REAL[]');
  }
  return out;
}

const files = readdirSync(dir)
  .filter((f) => f.endsWith('.sql') && f >= `${from}_`)
  .sort();

for (const file of files) {
  const sql = prepareSql(file, readFileSync(join(dir, file), 'utf8'));
  process.stdout.write(`Applying ${file}... `);
  try {
    await client.query(sql);
    console.log('ok');
  } catch (err) {
    console.log('FAILED');
    console.error(err.message);
    process.exitCode = 1;
    break;
  }
}

await client.end();
if (process.exitCode) process.exit(process.exitCode);
console.log('All migrations applied.');
