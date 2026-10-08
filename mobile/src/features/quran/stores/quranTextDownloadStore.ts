import { create } from 'zustand';

import { listOfflineTextSurahNumbers } from '../engine/quranBundleStorage';
import type { SurahBundle, SurahMeta } from '../types';
import {
  checkSurahTextOffline,
  downloadSurahText,
  removeSurahTextOffline,
} from '../engine/quranTextDownloadService';

interface QuranTextDownloadState {
  offlineSurahs: Record<number, boolean>;
  progress: Record<number, number>;
  hydrateOfflineCatalog: () => Promise<void>;
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

  hydrateOfflineCatalog: async () => {
    const numbers = await listOfflineTextSurahNumbers();
    const offlineSurahs: Record<number, boolean> = {};
    for (const number of numbers) {
      offlineSurahs[number] = true;
    }
    set({ offlineSurahs });
  },

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

export function selectOfflineTextCount(state: QuranTextDownloadState): number {
  return Object.entries(state.offlineSurahs).filter(([, saved]) => saved).length;
}
