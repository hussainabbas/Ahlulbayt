import { Injectable, NotFoundException } from '@nestjs/common';

import { CacheService } from '../redis/cache.service';
import { ZIYARAT_CATALOG, ZiyaratCatalogEntry } from './data/ziyarat-catalog';

@Injectable()
export class ZiyaratService {
  constructor(private readonly cache: CacheService) {}

  async list(locale = 'en', category?: string) {
    const cacheKey = `ziyarat:catalog:${category ?? 'all'}`;
    const cached = await this.cache.get<ZiyaratCatalogEntry[]>(cacheKey);
    const catalog = cached ?? ZIYARAT_CATALOG;
    if (!cached) await this.cache.set(cacheKey, catalog, 600);

    const filtered = category ? catalog.filter((z) => z.category === category) : catalog;
    return {
      total: filtered.length,
      items: filtered.map((z) => this.toSummary(z, locale)),
    };
  }

  async getById(id: string, locale = 'en') {
    const ziyarat = ZIYARAT_CATALOG.find((z) => z.id === id);
    if (!ziyarat) throw new NotFoundException(`Ziyarat not found: ${id}`);

    return {
      ...this.toSummary(ziyarat, locale),
      tags: ziyarat.tags,
      occasion: ziyarat.occasion ?? null,
      bundleId: id.replace(/_/g, '-'),
    };
  }

  async recommend(context: { muharramDay?: number; muharramSeason?: boolean }) {
    const picks: ZiyaratCatalogEntry[] = [];
    if (context.muharramDay === 10 || context.muharramSeason) {
      picks.push(ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_ashura')!);
    }
    if (context.muharramSeason) {
      picks.push(ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_waritha')!);
    }
    const unique = [...new Map(picks.filter(Boolean).map((z) => [z.id, z])).values()];
    if (unique.length === 0) {
      unique.push(ZIYARAT_CATALOG.find((z) => z.id === 'ziyarat_aminullah')!);
    }
    return { items: unique.map((z) => this.toSummary(z, 'en')) };
  }

  private toSummary(z: ZiyaratCatalogEntry, locale: string) {
    const title =
      locale === 'ar' ? z.titles.ar : locale === 'ur' ? z.titles.ur : z.titles.en;
    return { id: z.id, title, category: z.category };
  }
}
