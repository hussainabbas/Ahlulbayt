import { useCallback, useState } from 'react';

import { DUA_RECITERS } from '../constants/catalog';
import type { DuaId } from '../types';
import { useDuaDownloadStore } from '../stores/duaDownloadStore';

/** Stub — native audio disabled until Track Player New Arch migration. */
export function useDuaAudio(duaId: DuaId) {
  const [reciterId, setReciterId] = useState<string>(DUA_RECITERS[0].id);
  const isDownloaded = useDuaDownloadStore((s) => s.isDownloaded(duaId, reciterId));
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
    reciters: DUA_RECITERS,
  };
}
