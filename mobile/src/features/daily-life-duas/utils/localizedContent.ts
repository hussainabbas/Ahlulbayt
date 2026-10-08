import type { DailyLifeDuaId, DailyLifeDuaMeta, LocalizedText } from '../types';
import { DailyLifeDuaRepository } from '../engine/dailyLifeDuaRepository';

export function pickLocalized(text: LocalizedText, locale: string): string {
  if (locale === 'ur') return text.ur;
  if (locale === 'ar' && text.ar) return text.ar;
  return text.en;
}

export function getMetaTitle(meta: DailyLifeDuaMeta, locale: string): string {
  return pickLocalized(meta.titles, locale);
}

export function getMetaDescription(meta: DailyLifeDuaMeta, locale: string): string {
  return pickLocalized(meta.description, locale);
}

export function getDuaPreview(duaId: DailyLifeDuaId, locale: string) {
  const bundle = DailyLifeDuaRepository.getBundle(duaId);
  const section = bundle?.sections[0];
  if (!section) return { arabic: undefined, translation: undefined };

  const translation =
    locale === 'ur'
      ? section.translations.ur ?? section.translations.en
      : section.translations.en;

  return {
    arabic: section.arabic,
    translation,
  };
}
