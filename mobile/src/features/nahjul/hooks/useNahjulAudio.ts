import { useCallback, useEffect, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';

import { NAHJUL_RECITERS } from '../constants/catalog';
import type { NahjulId } from '../types';
import { nahjulAudioService } from '../audio/nahjulAudioService';
import { nahjulDownloadService } from '../audio/nahjulDownloadService';
import { nahjulDownloadKey, useNahjulDownloadStore } from '../stores/nahjulDownloadStore';

export function useNahjulAudio(nahjulId: NahjulId) {
  const [reciterId, setReciterId] = useState<string>(NAHJUL_RECITERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isDownloaded = useNahjulDownloadStore((s) => s.isDownloaded(nahjulId, reciterId));
  const getLocalPath = useNahjulDownloadStore((s) => s.getLocalPath);
  const setDownload = useNahjulDownloadStore((s) => s.setDownload);
  const removeDownload = useNahjulDownloadStore((s) => s.removeDownload);

  useTrackPlayerEvents([Event.PlaybackState], async () => {
    setIsPlaying(await nahjulAudioService.getIsPlaying(nahjulId, reciterId));
  });

  useEffect(() => {
    void nahjulAudioService.getIsPlaying(nahjulId, reciterId).then(setIsPlaying);
  }, [nahjulId, reciterId]);

  const togglePlay = useCallback(async () => {
    const localPath = getLocalPath(nahjulId, reciterId);
    await nahjulAudioService.togglePlay(reciterId, nahjulId, localPath);
    setIsPlaying(await nahjulAudioService.getIsPlaying(nahjulId, reciterId));
  }, [nahjulId, reciterId, getLocalPath]);

  const download = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    const key = nahjulDownloadKey(nahjulId, reciterId);
    try {
      const record = await nahjulDownloadService.download(reciterId, nahjulId, (p) => {
        setDownloadProgress(p);
        useNahjulDownloadStore.getState().setProgress(key, p);
      });
      setDownload(record);
    } finally {
      setIsDownloading(false);
      useNahjulDownloadStore.getState().clearProgress(key);
    }
  }, [nahjulId, reciterId, isDownloading, setDownload]);

  const removeOffline = useCallback(async () => {
    await nahjulDownloadService.remove(reciterId, nahjulId);
    removeDownload(nahjulId, reciterId);
    const active = await TrackPlayer.getActiveTrack();
    if (active?.id === nahjulDownloadService.getTrackId(reciterId, nahjulId)) {
      await nahjulAudioService.stop();
      setIsPlaying(false);
    }
  }, [nahjulId, reciterId, removeDownload]);

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
    reciters: NAHJUL_RECITERS,
  };
}
