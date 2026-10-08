import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type {
  MafatihDisplayMode,
  MafatihRef,
  MafatihTranslationLayer,
} from '../types';

interface MafatihReaderState {
  displayMode: MafatihDisplayMode;
  translationLayer: MafatihTranslationLayer;
  fontScale: number;
  focusMode: boolean;
  lastRead: Partial<Record<MafatihRef, { sectionIndex: number; at: string }>>;
  setDisplayMode: (mode: MafatihDisplayMode) => void;
  setTranslationLayer: (layer: MafatihTranslationLayer) => void;
  setFontScale: (scale: number) => void;
  toggleFocusMode: () => void;
  setLastRead: (ref: MafatihRef, sectionIndex: number) => void;
}

export const useMafatihReaderStore = create<MafatihReaderState>()(
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
      setLastRead: (ref, sectionIndex) =>
        set((s) => ({
          lastRead: { ...s.lastRead, [ref]: { sectionIndex, at: new Date().toISOString() } },
        })),
    }),
    { name: 'ahlulbayt-mafatih-reader', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
