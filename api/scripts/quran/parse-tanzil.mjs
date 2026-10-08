import { readFileSync } from 'node:fs';

/**
 * Parse Tanzil "Text (with aya numbers)" format: surah|ayah|text
 * @param {string} raw
 * @returns {Map<number, { ayah: number, text: string }[]>}
 */
export function parseTanzilText(raw) {
  const bySurah = new Map();

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.replace(/^\uFEFF/, '').trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parts = trimmed.split('|');
    if (parts.length < 3) continue;

    const surah = Number(parts[0]);
    const ayah = Number(parts[1]);
    const text = parts.slice(2).join('|').trim();

    if (!Number.isInteger(surah) || !Number.isInteger(ayah) || !text) continue;

    if (!bySurah.has(surah)) bySurah.set(surah, []);
    bySurah.get(surah).push({ ayah, text });
  }

  for (const ayahs of bySurah.values()) {
    ayahs.sort((a, b) => a.ayah - b.ayah);
  }

  return bySurah;
}

/** @param {string} filePath */
export function parseTanzilFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  return parseTanzilText(raw);
}
