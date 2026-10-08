import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { NahjulBookmark, NahjulId } from '../types';

interface NahjulBookmarkState {
  bookmarks: NahjulBookmark[];
  addBookmark: (nahjulId: NahjulId, sectionId?: string, label?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (nahjulId: NahjulId) => boolean;
  toggleBookmark: (nahjulId: NahjulId, label?: string) => void;
  getBookmarksFor: (nahjulId: NahjulId) => NahjulBookmark[];
}

export const useNahjulBookmarkStore = create<NahjulBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (nahjulId, sectionId, label) => {
        if (get().bookmarks.some((b) => b.nahjulId === nahjulId && b.sectionId === sectionId)) return;
        const bookmark: NahjulBookmark = {
          id: `${nahjulId}-${sectionId ?? 'full'}-${Date.now()}`,
          nahjulId,
          sectionId,
          label,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
      },
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (nahjulId) => get().bookmarks.some((b) => b.nahjulId === nahjulId && !b.sectionId),
      toggleBookmark: (nahjulId, label) => {
        const existing = get().bookmarks.find((b) => b.nahjulId === nahjulId && !b.sectionId);
        if (existing) {
          get().removeBookmark(existing.id);
        } else {
          get().addBookmark(nahjulId, undefined, label);
        }
      },
      getBookmarksFor: (nahjulId) => get().bookmarks.filter((b) => b.nahjulId === nahjulId),
    }),
    { name: 'ahlulbayt-nahjul-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
