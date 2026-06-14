import { useCallback, useState } from 'react';

import { NAHJUL_RECITERS } from '../constants/catalog';
import type { NahjulId } from '../types';
import { useNahjulDownloadStore } from '../stores/nahjulDownloadStore';

/** Stub — native audio disabled until Track Player New Arch migration. */
export function useNahjulAudio(nahjulId: NahjulId) {
  const [reciterId, setReciterId] = useState<string>(NAHJUL_RECITERS[0].id);
  const isDownloaded = useNahjulDownloadStore((s) => s.isDownloaded(nahjulId, reciterId));
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
    reciters: NAHJUL_RECITERS,
  };
}
