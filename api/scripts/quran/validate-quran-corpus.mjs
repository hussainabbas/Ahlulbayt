#!/usr/bin/env node
/**
 * Quran integrity gate. Exits non-zero on ANY discrepancy.
 *
 * Verifies, in order:
 *   1. the pinned Tanzil text is the exact file recorded in manifest.json (SHA-256)
 *   2. the source has 114 surahs / 6236 ayahs in order, with no stray characters
 *   3. Tanzil's own metadata and the app's surah metadata agree on every ayah count
 *   4. every bundled surah matches the source verse by verse, code point by code point
 *      (missing, duplicate, truncated, modified, re-ordered verses are all reported)
 *   5. every bundle file has the SHA-256 recorded in manifest.json
 *
 * Usage:
 *   node validate-quran-corpus.mjs                    # full check (source + mobile bundles)
 *   node validate-quran-corpus.mjs --source-only      # API image build: no mobile tree present
 *   node validate-quran-corpus.mjs --dir <bundles>    # check another bundle directory
 *   node validate-quran-corpus.mjs --report <file.md> # also write a Markdown report
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CANONICAL_AYAH_COUNTS, SURAH_COUNT, TOTAL_AYAHS } from './canonical-ayah-counts.mjs';
import {
  checkSourceStructure,
  corpusSha256,
  loadPinnedSource,
  parseTanzilMetadata,
  sha256,
  sourceSurahSha256,
  surahFileName,
  verifyBundle,
} from './corpus-lib.mjs';
import {
  MANIFEST_PATH,
  MOBILE_GENERATED_DIR,
  MOBILE_METADATA_PATH,
  TANZIL_ATTRIBUTION,
  TANZIL_METADATA_PATH,
  TANZIL_RAW_PATH,
} from './paths.mjs';

function parseArgs(argv) {
  const args = { dir: MOBILE_GENERATED_DIR, sourceOnly: false, report: null, quiet: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--source-only') args.sourceOnly = true;
    else if (arg === '--quiet') args.quiet = true;
    else if (arg === '--dir') args.dir = argv[(i += 1)];
    else if (arg === '--report') args.report = argv[(i += 1)];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

/**
 * Run every check and return a structured result.
 * @param {{ dir?: string, sourceOnly?: boolean }} options
 */
