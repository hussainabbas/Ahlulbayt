import { getHijriDate } from '@/features/home/services/hijriDate';

import type {
  FastDayRecord,
  MissedFast,
  RamadanCalendarDay,
  RamadanDayStatus,
  RamadanProgressSnapshot,
} from '../types';

export const RAMADAN_HIJRI_MONTH = 9;
export const RAMADAN_DEFAULT_LENGTH = 30;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** First approximate Gregorian date for a Hijri Ramadan day (offline heuristic). */
export function approximateGregorianForHijriDay(
  hijriYear: number,
  hijriDay: number,
  anchor = new Date(),
): string {
  const current = getHijriDate(anchor);
  const offset = hijriDay - (current.month === RAMADAN_HIJRI_MONTH ? current.day : 1);
  const base =
    current.month === RAMADAN_HIJRI_MONTH
      ? anchor
      : addDays(anchor, (RAMADAN_HIJRI_MONTH - current.month) * 29);
  return toDateKey(addDays(base, offset));
}

function statusForDay(
  dateKey: string,
  todayKey: string,
  fast?: FastDayRecord,
  missed?: MissedFast,
): RamadanDayStatus {
  if (dateKey > todayKey) return 'future';
  if (fast?.completed) {
    return fast.kind === 'sunnah' ? 'sunnah' : 'fasted';
  }
  if (missed && !missed.qadaCompleted) return 'missed';
  if (dateKey === todayKey) return 'today';
  if (dateKey < todayKey) return 'pending';
  return 'none';
}

function computeStreak(calendar: RamadanCalendarDay[], todayKey: string): number {
  const sorted = [...calendar]
    .filter((d) => d.dateKey <= todayKey)
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));

  let streak = 0;
  for (const day of sorted) {
    if (day.status === 'fasted' || day.status === 'sunnah') {
      streak += 1;
      continue;
    }
    if (day.status === 'today') {
      break;
    }
    break;
  }
  return streak;
}

export function buildRamadanProgress(
  fasts: FastDayRecord[],
  missed: MissedFast[],
  anchor = new Date(),
  hijriYear?: number,
): RamadanProgressSnapshot {
  const hijri = getHijriDate(anchor);
  const year = hijriYear ?? hijri.year;
  const todayKey = toDateKey(anchor);

  const ramadanFasts = fasts.filter(
    (f) => f.hijriYear === year && f.hijriMonth === RAMADAN_HIJRI_MONTH && f.completed,
  );
  const ramadanMissed = missed.filter(
    (m) => m.hijriYear === year && m.hijriMonth === RAMADAN_HIJRI_MONTH && !m.qadaCompleted,
  );

  const fastByDate = new Map(ramadanFasts.map((f) => [f.dateKey, f]));
  const missedByDate = new Map(ramadanMissed.map((m) => [m.dateKey, m]));

  const calendar: RamadanCalendarDay[] = [];
  for (let hijriDay = 1; hijriDay <= RAMADAN_DEFAULT_LENGTH; hijriDay += 1) {
    const dateKey = approximateGregorianForHijriDay(year, hijriDay, anchor);
    const fast = fastByDate.get(dateKey);
    const miss = missedByDate.get(dateKey);
    calendar.push({
      hijriDay,
      dateKey,
      status: statusForDay(dateKey, todayKey, fast, miss),
    });
  }

  const fastedCount = calendar.filter((d) => d.status === 'fasted' || d.status === 'sunnah').length;
  const missedCount = calendar.filter((d) => d.status === 'missed').length;
  const pendingCount = calendar.filter(
    (d) => d.status === 'pending' && d.dateKey < todayKey,
  ).length;

  const streak = computeStreak(calendar, todayKey);

  return {
    hijriYear: year,
    totalDays: RAMADAN_DEFAULT_LENGTH,
    fastedCount,
    missedCount,
    pendingCount,
    streak,
    progressRatio: fastedCount / RAMADAN_DEFAULT_LENGTH,
    calendar,
  };
}

export function isRamadanMonth(date: Date = new Date(), locale = 'en'): boolean {
  return getHijriDate(date, locale).month === RAMADAN_HIJRI_MONTH;
}
