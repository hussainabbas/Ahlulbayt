import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { SahifaDisplayMode, SahifaId, SahifaTranslationLayer } from '../types';

interface SahifaReaderState {
  displayMode: SahifaDisplayMode;
  translationLayer: SahifaTranslationLayer;
  fontScale: number;
  lastRead: Partial<Record<SahifaId, { sectionId: string; at: string }>>;
  setDisplayMode: (mode: SahifaDisplayMode) => void;
  setTranslationLayer: (layer: SahifaTranslationLayer) => void;
  setFontScale: (scale: number) => void;
  setLastRead: (sahifaId: SahifaId, sectionId: string) => void;
}

export const useSahifaReaderStore = create<SahifaReaderState>()(
  persist(
    (set) => ({
      displayMode: 'stacked',
      translationLayer: 'en',
      fontScale: 1,
      lastRead: {},
      setDisplayMode: (displayMode) => set({ displayMode }),
      setTranslationLayer: (translationLayer) => set({ translationLayer }),
      setFontScale: (fontScale) => set({ fontScale: Math.min(1.4, Math.max(0.85, fontScale)) }),
      setLastRead: (sahifaId, sectionId) =>
        set((s) => ({
          lastRead: {
            ...s.lastRead,
            [sahifaId]: { sectionId, at: new Date().toISOString() },
          },
        })),
    }),
    { name: 'ahlulbayt-sahifa-reader', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
