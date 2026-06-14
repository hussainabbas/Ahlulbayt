import { BUNDLED_STANDALONE_AYAHS, BUNDLED_SURAHS } from '../data/bundled/surah001';
import { SURAH_METADATA, getSurahMeta } from '../constants/surahMetadata';
import type { QuranAyah, SurahBundle, SurahMeta } from '../types';

const bundleCache = new Map<number, SurahBundle>();

export class QuranRepository {
  static listSurahs(): SurahMeta[] {
    return SURAH_METADATA;
  }

  static getSurahMeta(number: number): SurahMeta | undefined {
    return getSurahMeta(number);
  }

  static isSurahAvailable(number: number): boolean {
    return number in BUNDLED_SURAHS;
  }

  static async getSurah(number: number): Promise<SurahBundle | null> {
    if (bundleCache.has(number)) {
      return bundleCache.get(number)!;
    }

    const bundled = BUNDLED_SURAHS[number];
    if (bundled) {
      bundleCache.set(number, bundled);
      return bundled;
    }

    // Placeholder for CDN-downloaded bundles (production pipeline)
    const meta = getSurahMeta(number);
    if (!meta) return null;

    return {
      surah: number,
      meta,
      bundleVersion: 0,
      ayahs: Array.from({ length: meta.ayahCount }, (_, i) => ({
        surah: number,
        ayah: i + 1,
        juz: meta.juzStart,
        page: 0,
        arabic: '—',
        words: [],
        translations: {
          en: 'Download this surah for offline reading.',
          ur: 'آف لائن پڑھنے کے لیے یہ سورت ڈاؤن لوڈ کریں۔',
        },
      })),
    };
  }

  static getAyah(surah: number, ayah: number): QuranAyah | undefined {
    const bundled = BUNDLED_SURAHS[surah];
    if (bundled) {
      return bundled.ayahs.find((a: import('../types').QuranAyah) => a.ayah === ayah);
    }
    return BUNDLED_STANDALONE_AYAHS.find((a) => a.surah === surah && a.ayah === ayah);
  }

  static getAllIndexedAyahs(): QuranAyah[] {
    const fromSurahs = Object.values(BUNDLED_SURAHS).flatMap((b) => b.ayahs);
    return [...fromSurahs, ...BUNDLED_STANDALONE_AYAHS];
  }

  static clearCache(): void {
    bundleCache.clear();
  }
}
