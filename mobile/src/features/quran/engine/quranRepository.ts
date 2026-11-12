import {
  BUNDLED_STANDALONE_AYAHS,
  BUNDLED_SURAH_NUMBERS,
  getBundledSurah,
  isGeneratedCorpusReady,
} from '../data/bundled';
import { SURAH_METADATA, getSurahMeta } from '../constants/surahMetadata';
import type { QuranAyah, SurahBundle, SurahMeta } from '../types';

import { loadStoredTranslations, saveTranslations } from './quranBundleStorage';
import { fetchSurahTranslations, type SurahTranslations } from './quranRemoteService';

/** Surah bundles with any available translations already overlaid. */
const bundleCache = new Map<number, SurahBundle>();

/**
 * Overlay translations on the bundled Arabic. The bundled objects are shared and
 * read-only, so new ayah objects are created; `arabic` is always the bundled value.
 */
function withTranslations(base: SurahBundle, translations: SurahTranslations | null): SurahBundle {
  if (!translations) return base;

  return {
    ...base,
    attribution: {
      arabic: base.attribution?.arabic ?? '',
      translations: translations.sources,
    },
    ayahs: base.ayahs.map((ayah) => {
      const entry = translations.ayahs[ayah.ayah];
      if (!entry) return ayah;
      return {
        ...ayah,
        translations: { ...ayah.translations, ...entry },
        translationSources: { ...ayah.translationSources, ...translations.sources },
      };
    }),
  };
}

export function bundleHasTranslations(bundle: SurahBundle): boolean {
  return bundle.ayahs.some((ayah) => Boolean(ayah.translations.en || ayah.translations.ur));
}

export class QuranRepository {
  static listSurahs(): SurahMeta[] {
    return SURAH_METADATA;
  }

  static getSurahMeta(number: number): SurahMeta | undefined {
    return getSurahMeta(number);
  }

  static isSurahAvailable(number: number): boolean {
    return Boolean(getBundledSurah(number));
  }

  static hasBundledArabic(number: number): boolean {
    return Boolean(getBundledSurah(number));
  }

  static isCorpusReady(): boolean {
    return isGeneratedCorpusReady();
  }

  /**
   * Local-only read: verified Arabic from the app bundle plus any translation
   * already saved on the device. Never touches the network, so the reader can
   * render immediately, online or offline.
   */
  static async getSurah(number: number): Promise<SurahBundle | null> {
    const cached = bundleCache.get(number);
    if (cached) return cached;

    const bundled = getBundledSurah(number);
    if (!bundled) return null;

    const stored = await loadStoredTranslations(number).catch(() => null);
    const bundle = withTranslations(bundled, stored);
    bundleCache.set(number, bundle);
    return bundle;
  }

  /**
   * Fetch the translation for a surah that has none saved, store it and return
   * the updated bundle. Resolves to null when offline or when the response is
   * incomplete — the caller keeps showing the Arabic text.
   */
  static async fetchMissingTranslations(number: number): Promise<SurahBundle | null> {
    const bundled = getBundledSurah(number);
    const meta = getSurahMeta(number);
    if (!bundled || !meta) return null;

    const remote = await fetchSurahTranslations(meta);
    if (!remote) return null;

    await saveTranslations(remote).catch(() => undefined);
    const bundle = withTranslations(bundled, remote);
    bundleCache.set(number, bundle);
    return bundle;
  }

  static getAyah(surah: number, ayah: number): QuranAyah | undefined {
    const bundled = getBundledSurah(surah);
    if (bundled) return bundled.ayahs.find((a) => a.ayah === ayah);
    return BUNDLED_STANDALONE_AYAHS.find((a) => a.surah === surah && a.ayah === ayah);
  }

  /** Every bundled ayah. Loads the whole corpus — call from search, not from startup. */
  static getAllIndexedAyahs(): QuranAyah[] {
    const ayahs: QuranAyah[] = [];
    for (const number of BUNDLED_SURAH_NUMBERS) {
      const bundle = getBundledSurah(number);
      if (bundle) ayahs.push(...bundle.ayahs);
    }
    return ayahs;
  }

  static clearCache(number?: number): void {
    if (number == null) bundleCache.clear();
    else bundleCache.delete(number);
  }
}
