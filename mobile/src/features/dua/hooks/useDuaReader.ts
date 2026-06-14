import { useMemo } from 'react';

import { DuaRepository } from '../engine/duaRepository';
import { useDuaReaderStore } from '../stores/duaReaderStore';
import type { DuaBundle, DuaId } from '../types';

export function useDuaReader(duaId: DuaId) {
  const displayMode = useDuaReaderStore((s) => s.displayMode);
  const translationLayer = useDuaReaderStore((s) => s.translationLayer);
  const fontScale = useDuaReaderStore((s) => s.fontScale);
  const setDisplayMode = useDuaReaderStore((s) => s.setDisplayMode);
  const setTranslationLayer = useDuaReaderStore((s) => s.setTranslationLayer);
  const setFontScale = useDuaReaderStore((s) => s.setFontScale);
  const setLastRead = useDuaReaderStore((s) => s.setLastRead);

  const bundle = useMemo<DuaBundle | null>(() => DuaRepository.getDua(duaId), [duaId]);

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
