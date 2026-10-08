import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

export type TrackablePrayer = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

const EMPTY_COMPLETIONS: TrackablePrayer[] = [];

export function completionsForDate(
  byDate: Record<string, TrackablePrayer[]> | null | undefined,
  date: string,
): TrackablePrayer[] {
  return byDate?.[date] ?? EMPTY_COMPLETIONS;
}

interface PrayerCompletionState {
  /** date (YYYY-MM-DD) -> completed prayer keys */
  byDate: Record<string, TrackablePrayer[]>;
  togglePrayer: (prayer: TrackablePrayer, date?: string) => boolean;
  isCompleted: (prayer: TrackablePrayer, date?: string) => boolean;
  completedCount: (date?: string) => number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const usePrayerCompletionStore = create<PrayerCompletionState>()(
  persist(
    (set, get) => ({
      byDate: {},

      togglePrayer(prayer, date = todayKey()) {
        const byDate = get().byDate ?? {};
        const current = completionsForDate(byDate, date);
        const exists = current.includes(prayer);
        const next = exists ? current.filter((p) => p !== prayer) : [...current, prayer];
        set({ byDate: { ...byDate, [date]: next } });
        return !exists;
      },

      isCompleted(prayer, date = todayKey()) {
        return completionsForDate(get().byDate, date).includes(prayer);
      },

      completedCount(date = todayKey()) {
        return completionsForDate(get().byDate, date).length;
      },
    }),
    {
      name: 'ahlulbayt-prayer-completions',
      storage: createJSONStorage(() => mmkvStorage),
      merge: (persisted, current) => {
        const saved = persisted as Partial<PrayerCompletionState> | undefined;
        const byDate =
          saved?.byDate && typeof saved.byDate === 'object' ? saved.byDate : current.byDate;
        return { ...current, byDate };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.byDate || typeof state.byDate !== 'object') {
          state.byDate = {};
        }
      },
    },
  ),
);
