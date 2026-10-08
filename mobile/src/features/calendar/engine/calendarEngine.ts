import { SHIA_CALENDAR_EVENTS, SHIA_EVENTS_BY_ID, MUHARRAM_TIMELINE_IDS } from '../data/shiaEvents';
import { daysUntilHijriDate } from './hijriUtils';
import type {
  CalendarDayCell,
  CalendarEventCategory,
  CalendarEventInstance,
  CalendarFilterCategory,
  ShiaCalendarEvent,
} from '../types';

function matchesCategory(event: ShiaCalendarEvent, filter: CalendarFilterCategory): boolean {
  if (filter === 'all') return true;
  return event.categories.includes(filter);
}

function sortByDay(a: ShiaCalendarEvent, b: ShiaCalendarEvent): number {
  if (a.hijriMonth !== b.hijriMonth) return a.hijriMonth - b.hijriMonth;
  if (a.hijriDay !== b.hijriDay) return a.hijriDay - b.hijriDay;
  return b.priority - a.priority;
}

export function getAllEvents(filter: CalendarFilterCategory = 'all'): ShiaCalendarEvent[] {
  return SHIA_CALENDAR_EVENTS.filter((e) => matchesCategory(e, filter)).sort(sortByDay);
}

export function getEventById(id: string): ShiaCalendarEvent | undefined {
  return SHIA_EVENTS_BY_ID[id];
}

export function getEventsForMonth(
  month: number,
  filter: CalendarFilterCategory = 'all',
): ShiaCalendarEvent[] {
  return SHIA_CALENDAR_EVENTS.filter(
    (e) => e.hijriMonth === month && matchesCategory(e, filter),
  ).sort((a, b) => a.hijriDay - b.hijriDay || b.priority - a.priority);
}

export function getEventsForDay(
  month: number,
  day: number,
  filter: CalendarFilterCategory = 'all',
): ShiaCalendarEvent[] {
  return SHIA_CALENDAR_EVENTS.filter(
    (e) => e.hijriMonth === month && e.hijriDay === day && matchesCategory(e, filter),
  ).sort((a, b) => b.priority - a.priority);
}

export function getTodayEvents(
  currentMonth: number,
  currentDay: number,
  filter: CalendarFilterCategory = 'all',
): CalendarEventInstance[] {
  return getEventsForDay(currentMonth, currentDay, filter).map((event) => ({
    ...event,
    daysUntil: 0,
    isToday: true,
  }));
}

export function getUpcomingCalendarEvents(
  currentMonth: number,
  currentDay: number,
  limit = 6,
  filter: CalendarFilterCategory = 'all',
): CalendarEventInstance[] {
  const withDistance = SHIA_CALENDAR_EVENTS.filter((e) => matchesCategory(e, filter)).map(
    (event) => {
      const daysUntil = daysUntilHijriDate(
        currentMonth,
        currentDay,
        event.hijriMonth,
        event.hijriDay,
      );
      return {
        ...event,
        daysUntil,
        isToday: daysUntil === 0,
      };
    },
  );

  return withDistance
    .filter((e) => e.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil || b.priority - a.priority)
    .slice(0, limit);
}

export function buildMonthGrid(
  month: number,
  daysInMonth: number,
  viewYear: number,
  todayYear: number,
  todayMonth: number,
  todayDay: number,
  selectedDay: number | null,
  filter: CalendarFilterCategory = 'all',
): CalendarDayCell[] {
  const cells: CalendarDayCell[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const events = getEventsForDay(month, day, filter);
    cells.push({
      day,
      isToday: viewYear === todayYear && month === todayMonth && day === todayDay,
      isSelected: selectedDay === day,
      events,
      hasHighPriority: events.some((e) => e.priority >= 9),
    });
  }
  return cells;
}

export function getMuharramTimeline(): ShiaCalendarEvent[] {
  return MUHARRAM_TIMELINE_IDS.map((id) => SHIA_EVENTS_BY_ID[id]).filter(
    (e): e is ShiaCalendarEvent => e != null,
  );
}

export function getFeaturedForCategory(
  category: CalendarEventCategory,
): ShiaCalendarEvent | undefined {
  return SHIA_CALENDAR_EVENTS.filter((e) => e.categories.includes(category)).sort(
    (a, b) => b.priority - a.priority,
  )[0];
}

export function getPrimaryCategory(event: ShiaCalendarEvent): CalendarEventCategory {
  const order: CalendarEventCategory[] = [
    'muharram',
    'arbaeen',
    'ghadeer',
    'mubahila',
    'shahadat',
    'wiladat',
  ];
  for (const cat of order) {
    if (event.categories.includes(cat)) return cat;
  }
  return event.categories[0] ?? 'wiladat';
}

/** Legacy adapter for home dashboard widget */
export function getDashboardUpcomingEvents(
  currentMonth: number,
  currentDay: number,
  limit = 4,
): Array<{
  id: string;
  titleKey: string;
  hijriMonth: number;
  hijriDay: number;
  category: 'martyrdom' | 'birth' | 'occasion' | 'community';
  daysUntil: number;
}> {
  return getUpcomingCalendarEvents(currentMonth, currentDay, limit).map((event) => ({
    id: event.id,
    titleKey: event.titleKey,
    hijriMonth: event.hijriMonth,
    hijriDay: event.hijriDay,
    daysUntil: event.daysUntil,
    category: mapToLegacyCategory(getPrimaryCategory(event)),
  }));
}

function mapToLegacyCategory(
  cat: CalendarEventCategory,
): 'martyrdom' | 'birth' | 'occasion' | 'community' {
  switch (cat) {
    case 'shahadat':
    case 'muharram':
      return 'martyrdom';
    case 'wiladat':
      return 'birth';
    case 'arbaeen':
    case 'ghadeer':
    case 'mubahila':
      return 'occasion';
    default:
      return 'occasion';
  }
}
