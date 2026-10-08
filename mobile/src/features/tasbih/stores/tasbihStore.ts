import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import { CYCLE_TOTAL, DEFAULT_DAILY_GOAL_CYCLES, FATIMA_ZAHRA_PHASES } from '../constants/fatimaZahra';
import { buildAnalyticsSummary, emptyDailyRecord } from '../engine/tasbihAnalytics';
import { todayKey } from '../engine/dateUtils';
import { tasbihHaptics } from '../services/hapticsService';
import { buildWidgetSnapshot, syncTasbihWidget } from '../services/widgetSyncService';
import type { TasbihDailyRecord, TasbihMode, TasbihPhaseId } from '../types';

interface TasbihSettings {
  dailyGoalCycles: number;
  hapticsEnabled: boolean;
}

interface TasbihState {
  records: Record<string, TasbihDailyRecord>;
  session: {
    mode: TasbihMode;
    phaseIndex: number;
    phaseCount: number;
    freeCount: number;
  };
  settings: TasbihSettings;

  setDailyGoalCycles: (cycles: number) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  resetSession: (mode?: TasbihMode) => void;
  increment: () => { phaseComplete: boolean; cycleComplete: boolean; goalReached: boolean };
  undoLast: () => void;
  getTodayRecord: () => TasbihDailyRecord;
  syncWidget: () => void;
}

function bumpDhikr(record: TasbihDailyRecord, phaseId: TasbihPhaseId): TasbihDailyRecord {
  const next = { ...record };
  if (phaseId === 'subhanallah') next.subhanallah++;
  if (phaseId === 'alhamdulillah') next.alhamdulillah++;
  if (phaseId === 'allahu_akbar') next.allahuAkbar++;
  next.total++;
  return next;
}

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set, get) => ({
      records: {},
      session: {
        mode: 'fatima_zahra',
        phaseIndex: 0,
        phaseCount: 0,
        freeCount: 0,
      },
      settings: {
        dailyGoalCycles: DEFAULT_DAILY_GOAL_CYCLES,
        hapticsEnabled: true,
      },

      setDailyGoalCycles: (cycles) =>
        set((s) => ({
          settings: { ...s.settings, dailyGoalCycles: Math.max(1, cycles) },
        })),

      setHapticsEnabled: (enabled) => {
        tasbihHaptics.setEnabled(enabled);
        set((s) => ({ settings: { ...s.settings, hapticsEnabled: enabled } }));
      },

      resetSession: (mode = 'fatima_zahra') =>
        set({
          session: {
            mode,
            phaseIndex: 0,
            phaseCount: 0,
            freeCount: 0,
          },
        }),

      getTodayRecord: () => {
        const today = todayKey();
        return get().records[today] ?? emptyDailyRecord(today);
      },

      increment: () => {
        const state = get();
        const today = todayKey();
        const record = state.records[today] ?? emptyDailyRecord(today);
        const goalBefore = record.total >= state.settings.dailyGoalCycles * CYCLE_TOTAL;

        let phaseComplete = false;
        let cycleComplete = false;

        if (state.session.mode === 'free') {
          tasbihHaptics.tap();
          const nextRecord = { ...record, total: record.total + 1 };
          set((s) => ({
            session: { ...s.session, freeCount: s.session.freeCount + 1 },
            records: { ...s.records, [today]: nextRecord },
          }));
          get().syncWidget();
          return { phaseComplete: false, cycleComplete: false, goalReached: false };
        }

        const phase = FATIMA_ZAHRA_PHASES[state.session.phaseIndex]!;
        tasbihHaptics.tap();

        let nextPhaseIndex = state.session.phaseIndex;
        let nextPhaseCount = state.session.phaseCount + 1;
        let nextRecord = bumpDhikr(record, phase.id);

        if (nextPhaseCount >= phase.target) {
          phaseComplete = true;
          tasbihHaptics.phaseComplete();
          nextPhaseCount = 0;

          if (nextPhaseIndex >= FATIMA_ZAHRA_PHASES.length - 1) {
            cycleComplete = true;
            nextPhaseIndex = 0;
            nextRecord = { ...nextRecord, cycles: nextRecord.cycles + 1 };
            tasbihHaptics.cycleComplete();
          } else {
            nextPhaseIndex++;
          }
        }

        const goalTotal = state.settings.dailyGoalCycles * CYCLE_TOTAL;
        nextRecord.goalMet = nextRecord.total >= goalTotal;

        set({
          session: {
            ...state.session,
            phaseIndex: nextPhaseIndex,
            phaseCount: nextPhaseCount,
          },
          records: { ...state.records, [today]: nextRecord },
        });

        const goalReached = !goalBefore && nextRecord.total >= goalTotal;
        if (goalReached) {
          tasbihHaptics.goalReached();
        }

        get().syncWidget();
        return { phaseComplete, cycleComplete, goalReached };
      },

      undoLast: () => {
        const state = get();
        if (state.session.mode === 'free') {
          if (state.session.freeCount <= 0) return;
          const today = todayKey();
          const record = state.records[today];
          if (!record || record.total <= 0) return;
          set((s) => ({
            session: { ...s.session, freeCount: Math.max(0, s.session.freeCount - 1) },
            records: {
              ...s.records,
              [today]: { ...record, total: record.total - 1 },
            },
          }));
          get().syncWidget();
          return;
        }

        if (state.session.phaseCount <= 0 && state.session.phaseIndex === 0) return;

        const today = todayKey();
        const record = state.records[today];
        if (!record || record.total <= 0) return;

        let phaseIndex = state.session.phaseIndex;
        let phaseCount = state.session.phaseCount;

        if (phaseCount > 0) {
          phaseCount--;
        } else if (phaseIndex > 0) {
          phaseIndex--;
          phaseCount = FATIMA_ZAHRA_PHASES[phaseIndex]!.target - 1;
        }

        const phase = FATIMA_ZAHRA_PHASES[phaseIndex]!;
        const nextRecord = { ...record, total: record.total - 1 };
        if (phase.id === 'subhanallah') nextRecord.subhanallah = Math.max(0, nextRecord.subhanallah - 1);
        if (phase.id === 'alhamdulillah') nextRecord.alhamdulillah = Math.max(0, nextRecord.alhamdulillah - 1);
        if (phase.id === 'allahu_akbar') nextRecord.allahuAkbar = Math.max(0, nextRecord.allahuAkbar - 1);

        set({
          session: { ...state.session, phaseIndex, phaseCount },
          records: { ...state.records, [today]: nextRecord },
        });
        get().syncWidget();
      },

      syncWidget: () => {
        const state = get();
        const summary = buildAnalyticsSummary(state.records, state.settings.dailyGoalCycles);
        const today = state.getTodayRecord();
        const snapshot = buildWidgetSnapshot({
          todayTotal: today.total,
          dailyGoalCycles: state.settings.dailyGoalCycles,
          streak: summary.currentStreak,
          phaseIndex: state.session.phaseIndex,
          phaseCount: state.session.phaseCount,
          cyclesToday: today.cycles,
          cycleTotal: CYCLE_TOTAL,
        });
        syncTasbihWidget(snapshot);
      },
    }),
    {
      name: 'ahlulbayt-tasbih',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.settings.hapticsEnabled != null) {
          tasbihHaptics.setEnabled(state.settings.hapticsEnabled);
        }
        state?.syncWidget();
      },
    },
  ),
);
