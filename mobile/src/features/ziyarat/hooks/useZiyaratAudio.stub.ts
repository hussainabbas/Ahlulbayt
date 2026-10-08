import { useCallback, useState } from 'react';

import { ZIYARAT_RECITERS } from '../constants/catalog';
import { useZiyaratDownloadStore } from '../stores/ziyaratDownloadStore';
import type { ZiyaratId } from '../types';

/** Stub — native audio disabled until Track Player New Arch migration. */
export function useZiyaratAudio(id: ZiyaratId) {
  const [reciterId, setReciterId] = useState(ZIYARAT_RECITERS[0].id);
  const isDownloaded = useZiyaratDownloadStore((s) => s.isDownloaded(id, reciterId));
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
  };
}
