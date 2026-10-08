import {
  DAILY_LIFE_CATALOG,
  getDailyLifeMeta,
  getDailyLifeBySituation,
  getDailyLifeBySlug,
  getQuickActionDua,
  listByCategory,
  pickForDayIndex,
  pickRandomForDay,
} from '../constants/catalog';
import { DAILY_LIFE_CATEGORIES } from '../constants/categories';
import { getBundledDailyLifeDua, getEnrichedMeta } from '../data/bundled';
import type {
  DailyLifeCategoryId,
  DailyLifeDuaBundle,
  DailyLifeDuaId,
  DailyLifeDuaMeta,
  DailyLifeSearchHit,
  DailyLifeSituationKey,
  QuickActionId,
} from '../types';
import { DailyLifeSearchIndex } from './dailyLifeSearchIndex';

const enrichedCatalog = DAILY_LIFE_CATALOG.map(
  (meta) => getEnrichedMeta(meta.id) ?? meta,
);

const searchIndex = new DailyLifeSearchIndex(enrichedCatalog);

function dayIndex(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export class DailyLifeDuaRepository {
  static listCategories() {
    return DAILY_LIFE_CATEGORIES;
  }

  static listDuas(): DailyLifeDuaMeta[] {
    return enrichedCatalog;
  }

  static getMeta(id: DailyLifeDuaId): DailyLifeDuaMeta | undefined {
    return getEnrichedMeta(id);
  }

  static getBySlug(slug: string): DailyLifeDuaMeta | undefined {
    const meta = getDailyLifeBySlug(slug);
    return meta ? getEnrichedMeta(meta.id) : undefined;
  }

  static listByCategory(categoryId: DailyLifeCategoryId): DailyLifeDuaMeta[] {
    return listByCategory(categoryId).map((meta) => getEnrichedMeta(meta.id) ?? meta);
  }

  static getBySituation(situation: DailyLifeSituationKey): DailyLifeDuaMeta | undefined {
    const meta = getDailyLifeBySituation(situation);
    return meta ? getEnrichedMeta(meta.id) : undefined;
  }

  static getQuickAction(actionId: QuickActionId): DailyLifeDuaMeta | undefined {
    const meta = getQuickActionDua(actionId);
    return meta ? getEnrichedMeta(meta.id) : undefined;
  }

  static getTodaysDua(date: Date = new Date()): DailyLifeDuaMeta {
    const meta = pickForDayIndex(dayIndex(date));
    return getEnrichedMeta(meta.id) ?? meta;
  }

  static getRandomDailyDua(date: Date = new Date()): DailyLifeDuaMeta {
    const meta = pickRandomForDay(date);
    return getEnrichedMeta(meta.id) ?? meta;
  }

  static getShuffledDua(excludeId?: DailyLifeDuaId): DailyLifeDuaMeta {
    const pool = excludeId
      ? enrichedCatalog.filter((item) => item.id !== excludeId)
      : enrichedCatalog;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx] ?? enrichedCatalog[0]!;
  }

  static search(query: string): DailyLifeSearchHit[] {
    return searchIndex.search(query);
  }

  static getBundle(id: DailyLifeDuaId): DailyLifeDuaBundle | null {
    const bundled = getBundledDailyLifeDua(id);
    if (bundled) return bundled;

    const meta = getDailyLifeMeta(id);
    if (!meta) return null;

    return {
      meta,
      sections: [],
      bundleVersion: 0,
    };
  }

  static hasBody(id: DailyLifeDuaId): boolean {
    return (getBundledDailyLifeDua(id)?.sections.length ?? 0) > 0;
  }
}
