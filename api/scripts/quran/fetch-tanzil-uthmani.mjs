#!/usr/bin/env node
/**
 * Download Tanzil Uthmani v1.1 text and parse into per-surah JSON + checksum manifest.
 *
 * Source: https://tanzil.net/download/ (POST to /pub/download/index.php)
 * Format: surah|ayah|text (txt-2)
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { CANONICAL_AYAH_COUNTS, SURAH_COUNT, TOTAL_AYAHS } from './canonical-ayah-counts.mjs';
import { parseTanzilText } from './parse-tanzil.mjs';
import {
  MANIFEST_PATH,
  SOURCE_DIR,
  TANZIL_ATTRIBUTION,
  TANZIL_DOWNLOAD_URL,
  TANZIL_RAW_FILENAME,
} from './paths.mjs';

const TANZIL_FORM = {
  quranType: 'uthmani',
  outType: 'txt-2',
  agree: 'true',
  marks: 'true',
  sajdah: 'true',
  tatweel: 'true',
};

async function downloadTanzilText() {
  const body = new URLSearchParams(TANZIL_FORM);
  const response = await fetch(TANZIL_DOWNLOAD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/plain, application/octet-stream, */*',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Tanzil download failed: HTTP ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function validateParsedCorpus(bySurah) {
  const errors = [];

  if (bySurah.size !== SURAH_COUNT) {
    errors.push(`Expected ${SURAH_COUNT} surahs, got ${bySurah.size}`);
  }

  let totalAyahs = 0;
  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    const ayahs = bySurah.get(surah);
    const expected = CANONICAL_AYAH_COUNTS[surah - 1];

    if (!ayahs) {
      errors.push(`Missing surah ${surah}`);
      continue;
    }

    if (ayahs.length !== expected) {
      errors.push(`Surah ${surah}: expected ${expected} ayahs, got ${ayahs.length}`);
    }

    const seen = new Set();
    for (const row of ayahs) {
      const key = `${surah}:${row.ayah}`;
      if (seen.has(key)) errors.push(`Duplicate ayah ${key}`);
      seen.add(key);
      if (!row.text?.trim()) errors.push(`Empty text at ${key}`);
    }

    totalAyahs += ayahs.length;
  }

  if (totalAyahs !== TOTAL_AYAHS) {
    errors.push(`Expected ${TOTAL_AYAHS} total ayahs, got ${totalAyahs}`);
  }

  if (errors.length) {
    throw new Error(`Parsed corpus failed validation:\n- ${errors.join('\n- ')}`);
  }
}

async function main() {
  await mkdir(SOURCE_DIR, { recursive: true });

  console.log(`Fetching ${TANZIL_ATTRIBUTION} from Tanzil…`);
  const raw = await downloadTanzilText();
  const rawPath = join(SOURCE_DIR, TANZIL_RAW_FILENAME);
  await writeFile(rawPath, raw, 'utf8');
  console.log(`Saved raw text: ${rawPath} (${raw.length} bytes)`);

  const bySurah = parseTanzilText(raw);
  validateParsedCorpus(bySurah);

  const surahManifest = {};
  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    const ayahs = bySurah.get(surah);
    const payload = {
      surah,
      source: TANZIL_ATTRIBUTION,
      ayahCount: ayahs.length,
      ayahs,
    };
    const json = JSON.stringify(payload, null, 0);
    const fileName = `surah-${String(surah).padStart(3, '0')}.json`;
    const filePath = join(SOURCE_DIR, fileName);
    await writeFile(filePath, json, 'utf8');
    surahManifest[String(surah)] = {
      file: fileName,
      ayahCount: ayahs.length,
      sha256: sha256(json),
    };
  }

  const manifest = {
    version: 1,
    source: TANZIL_ATTRIBUTION,
    downloadUrl: 'https://tanzil.net/download/',
    fetchedAt: new Date().toISOString(),
    totalAyahs: TOTAL_AYAHS,
    surahCount: SURAH_COUNT,
    rawSha256: sha256(raw),
    surahs: surahManifest,
  };

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Wrote manifest: ${MANIFEST_PATH}`);
  console.log('Fetch complete — run npm run quran:build next.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