export async function validateCorpus(options = {}) {
  const dir = options.dir ?? MOBILE_GENERATED_DIR;
  const errors = [];
  const add = (list) => errors.push(...list);

  // 1. Manifest + pinned source
  if (!existsSync(MANIFEST_PATH)) {
    return finish([{ code: 'MANIFEST_MISSING', ref: MANIFEST_PATH, detail: 'run quran:fetch' }]);
  }
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const source = loadPinnedSource(TANZIL_RAW_PATH, manifest);
  add(source.errors);
  if (!source.raw) return finish(errors, manifest);

  // 2. Source structure and encoding
  add(checkSourceStructure(source.bySurah));

  if (manifest.corpusSha256 && corpusSha256(source.bySurah) !== manifest.corpusSha256) {
    add([{ code: 'CORPUS_CHECKSUM', ref: 'source', detail: 'parsed verse text differs from pin' }]);
  }
  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    const pinned = manifest.surahs?.[String(surah)];
    const ayahs = source.bySurah.get(surah) ?? [];
    if (!pinned) {
      add([{ code: 'MANIFEST_SURAH', ref: `${surah}`, detail: 'no manifest entry' }]);
    } else if (pinned.sha256 !== sourceSurahSha256(surah, TANZIL_ATTRIBUTION, ayahs)) {
      add([{ code: 'SURAH_CHECKSUM', ref: `${surah}`, detail: 'source text differs from pin' }]);
    }
  }

  // 3. Metadata cross-checks
  let tanzilMeta = null;
  if (!existsSync(TANZIL_METADATA_PATH)) {
    add([{ code: 'METADATA_MISSING', ref: TANZIL_METADATA_PATH, detail: 'run quran:fetch' }]);
  } else {
    const js = readFileSync(TANZIL_METADATA_PATH, 'utf8');
    if (manifest.metadata?.sha256 && sha256(js) !== manifest.metadata.sha256) {
      add([{ code: 'METADATA_CHECKSUM', ref: TANZIL_METADATA_PATH, detail: 'differs from pin' }]);
    }
    tanzilMeta = parseTanzilMetadata(js);
    tanzilMeta.suras.slice(0, SURAH_COUNT).forEach((sura, index) => {
      if (sura.ayas !== CANONICAL_AYAH_COUNTS[index]) {
        add([
          {
            code: 'METADATA_AYAH_COUNT',
            ref: `${index + 1}`,
            detail: `Tanzil metadata ${sura.ayas}, canonical ${CANONICAL_AYAH_COUNTS[index]}`,
          },
        ]);
      }
    });
  }

  if (!options.sourceOnly && existsSync(MOBILE_METADATA_PATH)) {
    const { loadSurahMetadata } = await import('./load-surah-metadata.mjs');
    for (const meta of loadSurahMetadata()) {
      const ref = `${meta.number}`;
      if (meta.ayahCount !== CANONICAL_AYAH_COUNTS[meta.number - 1]) {
        add([{ code: 'APP_METADATA_AYAH_COUNT', ref, detail: `app lists ${meta.ayahCount}` }]);
      }
      const tanzil = tanzilMeta?.suras[meta.number - 1];
      if (tanzil && tanzil.type !== meta.revelation) {
        add([
          {
            code: 'APP_METADATA_REVELATION',
            ref,
            detail: `app says ${meta.revelation}, Tanzil says ${tanzil.type}`,
          },
        ]);
      }
    }
  }

  // 4 + 5. Bundles
  let bundledAyahs = 0;
  let bundledSurahs = 0;
  if (!options.sourceOnly) {
    if (!existsSync(join(dir, 'registry.ts'))) {
      add([{ code: 'REGISTRY_MISSING', ref: dir, detail: 'run quran:build' }]);
    } else {
      const registry = readFileSync(join(dir, 'registry.ts'), 'utf8');
      if (!/GENERATED_CORPUS_READY = true/.test(registry)) {
        add([{ code: 'REGISTRY_NOT_READY', ref: 'registry.ts', detail: 'corpus flag is not true' }]);
      }
      if (!new RegExp(`GENERATED_SURAH_COUNT = ${SURAH_COUNT};`).test(registry)) {
        add([{ code: 'REGISTRY_COUNT', ref: 'registry.ts', detail: 'does not declare 114 surahs' }]);
      }
    }

    for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
      const filePath = join(dir, surahFileName(surah));
      if (!existsSync(filePath)) {
        add([{ code: 'BUNDLE_MISSING', ref: `${surah}`, detail: filePath }]);
        continue;
      }
      const raw = readFileSync(filePath, 'utf8');
      const pinned = manifest.bundles?.[String(surah)];
      if (!pinned) {
        add([{ code: 'BUNDLE_UNPINNED', ref: `${surah}`, detail: 'no checksum in manifest' }]);
      } else if (sha256(raw) !== pinned) {
        add([{ code: 'BUNDLE_CHECKSUM', ref: `${surah}`, detail: 'file differs from pinned build' }]);
      }

      let bundle;
      try {
        bundle = JSON.parse(raw);
      } catch {
        add([{ code: 'BUNDLE_JSON', ref: `${surah}`, detail: 'invalid JSON' }]);
        continue;
      }
      bundledSurahs += 1;
      bundledAyahs += Array.isArray(bundle.ayahs) ? bundle.ayahs.length : 0;
      add(verifyBundle(surah, bundle, source.bySurah.get(surah) ?? [], tanzilMeta));
    }

    if (bundledAyahs !== TOTAL_AYAHS) {
      add([{ code: 'TOTAL_AYAHS', ref: 'bundles', detail: `${bundledAyahs}, expected ${TOTAL_AYAHS}` }]);
    }
  }

  return finish(errors, manifest, source, { bundledSurahs, bundledAyahs, dir });

  function finish(list, mf = null, src = null, bundles = null) {
    const count = (codes) => list.filter((e) => codes.includes(e.code)).length;
    return {
      ok: list.length === 0,
      errors: list,
      summary: {
        source: mf?.source ?? null,
        rawSha256: mf?.rawSha256 ?? null,
        corpusSha256: mf?.corpusSha256 ?? null,
        fetchedAt: mf?.fetchedAt ?? null,
        bundleVersion: mf?.bundleVersion ?? null,
        sourceSurahs: src?.bySurah.size ?? 0,
        sourceAyahs: src ? [...src.bySurah.values()].reduce((n, a) => n + a.length, 0) : 0,
        bundledSurahs: bundles?.bundledSurahs ?? null,
        bundledAyahs: bundles?.bundledAyahs ?? null,
        missingAyahs: count(['MISSING_AYAH', 'BUNDLE_MISSING', 'SURAH_MISSING']),
        duplicateAyahs: count(['DUPLICATE_AYAH']),
        modifiedAyahs: count(['MODIFIED', 'TRUNCATED', 'EXTRA_TEXT']),
        truncatedAyahs: count(['TRUNCATED']),
        orderingErrors: count(['AYAH_ORDER']),
        encodingErrors: count(['ENCODING']),
        checksumErrors: count([
          'SOURCE_CHECKSUM',
          'CORPUS_CHECKSUM',
          'SURAH_CHECKSUM',
          'BUNDLE_CHECKSUM',
          'METADATA_CHECKSUM',
        ]),
        totalDiscrepancies: list.length,
      },
    };
  }
}

