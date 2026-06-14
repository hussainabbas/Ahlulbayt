import { useCallback, useEffect } from 'react';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

import { parseTrackId } from '../constants/audioSources';
import { quranPlayerService } from '../engine/quranPlayerService';
import { useQuranDownloadStore } from '../stores/quranDownloadStore';
import { useQuranPlayerStore } from '../stores/quranPlayerStore';
import type { PlaybackSpeed, QuranRepeatMode } from '../types';

export function useQuranPlayerNative() {
  const progress = useProgress(250);
  const playbackState = usePlaybackState();
  const activeTrack = useActiveTrack();

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

  const isPlaying = playbackState.state === State.Playing;
  const isBuffering =
    playbackState.state === State.Buffering || playbackState.state === State.Loading;
  const hasActiveTrack = activeTrack != null;

  const activeSurah =
    activeTrack && 'surah' in activeTrack
      ? (activeTrack as { surah?: number }).surah
      : activeTrack?.id
        ? parseTrackId(String(activeTrack.id)).surah
        : undefined;

  useEffect(() => {
    void quranPlayerService.initialize().then(async () => {
      await quranPlayerService.setRepeatMode(repeatMode);
      await quranPlayerService.setPlaybackRate(playbackRate);
    });
  }, [playbackRate, repeatMode]);

  useEffect(() => {
    if (sleepTimerMode !== 'minutes' || sleepTimerEndsAt == null) return;

    const timer = setInterval(() => {
      if (Date.now() >= sleepTimerEndsAt) {
        void quranPlayerService.pause();
        clearSleepTimer();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [clearSleepTimer, sleepTimerEndsAt, sleepTimerMode]);

  const playSurah = useCallback(
    async (surah: number) => {
      await quranPlayerService.playSurah(reciterId, surah);
    },
    [reciterId],
  );

  const playSurahs = useCallback(
    async (surahs: number[], startIndex = 0) => {
      await quranPlayerService.playQueue(reciterId, surahs, startIndex);
    },
    [reciterId],
  );

  const addToQueue = useCallback(
    async (surah: number) => {
      await quranPlayerService.appendToQueue(reciterId, surah);
    },
    [reciterId],
  );

  const togglePlayback = useCallback(async () => {
    await quranPlayerService.togglePlayback();
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    await quranPlayerService.seekTo(seconds);
  }, []);

  const skipNext = useCallback(async () => {
    await quranPlayerService.skipNext();
  }, []);

  const skipPrevious = useCallback(async () => {
    await quranPlayerService.skipPrevious();
  }, []);

  const cycleRepeatMode = useCallback(async () => {
    const next = cycleRepeatModeStore();
    await quranPlayerService.setRepeatMode(next);
    return next;
  }, [cycleRepeatModeStore]);

  const setRepeatMode = useCallback(
    async (mode: QuranRepeatMode) => {
      setRepeatModeStore(mode);
      await quranPlayerService.setRepeatMode(mode);
    },
    [setRepeatModeStore],
  );

  const setPlaybackRate = useCallback(
    async (rate: PlaybackSpeed) => {
      setPlaybackRateStore(rate);
      await quranPlayerService.setPlaybackRate(rate);
    },
    [setPlaybackRateStore],
  );

  const changeReciter = useCallback(
    async (nextReciterId: string) => {
      setReciterId(nextReciterId);
      await useQuranDownloadStore.getState().hydrateDownloads(nextReciterId);
      await quranPlayerService.refreshTrackSources(nextReciterId);
    },
    [setReciterId],
  );

  const sleepTimerRemainingMs =
    sleepTimerMode === 'minutes' && sleepTimerEndsAt
      ? Math.max(0, sleepTimerEndsAt - Date.now())
      : null;

  return {
    progress,
    activeTrack,
    activeSurah,
    isPlaying,
    isBuffering,
    hasActiveTrack,
    reciterId,
    repeatMode,
    playbackRate,
    isPlayerExpanded,
    sleepTimerMode,
    sleepTimerRemainingMs,
    playSurah,
    playSurahs,
    addToQueue,
    togglePlayback,
    seekTo,
    skipNext,
    skipPrevious,
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
