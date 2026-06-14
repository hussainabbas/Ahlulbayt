import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { MasoomeenBookmark, MasoomeenId } from '../types';

interface MasoomeenBookmarkState {
  bookmarks: MasoomeenBookmark[];
  isBookmarked: (masoomeenId: MasoomeenId) => boolean;
  toggleBookmark: (masoomeenId: MasoomeenId) => void;
}

export const useMasoomeenBookmarkStore = create<MasoomeenBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      isBookmarked: (masoomeenId) => get().bookmarks.some((b) => b.masoomeenId === masoomeenId),
      toggleBookmark: (masoomeenId) => {
        const existing = get().bookmarks.find((b) => b.masoomeenId === masoomeenId);
        if (existing) {
          set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.masoomeenId !== masoomeenId) }));
        } else {
          const bookmark: MasoomeenBookmark = {
            id: `${masoomeenId}-${Date.now()}`,
            masoomeenId,
            createdAt: new Date().toISOString(),
          };
          set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
        }
      },
    }),
    { name: 'ahlulbayt-masoomeen-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
