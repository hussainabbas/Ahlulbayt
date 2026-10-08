import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { GuideDifficulty, PrayerAcademyId, PrayerAcademyProgress } from '../types';

interface PrayerAcademyProgressState {
  byPrayer: Partial<Record<PrayerAcademyId, PrayerAcademyProgress>>;
  setStepProgress: (
    prayerId: PrayerAcademyId,
    stepId: string,
    difficulty: GuideDifficulty,
    guidedModeEnabled: boolean,
  ) => void;
  markComplete: (prayerId: PrayerAcademyId) => void;
  getProgress: (prayerId: PrayerAcademyId) => PrayerAcademyProgress | undefined;
  resetProgress: (prayerId: PrayerAcademyId) => void;
}

export const usePrayerAcademyProgressStore = create<PrayerAcademyProgressState>()(
  persist(
    (set, get) => ({
      byPrayer: {},
      setStepProgress: (prayerId, stepId, difficulty, guidedModeEnabled) => {
        set((state) => {
          const prev = state.byPrayer[prayerId];
          const completed = new Set(prev?.completedStepIds ?? []);
          completed.add(stepId);
          return {
            byPrayer: {
              ...state.byPrayer,
              [prayerId]: {
                prayerId,
                completedStepIds: [...completed],
                lastStepId: stepId,
                difficulty,
                guidedModeEnabled,
              },
            },
          };
        });
      },
      markComplete: (prayerId) => {
        set((state) => {
          const prev = state.byPrayer[prayerId];
          if (!prev) return state;
          return {
            byPrayer: {
              ...state.byPrayer,
              [prayerId]: { ...prev, completedAt: new Date().toISOString() },
            },
          };
        });
      },
      getProgress: (prayerId) => get().byPrayer[prayerId],
      resetProgress: (prayerId) => {
        set((state) => {
          const next = { ...state.byPrayer };
          delete next[prayerId];
          return { byPrayer: next };
        });
      },
    }),
    {
      name: 'ahlulbayt-prayer-academy-progress',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
