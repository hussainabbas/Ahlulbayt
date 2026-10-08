import { useCallback, useState } from 'react';

import { SAHIFA_RECITERS } from '../constants/catalog';
import type { SahifaId } from '../types';
import { useSahifaDownloadStore } from '../stores/sahifaDownloadStore';

/** Stub — native audio disabled until Track Player New Arch migration. */
export function useSahifaAudio(sahifaId: SahifaId) {
  const [reciterId, setReciterId] = useState<string>(SAHIFA_RECITERS[0].id);
  const isDownloaded = useSahifaDownloadStore((s) => s.isDownloaded(sahifaId, reciterId));
  const noop = useCallback(async () => undefined, []);

  return {
    reciterId,
    setReciterId,
    isPlaying: false,
    isDownloaded,
    isDownloading: false,
    downloadProgress: 0,
    togglePlay: noop,
    download: noop,
    removeOffline: noop,
    reciters: SAHIFA_RECITERS,
  };
}
