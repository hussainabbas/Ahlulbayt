import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { ZiyaratDisplayMode, ZiyaratId, ZiyaratTranslationLayer } from '../types';

interface ZiyaratReaderState {
  displayMode: ZiyaratDisplayMode;
  translationLayer: ZiyaratTranslationLayer;
  fontScale: number;
  focusMode: boolean;
  lastRead: Partial<Record<ZiyaratId, { sectionIndex: number; at: string }>>;
  setDisplayMode: (mode: ZiyaratDisplayMode) => void;
  setTranslationLayer: (layer: ZiyaratTranslationLayer) => void;
  setFontScale: (scale: number) => void;
  toggleFocusMode: () => void;
  setLastRead: (id: ZiyaratId, sectionIndex: number) => void;
}

export const useZiyaratReaderStore = create<ZiyaratReaderState>()(
  persist(
    (set) => ({
      displayMode: 'stacked',
      translationLayer: 'en',
      fontScale: 1.05,
      focusMode: false,
      lastRead: {},
      setDisplayMode: (displayMode) => set({ displayMode }),
      setTranslationLayer: (translationLayer) => set({ translationLayer }),
      setFontScale: (fontScale) =>
        set({ fontScale: Math.min(1.5, Math.max(0.9, fontScale)) }),
      toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
      setLastRead: (id, sectionIndex) =>
        set((s) => ({
          lastRead: {
            ...s.lastRead,
            [id]: { sectionIndex, at: new Date().toISOString() },
          },
        })),
    }),
    { name: 'ahlulbayt-ziyarat-reader', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
