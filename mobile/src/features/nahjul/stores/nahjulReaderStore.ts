import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { NahjulDisplayMode, NahjulId, NahjulTranslationLayer } from '../types';

interface NahjulReaderState {
  displayMode: NahjulDisplayMode;
  translationLayer: NahjulTranslationLayer;
  fontScale: number;
  lastRead: Partial<Record<NahjulId, { sectionId: string; at: string }>>;
  setDisplayMode: (mode: NahjulDisplayMode) => void;
  setTranslationLayer: (layer: NahjulTranslationLayer) => void;
  setFontScale: (scale: number) => void;
  setLastRead: (nahjulId: NahjulId, sectionId: string) => void;
}

export const useNahjulReaderStore = create<NahjulReaderState>()(
  persist(
    (set) => ({
      displayMode: 'stacked',
      translationLayer: 'en',
      fontScale: 1,
      lastRead: {},
      setDisplayMode: (displayMode) => set({ displayMode }),
      setTranslationLayer: (translationLayer) => set({ translationLayer }),
      setFontScale: (fontScale) => set({ fontScale: Math.min(1.4, Math.max(0.85, fontScale)) }),
      setLastRead: (nahjulId, sectionId) =>
        set((s) => ({
          lastRead: {
            ...s.lastRead,
            [nahjulId]: { sectionId, at: new Date().toISOString() },
          },
        })),
    }),
    { name: 'ahlulbayt-nahjul-reader', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
