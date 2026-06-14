import { useCallback, useEffect, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';

import { SAHIFA_RECITERS } from '../constants/catalog';
import type { SahifaId } from '../types';
import { sahifaAudioService } from '../audio/sahifaAudioService';
import { sahifaDownloadService } from '../audio/sahifaDownloadService';
import { sahifaDownloadKey, useSahifaDownloadStore } from '../stores/sahifaDownloadStore';

export function useSahifaAudioNative(sahifaId: SahifaId) {
  const [reciterId, setReciterId] = useState<string>(SAHIFA_RECITERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isDownloaded = useSahifaDownloadStore((s) => s.isDownloaded(sahifaId, reciterId));
  const getLocalPath = useSahifaDownloadStore((s) => s.getLocalPath);
  const setDownload = useSahifaDownloadStore((s) => s.setDownload);
  const removeDownload = useSahifaDownloadStore((s) => s.removeDownload);

  useTrackPlayerEvents([Event.PlaybackState], async () => {
    const playing = await sahifaAudioService.getIsPlaying(sahifaId, reciterId);
    setIsPlaying(playing);
  });

  useEffect(() => {
    void sahifaAudioService.getIsPlaying(sahifaId, reciterId).then(setIsPlaying);
  }, [sahifaId, reciterId]);

  const togglePlay = useCallback(async () => {
    const localPath = getLocalPath(sahifaId, reciterId);
    await sahifaAudioService.togglePlay(reciterId, sahifaId, localPath);
    const playing = await sahifaAudioService.getIsPlaying(sahifaId, reciterId);
    setIsPlaying(playing);
  }, [sahifaId, reciterId, getLocalPath]);

  const download = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    const key = sahifaDownloadKey(sahifaId, reciterId);

    try {
      const record = await sahifaDownloadService.download(reciterId, sahifaId, (p) => {
        setDownloadProgress(p);
        useSahifaDownloadStore.getState().setProgress(key, p);
      });
      setDownload(record);
    } finally {
      setIsDownloading(false);
      useSahifaDownloadStore.getState().clearProgress(key);
    }
  }, [sahifaId, reciterId, isDownloading, setDownload]);

  const removeOffline = useCallback(async () => {
    await sahifaDownloadService.remove(reciterId, sahifaId);
    removeDownload(sahifaId, reciterId);
    const active = await TrackPlayer.getActiveTrack();
    if (active?.id === sahifaDownloadService.getTrackId(reciterId, sahifaId)) {
      await sahifaAudioService.stop();
      setIsPlaying(false);
    }
  }, [sahifaId, reciterId, removeDownload]);

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
    reciters: SAHIFA_RECITERS,
  };
}
