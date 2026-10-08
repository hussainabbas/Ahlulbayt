import { getSurahMeta, RECITERS } from '../../constants/surahMetadata';

/** Maps app reciter IDs to cdn.islamic.network folder names. */
const CDN_RECITER_MAP: Record<string, string> = {
  al_afasy: 'mishari_al_afasy',
  abdul_basit: 'abdul_basit_murattal',
  minshawi: 'minshawy_murattal',
};

export function getCdnReciterId(reciterId: string): string {
  return CDN_RECITER_MAP[reciterId] ?? reciterId;
}

export function buildTrackId(reciterId: string, surah: number): string {
  return `${reciterId}:${surah}`;
}

export function parseTrackId(trackId: string): { reciterId: string; surah: number } {
  const [reciterId, surahStr] = trackId.split(':');
  return { reciterId: reciterId!, surah: Number(surahStr) };
}

export function getSurahStreamUrl(reciterId: string, surah: number): string {
  const cdnId = getCdnReciterId(reciterId);
  return `https://cdn.islamic.network/quran/audio-surah/128/${cdnId}/${surah}.mp3`;
}

export function getAyahStreamUrl(reciterId: string, surah: number, ayah: number): string {
  const cdnId = getCdnReciterId(reciterId);
  const ref = `${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}`;
  return `https://cdn.islamic.network/quran/audio/128/${cdnId}/${ref}.mp3`;
}

export function getReciterLabel(reciterId: string): string {
  const reciter = RECITERS.find((r) => r.id === reciterId);
  return reciter?.nameKey ?? reciterId;
}

export function getSurahTrackTitle(surah: number): { title: string; subtitle: string; arabic: string } {
  const meta = getSurahMeta(surah);
  return {
    title: meta?.nameEnglish ?? `Surah ${surah}`,
    subtitle: meta?.nameTransliteration ?? '',
    arabic: meta?.nameArabic ?? '',
  };
}

export function getAudioStorageDir(reciterId: string): string {
  return `quran-audio/${reciterId}`;
}

export function getSurahFileName(surah: number): string {
  return `surah-${String(surah).padStart(3, '0')}.mp3`;
}
