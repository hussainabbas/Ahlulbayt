#!/usr/bin/env node
/**
 * Download the Tanzil Uthmani v1.1 text and Tanzil metadata, and pin them.
 *
 * Source: https://tanzil.net/download/ (POST to /pub/download/index.php, format txt-2)
 *
 * The committed manifest pins the SHA-256 of the text. A download that differs
 * from the pinned text is NEVER applied silently: it is saved next to the pinned
 * file as a candidate and the script fails, unless --accept-update is passed
 * after a human has reviewed the difference (see https://tanzil.net/updates/).
 */
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { SURAH_COUNT, TOTAL_AYAHS } from './canonical-ayah-counts.mjs';
import {
  checkSourceStructure,
  corpusSha256,
  parseTanzilMetadata,
  sha256,
  sourceSurahSha256,
  surahFileName,
} from './corpus-lib.mjs';
import { parseTanzilText } from './parse-tanzil.mjs';
import {
  MANIFEST_PATH,
  SOURCE_DIR,
  TANZIL_ATTRIBUTION,
  TANZIL_DOWNLOAD_URL,
  TANZIL_METADATA_FILENAME,
  TANZIL_METADATA_PATH,
  TANZIL_METADATA_URL,
  TANZIL_RAW_PATH,
} from './paths.mjs';

const TANZIL_FORM = {
  quranType: 'uthmani',
  outType: 'txt-2',
  agree: 'true',
  marks: 'true',
  sajdah: 'true',
  tatweel: 'true',
};

async function download(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Download failed: ${url} → HTTP ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function downloadTanzilText() {
  return download(TANZIL_DOWNLOAD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/plain, application/octet-stream, */*',
    },
    body: new URLSearchParams(TANZIL_FORM),
  });
}

async function main() {
  const acceptUpdate = process.argv.includes('--accept-update');
  await mkdir(SOURCE_DIR, { recursive: true });

  const previous = existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
    : null;

  console.log(`Fetching ${TANZIL_ATTRIBUTION} from Tanzil…`);
  const raw = await downloadTanzilText();
  const rawSha = sha256(raw);

  const bySurah = parseTanzilText(raw);
  const structural = checkSourceStructure(bySurah);
  if (structural.length) {
    throw new Error(
      `Downloaded text failed validation:\n- ${structural
        .map((e) => `${e.code} ${e.ref}: ${e.detail}`)
        .join('\n- ')}`,
    );
  }

  if (previous?.rawSha256 && previous.rawSha256 !== rawSha && !acceptUpdate) {
    const candidate = join(SOURCE_DIR, 'quran-uthmani.candidate.txt');
    await writeFile(candidate, raw, 'utf8');
    throw new Error(
      [
        'Tanzil text differs from the pinned version.',
        `  pinned sha256:     ${previous.rawSha256}`,
        `  downloaded sha256: ${rawSha}`,
        `  candidate saved:   ${candidate}`,
        'Review the change against https://tanzil.net/updates/ and re-run with --accept-update.',
      ].join('\n'),
    );
  }

  const metadataJs = await download(TANZIL_METADATA_URL);
  parseTanzilMetadata(metadataJs); // throws when the structure is not what we expect
  const metadataSha = sha256(metadataJs);

  await writeFile(TANZIL_RAW_PATH, raw, 'utf8');
  await writeFile(TANZIL_METADATA_PATH, metadataJs, 'utf8');
  console.log(`Saved ${TANZIL_RAW_PATH} (${raw.length} chars, sha256 ${rawSha})`);

  const surahs = {};
  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    const ayahs = bySurah.get(surah);
    surahs[String(surah)] = {
      file: surahFileName(surah),
      ayahCount: ayahs.length,
      sha256: sourceSurahSha256(surah, TANZIL_ATTRIBUTION, ayahs),
    };
  }

  const textUnchanged = previous?.rawSha256 === rawSha;
  const metadataUnchanged = previous?.metadata?.sha256 === metadataSha;
  const unchanged = textUnchanged && metadataUnchanged;
  const now = new Date().toISOString();

  const manifest = {
    ...(previous ?? {}),
    version: 2,
    source: TANZIL_ATTRIBUTION,
    license: 'Creative Commons Attribution 3.0 — verbatim copies only; see copyright block in the source file',
    downloadUrl: 'https://tanzil.net/download/',
    // Date the pinned text was first obtained; only moves when the text itself changes.
    fetchedAt: textUnchanged ? previous.fetchedAt : now,
    totalAyahs: TOTAL_AYAHS,
    surahCount: SURAH_COUNT,
    rawFile: 'source/quran-uthmani.txt',
    rawSha256: rawSha,
    corpusSha256: corpusSha256(bySurah),
    metadata: {
      file: `source/${TANZIL_METADATA_FILENAME}`,
      source: TANZIL_METADATA_URL,
      sha256: metadataSha,
      fetchedAt: metadataUnchanged ? previous.metadata.fetchedAt : now,
    },
    surahs,
  };

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(
    unchanged
      ? 'Tanzil text and metadata are identical to the pinned versions.'
      : `Wrote manifest: ${MANIFEST_PATH}`,
  );
  console.log('Next: npm run quran:build && npm run quran:validate');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
