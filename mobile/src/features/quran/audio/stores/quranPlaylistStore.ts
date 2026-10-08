import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import { buildTrackId } from '../constants/audioSources';
import type { QuranPlaylist } from '../types';

interface PlaylistState {
  playlists: QuranPlaylist[];
  activePlaylistId: string | null;
  createPlaylist: (name: string) => QuranPlaylist;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  addTrackToPlaylist: (playlistId: string, reciterId: string, surah: number) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  setActivePlaylist: (id: string | null) => void;
  getPlaylistTracks: (playlistId: string) => string[];
}

function nowIso(): string {
  return new Date().toISOString();
}

const DEFAULT_PLAYLIST: QuranPlaylist = {
  id: 'default-favorites',
  name: 'Favorites',
  trackIds: [],
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

export const useQuranPlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [DEFAULT_PLAYLIST],
      activePlaylistId: DEFAULT_PLAYLIST.id,
      createPlaylist: (name) => {
        const playlist: QuranPlaylist = {
          id: `pl-${Date.now()}`,
          name,
          trackIds: [],
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        set((s) => ({ playlists: [playlist, ...s.playlists] }));
        return playlist;
      },
      deletePlaylist: (id) =>
        set((s) => ({
          playlists: s.playlists.filter((p) => p.id !== id),
          activePlaylistId: s.activePlaylistId === id ? null : s.activePlaylistId,
        })),
      renamePlaylist: (id, name) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id ? { ...p, name, updatedAt: nowIso() } : p,
          ),
        })),
      addTrackToPlaylist: (playlistId, reciterId, surah) => {
        const trackId = buildTrackId(reciterId, surah);
        set((s) => ({
          playlists: s.playlists.map((p) => {
            if (p.id !== playlistId) return p;
            if (p.trackIds.includes(trackId)) return p;
            return {
              ...p,
              trackIds: [...p.trackIds, trackId],
              updatedAt: nowIso(),
            };
          }),
        }));
      },
      removeTrackFromPlaylist: (playlistId, trackId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  trackIds: p.trackIds.filter((t) => t !== trackId),
                  updatedAt: nowIso(),
                }
              : p,
          ),
        })),
      setActivePlaylist: (activePlaylistId) => set({ activePlaylistId }),
      getPlaylistTracks: (playlistId) =>
        get().playlists.find((p) => p.id === playlistId)?.trackIds ?? [],
    }),
    { name: 'ahlulbayt-quran-playlists', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
