import { getDashboardUpcomingEvents } from '@/features/calendar/engine/calendarEngine';

import type { IslamicEvent } from '../types';

/** @deprecated Use calendar module directly — kept for home dashboard compatibility */
export function getUpcomingEvents(
  currentHijriMonth: number,
  currentHijriDay: number,
  limit = 4,
): IslamicEvent[] {
  return getDashboardUpcomingEvents(currentHijriMonth, currentHijriDay, limit);
}
