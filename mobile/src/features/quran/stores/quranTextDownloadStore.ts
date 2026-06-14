import { create } from 'zustand';

import type { SurahBundle, SurahMeta } from '../types';
import {
  checkSurahTextOffline,
  downloadSurahText,
  removeSurahTextOffline,
} from '../engine/quranTextDownloadService';

interface QuranTextDownloadState {
  offlineSurahs: Record<number, boolean>;
  progress: Record<number, number>;
  refreshOffline: (surah: number) => Promise<void>;
  downloadSurahText: (
    meta: SurahMeta,
    currentBundle?: SurahBundle | null,
  ) => Promise<SurahBundle | null>;
  removeSurahText: (surah: number) => Promise<void>;
}

export const useQuranTextDownloadStore = create<QuranTextDownloadState>((set) => ({
  offlineSurahs: {},
  progress: {},

  refreshOffline: async (surah) => {
    const stored = await checkSurahTextOffline(surah);
    set((state) => ({
      offlineSurahs: { ...state.offlineSurahs, [surah]: stored },
    }));
  },

  downloadSurahText: async (meta, currentBundle) => {
    set((state) => ({
      progress: { ...state.progress, [meta.number]: 0 },
    }));

    try {
      const bundle = await downloadSurahText(meta, currentBundle, (value) => {
        set((state) => ({
          progress: { ...state.progress, [meta.number]: value },
        }));
      });

      set((state) => {
        const nextProgress = { ...state.progress };
        delete nextProgress[meta.number];
        return {
          progress: nextProgress,
          offlineSurahs: { ...state.offlineSurahs, [meta.number]: true },
        };
      });

      return bundle;
    } catch {
      set((state) => {
        const nextProgress = { ...state.progress };
        delete nextProgress[meta.number];
        return { progress: nextProgress };
      });
      return null;
    }
  },

  removeSurahText: async (surah) => {
    await removeSurahTextOffline(surah);
    set((state) => ({
      offlineSurahs: { ...state.offlineSurahs, [surah]: false },
    }));
  },
}));
