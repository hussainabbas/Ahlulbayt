import { logger } from '@/core/logging/logger';

import { getBundledSurah } from '../data/bundled';
import type { SurahBundle, SurahMeta } from '../types';

import {
  isSurahTextStored,
  loadStoredSurahBundle,
  removeSurahBundleCache,
  saveSurahBundleCache,
} from './quranBundleStorage';
import { QuranRepository } from './quranRepository';
import { fetchSurahBundle } from './quranRemoteService';

export async function checkSurahTextOffline(surah: number): Promise<boolean> {
  return isSurahTextStored(surah);
}

export async function downloadSurahText(
  meta: SurahMeta,
  currentBundle?: SurahBundle | null,
  onProgress?: (progress: number) => void,
): Promise<SurahBundle> {
  if (getBundledSurah(meta.number)) {
    onProgress?.(1);
    return getBundledSurah(meta.number)!;
  }

  onProgress?.(0.15);

  const stored = await loadStoredSurahBundle(meta.number);
  if (stored?.bundleVersion && stored.ayahs.length >= meta.ayahCount) {
    onProgress?.(1);
    return stored;
  }

  if (currentBundle?.bundleVersion && currentBundle.ayahs.length >= meta.ayahCount) {
    onProgress?.(0.7);
    await saveSurahBundleCache(currentBundle);
    onProgress?.(1);
    return currentBundle;
  }

  onProgress?.(0.35);
  const remote = await fetchSurahBundle(meta);
  if (!remote) {
    logger.warn('Surah text download failed', { surah: meta.number });
    throw new Error('DOWNLOAD_FAILED');
  }

  onProgress?.(0.85);
  await saveSurahBundleCache(remote);
  QuranRepository.clearCache();
  onProgress?.(1);
  return remote;
}

export async function removeSurahTextOffline(surah: number): Promise<void> {
  await removeSurahBundleCache(surah);
  QuranRepository.clearCache();
}
