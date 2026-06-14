import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';
import { useDuaDownloadStore } from '@/features/dua/stores/duaDownloadStore';
import { useSahifaDownloadStore } from '@/features/sahifa/stores/sahifaDownloadStore';
import { useZiyaratDownloadStore } from '@/features/ziyarat/stores/ziyaratDownloadStore';

import { MAFATIH_INDEX } from '../constants/index';
import type { MafatihRef } from '../types';
import { parseMafatihRef } from '../types';

interface MafatihOfflineState {
  /** User pinned for offline pack (text always bundled; audio tracked separately). */
  pinnedRefs: MafatihRef[];
  indexVersion: number;
  pinOffline: (ref: MafatihRef) => void;
  unpinOffline: (ref: MafatihRef) => void;
  isPinned: (ref: MafatihRef) => boolean;
  /** Text bundled + optionally audio downloaded */
  isFullyOffline: (ref: MafatihRef, reciterId?: string) => boolean;
  offlineCount: (reciterId?: string) => number;
}

const DEFAULT_RECITER = 'feiz';

export const useMafatihOfflineStore = create<MafatihOfflineState>()(
  persist(
    (set, get) => ({
      pinnedRefs: MAFATIH_INDEX.map((e) => e.ref),
      indexVersion: 1,
      pinOffline: (ref) =>
        set((s) => ({
          pinnedRefs: s.pinnedRefs.includes(ref) ? s.pinnedRefs : [...s.pinnedRefs, ref],
        })),
      unpinOffline: (ref) =>
        set((s) => ({ pinnedRefs: s.pinnedRefs.filter((r) => r !== ref) })),
      isPinned: (ref) => get().pinnedRefs.includes(ref),
      isFullyOffline: (ref, reciterId = DEFAULT_RECITER) => {
        const { kind, contentId } = parseMafatihRef(ref);
        const textOk = get().pinnedRefs.includes(ref);
        if (!textOk) return false;
        if (kind === 'dua') {
          return useDuaDownloadStore.getState().isDownloaded(contentId as never, reciterId);
        }
        if (kind === 'ziyarat') {
          return useZiyaratDownloadStore.getState().isDownloaded(contentId as never, reciterId);
        }
        if (kind === 'sahifa') {
          return useSahifaDownloadStore.getState().isDownloaded(contentId as never, reciterId);
        }
        return textOk;
      },
      offlineCount: (reciterId = DEFAULT_RECITER) =>
        get().pinnedRefs.filter((ref) => get().isFullyOffline(ref, reciterId)).length,
    }),
    {
      name: 'ahlulbayt-mafatih-offline',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

/** All bundled text is offline-ready by default. */
export function isTextOffline(ref: MafatihRef): boolean {
  return MAFATIH_INDEX.some((e) => e.ref === ref && e.bundled);
}
