import type { NahjulCategory, NahjulId, NahjulMeta, NahjulSource } from '../types';
import {
  NAHJUL_CATALOG as IMPORTED_CATALOG,
  NAHJUL_SOURCE,
} from '../data/bundled';

export { NAHJUL_SOURCE };

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

export const NAHJUL_CATALOG: NahjulMeta[] = IMPORTED_CATALOG;

export function getNahjulCatalogStats(): {
  sermons: number;
  letters: number;
  sayings: number;
  bundled: number;
} {
  const sermons = NAHJUL_CATALOG.filter((n) => n.category === 'sermon').length;
  const letters = NAHJUL_CATALOG.filter((n) => n.category === 'letter').length;
  const sayings = NAHJUL_CATALOG.filter((n) => n.category === 'saying').length;
  const bundled = NAHJUL_CATALOG.filter((n) => n.bundled).length;
  return { sermons, letters, sayings, bundled };
}

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

export function getNahjulSource(): NahjulSource {
  return NAHJUL_SOURCE;
}
