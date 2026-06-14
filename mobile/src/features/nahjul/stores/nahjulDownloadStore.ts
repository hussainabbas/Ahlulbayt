import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { NahjulDownloadRecord, NahjulId } from '../types';

interface NahjulDownloadState {
  downloads: Record<string, NahjulDownloadRecord>;
  activeDownloads: Record<string, number>;
  setDownload: (record: NahjulDownloadRecord) => void;
  removeDownload: (nahjulId: NahjulId, reciterId: string) => void;
  setProgress: (key: string, progress: number) => void;
  clearProgress: (key: string) => void;
  isDownloaded: (nahjulId: NahjulId, reciterId: string) => boolean;
  getLocalPath: (nahjulId: NahjulId, reciterId: string) => string | null;
}

function downloadKey(nahjulId: NahjulId, reciterId: string): string {
  return `${reciterId}:${nahjulId}`;
}

export const useNahjulDownloadStore = create<NahjulDownloadState>()(
  persist(
    (set, get) => ({
      downloads: {},
      activeDownloads: {},
      setDownload: (record) =>
        set((s) => ({
          downloads: {
            ...s.downloads,
            [downloadKey(record.nahjulId, record.reciterId)]: record,
          },
        })),
      removeDownload: (nahjulId, reciterId) =>
        set((s) => {
          const key = downloadKey(nahjulId, reciterId);
          const { [key]: _, ...rest } = s.downloads;
          return { downloads: rest };
        }),
      setProgress: (key, progress) =>
        set((s) => ({ activeDownloads: { ...s.activeDownloads, [key]: progress } })),
      clearProgress: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.activeDownloads;
          return { activeDownloads: rest };
        }),
      isDownloaded: (nahjulId, reciterId) => !!get().downloads[downloadKey(nahjulId, reciterId)],
      getLocalPath: (nahjulId, reciterId) =>
        get().downloads[downloadKey(nahjulId, reciterId)]?.localPath ?? null,
    }),
    {
      name: 'ahlulbayt-nahjul-downloads',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ downloads: s.downloads }),
    },
  ),
);

export { downloadKey as nahjulDownloadKey };
