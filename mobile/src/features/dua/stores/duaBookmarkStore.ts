import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { DuaBookmark, DuaId } from '../types';

interface DuaBookmarkState {
  bookmarks: DuaBookmark[];
  addBookmark: (duaId: DuaId, sectionId?: string, label?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (duaId: DuaId) => boolean;
  toggleBookmark: (duaId: DuaId, label?: string) => void;
  getBookmarksForDua: (duaId: DuaId) => DuaBookmark[];
}

export const useDuaBookmarkStore = create<DuaBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (duaId, sectionId, label) => {
        if (get().bookmarks.some((b) => b.duaId === duaId && b.sectionId === sectionId)) return;
        const bookmark: DuaBookmark = {
          id: `${duaId}-${sectionId ?? 'full'}-${Date.now()}`,
          duaId,
          sectionId,
          label,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
      },
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (duaId) => get().bookmarks.some((b) => b.duaId === duaId && !b.sectionId),
      toggleBookmark: (duaId, label) => {
        const existing = get().bookmarks.find((b) => b.duaId === duaId && !b.sectionId);
        if (existing) {
          get().removeBookmark(existing.id);
        } else {
          get().addBookmark(duaId, undefined, label);
        }
      },
      getBookmarksForDua: (duaId) => get().bookmarks.filter((b) => b.duaId === duaId),
    }),
    { name: 'ahlulbayt-dua-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
