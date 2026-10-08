import type { QuranAyah, SurahBundle } from '../../types';

import {
  GENERATED_CORPUS_READY,
  GENERATED_SURAHS,
  GENERATED_SURAH_COUNT,
} from './generated/registry';

export { GENERATED_CORPUS_READY, GENERATED_SURAH_COUNT };

/**
 * Bundled surah corpus. Populated after `cd api && npm run quran:build`.
 * Arabic text sourced from Tanzil.net Uthmani v1.1 only.
 */
export const BUNDLED_SURAHS: Record<number, SurahBundle> = { ...GENERATED_SURAHS };

/** @deprecated Use BUNDLED_SURAHS from this module. Hand-typed ayahs removed. */
export const BUNDLED_STANDALONE_AYAHS: QuranAyah[] = [];

export function isGeneratedCorpusReady(): boolean {
  return GENERATED_CORPUS_READY && GENERATED_SURAH_COUNT === 114;
}

export function getBundledSurah(number: number): SurahBundle | undefined {
  const bundle = BUNDLED_SURAHS[number];
  if (!bundle?.ayahs?.length) return undefined;
  const hasArabic = bundle.ayahs.some((a) => Boolean(a.arabic?.trim()));
  return hasArabic ? bundle : undefined;
}
