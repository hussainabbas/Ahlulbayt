import { useCallback } from 'react';

import { useQuranDownloadStore } from '../stores/quranDownloadStore';
import { useQuranPlayerStore } from '../stores/quranPlayerStore';
import type { PlaybackSpeed, QuranRepeatMode } from '../types';

/** Stub hook — native audio disabled until Track Player v5 migration. */
export function useQuranPlayer() {
  const reciterId = useQuranPlayerStore((s) => s.reciterId);
  const repeatMode = useQuranPlayerStore((s) => s.repeatMode);
  const playbackRate = useQuranPlayerStore((s) => s.playbackRate);
  const isPlayerExpanded = useQuranPlayerStore((s) => s.isPlayerExpanded);
  const sleepTimerEndsAt = useQuranPlayerStore((s) => s.sleepTimerEndsAt);
  const sleepTimerMode = useQuranPlayerStore((s) => s.sleepTimerMode);

  const setReciterId = useQuranPlayerStore((s) => s.setReciterId);
  const setRepeatModeStore = useQuranPlayerStore((s) => s.setRepeatMode);
  const cycleRepeatModeStore = useQuranPlayerStore((s) => s.cycleRepeatMode);
  const setPlaybackRateStore = useQuranPlayerStore((s) => s.setPlaybackRate);
  const setPlayerExpanded = useQuranPlayerStore((s) => s.setPlayerExpanded);
  const setSleepTimerMinutes = useQuranPlayerStore((s) => s.setSleepTimerMinutes);
  const setSleepTimerEndOfSurah = useQuranPlayerStore((s) => s.setSleepTimerEndOfSurah);
  const clearSleepTimer = useQuranPlayerStore((s) => s.clearSleepTimer);

  const noop = useCallback(async () => undefined, []);

  const changeReciter = useCallback(async (nextReciterId: string) => {
    setReciterId(nextReciterId);
    await useQuranDownloadStore.getState().hydrateDownloads(nextReciterId);
  }, [setReciterId]);

  const cycleRepeatMode = useCallback(async () => cycleRepeatModeStore(), [cycleRepeatModeStore]);

  const setRepeatMode = useCallback(
    async (mode: QuranRepeatMode) => {
      setRepeatModeStore(mode);
    },
    [setRepeatModeStore],
  );

  const setPlaybackRate = useCallback(
    async (rate: PlaybackSpeed) => {
      setPlaybackRateStore(rate);
    },
    [setPlaybackRateStore],
  );

  const sleepTimerRemainingMs =
    sleepTimerMode === 'minutes' && sleepTimerEndsAt
      ? Math.max(0, sleepTimerEndsAt - Date.now())
      : null;

  return {
    progress: { position: 0, duration: 0, buffered: 0 },
    activeTrack: null,
    activeSurah: undefined,
    isPlaying: false,
    isBuffering: false,
    hasActiveTrack: false,
    reciterId,
    repeatMode,
    playbackRate,
    isPlayerExpanded,
    sleepTimerMode,
    sleepTimerRemainingMs,
    playSurah: noop,
    playSurahs: noop,
    addToQueue: noop,
    togglePlayback: noop,
    seekTo: noop,
    skipNext: noop,
    skipPrevious: noop,
    cycleRepeatMode,
    setRepeatMode,
    setPlaybackRate,
    changeReciter,
    setPlayerExpanded,
    setSleepTimerMinutes,
    setSleepTimerEndOfSurah,
    clearSleepTimer,
  };
}
