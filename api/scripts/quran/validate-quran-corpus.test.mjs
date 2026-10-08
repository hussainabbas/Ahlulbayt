import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  CANONICAL_AYAH_COUNTS,
  SURAH_COUNT,
  TOTAL_AYAHS,
  expectedAyahCount,
} from './canonical-ayah-counts.mjs';

test('canonical Hafs corpus has 114 surahs', () => {
  assert.equal(CANONICAL_AYAH_COUNTS.length, SURAH_COUNT);
});

test('canonical Hafs corpus totals 6236 ayahs', () => {
  assert.equal(TOTAL_AYAHS, 6236);
});

test('expectedAyahCount returns known surah sizes', () => {
  assert.equal(expectedAyahCount(1), 7);
  assert.equal(expectedAyahCount(2), 286);
  assert.equal(expectedAyahCount(114), 6);
  assert.equal(expectedAyahCount(0), undefined);
  assert.equal(expectedAyahCount(115), undefined);
});

test('validate script supports --if-present flag', async () => {
  const { spawn } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const script = fileURLToPath(new URL('./validate-quran-corpus.mjs', import.meta.url));

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, '--if-present', '--dir', '/nonexistent/quran'], {
      stdio: 'pipe',
    });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('close', (code) => {
      try {
        assert.equal(code, 0);
        assert.match(stderr, /skipped/i);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
});
