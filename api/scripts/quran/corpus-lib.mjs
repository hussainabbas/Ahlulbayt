/**
 * Shared Quran corpus helpers: pinned-source loading, Tanzil metadata parsing,
 * deterministic bundle construction and verse-by-verse verification.
 *
 * The Arabic text is NEVER edited here. The only transformation applied to the
 * Tanzil text is separating the basmala that Tanzil prefixes to verse 1 of every
 * surah except 1 and 9; the removed prefix is stored verbatim in `bundle.bismillah`
 * so the original line can be reconstructed and compared byte for byte.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { CANONICAL_AYAH_COUNTS, SURAH_COUNT, TOTAL_AYAHS } from './canonical-ayah-counts.mjs';
import { parseTanzilText } from './parse-tanzil.mjs';

export const BUNDLE_VERSION = 2;

/** Surahs whose first verse carries no prefixed basmala in the Tanzil text. */
const NO_BASMALA_PREFIX = new Set([1, 9]);
const BASMALA_SKELETON = 'بسماللهالرحمنالرحيم';
const TANZIL_LICENSE_MARKER = 'Tanzil Quran Text (Uthmani, Version 1.1)';

export function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export function surahFileName(surah) {
  return `surah-${String(surah).padStart(3, '0')}.json`;
}

