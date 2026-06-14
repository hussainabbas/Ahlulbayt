import type { NahjulCategory, NahjulId, NahjulMeta } from '../types';
import { NAHJUL_ENTRIES, nahjulId } from './entries';

export const NAHJUL_CATEGORIES: Array<{
  id: NahjulCategory;
  nameKey: string;
  icon: string;
}> = [
  { id: 'sermon', nameKey: 'nahjul.categories.sermons', icon: '📜' },
  { id: 'letter', nameKey: 'nahjul.categories.letters', icon: '✉️' },
  { id: 'saying', nameKey: 'nahjul.categories.quotes', icon: '💬' },
];

export const NAHJUL_RECITERS = [
  { id: 'feiz', nameKey: 'nahjul.reciters.feiz' },
  { id: 'abbas', nameKey: 'nahjul.reciters.abbas' },
] as const;

export const NAHJUL_AUDIO_CDN =
  'https://raw.githubusercontent.com/IslamicNetwork/audio/main/placeholder';

export const BUNDLED_NAHJUL_NUMBERS: Record<NahjulCategory, number[]> = {
  sermon: [1, 2, 3, 24, 109],
  letter: [1, 31, 47, 53],
  saying: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30],
};

export function getNahjulAudioDir(reciterId: string): string {
  return `nahjul-audio/${reciterId}`;
}

export function getNahjulAudioFileName(id: NahjulId): string {
  return `${id}.mp3`;
}

export function getNahjulStreamUrl(id: NahjulId, reciterId: string): string {
  return `${NAHJUL_AUDIO_CDN}/${reciterId}/${id}.mp3`;
}

export function buildNahjulTrackId(reciterId: string, id: NahjulId): string {
  return `nahjul:${reciterId}:${id}`;
}

export const NAHJUL_CATALOG: NahjulMeta[] = NAHJUL_ENTRIES.map((e) => ({
  id: nahjulId(e.category, e.number),
  number: e.number,
  slug: e.slug,
  category: e.category,
  titles: { en: e.en, ur: e.ur, ar: e.ar },
  subtitles: { en: e.subtitleEn, ur: e.subtitleUr },
  description: { en: e.subtitleEn, ur: e.subtitleUr },
  themes: e.themes,
  excerpt: { en: e.excerptEn, ur: e.excerptUr },
  sectionCount: e.sections,
  estimatedMinutes: e.minutes,
  hasAudio: true,
  bundled: BUNDLED_NAHJUL_NUMBERS[e.category].includes(e.number),
}));

export function getNahjulMeta(id: NahjulId): NahjulMeta | undefined {
  return NAHJUL_CATALOG.find((n) => n.id === id);
}

export function getNahjulByCategory(category: NahjulCategory): NahjulMeta[] {
  return NAHJUL_CATALOG.filter((n) => n.category === category);
}

export function getNahjulMetaByNumber(
  category: NahjulCategory,
  number: number,
): NahjulMeta | undefined {
  return NAHJUL_CATALOG.find((n) => n.category === category && n.number === number);
}
