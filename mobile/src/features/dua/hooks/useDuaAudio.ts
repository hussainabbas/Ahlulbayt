import { useCallback, useEffect, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';

import { DUA_RECITERS } from '../constants/catalog';
import type { DuaId } from '../types';
import { duaAudioService } from '../audio/duaAudioService';
import { duaDownloadService } from '../audio/duaDownloadService';
import { duaDownloadKey, useDuaDownloadStore } from '../stores/duaDownloadStore';

export function useDuaAudio(duaId: DuaId) {
  const [reciterId, setReciterId] = useState<string>(DUA_RECITERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isDownloaded = useDuaDownloadStore((s) => s.isDownloaded(duaId, reciterId));
  const getLocalPath = useDuaDownloadStore((s) => s.getLocalPath);
  const setDownload = useDuaDownloadStore((s) => s.setDownload);
  const removeDownload = useDuaDownloadStore((s) => s.removeDownload);

  useTrackPlayerEvents([Event.PlaybackState], async () => {
    const playing = await duaAudioService.getIsPlaying(duaId, reciterId);
    setIsPlaying(playing);
  });

  useEffect(() => {
    void duaAudioService.getIsPlaying(duaId, reciterId).then(setIsPlaying);
  }, [duaId, reciterId]);

  const togglePlay = useCallback(async () => {
    const localPath = getLocalPath(duaId, reciterId);
    await duaAudioService.togglePlay(reciterId, duaId, localPath);
    const playing = await duaAudioService.getIsPlaying(duaId, reciterId);
    setIsPlaying(playing);
  }, [duaId, reciterId, getLocalPath]);

  const download = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    const key = duaDownloadKey(duaId, reciterId);

    try {
      const record = await duaDownloadService.download(reciterId, duaId, (p) => {
        setDownloadProgress(p);
        useDuaDownloadStore.getState().setProgress(key, p);
      });
      setDownload(record);
    } finally {
      setIsDownloading(false);
      useDuaDownloadStore.getState().clearProgress(key);
    }
  }, [duaId, reciterId, isDownloading, setDownload]);

  const removeOffline = useCallback(async () => {
    await duaDownloadService.remove(reciterId, duaId);
    removeDownload(duaId, reciterId);
    const active = await TrackPlayer.getActiveTrack();
    if (active?.id === duaDownloadService.getTrackId(reciterId, duaId)) {
      await duaAudioService.stop();
      setIsPlaying(false);
    }
  }, [duaId, reciterId, removeDownload]);

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
    reciters: DUA_RECITERS,
  };
}
