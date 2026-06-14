import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { DuaDownloadRecord, DuaId } from '../types';

interface DuaDownloadState {
  downloads: Record<string, DuaDownloadRecord>;
  activeDownloads: Record<string, number>;
  setDownload: (record: DuaDownloadRecord) => void;
  removeDownload: (duaId: DuaId, reciterId: string) => void;
  setProgress: (key: string, progress: number) => void;
  clearProgress: (key: string) => void;
  isDownloaded: (duaId: DuaId, reciterId: string) => boolean;
  getLocalPath: (duaId: DuaId, reciterId: string) => string | null;
}

function downloadKey(duaId: DuaId, reciterId: string): string {
  return `${reciterId}:${duaId}`;
}

export const useDuaDownloadStore = create<DuaDownloadState>()(
  persist(
    (set, get) => ({
      downloads: {},
      activeDownloads: {},
      setDownload: (record) =>
        set((s) => ({
          downloads: {
            ...s.downloads,
            [downloadKey(record.duaId, record.reciterId)]: record,
          },
        })),
      removeDownload: (duaId, reciterId) =>
        set((s) => {
          const key = downloadKey(duaId, reciterId);
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
      isDownloaded: (duaId, reciterId) => !!get().downloads[downloadKey(duaId, reciterId)],
      getLocalPath: (duaId, reciterId) =>
        get().downloads[downloadKey(duaId, reciterId)]?.localPath ?? null,
    }),
    {
      name: 'ahlulbayt-dua-downloads',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ downloads: s.downloads }),
    },
  ),
);

export { downloadKey as duaDownloadKey };
