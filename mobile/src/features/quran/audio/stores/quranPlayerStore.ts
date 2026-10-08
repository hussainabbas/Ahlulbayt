import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type {
  PlaybackResumeState,
  PlaybackSpeed,
  QuranRepeatMode,
  SleepTimerMode,
} from '../types';

/** Matches react-native-track-player RepeatMode numeric values. */
const REPEAT_FROM_NATIVE: Record<number, QuranRepeatMode> = {
  0: 'off',
  1: 'one',
  2: 'all',
};

interface QuranPlayerState {
  reciterId: string;
  repeatMode: QuranRepeatMode;
  playbackRate: PlaybackSpeed;
  continuousPlayEnabled: boolean;
  lastPlayback: PlaybackResumeState | null;
  sleepTimerEndsAt: number | null;
  sleepTimerMode: SleepTimerMode | null;
  isPlayerExpanded: boolean;
  setReciterId: (id: string) => void;
  setContinuousPlayEnabled: (enabled: boolean) => void;
  savePlaybackResume: (state: PlaybackResumeState) => void;
  clearPlaybackResume: () => void;
  setRepeatMode: (mode: QuranRepeatMode) => void;
  syncRepeatModeFromNative: (mode: number) => void;
  cycleRepeatMode: () => QuranRepeatMode;
  setPlaybackRate: (rate: PlaybackSpeed) => void;
  setSleepTimerMinutes: (minutes: number) => void;
  setSleepTimerEndOfSurah: () => void;
  clearSleepTimer: () => void;
  setPlayerExpanded: (expanded: boolean) => void;
}

export const useQuranPlayerStore = create<QuranPlayerState>()(
  persist(
    (set, get) => ({
      reciterId: 'al_afasy',
      repeatMode: 'off',
      playbackRate: 1,
      continuousPlayEnabled: true,
      lastPlayback: null,
      sleepTimerEndsAt: null,
      sleepTimerMode: null,
      isPlayerExpanded: false,
      setReciterId: (reciterId) => set({ reciterId }),
      setContinuousPlayEnabled: (continuousPlayEnabled) => set({ continuousPlayEnabled }),
      savePlaybackResume: (lastPlayback) => set({ lastPlayback }),
      clearPlaybackResume: () => set({ lastPlayback: null }),
      setRepeatMode: (repeatMode) => set({ repeatMode }),
      syncRepeatModeFromNative: (mode) =>
        set({ repeatMode: REPEAT_FROM_NATIVE[mode] ?? 'off' }),
      cycleRepeatMode: () => {
        const order: QuranRepeatMode[] = ['off', 'all', 'one'];
        const current = get().repeatMode;
        const next = order[(order.indexOf(current) + 1) % order.length]!;
        set({ repeatMode: next });
        return next;
      },
      setPlaybackRate: (playbackRate) => set({ playbackRate }),
      setSleepTimerMinutes: (minutes) =>
        set({
          sleepTimerMode: 'minutes',
          sleepTimerEndsAt: Date.now() + minutes * 60_000,
        }),
      setSleepTimerEndOfSurah: () =>
        set({
          sleepTimerMode: 'end_of_surah',
          sleepTimerEndsAt: null,
        }),
      clearSleepTimer: () => set({ sleepTimerMode: null, sleepTimerEndsAt: null }),
      setPlayerExpanded: (isPlayerExpanded) => set({ isPlayerExpanded }),
    }),
    {
      name: 'ahlulbayt-quran-player',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({
        reciterId: s.reciterId,
        repeatMode: s.repeatMode,
        playbackRate: s.playbackRate,
        continuousPlayEnabled: s.continuousPlayEnabled,
        lastPlayback: s.lastPlayback,
      }),
    },
  ),
);
