import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { ReaderPreferences, TranslationLayer, ReaderDisplayMode } from '../types';

interface QuranReaderState extends ReaderPreferences {
  lastReadSurah: number;
  lastReadAyah: number;
  setDisplayMode: (mode: ReaderDisplayMode) => void;
  setShowTajweed: (show: boolean) => void;
  toggleTranslationLayer: (layer: TranslationLayer) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setShowTafsir: (show: boolean) => void;
  setReciterId: (id: string) => void;
  setAudioSyncEnabled: (enabled: boolean) => void;
  setLastRead: (surah: number, ayah: number) => void;
}

export const useQuranReaderStore = create<QuranReaderState>()(
  persist(
    (set, get) => ({
      displayMode: 'stacked',
      showTajweed: true,
      translationLayers: ['en', 'ur'],
      arabicFontSize: 28,
      translationFontSize: 16,
      showTafsir: false,
      reciterId: 'al_afasy',
      audioSyncEnabled: true,
      lastReadSurah: 1,
      lastReadAyah: 1,
      setDisplayMode: (displayMode) => set({ displayMode }),
      setShowTajweed: (showTajweed) => set({ showTajweed }),
      toggleTranslationLayer: (layer) => {
        const current = get().translationLayers;
        set({
          translationLayers: current.includes(layer)
            ? current.filter((l) => l !== layer)
            : [...current, layer],
        });
      },
      setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),
      setTranslationFontSize: (translationFontSize) => set({ translationFontSize }),
      setShowTafsir: (showTafsir) => set({ showTafsir }),
      setReciterId: (reciterId) => set({ reciterId }),
      setAudioSyncEnabled: (audioSyncEnabled) => set({ audioSyncEnabled }),
      setLastRead: (lastReadSurah, lastReadAyah) => set({ lastReadSurah, lastReadAyah }),
    }),
    { name: 'ahlulbayt-quran-reader', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
