import { useCallback, useEffect, useRef, useState } from 'react';
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player';

import { getAyahStreamUrl } from '../audio/constants/audioSources';
import { quranPlayerService } from '../audio/engine/quranPlayerService';
import { useQuranPlayerStore } from '../audio/stores/quranPlayerStore';
import { useQuranReaderStore } from '../stores/quranReaderStore';
import type { QuranAyah } from '../types';

/** Ayah-level playback with optional word sync via track player position. */
export function useQuranAudioNative() {
  const audioSyncEnabled = useQuranReaderStore((s) => s.audioSyncEnabled);
  const reciterId = useQuranPlayerStore((s) => s.reciterId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [activeAyah, setActiveAyah] = useState<QuranAyah | null>(null);
  const ayahRef = useRef<QuranAyah | null>(null);
  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopSync = useCallback(() => {
    if (syncTimer.current) {
      clearInterval(syncTimer.current);
      syncTimer.current = null;
    }
  }, []);

  const startWordSync = useCallback(
    (ayah: QuranAyah) => {
      stopSync();
      if (!audioSyncEnabled || !ayah.words.some((w) => w.audioStartMs != null)) return;

      syncTimer.current = setInterval(async () => {
        const posMs = (await TrackPlayer.getPosition()) * 1000;
        const active = ayah.words.findIndex(
          (w) =>
            w.audioStartMs != null &&
            w.audioEndMs != null &&
            posMs >= w.audioStartMs &&
            posMs < w.audioEndMs,
        );
        setActiveWordIndex(active >= 0 ? active : null);
      }, 120);
    },
    [audioSyncEnabled, stopSync],
  );

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getPlaybackState();
      setIsPlaying(state.state === State.Playing);
      if (state.state !== State.Playing) {
        stopSync();
      } else if (ayahRef.current) {
        startWordSync(ayahRef.current);
      }
    }
  });

  const loadAyah = useCallback(
    async (ayah: QuranAyah, audioUrl?: string) => {
      ayahRef.current = ayah;
      setActiveAyah(ayah);
      setActiveWordIndex(null);
      const url = audioUrl ?? getAyahStreamUrl(reciterId, ayah.surah, ayah.ayah);
      await quranPlayerService.playAyah(reciterId, ayah.surah, ayah.ayah, url);
      startWordSync(ayah);
    },
    [reciterId, startWordSync],
  );

  const playNextAyah = useCallback(
    async (ayahs: QuranAyah[]) => {
      const current = ayahRef.current;
      if (!current || !ayahs.length) return;
      const index = ayahs.findIndex((a) => a.surah === current.surah && a.ayah === current.ayah);
      const next = index >= 0 ? ayahs[index + 1] : undefined;
      if (next) await loadAyah(next);
    },
    [loadAyah],
  );

  const playPreviousAyah = useCallback(
    async (ayahs: QuranAyah[]) => {
      const current = ayahRef.current;
      if (!current || !ayahs.length) return;
      const index = ayahs.findIndex((a) => a.surah === current.surah && a.ayah === current.ayah);
      const prev = index > 0 ? ayahs[index - 1] : undefined;
      if (prev) await loadAyah(prev);
    },
    [loadAyah],
  );

  const play = useCallback(async () => {
    await quranPlayerService.play();
    if (ayahRef.current) startWordSync(ayahRef.current);
  }, [startWordSync]);

  const pause = useCallback(async () => {
    await quranPlayerService.pause();
    stopSync();
    setActiveWordIndex(null);
  }, [stopSync]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else if (ayahRef.current) {
      await play();
    }
  }, [isPlaying, pause, play]);

  useEffect(() => () => stopSync(), [stopSync]);

  return {
    isPlaying,
    activeWordIndex,
    activeAyah,
    loadAyah,
    playNextAyah,
    playPreviousAyah,
    play,
    pause,
    toggle,
  };
}
