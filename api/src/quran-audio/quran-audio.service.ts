import { Injectable } from '@nestjs/common';

const RECITERS = [
  {
    id: 'al_afasy',
    nameEn: 'Mishari Al-Afasy',
    nameAr: 'Mishari Al-Afasy',
    cdnFolder: 'mishari_al_afasy',
    bitrateKbps: 128,
    available: true,
  },
  {
    id: 'abdul_basit',
    nameEn: 'Abdul Basit (Murattal)',
    nameAr: 'Abdul Basit',
    cdnFolder: 'abdul_basit_murattal',
    bitrateKbps: 128,
    available: true,
  },
  {
    id: 'minshawi',
    nameEn: 'Minshawi (Murattal)',
    nameAr: 'Minshawi',
    cdnFolder: 'minshawy_murattal',
    bitrateKbps: 128,
    available: true,
  },
] as const;

@Injectable()
export class QuranAudioService {
  listReciters() {
    return {
      reciters: RECITERS.map(({ id, nameEn, nameAr, bitrateKbps, available }) => ({
        id,
        nameEn,
        nameAr,
        bitrateKbps,
        available,
      })),
    };
  }

  getSurahStreamUrl(reciterId: string, surah: number, bitrate = 128) {
    const reciter = RECITERS.find((r) => r.id === reciterId);
    if (!reciter) {
      return { error: 'reciter_not_found', reciterId };
    }
    if (surah < 1 || surah > 114) {
      return { error: 'invalid_surah', surah };
    }

    const url = `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${reciter.cdnFolder}/${surah}.mp3`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    return {
      reciterId,
      surah,
      url,
      expiresAt,
      bitrateKbps: bitrate,
      source: 'cdn.islamic.network',
    };
  }

  getAyahStreamUrl(reciterId: string, surah: number, ayah: number, bitrate = 128) {
    const reciter = RECITERS.find((r) => r.id === reciterId);
    if (!reciter) {
      return { error: 'reciter_not_found', reciterId };
    }
    const ref = `${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}`;
    const url = `https://cdn.islamic.network/quran/audio/${bitrate}/${reciter.cdnFolder}/${ref}.mp3`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    return {
      reciterId,
      surah,
      ayah,
      url,
      expiresAt,
      bitrateKbps: bitrate,
      source: 'cdn.islamic.network',
    };
  }

  getManifest() {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      packs: RECITERS.map((r) => ({
        reciterId: r.id,
        surahCount: 114,
        format: 'mp3',
        bitrateKbps: r.bitrateKbps,
        status: 'cdn_proxy',
      })),
    };
  }

  /** Placeholder — wire to users table after auth integration. */
  getProgress(_userId: string) {
    return { progress: [] as Array<{ trackId: string; positionSec: number; updatedAt: string }> };
  }

  /** Placeholder — persist to DB in phase 2. */
  saveProgress(_userId: string, dto: { trackId: string; positionSec: number; updatedAt?: string }) {
    return {
      ok: true,
      trackId: dto.trackId,
      positionSec: dto.positionSec,
      updatedAt: dto.updatedAt ?? new Date().toISOString(),
      persisted: false,
    };
  }

  registerDownload(
    _userId: string,
    dto: { reciterId: string; surah: number; deviceId?: string },
  ) {
    return {
      ok: true,
      reciterId: dto.reciterId,
      surah: dto.surah,
      registered: false,
    };
  }
}
