import { useMemo } from 'react';

import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { useHijriClock } from '@/features/calendar/hooks/useHijriClock';
import { useLocale } from '@/i18n/useLocale';

import {
  getMuharramDay,
  isMuharramMonth,
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

  const now = useHijriClock();
  const hijri = useMemo(() => parseHijriDate(now, locale), [now, locale]);

  const seasonActive = isMuharramSeason(hijri.month, hijri.day);
  const muharramStarted = isMuharramMonth(hijri.month);

  const isModeActive = useMemo(() => {
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    return muharramStarted;
  }, [mode, muharramStarted]);

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
  _hijriDay: number,
): boolean {
  const muharramStarted = isMuharramMonth(hijriMonth);
  const modeActive = mode === 'on' || (mode === 'auto' && muharramStarted);
  if (!modeActive) return false;
  if (mode === 'auto' && muharramStarted) return true;
  return blackTheme;
}
