import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import { buildTrackId } from '../constants/audioSources';
import { audioDownloadService } from '../engine/audioDownloadService';
import type { DownloadJob, DownloadRecord } from '../types';

interface DownloadState {
  downloads: Record<string, DownloadRecord>;
  jobs: Record<string, DownloadJob>;
  hydrateDownloads: (reciterId: string) => Promise<void>;
  downloadSurah: (reciterId: string, surah: number) => Promise<void>;
  deleteDownload: (reciterId: string, surah: number) => Promise<void>;
  isDownloaded: (reciterId: string, surah: number) => boolean;
  getJob: (reciterId: string, surah: number) => DownloadJob | undefined;
}

export const useQuranDownloadStore = create<DownloadState>()(
  persist(
    (set, get) => ({
      downloads: {},
      jobs: {},
      hydrateDownloads: async (reciterId) => {
        const records: Record<string, DownloadRecord> = { ...get().downloads };
        const batchSize = 20;

        for (let start = 1; start <= 114; start += batchSize) {
          const end = Math.min(114, start + batchSize - 1);
          const batch = await Promise.all(
            Array.from({ length: end - start + 1 }, async (_, index) => {
              const surah = start + index;
              const record = await audioDownloadService.getDownloadRecord(reciterId, surah);
              return { surah, record };
            }),
          );

          for (const { surah, record } of batch) {
            const id = buildTrackId(reciterId, surah);
            if (record) {
              records[id] = record;
            } else if (records[id]?.reciterId === reciterId) {
              delete records[id];
            }
          }
        }

        set({ downloads: records });
      },
      downloadSurah: async (reciterId, surah) => {
        const id = buildTrackId(reciterId, surah);
        set((s) => ({
          jobs: {
            ...s.jobs,
            [id]: { id, reciterId, surah, progress: 0, status: 'pending' },
          },
        }));

        try {
          const record = await audioDownloadService.downloadSurah(reciterId, surah, (job) => {
            set((s) => ({ jobs: { ...s.jobs, [id]: job } }));
          });
          set((s) => ({
            downloads: { ...s.downloads, [id]: record },
            jobs: {
              ...s.jobs,
              [id]: { id, reciterId, surah, progress: 1, status: 'completed' },
            },
          }));
        } catch (error) {
          set((s) => ({
            jobs: {
              ...s.jobs,
              [id]: {
                id,
                reciterId,
                surah,
                progress: 0,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Failed',
              },
            },
          }));
        }
      },
      deleteDownload: async (reciterId, surah) => {
        const id = buildTrackId(reciterId, surah);
        await audioDownloadService.deleteDownload(reciterId, surah);
        set((s) => {
          const downloads = { ...s.downloads };
          delete downloads[id];
          return { downloads };
        });
      },
      isDownloaded: (reciterId, surah) => {
        const id = buildTrackId(reciterId, surah);
        return Boolean(get().downloads[id]);
      },
      getJob: (reciterId, surah) => {
        const id = buildTrackId(reciterId, surah);
        return get().jobs[id];
      },
    }),
    {
      name: 'ahlulbayt-quran-downloads',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ downloads: s.downloads }),
    },
  ),
);
