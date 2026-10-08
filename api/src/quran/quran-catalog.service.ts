import { Injectable, NotFoundException } from '@nestjs/common';

import { CacheService } from '../redis/cache.service';
import { QURAN_SURAHS, SurahMeta } from './data/quran-surahs';

@Injectable()
export class QuranCatalogService {
  constructor(private readonly cache: CacheService) {}

  async listSurahs() {
    const cached = await this.cache.get<SurahMeta[]>('quran:surahs');
    const surahs = cached ?? QURAN_SURAHS;
    if (!cached) await this.cache.set('quran:surahs', surahs, 86400);

    return {
      total: 114,
      bundled: surahs.length,
      items: surahs,
    };
  }

  async getSurah(number: number) {
    const surah = QURAN_SURAHS.find((s) => s.number === number);
    if (!surah) throw new NotFoundException(`Surah ${number} not found in catalog`);

    return {
      ...surah,
      bundleId: `surah-${String(number).padStart(3, '0')}`,
      offlineAvailable: number === 1 || number === 30,
    };
  }
}
