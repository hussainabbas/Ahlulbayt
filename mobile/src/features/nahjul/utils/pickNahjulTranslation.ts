import type { NahjulMeta, NahjulSection, NahjulTranslationLayer } from '../types';

export type NahjulTranslationPick = {
  text: string | undefined;
  isFallback: boolean;
  resolvedLayer: NahjulTranslationLayer;
};

export function pickNahjulTranslation(
  section: NahjulSection,
  layer: NahjulTranslationLayer,
): NahjulTranslationPick {
  const direct = section.translations[layer]?.trim();
  if (direct) {
    return { text: direct, isFallback: false, resolvedLayer: layer };
  }

  if (layer !== 'en') {
    const en = section.translations.en?.trim();
    if (en) {
      return { text: en, isFallback: true, resolvedLayer: 'en' };
    }
  }

  return { text: undefined, isFallback: false, resolvedLayer: layer };
}

export function pickNahjulMetaText(
  meta: NahjulMeta,
  field: 'titles' | 'subtitles' | 'excerpt' | 'description',
  layer: NahjulTranslationLayer,
): string {
  const record = meta[field];
  if (field === 'titles') {
    const titles = record as NahjulMeta['titles'];
    if (layer === 'ar') return titles.ar?.trim() || titles.en;
    if (layer === 'ur') return titles.ur?.trim() || titles.en;
    return titles.en;
  }

  const localized = record as { en: string; ur: string };
  if (layer === 'ur') return localized.ur?.trim() || localized.en;
  return localized.en;
}

export function sectionHasTranslation(
  section: NahjulSection,
  layer: NahjulTranslationLayer,
): boolean {
  return Boolean(section.translations[layer]?.trim());
}
