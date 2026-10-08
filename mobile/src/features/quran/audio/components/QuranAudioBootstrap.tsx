import { useEffect } from 'react';

import { logger } from '@/core/logging/logger';

import { useQuranReaderStore } from '../../stores/quranReaderStore';
import { quranPlayerService } from '../engine/quranPlayerService';
import { useQuranDownloadStore } from '../stores/quranDownloadStore';
import { useQuranPlayerStore } from '../stores/quranPlayerStore';

/** Initializes track player + hydrates offline library on app boot. */
export function QuranAudioBootstrap() {
  const reciterId = useQuranPlayerStore((s) => s.reciterId);
  const hydrateDownloads = useQuranDownloadStore((s) => s.hydrateDownloads);
  const setReaderReciter = useQuranReaderStore((s) => s.setReciterId);

  useEffect(() => {
    setReaderReciter(reciterId);
  }, [reciterId, setReaderReciter]);

  useEffect(() => {
    void (async () => {
      try {
        await quranPlayerService.initialize();
        const repeatMode = useQuranPlayerStore.getState().repeatMode;
        const playbackRate = useQuranPlayerStore.getState().playbackRate;
        await quranPlayerService.setRepeatMode(repeatMode);
        await quranPlayerService.setPlaybackRate(playbackRate);
        await hydrateDownloads(reciterId);
        await quranPlayerService.restoreLastPlayback();
      } catch (error) {
        logger.error('Quran audio bootstrap failed', error);
      }
    })();
  }, [hydrateDownloads, reciterId]);

  return null;
}
