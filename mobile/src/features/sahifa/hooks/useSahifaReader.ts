import { useMemo } from 'react';

import { SahifaRepository } from '../engine/sahifaRepository';
import { useSahifaReaderStore } from '../stores/sahifaReaderStore';
import type { SahifaBundle, SahifaId } from '../types';

export function useSahifaReader(sahifaId: SahifaId) {
  const displayMode = useSahifaReaderStore((s) => s.displayMode);
  const translationLayer = useSahifaReaderStore((s) => s.translationLayer);
  const fontScale = useSahifaReaderStore((s) => s.fontScale);
  const setDisplayMode = useSahifaReaderStore((s) => s.setDisplayMode);
  const setTranslationLayer = useSahifaReaderStore((s) => s.setTranslationLayer);
  const setFontScale = useSahifaReaderStore((s) => s.setFontScale);
  const setLastRead = useSahifaReaderStore((s) => s.setLastRead);

  const bundle = useMemo<SahifaBundle | null>(
    () => SahifaRepository.getSupplication(sahifaId),
    [sahifaId],
  );

  const cycleDisplayMode = () => {
    const modes = ['stacked', 'arabic_only', 'translation_only'] as const;
    const idx = modes.indexOf(displayMode);
    setDisplayMode(modes[(idx + 1) % modes.length]!);
  };

  const cycleTranslation = () => {
    setTranslationLayer(translationLayer === 'en' ? 'ur' : 'en');
  };

  return {
    bundle,
    meta: bundle?.meta,
    sections: bundle?.sections ?? [],
    displayMode,
    translationLayer,
    fontScale,
    setDisplayMode,
    setTranslationLayer,
    setFontScale,
    cycleDisplayMode,
    cycleTranslation,
    setLastRead,
  };
}
