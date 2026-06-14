import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const { Client } = pg;
const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://ahlulbayt:ahlulbayt@localhost:5432/ahlulbayt';

const client = new Client({ connectionString });
await client.connect();
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
