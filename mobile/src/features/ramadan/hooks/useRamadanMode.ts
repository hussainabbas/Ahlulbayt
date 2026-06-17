import { useMemo } from 'react';

import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { useHijriClock } from '@/features/calendar/hooks/useHijriClock';
import { useLocale } from '@/i18n/useLocale';

import {
  daysUntilRamadan,
  getRamadanDay,
  isLastTenNights,
  isLaylatAlQadrCandidate,
  isRamadanMonth,
  isRamadanSeason,
  resolveRamadanDay,
} from '../engine/ramadanRepository';
import { useRamadanStore } from '../stores/ramadanStore';
import type { RamadanDayEntry, RamadanModeState } from '../types';

export function useRamadanMode() {
  const { locale } = useLocale();
  const mode = useRamadanStore((s) => s.mode);
  const selectedDay = useRamadanStore((s) => s.selectedDay);
  const lastVisitedDay = useRamadanStore((s) => s.lastVisitedDay);
  const setMode = useRamadanStore((s) => s.setMode);
  const setSelectedDay = useRamadanStore((s) => s.setSelectedDay);
  const markDayVisited = useRamadanStore((s) => s.markDayVisited);

  const now = useHijriClock();
  const hijri = useMemo(() => parseHijriDate(now, locale), [now, locale]);

  const seasonActive = isRamadanSeason(hijri.month, hijri.day);
  const ramadanStarted = isRamadanMonth(hijri.month);
  const lastTen = isLastTenNights(hijri.month, hijri.day);
  const qadrCandidate = isLaylatAlQadrCandidate(hijri.month, hijri.day);

  const isModeActive = useMemo(() => {
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    return ramadanStarted;
  }, [mode, ramadanStarted]);

  const currentDay = resolveRamadanDay(hijri.month, hijri.day, selectedDay);

  const daily: RamadanDayEntry | undefined = useMemo(
    () => getRamadanDay(currentDay),
    [currentDay],
  );

  const daysLeft = daysUntilRamadan(hijri.month, hijri.day);

  return {
    hijri,
    seasonActive,
    isModeActive,
    ramadanStarted,
    lastTen,
    qadrCandidate,
    mode,
    currentDay,
    daily,
    daysLeft,
    lastVisitedDay,
    setMode,
    setSelectedDay,
    markDayVisited,
  };
}

export function resolveRamadanHubActive(
  mode: RamadanModeState,
  hijriMonth: number,
): boolean {
  const ramadanStarted = isRamadanMonth(hijriMonth);
  return mode === 'on' || (mode === 'auto' && ramadanStarted);
}
