import { logger } from '@/core/logging/logger';
import { networkManager } from '@/core/offline/network';

import type { SurahMeta, TranslationSources } from '../types';

/**
 * Remote TRANSLATIONS only.
 *
 * Arabic Quran text is never taken from the network: it ships inside the app,
 * verified against the pinned Tanzil corpus. Anything fetched here is overlaid
 * on that text by ayah number and can never replace it.
 */
const API_BASE = 'https://api.alquran.cloud/v1';
const EDITION_EN = 'en.sahih';
const EDITION_UR = 'ur.jalandhry';
const REQUEST_TIMEOUT_MS = 15000;

export const TRANSLATION_SOURCE_LABELS: Record<string, string> = {
  [EDITION_EN]: 'Sahih International',
  [EDITION_UR]: 'Jalandhry',
};

export interface AyahTranslationEntry {
  en?: string;
  ur?: string;
}

export interface SurahTranslations {
  surah: number;
  version: 1;
  sources: TranslationSources;
  /** Keyed by ayah number. Always covers every ayah of the surah. */
  ayahs: Record<number, AyahTranslationEntry>;
}

interface RemoteAyah {
  numberInSurah: number;
  text: string;
}

interface RemoteSurah {
  number: number;
  ayahs: RemoteAyah[];
  edition?: { identifier?: string };
}

interface RemoteResponse {
  code: number;
  data: RemoteSurah[];
}

function cleanText(text: string): string {
  return text.replace(/^﻿/, '').trim();
}

/** An edition is accepted only when it has exactly one non-empty entry per ayah, in order. */
function completeEdition(
  data: RemoteSurah[],
  identifier: string,
  meta: SurahMeta,
): RemoteAyah[] | null {
  const edition = data.find((surah) => surah.edition?.identifier === identifier);
  if (!edition || edition.number !== meta.number) return null;
  if (!Array.isArray(edition.ayahs) || edition.ayahs.length !== meta.ayahCount) return null;
  const ordered = edition.ayahs.every(
    (ayah, index) =>
      ayah.numberInSurah === index + 1 && typeof ayah.text === 'string' && ayah.text.trim(),
  );
  return ordered ? edition.ayahs : null;
}

async function requestEditions(meta: SurahMeta, editions: string[]): Promise<RemoteSurah[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(
      `${API_BASE}/surah/${meta.number}/editions/${editions.join(',')}`,
      { headers: { Accept: 'application/json' }, signal: controller.signal },
    );
    if (!response.ok) {
      logger.warn('Quran translation fetch failed', {
        surah: meta.number,
        status: response.status,
      });
      return null;
    }
    const json = (await response.json()) as RemoteResponse;
    if (json.code !== 200 || !Array.isArray(json.data) || json.data.length === 0) return null;
    return json.data;
  } finally {
    clearTimeout(timer);
  }
}

/** Concurrent callers for the same surah share one request. */
const inFlight = new Map<number, Promise<SurahTranslations | null>>();

async function load(meta: SurahMeta): Promise<SurahTranslations | null> {
  if (!networkManager.getIsConnected()) return null;

  try {
    const data =
      (await requestEditions(meta, [EDITION_EN, EDITION_UR])) ??
      (await requestEditions(meta, [EDITION_EN]));
    if (!data) return null;

    const en = completeEdition(data, EDITION_EN, meta);
    const ur = completeEdition(data, EDITION_UR, meta);
    if (!en && !ur) {
      logger.warn('Quran translation response rejected as incomplete', { surah: meta.number });
      return null;
    }

    const sources: TranslationSources = {};
    if (en) sources.en = TRANSLATION_SOURCE_LABELS[EDITION_EN];
    if (ur) sources.ur = TRANSLATION_SOURCE_LABELS[EDITION_UR];

    const ayahs: Record<number, AyahTranslationEntry> = {};
    for (let index = 0; index < meta.ayahCount; index += 1) {
      const entry: AyahTranslationEntry = {};
      const enText = en?.[index]?.text;
      const urText = ur?.[index]?.text;
      if (enText) entry.en = cleanText(enText);
      if (urText) entry.ur = cleanText(urText);
      ayahs[index + 1] = entry;
    }

    return { surah: meta.number, version: 1, sources, ayahs };
  } catch (error) {
    logger.warn('Quran translation fetch error', { surah: meta.number, error: String(error) });
    return null;
  }
}

export function fetchSurahTranslations(meta: SurahMeta): Promise<SurahTranslations | null> {
  const existing = inFlight.get(meta.number);
  if (existing) return existing;

  const request = load(meta).finally(() => {
    inFlight.delete(meta.number);
  });
  inFlight.set(meta.number, request);
  return request;
}
