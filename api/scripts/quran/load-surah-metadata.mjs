import { readFileSync } from 'node:fs';

import { MOBILE_METADATA_PATH } from './paths.mjs';

const ENTRY_RE =
  /\{\s*number:\s*(\d+),\s*nameArabic:\s*'((?:\\'|[^'])*)',\s*nameEnglish:\s*'((?:\\'|[^'])*)',\s*nameUrdu:\s*'((?:\\'|[^'])*)',\s*nameTransliteration:\s*'((?:\\'|[^'])*)',\s*revelation:\s*'(meccan|medinan)',\s*ayahCount:\s*(\d+),\s*juzStart:\s*(\d+)\s*\}/g;

function unescape(value) {
  return value.replace(/\\'/g, "'");
}

/** @returns {import('./types.mjs').SurahMetaRecord[]} */
export function loadSurahMetadata() {
  const raw = readFileSync(MOBILE_METADATA_PATH, 'utf8');
  const entries = [];

  for (const match of raw.matchAll(ENTRY_RE)) {
    entries.push({
      number: Number(match[1]),
      nameArabic: unescape(match[2]),
      nameEnglish: unescape(match[3]),
      nameUrdu: unescape(match[4]),
      nameTransliteration: unescape(match[5]),
      revelation: match[6],
      ayahCount: Number(match[7]),
      juzStart: Number(match[8]),
    });
  }

  if (entries.length !== 114) {
    throw new Error(`Expected 114 surah metadata rows, parsed ${entries.length}`);
  }

  return entries.sort((a, b) => a.number - b.number);
}

/** @param {number} surah */
export function getSurahMeta(surah) {
  return loadSurahMetadata().find((row) => row.number === surah);
}
