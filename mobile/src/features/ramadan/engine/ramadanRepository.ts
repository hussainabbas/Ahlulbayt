import { RAMADAN_DAILY, RAMADAN_DAYS_BY_NUMBER } from '../data/dailyContent';
import { LAYLAT_AL_QADR_NIGHTS, LAYLAT_BY_DAY } from '../data/laylatAlQadr';
import type { LaylatAlQadrNight, RamadanDayEntry } from '../types';

export function getRamadanDay(day: number): RamadanDayEntry | undefined {
  return RAMADAN_DAYS_BY_NUMBER[day];
}

export function getAllRamadanDays(): RamadanDayEntry[] {
  return RAMADAN_DAILY;
}

export function clampRamadanDay(day: number): number {
  return Math.min(Math.max(day, 1), RAMADAN_DAILY.length);
}

export function isRamadanMonth(hijriMonth: number): boolean {
  return hijriMonth === 9;
}

/** Sha'ban 15+ lead-up through Ramadan — banners and notifications. */
export function isRamadanSeason(hijriMonth: number, hijriDay: number): boolean {
  return hijriMonth === 9 || (hijriMonth === 8 && hijriDay >= 15);
}

export function isLastTenNights(hijriMonth: number, hijriDay: number): boolean {
  return hijriMonth === 9 && hijriDay >= 21;
}

export function isOddRamadanNight(hijriDay: number): boolean {
  return hijriDay % 2 === 1;
}

export function isLaylatAlQadrCandidate(hijriMonth: number, hijriDay: number): boolean {
  if (hijriMonth !== 9) return false;
  return hijriDay >= 19 && hijriDay % 2 === 1;
}

export function getLaylatAlQadrNight(day: number): LaylatAlQadrNight | undefined {
  return LAYLAT_BY_DAY[day];
}

export function getAllLaylatNights(): LaylatAlQadrNight[] {
  return LAYLAT_AL_QADR_NIGHTS;
}

export function resolveRamadanDay(
  hijriMonth: number,
  hijriDay: number,
  overrideDay: number | null,
): number {
  if (overrideDay != null) return clampRamadanDay(overrideDay);
  if (hijriMonth === 9) return clampRamadanDay(hijriDay);
  return 1;
}

export function hijriRamadanKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function daysUntilRamadan(hijriMonth: number, hijriDay: number): number | null {
  if (hijriMonth === 9) return 0;
  if (hijriMonth === 8) return Math.max(0, 30 - hijriDay);
  return null;
}
