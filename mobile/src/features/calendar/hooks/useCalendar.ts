import { useMemo, useState } from 'react';

import { useLocale } from '@/i18n/useLocale';

import {
  buildMonthGrid,
  getEventsForDay,
  getEventsForMonth,
  getMuharramTimeline,
  getTodayEvents,
  getUpcomingCalendarEvents,
} from '../engine/calendarEngine';
import {
  addHijriMonths,
  formatHijriDate,
  getDaysInHijriMonth,
  parseHijriDate,
} from '../engine/hijriUtils';
import { useCalendarStore } from '../stores/calendarStore';
import type { CalendarFilterCategory } from '../types';

export function useCalendar() {
  const { locale } = useLocale();
  const preferredFilter = useCalendarStore((s) => s.preferredFilter);
  const bookmarkedIds = useCalendarStore((s) => s.bookmarkedIds);

  const [now] = useState(() => new Date());
  const today = useMemo(() => parseHijriDate(now, locale), [now, locale]);

  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const [selectedDay, setSelectedDay] = useState<number | null>(today.day);
  const [filter, setFilter] = useState<CalendarFilterCategory>(preferredFilter);

  const daysInMonth = useMemo(
    () => getDaysInHijriMonth(viewYear, viewMonth, locale),
    [viewYear, viewMonth, locale],
  );

  const monthGrid = useMemo(
    () =>
      buildMonthGrid(
        viewMonth,
        daysInMonth,
        viewYear,
        today.year,
        today.month,
        today.day,
        selectedDay,
        filter,
      ),
    [viewMonth, daysInMonth, viewYear, today.year, today.month, today.day, selectedDay, filter],
  );

  const monthEvents = useMemo(
    () => getEventsForMonth(viewMonth, filter),
    [viewMonth, filter],
  );

  const selectedDayEvents = useMemo(() => {
    const day = selectedDay ?? today.day;
    if (viewYear !== today.year || viewMonth !== today.month) {
      return getEventsForDay(viewMonth, day, filter);
    }
    return getEventsForDay(viewMonth, day, filter);
  }, [selectedDay, today.day, viewYear, today.year, viewMonth, today.month, filter]);

  const todayEvents = useMemo(
    () => getTodayEvents(today.month, today.day, filter),
    [today.month, today.day, filter],
  );

  const upcoming = useMemo(
    () => getUpcomingCalendarEvents(today.month, today.day, 8, filter),
    [today.month, today.day, filter],
  );

  const muharramTimeline = useMemo(() => getMuharramTimeline(), []);

  const hijriFormatted = useMemo(() => formatHijriDate(now, locale), [now, locale]);

  const goToPrevMonth = () => {
    const next = addHijriMonths(viewYear, viewMonth, -1);
    setViewYear(next.year);
    setViewMonth(next.month);
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    const next = addHijriMonths(viewYear, viewMonth, 1);
    setViewYear(next.year);
    setViewMonth(next.month);
    setSelectedDay(1);
  };

  const goToToday = () => {
    setViewYear(today.year);
    setViewMonth(today.month);
    setSelectedDay(today.day);
  };

  const isViewingToday = viewYear === today.year && viewMonth === today.month;
  const isMuharramView = viewMonth === 1;
  const showMuharramTimeline = isMuharramView || today.month === 1;

  return {
    today,
    now,
    viewYear,
    viewMonth,
    selectedDay,
    setSelectedDay,
    filter,
    setFilter,
    daysInMonth,
    monthGrid,
    monthEvents,
    selectedDayEvents,
    todayEvents,
    upcoming,
    muharramTimeline,
    hijriFormatted,
    bookmarkedIds,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    isViewingToday,
    showMuharramTimeline,
  };
}