function toHex(char) {
  return `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
}

/** Letters only, with alif wasla folded to alif — used solely to recognise the basmala. */
function letterSkeleton(text) {
  return [...text]
    .filter((c) => /\p{Lo}/u.test(c) && c !== 'ـ')
    .join('')
    .replace(/ٱ/g, 'ا');
}

/**
 * Split the Tanzil-prefixed basmala from verse 1.
 * @returns {{ bismillah: string | null, text: string }}
 */
export function splitBasmala(surah, ayah, text) {
  if (ayah !== 1 || NO_BASMALA_PREFIX.has(surah)) return { bismillah: null, text };

  const tokens = text.split(' ');
  const prefix = tokens.slice(0, 4).join(' ');
  const rest = tokens.slice(4).join(' ');

  if (letterSkeleton(prefix) !== BASMALA_SKELETON || !rest) {
    throw new Error(`Surah ${surah}: verse 1 does not start with the expected basmala prefix`);
  }
  return { bismillah: prefix, text: rest };
}

/** Rebuild the exact Tanzil line text from a bundle ayah. */
export function reconstructSourceText(bundle, ayah) {
  if (ayah.ayah === 1 && bundle.bismillah) return `${bundle.bismillah} ${ayah.arabic}`;
  return ayah.arabic;
}

/**
 * Load the pinned Tanzil text and confirm it is the exact file recorded in the manifest.
 * @returns {{ raw: string, bySurah: Map<number, {ayah:number,text:string}[]>, errors: object[] }}
 */
export function loadPinnedSource(rawPath, manifest) {
  const errors = [];
  let raw;
  try {
    raw = readFileSync(rawPath, 'utf8');
  } catch {
    return {
      raw: '',
      bySurah: new Map(),
      errors: [{ code: 'SOURCE_MISSING', ref: rawPath, detail: 'Pinned Tanzil text not found' }],
    };
  }

  const digest = sha256(raw);
  if (manifest?.rawSha256 && digest !== manifest.rawSha256) {
    errors.push({
      code: 'SOURCE_CHECKSUM',
      ref: rawPath,
      detail: `sha256 ${digest} does not match pinned ${manifest.rawSha256}`,
    });
  }
  if (!raw.includes(TANZIL_LICENSE_MARKER)) {
    errors.push({
      code: 'SOURCE_LICENSE',
      ref: rawPath,
      detail: 'Tanzil copyright block is missing from the source text',
    });
  }

  return { raw, bySurah: parseTanzilText(raw), errors };
}

/** Structural + encoding checks on the parsed source itself. */
export function checkSourceStructure(bySurah) {
  const errors = [];
  let total = 0;

  if (bySurah.size !== SURAH_COUNT) {
    errors.push({ code: 'SURAH_COUNT', ref: 'source', detail: `${bySurah.size} surahs` });
  }

  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    const ayahs = bySurah.get(surah);
    const expected = CANONICAL_AYAH_COUNTS[surah - 1];
    if (!ayahs) {
      errors.push({ code: 'SURAH_MISSING', ref: `${surah}`, detail: 'not in source' });
      continue;
    }
    if (ayahs.length !== expected) {
      errors.push({
        code: 'AYAH_COUNT',
        ref: `${surah}`,
        detail: `source has ${ayahs.length}, expected ${expected}`,
      });
    }
    ayahs.forEach((row, index) => {
      if (row.ayah !== index + 1) {
        errors.push({
          code: 'AYAH_ORDER',
          ref: `${surah}:${row.ayah}`,
          detail: `position ${index + 1} in source`,
        });
      }
      const bad = findEncodingIssue(row.text);
      if (bad) errors.push({ code: 'ENCODING', ref: `${surah}:${row.ayah}`, detail: bad });
    });
    total += ayahs.length;
  }

  if (total !== TOTAL_AYAHS) {
    errors.push({ code: 'TOTAL_AYAHS', ref: 'source', detail: `${total}, expected ${TOTAL_AYAHS}` });
  }
  return errors;
}

/** Any character outside the Arabic block / plain space is an encoding fault in Quran text. */
export function findEncodingIssue(text) {
  if (typeof text !== 'string' || !text) return 'empty text';
  if (text !== text.trim()) return 'leading or trailing whitespace';
  if (text.includes('  ')) return 'double space';
  for (const char of text) {
    if (char === ' ') continue;
    const cp = char.codePointAt(0);
    if (cp < 0x0600 || cp > 0x06ff) return `unexpected character ${toHex(char)}`;
  }
  return null;
}

/** Describe the first point at which two strings diverge. */
export function describeMismatch(actual, expected) {
  const a = [...actual];
  const e = [...expected];
  let i = 0;
  while (i < a.length && i < e.length && a[i] === e[i]) i += 1;
  const kind =
    a.length < e.length && i === a.length
      ? 'TRUNCATED'
      : a.length > e.length && i === e.length
        ? 'EXTRA_TEXT'
        : 'MODIFIED';
  const show = (arr) => arr.slice(i, i + 4).map(toHex).join(' ') || '(end)';
  return {
    kind,
    detail: `${a.length} vs ${e.length} code points; first difference at ${i}: found ${show(a)}, expected ${show(e)}`,
  };
}

// ── Tanzil metadata (quran-data.js) ──────────────────────────────────────────

function sectionRows(js, name) {
  const start = js.indexOf(`QuranData.${name} = [`);
  if (start < 0) throw new Error(`Tanzil metadata: section ${name} not found`);
  const end = js.indexOf('\n];', start);
  const body = js
    .slice(js.indexOf('[', start) + 1, end)
    .replace(/\/\/.*$/gm, ''); // drop comment lines such as "// [sura, aya]"
  return [...body.matchAll(/\[([^[\]]+)\]/g)].map((m) => m[1]);
}

/**
 * Parse Tanzil quran-data.js without evaluating it.
 * @returns {{ suras: {ayas:number,type:string}[], juz: [number,number][], pages: [number,number][], sajda: Map<string,string> }}
 */
export function parseTanzilMetadata(js) {
  const suras = sectionRows(js, 'Sura')
    .map((row) => {
      const nums = row.match(/^\s*(\d+),\s*(\d+),/);
      const type = row.match(/'(Meccan|Medinan)'\s*$/);
      return nums && type ? { ayas: Number(nums[2]), type: type[1].toLowerCase() } : null;
    })
    .filter(Boolean);

  const pairs = (name) =>
    sectionRows(js, name).map((row) => {
      const [s, a] = row.split(',').map((v) => Number(v.trim()));
      return [s, a];
    });

  const sajda = new Map();
  for (const row of sectionRows(js, 'Sajda')) {
    const m = row.match(/^\s*(\d+),\s*(\d+),\s*'(\w+)'/);
    if (m) sajda.set(`${m[1]}:${m[2]}`, m[3]);
  }

  const meta = { suras, juz: pairs('Juz'), pages: pairs('Page'), sajda };
  if (meta.suras.length < SURAH_COUNT) throw new Error('Tanzil metadata: fewer than 114 surahs');
  if (meta.juz.length < 30) throw new Error('Tanzil metadata: fewer than 30 juz markers');
  if (meta.pages.length < 604) throw new Error('Tanzil metadata: fewer than 604 page markers');
  return meta;
}

/** 1-based index of the last marker that starts at or before (surah, ayah). */
function locate(markers, surah, ayah) {
  let lo = 0;
  let hi = markers.length - 1;
  let found = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [s, a] = markers[mid];
    if (s < surah || (s === surah && a <= ayah)) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return found + 1;
}

export function juzOf(meta, surah, ayah) {
  return locate(meta.juz.slice(0, 30), surah, ayah);
}

export function pageOf(meta, surah, ayah) {
  return locate(meta.pages.slice(0, 604), surah, ayah);
}

// ── Bundle construction ──────────────────────────────────────────────────────

export function buildSurahBundle(surahMeta, sourceAyahs, tanzilMeta, attribution) {
  let bismillah = null;

  const ayahs = sourceAyahs.map((row) => {
    const split = splitBasmala(surahMeta.number, row.ayah, row.text);
    if (split.bismillah) bismillah = split.bismillah;

    const ayah = {
      surah: surahMeta.number,
      ayah: row.ayah,
      juz: juzOf(tanzilMeta, surahMeta.number, row.ayah),
      page: pageOf(tanzilMeta, surahMeta.number, row.ayah),
      arabic: split.text,
      words: [],
      translations: {},
      translationSources: {},
    };
    const sajdah = tanzilMeta.sajda.get(`${surahMeta.number}:${row.ayah}`);
    if (sajdah) {
      ayah.hasSajdah = true;
      ayah.sajdahType = sajdah;
    }
    if (split.bismillah) ayah.bismillahBefore = true;
    return ayah;
  });

  const bundle = {
    surah: surahMeta.number,
    meta: {
      number: surahMeta.number,
      nameArabic: surahMeta.nameArabic,
      nameEnglish: surahMeta.nameEnglish,
      nameUrdu: surahMeta.nameUrdu,
      nameTransliteration: surahMeta.nameTransliteration,
      revelation: surahMeta.revelation,
      ayahCount: surahMeta.ayahCount,
      juzStart: surahMeta.juzStart,
    },
    bundleVersion: BUNDLE_VERSION,
    attribution: { arabic: attribution, translations: {} },
    ayahs,
  };
  if (bismillah) bundle.bismillah = bismillah;
  return bundle;
}

export function serializeBundle(bundle) {
  return `${JSON.stringify(bundle)}\n`;
}

/** Hash of the canonical "surah|ayah|text" lines — identifies the verse text independent of packaging. */
export function corpusSha256(bySurah) {
  const lines = [];
  for (let surah = 1; surah <= SURAH_COUNT; surah += 1) {
    for (const row of bySurah.get(surah) ?? []) lines.push(`${surah}|${row.ayah}|${row.text}`);
  }
  return sha256(lines.join('\n'));
}

/** The per-surah source digest format originally pinned in manifest.json (version 1). */
export function sourceSurahSha256(surah, attribution, ayahs) {
  return sha256(JSON.stringify({ surah, source: attribution, ayahCount: ayahs.length, ayahs }));
}

// ── Bundle verification ──────────────────────────────────────────────────────

/**
 * Compare one bundle (already parsed) with the pinned source, verse by verse.
 * @returns {object[]} discrepancy records
 */
export function verifyBundle(surah, bundle, sourceAyahs, tanzilMeta) {
  const errors = [];
  const push = (code, ref, detail) => errors.push({ code, ref, detail });

  if (bundle?.surah !== surah) push('SURAH_NUMBER', `${surah}`, `bundle declares ${bundle?.surah}`);
  if (!Array.isArray(bundle?.ayahs)) {
    push('AYAHS_MISSING', `${surah}`, 'no ayahs array');
    return errors;
  }

  const expected = sourceAyahs.length;
  if (bundle.ayahs.length !== expected) {
    push('AYAH_COUNT', `${surah}`, `bundle has ${bundle.ayahs.length}, source has ${expected}`);
  }

  const seen = new Set();
  bundle.ayahs.forEach((ayah, index) => {
    const ref = `${surah}:${ayah?.ayah}`;
    if (ayah?.surah !== surah) push('AYAH_SURAH', ref, `ayah declares surah ${ayah?.surah}`);
    if (seen.has(ayah?.ayah)) push('DUPLICATE_AYAH', ref, 'appears more than once');
    seen.add(ayah?.ayah);
    if (ayah?.ayah !== index + 1) push('AYAH_ORDER', ref, `found at position ${index + 1}`);

    const source = sourceAyahs.find((row) => row.ayah === ayah?.ayah);
    if (!source) {
      push('UNKNOWN_AYAH', ref, 'not present in source');
      return;
    }

    const text = typeof ayah.arabic === 'string' ? reconstructSourceText(bundle, ayah) : '';
    if (text !== source.text) {
      const diff = describeMismatch(text, source.text);
      push(diff.kind, ref, diff.detail);
    }

    if (tanzilMeta) {
      const juz = juzOf(tanzilMeta, surah, ayah.ayah);
      const page = pageOf(tanzilMeta, surah, ayah.ayah);
      if (ayah.juz !== juz) push('JUZ', ref, `bundle ${ayah.juz}, Tanzil ${juz}`);
      if (ayah.page !== page) push('PAGE', ref, `bundle ${ayah.page}, Tanzil ${page}`);
    }
  });

  for (const row of sourceAyahs) {
    if (!seen.has(row.ayah)) push('MISSING_AYAH', `${surah}:${row.ayah}`, 'absent from bundle');
  }

  const hasPrefix = !NO_BASMALA_PREFIX.has(surah);
  if (hasPrefix && !bundle.bismillah) push('BASMALA', `${surah}`, 'bundle.bismillah missing');
  if (!hasPrefix && bundle.bismillah) push('BASMALA', `${surah}`, 'unexpected bundle.bismillah');

  return errors;
}
