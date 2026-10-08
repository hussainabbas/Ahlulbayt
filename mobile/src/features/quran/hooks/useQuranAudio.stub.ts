import { useCallback } from 'react';

import type { QuranAyah } from '../types';

/** Stub — native audio disabled until Track Player New Architecture migration. */
export function useQuranAudioStub() {
  const noop = useCallback(async () => undefined, []);

  return {
    isPlaying: false,
    activeWordIndex: null as number | null,
    activeAyah: null as QuranAyah | null,
    loadAyah: noop,
    playNextAyah: noop,
    playPreviousAyah: noop,
    play: noop,
    pause: noop,
    toggle: noop,
  };
}
