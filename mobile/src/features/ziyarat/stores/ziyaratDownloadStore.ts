import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { ZiyaratDownloadRecord, ZiyaratId } from '../types';

interface ZiyaratDownloadState {
  downloads: Record<string, ZiyaratDownloadRecord>;
  activeDownloads: Record<string, number>;
  setDownload: (record: ZiyaratDownloadRecord) => void;
  removeDownload: (id: ZiyaratId, reciterId: string) => void;
  setProgress: (key: string, progress: number) => void;
  clearProgress: (key: string) => void;
  isDownloaded: (id: ZiyaratId, reciterId: string) => boolean;
  getLocalPath: (id: ZiyaratId, reciterId: string) => string | null;
}

export function ziyaratDownloadKey(id: ZiyaratId, reciterId: string): string {
  return `${reciterId}:${id}`;
}

export const useZiyaratDownloadStore = create<ZiyaratDownloadState>()(
  persist(
    (set, get) => ({
      downloads: {},
      activeDownloads: {},
      setDownload: (record) =>
        set((s) => ({
          downloads: {
            ...s.downloads,
            [ziyaratDownloadKey(record.ziyaratId, record.reciterId)]: record,
          },
        })),
      removeDownload: (id, reciterId) =>
        set((s) => {
          const key = ziyaratDownloadKey(id, reciterId);
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
      isDownloaded: (id, reciterId) => !!get().downloads[ziyaratDownloadKey(id, reciterId)],
      getLocalPath: (id, reciterId) =>
        get().downloads[ziyaratDownloadKey(id, reciterId)]?.localPath ?? null,
    }),
    {
      name: 'ahlulbayt-ziyarat-downloads',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ downloads: s.downloads }),
    },
  ),
);
