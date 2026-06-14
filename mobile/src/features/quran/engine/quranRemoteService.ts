import { logger } from '@/core/logging/logger';
import { networkManager } from '@/core/offline/network';

import type { QuranAyah, SurahBundle, SurahMeta } from '../types';

const API_BASE = 'https://api.alquran.cloud/v1';
const FULL_EDITIONS = 'quran-uthmani,en.sahih,ur.jalandhry';
const FALLBACK_EDITIONS = 'quran-uthmani,en.sahih';

interface RemoteAyah {
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  sajda?: boolean | { recommended?: boolean; obligatory?: boolean };
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
  return text.replace(/^\uFEFF/, '').trim();
}

function findEditionAyahs(data: RemoteSurah[], identifier: string): RemoteAyah[] | undefined {
  return data.find((surah) => surah.edition?.identifier === identifier)?.ayahs;
}

function mapAyahs(
  meta: SurahMeta,
  arabicAyahs: RemoteAyah[],
  enAyahs?: RemoteAyah[],
  urAyahs?: RemoteAyah[],
): QuranAyah[] {
  return arabicAyahs.map((ayah, index) => {
    const sajda = ayah.sajda;
    const hasSajdah =
      typeof sajda === 'object'
        ? Boolean(sajda.obligatory || sajda.recommended)
        : Boolean(sajda);

    return {
      surah: meta.number,
      ayah: ayah.numberInSurah,
      juz: ayah.juz,
      page: ayah.page,
      arabic: cleanText(ayah.text),
      words: [],
      translations: {
        en: enAyahs?.[index] ? cleanText(enAyahs[index].text) : undefined,
        ur: urAyahs?.[index] ? cleanText(urAyahs[index].text) : undefined,
      },
      hasSajdah,
    };
  });
}

function mapRemoteResponse(meta: SurahMeta, data: RemoteSurah[]): SurahBundle | null {
  const arabicAyahs = findEditionAyahs(data, 'quran-uthmani') ?? data[0]?.ayahs;
  if (!arabicAyahs?.length) return null;

  return {
    surah: meta.number,
    meta,
    bundleVersion: 1,
    ayahs: mapAyahs(
      meta,
      arabicAyahs,
      findEditionAyahs(data, 'en.sahih'),
      findEditionAyahs(data, 'ur.jalandhry'),
    ),
  };
}

async function requestSurahEditions(meta: SurahMeta, editions: string): Promise<SurahBundle | null> {
  const response = await fetch(`${API_BASE}/surah/${meta.number}/editions/${editions}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    logger.warn('Quran remote fetch failed', { surah: meta.number, status: response.status });
    return null;
  }

  const json = (await response.json()) as RemoteResponse;
  if (json.code !== 200 || !Array.isArray(json.data) || json.data.length === 0) {
    return null;
  }

  return mapRemoteResponse(meta, json.data);
}

export async function fetchSurahBundle(meta: SurahMeta): Promise<SurahBundle | null> {
  if (!networkManager.getIsConnected()) return null;

  try {
    const bundle = await requestSurahEditions(meta, FULL_EDITIONS);
    if (bundle) return bundle;
    return await requestSurahEditions(meta, FALLBACK_EDITIONS);
  } catch (error) {
    logger.warn('Quran remote fetch error', { surah: meta.number, error: String(error) });
    return null;
  }
}
