import { CYCLE_TOTAL } from '../constants/fatimaZahra';
import type { TasbihAnalyticsSummary, TasbihDailyRecord } from '../types';
import { addDays, lastNDays, todayKey } from './dateUtils';

export function emptyDailyRecord(date: string): TasbihDailyRecord {
  return {
    date,
    subhanallah: 0,
    alhamdulillah: 0,
    allahuAkbar: 0,
    total: 0,
    cycles: 0,
    goalMet: false,
  };
}

export function computeStreak(
  records: Record<string, TasbihDailyRecord>,
  dailyGoalCycles: number,
  asOf = todayKey(),
): { current: number; longest: number } {
  const goalTotal = dailyGoalCycles * CYCLE_TOTAL;

  const metGoal = (date: string) => {
    const r = records[date];
    return r ? r.total >= goalTotal || r.goalMet : false;
  };

  let current = 0;
  let cursor = asOf;

  if (!metGoal(cursor)) {
    cursor = addDays(cursor, -1);
  }

  while (metGoal(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  const allDates = Object.keys(records).sort();
  let longest = 0;
  let run = 0;

  for (const date of allDates) {
    if (metGoal(date)) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  return { current, longest: Math.max(longest, current) };
}

export function buildAnalyticsSummary(
  records: Record<string, TasbihDailyRecord>,
  dailyGoalCycles: number,
): TasbihAnalyticsSummary {
  const today = todayKey();
  const todayRecord = records[today] ?? emptyDailyRecord(today);
  const goalTotal = dailyGoalCycles * CYCLE_TOTAL;
  const goalProgress = Math.min(1, todayRecord.total / goalTotal);
  const { current, longest } = computeStreak(records, dailyGoalCycles, today);

  const last7Keys = lastNDays(7);
  const last7Days = last7Keys.map((k) => records[k] ?? emptyDailyRecord(k));

  const last30Keys = lastNDays(30);
  const last30DaysTotal = last30Keys.reduce(
    (sum, k) => sum + (records[k]?.total ?? 0),
    0,
  );
  const averageDaily7 =
    last7Days.reduce((sum, d) => sum + d.total, 0) / Math.max(1, last7Days.length);

  return {
    todayTotal: todayRecord.total,
    todayCycles: todayRecord.cycles,
    goalProgress,
    goalMet: todayRecord.total >= goalTotal,
    currentStreak: current,
    longestStreak: longest,
    last7Days,
    last30DaysTotal,
    averageDaily7: Math.round(averageDaily7),
    byDhikr: {
      subhanallah: todayRecord.subhanallah,
      alhamdulillah: todayRecord.alhamdulillah,
      allahuAkbar: todayRecord.allahuAkbar,
    },
  };
}
