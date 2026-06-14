import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { MafatihFavorite, MafatihRef } from '../types';

interface MafatihFavoriteState {
  favorites: MafatihFavorite[];
  addFavorite: (ref: MafatihRef) => void;
  removeFavorite: (ref: MafatihRef) => void;
  isFavorite: (ref: MafatihRef) => boolean;
  toggleFavorite: (ref: MafatihRef) => void;
  getFavoriteRefs: () => MafatihRef[];
}

export const useMafatihFavoriteStore = create<MafatihFavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (ref) => {
        if (get().favorites.some((f) => f.ref === ref)) return;
        set((s) => ({
          favorites: [{ id: `${ref}-${Date.now()}`, ref, createdAt: new Date().toISOString() }, ...s.favorites],
        }));
      },
      removeFavorite: (ref) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f.ref !== ref) })),
      isFavorite: (ref) => get().favorites.some((f) => f.ref === ref),
      toggleFavorite: (ref) => {
        if (get().isFavorite(ref)) get().removeFavorite(ref);
        else get().addFavorite(ref);
      },
      getFavoriteRefs: () => get().favorites.map((f) => f.ref),
    }),
    { name: 'ahlulbayt-mafatih-favorites', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
