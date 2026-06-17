import { parseHijriDate, type HijriParts } from '@/features/calendar/engine/hijriUtils';

import { buildIslamicContext } from './context';
import {
  getFeaturedForSeason,
  getHomePrioritiesForSeason,
} from './catalog/prioritiesCatalog';
import {
  getTimelineForDay,
  getTimelineForMonth,
} from './catalog/timelineCatalog';
import type {
  EventTimelineEntry,
  FeaturedContentItem,
  HomePriorityItem,
  IslamicEventContext,
  IslamicEventsSnapshot,
} from './types';

export function getCurrentContext(date: Date, locale = 'en'): IslamicEventContext {
  const hijri = parseHijriDate(date, locale);
  return buildIslamicContext(hijri);
}

export function getHomePriorities(
  date: Date,
  locale = 'en',
  limit?: number,
): HomePriorityItem[] {
  const ctx = getCurrentContext(date, locale);
  const items = getHomePrioritiesForSeason(ctx.season);
  return limit != null ? items.slice(0, limit) : items;
}

export function getDailyTimeline(
  date: Date,
  locale = 'en',
): EventTimelineEntry[] {
  const hijri = parseHijriDate(date, locale);
  return getTimelineForDay(hijri.month, hijri.day);
}

export function getMonthlyTimeline(
  hijriMonth: number,
): EventTimelineEntry[] {
  return getTimelineForMonth(hijriMonth);
}

export function getFeaturedContent(
  date: Date,
  locale = 'en',
  limit?: number,
): FeaturedContentItem[] {
  const ctx = getCurrentContext(date, locale);
  const items = getFeaturedForSeason(ctx.season);
  return limit != null ? items.slice(0, limit) : items;
}

/** Full snapshot for dashboard / AI context builders. */
export function getIslamicEventsSnapshot(
  date: Date,
  locale = 'en',
): IslamicEventsSnapshot {
  const hijri = parseHijriDate(date, locale);
  const context = buildIslamicContext(hijri);
  return {
    context,
    homePriorities: getHomePrioritiesForSeason(context.season),
    dailyTimeline: getTimelineForDay(hijri.month, hijri.day),
    featuredContent: getFeaturedForSeason(context.season),
  };
}

export function getIslamicEventsSnapshotFromHijri(
  hijri: HijriParts,
): IslamicEventsSnapshot {
  const context = buildIslamicContext(hijri);
  return {
    context,
    homePriorities: getHomePrioritiesForSeason(context.season),
    dailyTimeline: getTimelineForDay(hijri.month, hijri.day),
    featuredContent: getFeaturedForSeason(context.season),
  };
}
