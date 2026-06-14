import { useCallback, useEffect, useMemo, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';

import { ZIYARAT_RECITERS } from '../constants/catalog';
import { ZiyaratRepository } from '../engine/ziyaratRepository';
import { ziyaratAudioService } from '../audio/ziyaratAudioService';
import { ziyaratDownloadService } from '../audio/ziyaratDownloadService';
import { useZiyaratReaderStore } from '../stores/ziyaratReaderStore';
import { ziyaratDownloadKey, useZiyaratDownloadStore } from '../stores/ziyaratDownloadStore';
import type { ZiyaratId } from '../types';

export function useZiyaratReader(id: ZiyaratId) {
  const displayMode = useZiyaratReaderStore((s) => s.displayMode);
  const translationLayer = useZiyaratReaderStore((s) => s.translationLayer);
  const fontScale = useZiyaratReaderStore((s) => s.fontScale);
  const focusMode = useZiyaratReaderStore((s) => s.focusMode);
  const lastRead = useZiyaratReaderStore((s) => s.lastRead[id]);
  const setDisplayMode = useZiyaratReaderStore((s) => s.setDisplayMode);
  const setTranslationLayer = useZiyaratReaderStore((s) => s.setTranslationLayer);
  const setFontScale = useZiyaratReaderStore((s) => s.setFontScale);
  const toggleFocusMode = useZiyaratReaderStore((s) => s.toggleFocusMode);
  const setLastRead = useZiyaratReaderStore((s) => s.setLastRead);

  const bundle = useMemo(() => ZiyaratRepository.get(id), [id]);

  const cycleDisplayMode = () => {
    const modes = ['stacked', 'arabic_only', 'translation_only'] as const;
    const idx = modes.indexOf(displayMode);
    setDisplayMode(modes[(idx + 1) % modes.length]!);
  };

  const cycleTranslation = () => {
    setTranslationLayer(translationLayer === 'en' ? 'ur' : 'en');
  };

  return {
    bundle,
    meta: bundle?.meta,
    sections: bundle?.sections ?? [],
    displayMode,
    translationLayer,
    fontScale,
    focusMode,
    lastRead,
    setDisplayMode,
    setTranslationLayer,
    setFontScale,
    toggleFocusMode,
    cycleDisplayMode,
    cycleTranslation,
    setLastRead,
  };
}

export function useZiyaratAudio(id: ZiyaratId) {
  const [reciterId, setReciterId] = useState(ZIYARAT_RECITERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isDownloaded = useZiyaratDownloadStore((s) => s.isDownloaded(id, reciterId));
  const getLocalPath = useZiyaratDownloadStore((s) => s.getLocalPath);
  const setDownload = useZiyaratDownloadStore((s) => s.setDownload);
  const removeDownload = useZiyaratDownloadStore((s) => s.removeDownload);

  useTrackPlayerEvents([Event.PlaybackState], async () => {
    setIsPlaying(await ziyaratAudioService.getIsPlaying(id, reciterId));
  });

  useEffect(() => {
    void ziyaratAudioService.getIsPlaying(id, reciterId).then(setIsPlaying);
  }, [id, reciterId]);

  const togglePlay = useCallback(async () => {
    await ziyaratAudioService.togglePlay(reciterId, id, getLocalPath(id, reciterId));
    setIsPlaying(await ziyaratAudioService.getIsPlaying(id, reciterId));
  }, [id, reciterId, getLocalPath]);

  const download = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const key = ziyaratDownloadKey(id, reciterId);
    try {
      const record = await ziyaratDownloadService.download(reciterId, id, (p) => {
        setDownloadProgress(p);
        useZiyaratDownloadStore.getState().setProgress(key, p);
      });
      setDownload(record);
    } finally {
      setIsDownloading(false);
      useZiyaratDownloadStore.getState().clearProgress(key);
    }
  }, [id, reciterId, isDownloading, setDownload]);

  const removeOffline = useCallback(async () => {
    await ziyaratDownloadService.remove(reciterId, id);
    removeDownload(id, reciterId);
    const active = await TrackPlayer.getActiveTrack();
    if (active?.id === ziyaratDownloadService.getTrackId(reciterId, id)) {
      setIsPlaying(false);
    }
  }, [id, reciterId, removeDownload]);

  return {
    reciterId,
    setReciterId,
    isPlaying,
    isDownloaded,
    isDownloading,
    downloadProgress,
    togglePlay,
    download,
    removeOffline,
  };
}
