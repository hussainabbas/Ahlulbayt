import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { MuharramModeState } from '../types';

interface MuharramState {
  mode: MuharramModeState;
  blackTheme: boolean;
  selectedDay: number | null;
  lastVisitedDay: number | null;
  setMode: (mode: MuharramModeState) => void;
  setBlackTheme: (enabled: boolean) => void;
  setSelectedDay: (day: number | null) => void;
  markDayVisited: (day: number) => void;
}

export const useMuharramStore = create<MuharramState>()(
  persist(
    (set) => ({
      mode: 'auto',
      blackTheme: true,
      selectedDay: null,
      lastVisitedDay: null,
      setMode: (mode) => set({ mode }),
      setBlackTheme: (blackTheme) => set({ blackTheme }),
      setSelectedDay: (selectedDay) => set({ selectedDay }),
      markDayVisited: (day) => set({ lastVisitedDay: day }),
    }),
    {
      name: 'ahlulbayt-muharram',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
