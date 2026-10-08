import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { CalendarFilterCategory } from '../types';

interface CalendarState {
  bookmarkedIds: string[];
  preferredFilter: CalendarFilterCategory;
  toggleBookmark: (id: string) => void;
  setPreferredFilter: (filter: CalendarFilterCategory) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      bookmarkedIds: [],
      preferredFilter: 'all',
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarkedIds: s.bookmarkedIds.includes(id)
            ? s.bookmarkedIds.filter((x) => x !== id)
            : [...s.bookmarkedIds, id],
        })),
      setPreferredFilter: (preferredFilter) => set({ preferredFilter }),
    }),
    {
      name: 'ahlulbayt-calendar',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
