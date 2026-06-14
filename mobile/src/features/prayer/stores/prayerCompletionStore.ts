import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

export type TrackablePrayer = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

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
        const current = get().byDate[date] ?? [];
        const exists = current.includes(prayer);
        const next = exists ? current.filter((p) => p !== prayer) : [...current, prayer];
        set({ byDate: { ...get().byDate, [date]: next } });
        return !exists;
      },

      isCompleted(prayer, date = todayKey()) {
        return (get().byDate[date] ?? []).includes(prayer);
      },

      completedCount(date = todayKey()) {
        return (get().byDate[date] ?? []).length;
      },
    }),
    {
      name: 'ahlulbayt-prayer-completions',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
