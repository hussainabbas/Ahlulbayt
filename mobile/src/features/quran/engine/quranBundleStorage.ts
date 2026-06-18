import RNFS from 'react-native-fs';

import { CONTENT_PATHS, contentManifestService } from '@/core/offline/contentManifestService';

import { BUNDLED_SURAHS, getBundledSurah } from '../data/bundled';
import { SURAH_METADATA, getSurahMeta } from '../constants/surahMetadata';
import type { SurahBundle } from '../types';

function surahBundleId(number: number): string {
  return `surah-${String(number).padStart(3, '0')}`;
}

function cachePath(number: number): string {
  return `${CONTENT_PATHS.quran}/${surahBundleId(number)}.cache.json`;
}

export async function loadStoredSurahBundle(number: number): Promise<SurahBundle | null> {
  const manifestEntry = contentManifestService.getLocalVersion('quran', surahBundleId(number));
  if (manifestEntry?.localPath && (await RNFS.exists(manifestEntry.localPath))) {
    try {
      const raw = await RNFS.readFile(manifestEntry.localPath, 'utf8');
      return JSON.parse(raw) as SurahBundle;
    } catch {
      // fall through to cache file
    }
  }

  const path = cachePath(number);
  if (!(await RNFS.exists(path))) return null;

  try {
    const raw = await RNFS.readFile(path, 'utf8');
    return JSON.parse(raw) as SurahBundle;
  } catch {
    return null;
  }
}

export async function saveSurahBundleCache(bundle: SurahBundle): Promise<void> {
  await contentManifestService.ensureContentDirs();
  await RNFS.writeFile(cachePath(bundle.surah), JSON.stringify(bundle), 'utf8');
}

export async function isSurahTextStored(number: number): Promise<boolean> {
  if (getBundledSurah(number)) return true;

  const stored = await loadStoredSurahBundle(number);
  if (!stored?.ayahs.length || stored.bundleVersion <= 0) return false;

  const expectedCount = stored.meta?.ayahCount ?? getSurahMeta(number)?.ayahCount ?? 0;
  if (expectedCount <= 0) return true;

  return stored.ayahs.length >= expectedCount;
}

export async function removeSurahBundleCache(number: number): Promise<void> {
  if (getBundledSurah(number)) return;

  const path = cachePath(number);
  if (await RNFS.exists(path)) {
    await RNFS.unlink(path);
  }
}

/** Returns surah numbers with full text available offline (bundled + saved cache). */
export async function listOfflineTextSurahNumbers(): Promise<number[]> {
  const offline = new Set<number>();
  for (const key of Object.keys(BUNDLED_SURAHS)) {
    const number = Number(key);
    if (getBundledSurah(number)) offline.add(number);
  }

  await contentManifestService.ensureContentDirs();
  const dirExists = await RNFS.exists(CONTENT_PATHS.quran);
  if (dirExists) {
    const files = await RNFS.readDir(CONTENT_PATHS.quran);
    for (const file of files) {
      const match = /^surah-(\d{3})\.cache\.json$/.exec(file.name);
      if (!match) continue;
      const number = Number.parseInt(match[1]!, 10);
      if (await isSurahTextStored(number)) offline.add(number);
    }
  }

  for (const meta of SURAH_METADATA) {
    const manifestEntry = contentManifestService.getLocalVersion('quran', surahBundleId(meta.number));
    if (manifestEntry?.localPath && (await RNFS.exists(manifestEntry.localPath))) {
      if (await isSurahTextStored(meta.number)) offline.add(meta.number);
    }
  }

  return [...offline].sort((a, b) => a - b);
}
