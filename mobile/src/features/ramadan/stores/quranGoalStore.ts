import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { QuranGoalUnit } from '../types';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface QuranGoalState {
  unit: QuranGoalUnit;
  dailyTarget: number;
  todayProgress: number;
  progressDate: string;
  setGoal: (unit: QuranGoalUnit, dailyTarget: number) => void;
  incrementProgress: (amount?: number) => void;
  resetProgress: () => void;
  ensureToday: () => void;
  progressPercent: () => number;
}

export const useQuranGoalStore = create<QuranGoalState>()(
  persist(
    (set, get) => ({
      unit: 'pages',
      dailyTarget: 20,
      todayProgress: 0,
      progressDate: todayKey(),

      setGoal(unit, dailyTarget) {
        set({ unit, dailyTarget: Math.max(1, dailyTarget) });
      },

      incrementProgress(amount = 1) {
        get().ensureToday();
        set((s) => ({ todayProgress: s.todayProgress + amount }));
      },

      resetProgress() {
        set({ todayProgress: 0, progressDate: todayKey() });
      },

      ensureToday() {
        const key = todayKey();
        if (get().progressDate !== key) {
          set({ todayProgress: 0, progressDate: key });
        }
      },

      progressPercent() {
        get().ensureToday();
        const { dailyTarget, todayProgress } = get();
        if (dailyTarget <= 0) return 0;
        return Math.min(100, Math.round((todayProgress / dailyTarget) * 100));
      },
    }),
    {
      name: 'ahlulbayt-ramadan-quran-goal',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
