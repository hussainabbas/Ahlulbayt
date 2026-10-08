import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { CharityEntry, CharityType } from '../types';

function newId(): string {
  return `charity_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface CharityTrackerState {
  entries: CharityEntry[];
  addEntry: (input: {
    type: CharityType;
    amount?: number;
    currency?: string;
    note?: string;
  }) => void;
  toggleFulfilled: (id: string) => void;
  removeEntry: (id: string) => void;
  totalSadaqah: () => number;
  pendingZakatFitr: () => number;
}

export const useCharityTrackerStore = create<CharityTrackerState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry({ type, amount, currency, note }) {
        const entry: CharityEntry = {
          id: newId(),
          type,
          amount,
          currency: currency ?? 'USD',
          note,
          createdAt: new Date().toISOString(),
          fulfilled: false,
        };
        set((s) => ({ entries: [entry, ...s.entries] }));
      },

      toggleFulfilled(id) {
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, fulfilled: !e.fulfilled } : e)),
        }));
      },

      removeEntry(id) {
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
      },

      totalSadaqah() {
        return get()
          .entries.filter((e) => e.type === 'sadaqah' && e.fulfilled)
          .reduce((sum, e) => sum + (e.amount ?? 0), 0);
      },

      pendingZakatFitr() {
        return get().entries.filter((e) => e.type === 'zakat_fitr' && !e.fulfilled).length;
      },
    }),
    {
      name: 'ahlulbayt-ramadan-charity',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
