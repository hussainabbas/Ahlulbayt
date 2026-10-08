import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { RamadanModeState } from '../types';

interface RamadanState {
  mode: RamadanModeState;
  selectedDay: number | null;
  lastVisitedDay: number | null;
  setMode: (mode: RamadanModeState) => void;
  setSelectedDay: (day: number | null) => void;
  markDayVisited: (day: number) => void;
}

export const useRamadanStore = create<RamadanState>()(
  persist(
    (set) => ({
      mode: 'auto',
      selectedDay: null,
      lastVisitedDay: null,
      setMode: (mode) => set({ mode }),
      setSelectedDay: (selectedDay) => set({ selectedDay }),
      markDayVisited: (day) => set({ lastVisitedDay: day }),
    }),
    {
      name: 'ahlulbayt-ramadan',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
