import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { SahifaDownloadRecord, SahifaId } from '../types';

interface SahifaDownloadState {
  downloads: Record<string, SahifaDownloadRecord>;
  activeDownloads: Record<string, number>;
  setDownload: (record: SahifaDownloadRecord) => void;
  removeDownload: (sahifaId: SahifaId, reciterId: string) => void;
  setProgress: (key: string, progress: number) => void;
  clearProgress: (key: string) => void;
  isDownloaded: (sahifaId: SahifaId, reciterId: string) => boolean;
  getLocalPath: (sahifaId: SahifaId, reciterId: string) => string | null;
}

function downloadKey(sahifaId: SahifaId, reciterId: string): string {
  return `${reciterId}:${sahifaId}`;
}

export const useSahifaDownloadStore = create<SahifaDownloadState>()(
  persist(
    (set, get) => ({
      downloads: {},
      activeDownloads: {},
      setDownload: (record) =>
        set((s) => ({
          downloads: {
            ...s.downloads,
            [downloadKey(record.sahifaId, record.reciterId)]: record,
          },
        })),
      removeDownload: (sahifaId, reciterId) =>
        set((s) => {
          const key = downloadKey(sahifaId, reciterId);
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
      isDownloaded: (sahifaId, reciterId) => !!get().downloads[downloadKey(sahifaId, reciterId)],
      getLocalPath: (sahifaId, reciterId) =>
        get().downloads[downloadKey(sahifaId, reciterId)]?.localPath ?? null,
    }),
    {
      name: 'ahlulbayt-sahifa-downloads',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ downloads: s.downloads }),
    },
  ),
);

export { downloadKey as sahifaDownloadKey };
