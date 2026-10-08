import {
  BUNDLED_SURAHS,
  BUNDLED_STANDALONE_AYAHS,
  getBundledSurah,
  isGeneratedCorpusReady,
} from '../data/bundled';

import { SURAH_METADATA, getSurahMeta } from '../constants/surahMetadata';

import type { QuranAyah, SurahBundle, SurahMeta } from '../types';

import { loadStoredSurahBundle } from './quranBundleStorage';

import { fetchSurahBundle } from './quranRemoteService';

const bundleCache = new Map<number, SurahBundle>();

const PREVIEW_AYAH_COUNT = 3;

function createOfflinePreview(meta: SurahMeta): SurahBundle {
  const previewCount = Math.min(PREVIEW_AYAH_COUNT, meta.ayahCount);

  return {
    surah: meta.number,
    meta,
    bundleVersion: 0,
    ayahs: Array.from({ length: previewCount }, (_, i) => ({
      surah: meta.number,
      ayah: i + 1,
      juz: meta.juzStart,
      page: 0,
      arabic: '',
      words: [],
      translations: {
        en: 'Connect to the internet to load Arabic text for this surah.',
        ur: 'عربی متن لوڈ کرنے کے لیے انٹرنیٹ سے جڑیں۔',
      },
      translationSources: {},
    })),
  };
}

export class QuranRepository {
  static listSurahs(): SurahMeta[] {
    return SURAH_METADATA;
  }

  static getSurahMeta(number: number): SurahMeta | undefined {
    return getSurahMeta(number);
  }

  static isSurahAvailable(number: number): boolean {
    if (getBundledSurah(number)) return true;
    return isGeneratedCorpusReady();
  }

  static hasBundledArabic(number: number): boolean {
    return Boolean(getBundledSurah(number));
  }

  static async getSurah(number: number): Promise<SurahBundle | null> {
    if (bundleCache.has(number)) {
      return bundleCache.get(number)!;
    }

    const bundled = getBundledSurah(number);
    if (bundled) {
      bundleCache.set(number, bundled);
      return bundled;
    }

    const meta = getSurahMeta(number);
    if (!meta) return null;

    const stored = await loadStoredSurahBundle(number);
    if (stored?.ayahs.length && stored.ayahs.some((a) => a.arabic?.trim())) {
      bundleCache.set(number, stored);
      return stored;
    }

    const remote = await fetchSurahBundle(meta);
    if (remote) {
      bundleCache.set(number, remote);
      return remote;
    }

    const preview = createOfflinePreview(meta);
    bundleCache.set(number, preview);
    return preview;
  }

  static getAyah(surah: number, ayah: number): QuranAyah | undefined {
    const bundled = getBundledSurah(surah);
    if (bundled) {
      return bundled.ayahs.find((a) => a.ayah === ayah);
    }

    return BUNDLED_STANDALONE_AYAHS.find((a) => a.surah === surah && a.ayah === ayah);
  }

  static getAllIndexedAyahs(): QuranAyah[] {
    const fromSurahs = Object.values(BUNDLED_SURAHS).flatMap((b) =>
      b.ayahs.filter((a) => Boolean(a.arabic?.trim())),
    );
    const standalone = BUNDLED_STANDALONE_AYAHS.filter((a) => Boolean(a.arabic?.trim()));
    return [...fromSurahs, ...standalone];
  }

  static clearCache(): void {
    bundleCache.clear();
  }
}
