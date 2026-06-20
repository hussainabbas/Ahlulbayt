#!/usr/bin/env node
/**
 * Production entrypoint: migrate → seed admin → start API.
 * Used by Railway/Docker so ADMIN_SEED_* vars actually create the login user.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

function run(label, script) {
  console.log(`[start] ${label}...`);
  const result = spawnSync(process.execPath, [join(root, script)], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`[start] ${label} failed (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
}

run('migrations', 'apply-migrations.mjs');
run('admin seed', 'seed-admin-user.mjs');

console.log('[start] launching API...');
const api = spawnSync(process.execPath, [join(root, '..', 'dist', 'main.js')], {
  stdio: 'inherit',
  env: process.env,
});
process.exit(api.status ?? 1);
