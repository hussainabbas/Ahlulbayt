import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { DuaDisplayMode, DuaId, DuaTranslationLayer } from '../types';

interface DuaReaderState {
  displayMode: DuaDisplayMode;
  translationLayer: DuaTranslationLayer;
  fontScale: number;
  lastRead: Partial<Record<DuaId, { sectionId: string; at: string }>>;
  setDisplayMode: (mode: DuaDisplayMode) => void;
  setTranslationLayer: (layer: DuaTranslationLayer) => void;
  setFontScale: (scale: number) => void;
  setLastRead: (duaId: DuaId, sectionId: string) => void;
}

export const useDuaReaderStore = create<DuaReaderState>()(
  persist(
    (set) => ({
      displayMode: 'stacked',
      translationLayer: 'en',
      fontScale: 1,
      lastRead: {},
      setDisplayMode: (displayMode) => set({ displayMode }),
      setTranslationLayer: (translationLayer) => set({ translationLayer }),
      setFontScale: (fontScale) => set({ fontScale: Math.min(1.4, Math.max(0.85, fontScale)) }),
      setLastRead: (duaId, sectionId) =>
        set((s) => ({
          lastRead: {
            ...s.lastRead,
            [duaId]: { sectionId, at: new Date().toISOString() },
          },
        })),
    }),
    { name: 'ahlulbayt-dua-reader', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
