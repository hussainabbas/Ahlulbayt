import { useMemo, useState } from 'react';

import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { useLocale } from '@/i18n/useLocale';

import {
  getMuharramDay,
  isMuharramSeason,
  resolveMuharramDay,
} from '../engine/muharramRepository';
import { useMuharramStore } from '../stores/muharramStore';
import type { MuharramDayContent, MuharramModeState } from '../types';

export function useMuharramMode() {
  const { locale } = useLocale();
  const mode = useMuharramStore((s) => s.mode);
  const blackTheme = useMuharramStore((s) => s.blackTheme);
  const selectedDay = useMuharramStore((s) => s.selectedDay);
  const lastVisitedDay = useMuharramStore((s) => s.lastVisitedDay);
  const setMode = useMuharramStore((s) => s.setMode);
  const setBlackTheme = useMuharramStore((s) => s.setBlackTheme);
  const setSelectedDay = useMuharramStore((s) => s.setSelectedDay);
  const markDayVisited = useMuharramStore((s) => s.markDayVisited);

  const [now] = useState(() => new Date());
  const hijri = useMemo(() => parseHijriDate(now, locale), [now, locale]);

  const seasonActive = isMuharramSeason(hijri.month, hijri.day);

  const isModeActive = useMemo(() => {
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    return seasonActive;
  }, [mode, seasonActive]);

  const isBlackThemeActive = isModeActive && blackTheme;

  const currentDay = resolveMuharramDay(hijri.month, hijri.day, selectedDay);

  const daily: MuharramDayContent | undefined = useMemo(
    () => getMuharramDay(currentDay),
    [currentDay],
  );

  const daysUntilAshura =
    hijri.month === 1 ? Math.max(0, 10 - hijri.day) : hijri.month === 12 ? null : null;

  return {
    hijri,
    seasonActive,
    isModeActive,
    isBlackThemeActive,
    mode,
    blackTheme,
    currentDay,
    daily,
    daysUntilAshura,
    lastVisitedDay,
    setMode,
    setBlackTheme,
    setSelectedDay,
    markDayVisited,
  };
}

export function resolveMuharramThemeActive(
  mode: MuharramModeState,
  blackTheme: boolean,
  hijriMonth: number,
  hijriDay: number,
): boolean {
  const season = isMuharramSeason(hijriMonth, hijriDay);
  const active = mode === 'on' || (mode === 'auto' && season);
  return active && blackTheme;
}
