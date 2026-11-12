import RNFS from 'react-native-fs';

import { CONTENT_PATHS, contentManifestService } from '@/core/offline/contentManifestService';
import { logger } from '@/core/logging/logger';

import { SURAH_METADATA, getSurahMeta } from '../constants/surahMetadata';
import type { SurahBundle } from '../types';

import type { AyahTranslationEntry, SurahTranslations } from './quranRemoteService';

/**
 * On-device storage for downloaded TRANSLATIONS.
 *
 * Arabic text is not stored here — it is bundled with the app. Files written by
 * older app versions (`surah-NNN.cache.json`, a full bundle fetched from the
 * network) are still read, but only their translations are used.
 */

function surahId(number: number): string {
  return `surah-${String(number).padStart(3, '0')}`;
}

function translationsPath(number: number): string {
  return `${CONTENT_PATHS.quran}/${surahId(number)}.translations.json`;
}

function legacyCachePath(number: number): string {
  return `${CONTENT_PATHS.quran}/${surahId(number)}.cache.json`;
}

/** A stored file is usable only when it covers every ayah of the surah. */
function isComplete(value: SurahTranslations | null, number: number): value is SurahTranslations {
  const expected = getSurahMeta(number)?.ayahCount ?? 0;
  if (!value || value.surah !== number || !value.ayahs || expected <= 0) return false;
  for (let ayah = 1; ayah <= expected; ayah += 1) {
    const entry = value.ayahs[ayah];
    if (!entry || (!entry.en && !entry.ur)) return false;
  }
  return true;
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    if (!(await RNFS.exists(path))) return null;
    return JSON.parse(await RNFS.readFile(path, 'utf8')) as T;
  } catch (error) {
    logger.warn('Quran translation file unreadable', { path, error: String(error) });
    return null;
  }
}

function fromLegacyBundle(bundle: SurahBundle | null, number: number): SurahTranslations | null {
  if (!bundle?.ayahs?.length) return null;
  const ayahs: Record<number, AyahTranslationEntry> = {};
  for (const ayah of bundle.ayahs) {
    const entry: AyahTranslationEntry = {};
    if (ayah.translations?.en) entry.en = ayah.translations.en;
    if (ayah.translations?.ur) entry.ur = ayah.translations.ur;
    ayahs[ayah.ayah] = entry;
  }
  return {
    surah: number,
    version: 1,
    sources: bundle.attribution?.translations ?? {},
    ayahs,
  };
}

export async function loadStoredTranslations(number: number): Promise<SurahTranslations | null> {
  const current = await readJson<SurahTranslations>(translationsPath(number));
  if (isComplete(current, number)) return current;

  const legacy = fromLegacyBundle(await readJson<SurahBundle>(legacyCachePath(number)), number);
  return isComplete(legacy, number) ? legacy : null;
}

/**
 * Save translations atomically: write a temporary file, then move it into place,
 * so an interrupted download can never replace a good file with a partial one.
 */
export async function saveTranslations(translations: SurahTranslations): Promise<void> {
  if (!isComplete(translations, translations.surah)) {
    throw new Error('INCOMPLETE_TRANSLATIONS');
  }
  await contentManifestService.ensureContentDirs();

  const target = translationsPath(translations.surah);
  const temp = `${target}.tmp`;
  await RNFS.writeFile(temp, JSON.stringify(translations), 'utf8');
  if (await RNFS.exists(target)) await RNFS.unlink(target);
  await RNFS.moveFile(temp, target);
}

export async function removeStoredTranslations(number: number): Promise<void> {
  for (const path of [translationsPath(number), legacyCachePath(number)]) {
    if (await RNFS.exists(path)) await RNFS.unlink(path);
  }
}

/** True when the surah's translation is saved; the Arabic text is always offline. */
export async function isSurahTextStored(number: number): Promise<boolean> {
  return (await loadStoredTranslations(number)) !== null;
}

/** Surah numbers whose translation is saved for offline reading. */
export async function listOfflineTextSurahNumbers(): Promise<number[]> {
  await contentManifestService.ensureContentDirs();
  if (!(await RNFS.exists(CONTENT_PATHS.quran))) return [];

  const candidates = new Set<number>();
  for (const file of await RNFS.readDir(CONTENT_PATHS.quran)) {
    const match = /^surah-(\d{3})\.(?:translations|cache)\.json$/.exec(file.name);
    if (match) candidates.add(Number.parseInt(match[1]!, 10));
  }

  const offline: number[] = [];
  for (const meta of SURAH_METADATA) {
    if (candidates.has(meta.number) && (await isSurahTextStored(meta.number))) {
      offline.push(meta.number);
    }
  }
  return offline;
}
