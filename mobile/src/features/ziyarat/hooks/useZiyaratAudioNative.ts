import { useCallback, useEffect, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';

import { ZIYARAT_RECITERS } from '../constants/catalog';
import { ziyaratAudioService } from '../audio/ziyaratAudioService';
import { ziyaratDownloadService } from '../audio/ziyaratDownloadService';
import { ziyaratDownloadKey, useZiyaratDownloadStore } from '../stores/ziyaratDownloadStore';
import type { ZiyaratId } from '../types';

export function useZiyaratAudioNative(id: ZiyaratId) {
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
