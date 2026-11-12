import { logger } from '@/core/logging/logger';

import type { SurahBundle, SurahMeta } from '../types';

import {
  isSurahTextStored,
  removeStoredTranslations,
  saveTranslations,
} from './quranBundleStorage';
import { QuranRepository, bundleHasTranslations } from './quranRepository';
import { fetchSurahTranslations } from './quranRemoteService';

/**
 * "Offline" here means the surah's TRANSLATION is saved on the device.
 * The Arabic text needs no download: it is part of the app.
 */
export async function checkSurahTextOffline(surah: number): Promise<boolean> {
  return isSurahTextStored(surah);
}

export async function downloadSurahText(
  meta: SurahMeta,
  _currentBundle?: SurahBundle | null,
  onProgress?: (progress: number) => void,
): Promise<SurahBundle> {
  onProgress?.(0.15);

  if (await isSurahTextStored(meta.number)) {
    const local = await QuranRepository.getSurah(meta.number);
    if (local && bundleHasTranslations(local)) {
      onProgress?.(1);
      return local;
    }
  }

  onProgress?.(0.35);
  const remote = await fetchSurahTranslations(meta);
  if (!remote) {
    logger.warn('Surah translation download failed', { surah: meta.number });
    throw new Error('DOWNLOAD_FAILED');
  }

  onProgress?.(0.85);
  await saveTranslations(remote);
  QuranRepository.clearCache(meta.number);

  const bundle = await QuranRepository.getSurah(meta.number);
  if (!bundle) throw new Error('DOWNLOAD_FAILED');
  onProgress?.(1);
  return bundle;
}

export async function removeSurahTextOffline(surah: number): Promise<void> {
  await removeStoredTranslations(surah);
  QuranRepository.clearCache(surah);
}
