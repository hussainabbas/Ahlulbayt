import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { ZiyaratBookmark, ZiyaratId } from '../types';

interface ZiyaratBookmarkState {
  bookmarks: ZiyaratBookmark[];
  addBookmark: (ziyaratId: ZiyaratId, sectionId?: string, label?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (ziyaratId: ZiyaratId) => boolean;
  toggleBookmark: (ziyaratId: ZiyaratId, label?: string) => void;
}

export const useZiyaratBookmarkStore = create<ZiyaratBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (ziyaratId, sectionId, label) => {
        if (get().bookmarks.some((b) => b.ziyaratId === ziyaratId && b.sectionId === sectionId))
          return;
        const bookmark: ZiyaratBookmark = {
          id: `${ziyaratId}-${sectionId ?? 'full'}-${Date.now()}`,
          ziyaratId,
          sectionId,
          label,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
      },
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (ziyaratId) =>
        get().bookmarks.some((b) => b.ziyaratId === ziyaratId && !b.sectionId),
      toggleBookmark: (ziyaratId, label) => {
        const existing = get().bookmarks.find((b) => b.ziyaratId === ziyaratId && !b.sectionId);
        if (existing) get().removeBookmark(existing.id);
        else get().addBookmark(ziyaratId, undefined, label);
      },
    }),
    { name: 'ahlulbayt-ziyarat-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
