import { MUHARRAM_DAILY, MUHARRAM_DAYS_BY_NUMBER } from '../data/dailyContent';
import type { MuharramDayContent } from '../types';

export function getMuharramDay(day: number): MuharramDayContent | undefined {
  return MUHARRAM_DAYS_BY_NUMBER[day];
}

export function getAllMuharramDays(): MuharramDayContent[] {
  return MUHARRAM_DAILY;
}

export function clampMuharramDay(day: number): number {
  return Math.min(Math.max(day, 1), MUHARRAM_DAILY.length);
}

export function isMuharramSeason(hijriMonth: number, hijriDay: number): boolean {
  return hijriMonth === 1 || (hijriMonth === 12 && hijriDay >= 20);
}

export function resolveMuharramDay(
  hijriMonth: number,
  hijriDay: number,
  overrideDay: number | null,
): number {
  if (overrideDay != null) return clampMuharramDay(overrideDay);
  if (hijriMonth === 1) return clampMuharramDay(hijriDay);
  return 1;
}
