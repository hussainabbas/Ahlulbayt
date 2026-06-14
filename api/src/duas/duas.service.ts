import { Injectable, NotFoundException } from '@nestjs/common';

import { CacheService } from '../redis/cache.service';
import { DUAS_CATALOG, DuaCatalogEntry } from './data/duas-catalog';

@Injectable()
export class DuasService {
  constructor(private readonly cache: CacheService) {}

  async list(locale = 'en', category?: string) {
    const cacheKey = `duas:catalog:${category ?? 'all'}`;
    const cached = await this.cache.get<DuaCatalogEntry[]>(cacheKey);
    const catalog = cached ?? DUAS_CATALOG;
    if (!cached) await this.cache.set(cacheKey, catalog, 600);

    const filtered = category ? catalog.filter((d) => d.category === category) : catalog;
    return {
      total: filtered.length,
      items: filtered.map((d) => this.toSummary(d, locale)),
    };
  }

  async getById(id: string, locale = 'en') {
    const dua = DUAS_CATALOG.find((d) => d.id === id);
    if (!dua) throw new NotFoundException(`Dua not found: ${id}`);

    return {
      ...this.toSummary(dua, locale),
      tags: dua.tags,
      recommendedDays: dua.recommendedDays ?? [],
      bundleId: id.replace(/_/g, '-'),
    };
  }

  async recommend(context: { muharramSeason?: boolean; dayOfWeek?: string }) {
    const picks: DuaCatalogEntry[] = [];
    if (context.muharramSeason) {
      picks.push(...DUAS_CATALOG.filter((d) => d.tags.includes('muharram')));
    }
    if (context.dayOfWeek === 'thursday') {
      picks.push(DUAS_CATALOG.find((d) => d.id === 'dua_kumail')!);
    }
    if (context.dayOfWeek === 'friday') {
      picks.push(DUAS_CATALOG.find((d) => d.id === 'dua_ahad')!);
    }
    const unique = [...new Map(picks.filter(Boolean).map((d) => [d.id, d])).values()];
    if (unique.length === 0) {
      unique.push(DUAS_CATALOG.find((d) => d.id === 'dua_tawassul')!);
    }
    return { items: unique.map((d) => this.toSummary(d, 'en')) };
  }

  private toSummary(dua: DuaCatalogEntry, locale: string) {
    const title =
      locale === 'ar' ? dua.titles.ar : locale === 'ur' ? dua.titles.ur : dua.titles.en;
    return { id: dua.id, title, category: dua.category };
  }
}
