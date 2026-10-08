import {
  getPrimaryCategory,
  getTodayEvents as getCalendarTodayEvents,
} from '@/features/calendar/engine/calendarEngine';
import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import type { ShiaCalendarEvent } from '@/features/calendar/types';
import { getTimelineForDay } from '@/core/islamic-events/catalog/timelineCatalog';
import { buildIslamicContext } from '@/core/islamic-events/context';
import type { EventTimelineEntry } from '@/core/islamic-events/types';

import {
  getEventContentSeed,
  seedReferencesToCitations,
} from '../data/eventContentCatalog';
import type {
  CalendarEvent,
  CalendarEventType,
  ContentRecommendation,
  IslamicDateContext,
} from '../types';

function mapEventType(event: ShiaCalendarEvent): CalendarEventType {
  const primary = getPrimaryCategory(event);
  if (event.id.startsWith('eid_')) return 'eid';
  if (primary === 'wiladat') return 'wiladat';
  if (primary === 'shahadat' || primary === 'muharram') return 'shahadat';
  if (primary === 'ghadeer' || primary === 'mubahila' || primary === 'arbaeen') {
    return 'season';
  }
  return 'historical';
}

function mapCalendarEvent(
  event: ShiaCalendarEvent,
  daysUntil = 0,
): CalendarEvent {
  const seed = getEventContentSeed(event.id);
  const refs = seed?.references ?? [];
  const unverified = refs.length === 0 || refs.every((r) => r.unverified);

  return {
    id: event.id,
    type: mapEventType(event),
    titleKey: event.titleKey,
    descriptionKey: event.descriptionKey,
    hijriMonth: event.hijriMonth,
    hijriDay: event.hijriDay,
    significanceKey: seed?.significanceKey,
    references: seedReferencesToCitations(refs),
    unverified,
    priority: event.priority,
    amaalKey: event.amaalKey,
    isToday: daysUntil === 0,
    daysUntil,
  };
}

function timelineToRecommendation(
  entry: EventTimelineEntry,
  priority: number,
): ContentRecommendation {
  const refs = seedReferencesToCitations(entry.references);
  const route = entry.route?.screen ?? 'Calendar';
  const routeParams =
    entry.route?.params ??
    (entry.duaId
      ? { duaId: entry.duaId }
      : entry.ziyaratId
        ? { ziyaratId: entry.ziyaratId }
        : undefined);

  return {
    id: `timeline_${entry.id}`,
    kind: entry.duaId ? 'dua' : entry.ziyaratId ? 'ziyarat' : 'history',
    titleKey: entry.titleKey,
    bodyKey: entry.bodyKey,
    route,
    routeParams: routeParams as ContentRecommendation['routeParams'],
    references: refs,
    unverified: entry.unverified,
    priority,
  };
}

export function buildTodayRecommendations(
  month: number,
  day: number,
  todayEvents: CalendarEvent[],
): ContentRecommendation[] {
  const recs: ContentRecommendation[] = [];
  const seen = new Set<string>();

  for (const event of todayEvents) {
    const seed = getEventContentSeed(event.id);
    if (!seed) continue;

    for (const item of seed.items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);

      const itemRefs = item.references
        ? seedReferencesToCitations(item.references)
        : event.references;

      recs.push({
        id: item.id,
        kind: item.kind,
        titleKey: item.titleKey,
        bodyKey: item.bodyKey,
        route: item.route,
        routeParams: item.routeParams as ContentRecommendation['routeParams'],
        references: itemRefs,
        unverified: itemRefs.length === 0 || itemRefs.every((r) => !r.verified),
        priority: item.priority + event.priority / 10,
        eventId: event.id,
      });
    }
  }

  const timeline = getTimelineForDay(month, day);
  for (const entry of timeline) {
    const id = `timeline_${entry.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    recs.push(timelineToRecommendation(entry, 6));
  }

  return recs.sort((a, b) => b.priority - a.priority);
}

export function getTodayContext(now: Date = new Date(), locale = 'en'): IslamicDateContext {
  const hijri = parseHijriDate(now, locale);
  const islamic = buildIslamicContext(hijri, locale);

  return {
    hijriYear: hijri.year,
    hijriMonth: hijri.month,
    hijriDay: hijri.day,
    locale,
    seasonLabelKey: islamic.seasonLabelKey,
    gregorianDate: now,
  };
}

export function getTodayEvents(now: Date = new Date(), locale = 'en'): CalendarEvent[] {
  const hijri = parseHijriDate(now, locale);
  return getCalendarTodayEvents(hijri.month, hijri.day).map((e) =>
    mapCalendarEvent(e, 0),
  );
}

export function getTodayRecommendations(
  now: Date = new Date(),
  locale = 'en',
): ContentRecommendation[] {
  const hijri = parseHijriDate(now, locale);
  const events = getTodayEvents(now, locale);
  return buildTodayRecommendations(hijri.month, hijri.day, events);
}
