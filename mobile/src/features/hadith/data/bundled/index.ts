import type { HadithEntry, HadithId } from '../../types';
import { BIHAR_HADITHS } from './sources/bihar';
import { KAFI_HADITHS } from './sources/kafi';
import { NAHJUL_HADITHS } from './sources/nahjul';

const ALL_ENTRIES: HadithEntry[] = [...NAHJUL_HADITHS, ...KAFI_HADITHS, ...BIHAR_HADITHS];

export const BUNDLED_HADITHS: HadithEntry[] = ALL_ENTRIES;

export const BUNDLED_BY_ID = Object.fromEntries(
  ALL_ENTRIES.map((h) => [h.id, h]),
) as Record<HadithId, HadithEntry>;

export const HADITH_COUNT = ALL_ENTRIES.length;
