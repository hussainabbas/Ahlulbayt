import type { SahifaId, SahifaMeta } from '../types';
import { SAHIFA_TITLES, sahifaId } from './titles';

export const SAHIFA_RECITERS = [
  { id: 'feiz', nameKey: 'sahifa.reciters.feiz' },
  { id: 'abbas', nameKey: 'sahifa.reciters.abbas' },
] as const;

export const SAHIFA_AUDIO_CDN =
  'https://raw.githubusercontent.com/IslamicNetwork/audio/main/placeholder';

export function getSahifaAudioDir(reciterId: string): string {
  return `sahifa-audio/${reciterId}`;
}

export function getSahifaAudioFileName(id: SahifaId): string {
  return `${id}.mp3`;
}

export function getSahifaStreamUrl(id: SahifaId, reciterId: string): string {
  return `${SAHIFA_AUDIO_CDN}/${reciterId}/${id}.mp3`;
}

export function buildSahifaTrackId(reciterId: string, id: SahifaId): string {
  return `sahifa:${reciterId}:${id}`;
}

/** Numbers with full bundled Arabic + EN + UR text in app. */
export const BUNDLED_SAHIFA_NUMBERS = [1, 2, 3, 8, 11, 15, 20, 24, 31, 47, 54] as const;

/** Full catalog of 54 Sahifa supplications. */
export const SAHIFA_CATALOG: SahifaMeta[] = SAHIFA_TITLES.map((t) => ({
  id: sahifaId(t.number),
  number: t.number,
  slug: t.slug,
  titles: { en: t.en, ur: t.ur, ar: t.ar },
  subtitles: { en: t.subtitleEn, ur: t.subtitleUr },
  description: { en: t.subtitleEn, ur: t.subtitleUr },
  themes: t.themes,
  sectionCount: t.sections,
  estimatedMinutes: t.minutes,
  hasAudio: true,
  bundled: BUNDLED_SAHIFA_NUMBERS.includes(t.number as (typeof BUNDLED_SAHIFA_NUMBERS)[number]),
}));

export function getSahifaMeta(id: SahifaId): SahifaMeta | undefined {
  return SAHIFA_CATALOG.find((s) => s.id === id);
}

export function getSahifaMetaByNumber(n: number): SahifaMeta | undefined {
  return SAHIFA_CATALOG.find((s) => s.number === n);
}
