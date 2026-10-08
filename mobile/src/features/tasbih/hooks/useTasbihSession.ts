import { useMemo } from 'react';

import { buildAnalyticsSummary } from '../engine/tasbihAnalytics';
import { CYCLE_TOTAL, FATIMA_ZAHRA_PHASES } from '../constants/fatimaZahra';
import { useTasbihStore } from '../stores/tasbihStore';

export function useTasbihAnalytics() {
  const records = useTasbihStore((s) => s.records);
  const dailyGoalCycles = useTasbihStore((s) => s.settings.dailyGoalCycles);

  return useMemo(
    () => buildAnalyticsSummary(records, dailyGoalCycles),
    [records, dailyGoalCycles],
  );
}

export function useTasbihSession() {
  const session = useTasbihStore((s) => s.session);
  const settings = useTasbihStore((s) => s.settings);
  const increment = useTasbihStore((s) => s.increment);
  const undoLast = useTasbihStore((s) => s.undoLast);
  const resetSession = useTasbihStore((s) => s.resetSession);
  const getTodayRecord = useTasbihStore((s) => s.getTodayRecord);

  const phase = FATIMA_ZAHRA_PHASES[session.phaseIndex] ?? FATIMA_ZAHRA_PHASES[0]!;
  const todayRecord = getTodayRecord();
  const goalTotal = settings.dailyGoalCycles * CYCLE_TOTAL;

  return {
    session,
    settings,
    phase,
    phaseIndex: session.phaseIndex,
    phaseCount: session.phaseCount,
    phaseTarget: phase.target,
    phaseProgress: session.phaseCount / phase.target,
    todayRecord,
    goalTotal,
    increment,
    undoLast,
    resetSession,
    phases: FATIMA_ZAHRA_PHASES,
  };
}
