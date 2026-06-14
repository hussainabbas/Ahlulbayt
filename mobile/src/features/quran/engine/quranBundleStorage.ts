import RNFS from 'react-native-fs';

import { CONTENT_PATHS, contentManifestService } from '@/core/offline/contentManifestService';

import { BUNDLED_SURAHS } from '../data/bundled/surah001';
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
  if (number in BUNDLED_SURAHS) return true;

  const stored = await loadStoredSurahBundle(number);
  if (!stored?.ayahs.length || stored.bundleVersion <= 0) return false;

  return stored.ayahs.length >= stored.meta.ayahCount;
}

export async function removeSurahBundleCache(number: number): Promise<void> {
  if (number in BUNDLED_SURAHS) return;

  const path = cachePath(number);
  if (await RNFS.exists(path)) {
    await RNFS.unlink(path);
  }
}
