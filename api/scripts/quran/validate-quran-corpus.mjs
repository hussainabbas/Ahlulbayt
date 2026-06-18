#!/usr/bin/env node
/**
 * Validate Quran corpus integrity (counts, uniqueness, checksums).
 *
 * Usage:
 *   node validate-quran-corpus.mjs
 *   node validate-quran-corpus.mjs --if-present   # exit 0 when no bundles exist
 *   node validate-quran-corpus.mjs --dir api/data/quran/bundles
 */
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  CANONICAL_AYAH_COUNTS,
  SURAH_COUNT,
  TOTAL_AYAHS,
  expectedAyahCount,
} from './canonical-ayah-counts.mjs';
import { BUNDLES_DIR, MANIFEST_PATH, SOURCE_DIR } from './paths.mjs';

function parseArgs(argv) {
  const args = { ifPresent: false, dir: BUNDLES_DIR, checkManifest: true };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--if-present') args.ifPresent = true;
    else if (arg === '--no-manifest') args.checkManifest = false;
    else if (arg === '--dir') {
      args.dir = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function surahFileName(surah) {
  return `surah-${String(surah).padStart(3, '0')}.json`;
}

async function validateBundles(dir, manifest) {
  const errors = [];
  const seen = new Set();
  let totalAyahs = 0;

  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    const filePath = join(dir, surahFileName(surah));
    if (!(await exists(filePath))) {
      errors.push(`Missing bundle file: ${filePath}`);
      continue;
    }

    const raw = await readFile(filePath, 'utf8');
    let bundle;
    try {
      bundle = JSON.parse(raw);
    } catch {
      errors.push(`Invalid JSON: ${filePath}`);
      continue;
    }

    const expected = expectedAyahCount(surah);
    if (bundle.surah !== surah) {
      errors.push(`Surah number mismatch in ${filePath}: ${bundle.surah}`);
    }

    if (!Array.isArray(bundle.ayahs)) {
      errors.push(`Missing ayahs array in ${filePath}`);
      continue;
    }

    if (bundle.ayahs.length !== expected) {
      errors.push(`Surah ${surah}: expected ${expected} ayahs, got ${bundle.ayahs.length}`);
    }

    if (bundle.ayahs.length !== CANONICAL_AYAH_COUNTS[surah - 1]) {
      errors.push(`Surah ${surah}: canonical count mismatch`);
    }

    for (const ayah of bundle.ayahs) {
      const key = `${ayah.surah}:${ayah.ayah}`;
      if (seen.has(key)) errors.push(`Duplicate ayah key ${key}`);
      seen.add(key);

      if (!ayah.arabic?.trim()) errors.push(`Empty arabic text at ${key}`);
      if (ayah.surah !== surah) errors.push(`Ayah surah mismatch at ${key}`);
    }

    totalAyahs += bundle.ayahs.length;

    if (manifest?.surahs?.[String(surah)]?.sha256) {
      const { createHash } = await import('node:crypto');
      const digest = createHash('sha256').update(raw, 'utf8').digest('hex');
      const sourcePath = join(SOURCE_DIR, surahFileName(surah));
      if (await exists(sourcePath)) {
        const sourceRaw = await readFile(sourcePath, 'utf8');
        const sourceDigest = createHash('sha256').update(sourceRaw, 'utf8').digest('hex');
        if (sourceDigest !== manifest.surahs[String(surah)].sha256) {
          errors.push(`SHA256 mismatch for surah ${surah} source vs manifest`);
        }
      } else if (digest !== manifest.surahs[String(surah)].sha256) {
        errors.push(`SHA256 mismatch for surah ${surah} bundle vs manifest`);
      }
    }
  }

  if (totalAyahs !== TOTAL_AYAHS) {
    errors.push(`Total ayah count ${totalAyahs}, expected ${TOTAL_AYAHS}`);
  }

  return errors;
}

async function main() {
  const args = parseArgs(process.argv);
  const hasBundles = await exists(join(args.dir, surahFileName(1)));

  if (!hasBundles) {
    const message = `No Quran bundles found in ${args.dir}. Run: npm run quran:fetch && npm run quran:build`;
    if (args.ifPresent) {
      console.warn(`[quran:validate] skipped — ${message}`);
      return;
    }
    console.error(message);
    process.exit(1);
  }

  let manifest;
  if (args.checkManifest && (await exists(MANIFEST_PATH))) {
    manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  }

  const errors = await validateBundles(args.dir, manifest);
  if (errors.length) {
    console.error('Quran corpus validation FAILED:');
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  console.log(`Quran corpus validation passed (${SURAH_COUNT} surahs, ${TOTAL_AYAHS} ayahs).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
