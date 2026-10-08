/**
 * Seeds permissions + role_permissions from the Phase 1 matrix.
 * Safe to re-run (ON CONFLICT DO NOTHING).
 */
import pg from 'pg';

import { loadEnv } from './load-env.mjs';

loadEnv();

const ROLE_PERMISSIONS = {
  moderator: [
    'users.read',
    'analytics.read',
    'cms.read',
    'cms.write',
    'guides.read',
    'events.read',
    'flags.read',
    'health.read',
    'notifications.read',
    'media.read',
    'audit.read',
  ],
  admin: [
    'users.read',
    'users.write',
    'analytics.read',
    'analytics.export',
    'notifications.read',
    'notifications.write',
    'cms.read',
    'cms.write',
    'cms.publish',
    'guides.read',
    'guides.write',
    'events.read',
    'events.write',
    'flags.read',
    'flags.write',
    'health.read',
    'logs.read',
    'security.read',
    'ai.read',
    'media.read',
    'media.write',
    'rbac.read',
    'audit.read',
  ],
  super_admin: [
    'users.read',
    'users.write',
    'users.delete',
    'analytics.read',
    'analytics.export',
    'notifications.read',
    'notifications.write',
    'cms.read',
    'cms.write',
    'cms.publish',
    'guides.read',
    'guides.write',
    'events.read',
    'events.write',
    'flags.read',
    'flags.write',
    'health.read',
    'logs.read',
    'security.read',
    'security.write',
    'ai.read',
    'ai.write',
    'media.read',
    'media.write',
    'rbac.read',
    'rbac.write',
    'audit.read',
  ],
};

const ALL_PERMISSIONS = [...new Set(Object.values(ROLE_PERMISSIONS).flat())].sort();

function slugToParts(slug) {
  const dot = slug.indexOf('.');
  if (dot === -1) return { resource: slug, action: 'access' };
  return { resource: slug.slice(0, dot), action: slug.slice(dot + 1) };
}

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://ahlulbayt:ahlulbayt@localhost:5432/ahlulbayt';

const client = new pg.Client({ connectionString });

try {
  await client.connect();

  for (const slug of ALL_PERMISSIONS) {
    const { resource, action } = slugToParts(slug);
    await client.query(
      `INSERT INTO permissions (slug, resource, action, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO NOTHING`,
      [slug, resource, action, `Phase 1 seed: ${slug}`],
    );
  }

  const rolesRes = await client.query(`SELECT id, slug FROM roles`);
  const permsRes = await client.query(`SELECT id, slug FROM permissions`);

  const roleIdBySlug = new Map(rolesRes.rows.map((r) => [r.slug, r.id]));
  const permIdBySlug = new Map(permsRes.rows.map((p) => [p.slug, p.id]));

  let links = 0;
  for (const [roleSlug, slugs] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleIdBySlug.get(roleSlug);
    if (!roleId) continue;
    for (const permSlug of slugs) {
      const permissionId = permIdBySlug.get(permSlug);
      if (!permissionId) continue;
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT (role_id, permission_id) DO NOTHING`,
        [roleId, permissionId],
      );
      links += 1;
    }
  }

  console.log(`RBAC seeded: ${permsRes.rows.length} permissions, ${links} role links.`);
} catch (err) {
  console.error('Failed to seed RBAC:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

if (process.exitCode) process.exit(process.exitCode);
