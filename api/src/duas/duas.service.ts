import { Injectable, NotFoundException } from '@nestjs/common';

import { CacheService } from '../redis/cache.service';
import { DUAS_CATALOG, DuaCatalogEntry } from './data/duas-catalog';
import {
  DAILY_LIFE_CATALOG,
  DAILY_LIFE_CATEGORIES,
  pickTodaysDua,
  type DailyLifeCatalogEntry,
} from './data/daily-life-catalog';

@Injectable()
export class DuasService {
  constructor(private readonly cache: CacheService) {}

  async list(locale = 'en', category?: string, kind?: string) {
    if (kind === 'daily_life') {
      return this.listDailyLife(locale, category);
    }

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

  async listCategories() {
    return { items: DAILY_LIFE_CATEGORIES };
  }

  async listDailyLife(locale = 'en', category?: string) {
    const filtered = category
      ? DAILY_LIFE_CATALOG.filter((d) => d.categoryIds.includes(category))
      : DAILY_LIFE_CATALOG;

    return {
      total: filtered.length,
      kind: 'daily_life',
      items: filtered.map((d) => this.dailyLifeSummary(d, locale)),
    };
  }

  async getDailyLifeToday(locale = 'en') {
    return this.dailyLifeSummary(pickTodaysDua(), locale);
  }

  async search(q: string, locale = 'en', kind?: string) {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return { total: 0, items: [] };

    if (kind !== 'daily_life') {
      const majorHits = DUAS_CATALOG.filter((d) => {
        const haystack = [d.titles.en, d.titles.ur, d.category, ...d.tags].join(' ').toLowerCase();
        return haystack.includes(query);
      }).map((d) => this.toSummary(d, locale));

      return { total: majorHits.length, items: majorHits };
    }

    const hits = DAILY_LIFE_CATALOG.filter((d) => {
      const haystack = [
        d.titles.en,
        d.titles.ur,
        d.description.en,
        ...d.tags,
        d.slug,
        d.situationKey,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    }).map((d) => this.dailyLifeSummary(d, locale));

    return { total: hits.length, items: hits };
  }

  async getById(id: string, locale = 'en') {
    const daily = DAILY_LIFE_CATALOG.find((d) => d.id === id || d.slug === id);
    if (daily) {
      return {
        ...this.dailyLifeSummary(daily, locale),
        tags: daily.tags,
        attribution: daily.attribution,
        bundleVersion: 0,
        contentStatus: daily.contentStatus,
      };
    }

    const dua = DUAS_CATALOG.find((d) => d.id === id);
    if (!dua) throw new NotFoundException(`Dua not found: ${id}`);

    return {
      ...this.toSummary(dua, locale),
      tags: dua.tags,
      recommendedDays: dua.recommendedDays ?? [],
      bundleId: id.replace(/_/g, '-'),
    };
  }

  async getBody(id: string) {
    const daily = DAILY_LIFE_CATALOG.find((d) => d.id === id || d.slug === id);
    if (!daily) throw new NotFoundException(`Dua body not found: ${id}`);

    return {
      meta: daily,
      sections: [],
      audio: [],
      bundleVersion: 0,
      attribution: daily.attribution,
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

  private dailyLifeSummary(dua: DailyLifeCatalogEntry, locale: string) {
    const title =
      locale === 'ar' ? dua.titles.ar : locale === 'ur' ? dua.titles.ur : dua.titles.en;
    return {
      id: dua.id,
      slug: dua.slug,
      title,
      kind: 'daily_life',
      categories: dua.categoryIds,
      situationKey: dua.situationKey,
      hasAudio: dua.hasAudio,
      contentStatus: dua.contentStatus,
      citations: dua.attribution.citations,
    };
  }
}