export function renderReport(result, { sourceOnly = false } = {}) {
  const s = result.summary;
  const lines = [
    '# Quran integrity verification report',
    '',
    `Result: **${result.ok ? 'PASS' : 'FAIL'}**${sourceOnly ? ' (source only)' : ''}`,
    '',
    '| Item | Value |',
    '| --- | --- |',
    `| Source | ${s.source} |`,
    `| Source fetched | ${s.fetchedAt} |`,
    `| Source file SHA-256 | \`${s.rawSha256}\` |`,
    `| Verse-text SHA-256 | \`${s.corpusSha256}\` |`,
    `| Bundle version | ${s.bundleVersion} |`,
    `| Surahs in source | ${s.sourceSurahs} |`,
    `| Ayahs in source | ${s.sourceAyahs} |`,
    `| Surahs bundled in the app | ${s.bundledSurahs ?? 'not checked'} |`,
    `| Ayahs bundled in the app | ${s.bundledAyahs ?? 'not checked'} |`,
    `| Missing ayahs | ${s.missingAyahs} |`,
    `| Duplicate ayahs | ${s.duplicateAyahs} |`,
    `| Modified ayahs (incl. truncated) | ${s.modifiedAyahs} |`,
    `| Truncated ayahs | ${s.truncatedAyahs} |`,
    `| Ordering errors | ${s.orderingErrors} |`,
    `| Encoding errors | ${s.encodingErrors} |`,
    `| Checksum errors | ${s.checksumErrors} |`,
    `| Total discrepancies | ${s.totalDiscrepancies} |`,
    '',
  ];
  if (result.errors.length) {
    lines.push('## Discrepancies', '', '| Code | Reference | Detail |', '| --- | --- | --- |');
    for (const e of result.errors) lines.push(`| ${e.code} | ${e.ref} | ${e.detail} |`);
    lines.push('');
  } else {
    lines.push('No discrepancies: every bundled verse is identical to the pinned Tanzil text.', '');
  }
  lines.push(
    'Generated by `npm run quran:validate -- --report <file>` in `api/`. Do not edit by hand.',
    '',
  );
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);
  const result = await validateCorpus(args);

  if (args.report) writeFileSync(args.report, renderReport(result, args), 'utf8');

  if (!result.ok) {
    console.error(`Quran corpus validation FAILED (${result.errors.length} discrepancies):`);
    for (const e of result.errors.slice(0, 50)) console.error(`  - ${e.code} ${e.ref}: ${e.detail}`);
    if (result.errors.length > 50) console.error(`  … ${result.errors.length - 50} more`);
    process.exit(1);
  }

  if (!args.quiet) {
    const s = result.summary;
    console.log(
      args.sourceOnly
        ? `Quran source verified: ${s.sourceSurahs} surahs, ${s.sourceAyahs} ayahs match the pinned Tanzil text.`
        : `Quran corpus verified: ${s.bundledSurahs} surahs, ${s.bundledAyahs} ayahs identical to the pinned Tanzil text.`,
    );
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
