import { useMemo } from 'react';

import { NahjulRepository } from '../engine/nahjulRepository';
import { useNahjulReaderStore } from '../stores/nahjulReaderStore';
import type { NahjulBundle, NahjulId, NahjulTranslationLayer } from '../types';

export const NAHJUL_CONTENT_LOCALES: NahjulTranslationLayer[] = ['en', 'ur', 'ar'];

export const NAHJUL_LOCALE_LABELS: Record<NahjulTranslationLayer, string> = {
  en: 'EN',
  ur: 'UR',
  ar: 'AR',
};

export function useNahjulReader(nahjulId: NahjulId) {
  const displayMode = useNahjulReaderStore((s) => s.displayMode);
  const translationLayer = useNahjulReaderStore((s) => s.translationLayer);
  const fontScale = useNahjulReaderStore((s) => s.fontScale);
  const setDisplayMode = useNahjulReaderStore((s) => s.setDisplayMode);
  const setTranslationLayer = useNahjulReaderStore((s) => s.setTranslationLayer);
  const setFontScale = useNahjulReaderStore((s) => s.setFontScale);
  const setLastRead = useNahjulReaderStore((s) => s.setLastRead);

  const bundle = useMemo<NahjulBundle | null>(() => NahjulRepository.getItem(nahjulId), [nahjulId]);

  const cycleDisplayMode = () => {
    const modes = ['stacked', 'arabic_only', 'translation_only'] as const;
    const idx = modes.indexOf(displayMode);
    setDisplayMode(modes[(idx + 1) % modes.length]!);
  };

  const setContentLocale = (layer: NahjulTranslationLayer) => {
    setTranslationLayer(layer);
  };

  return {
    bundle,
    meta: bundle?.meta,
    sections: bundle?.sections ?? [],
    displayMode,
    translationLayer,
    fontScale,
    cycleDisplayMode,
    setContentLocale,
    setTranslationLayer: setContentLocale,
    setFontScale,
    setLastRead,
  };
}
