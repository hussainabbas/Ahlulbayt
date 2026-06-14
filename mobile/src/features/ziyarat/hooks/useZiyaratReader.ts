import { useMemo } from 'react';

import { ZiyaratRepository } from '../engine/ziyaratRepository';
import { useZiyaratReaderStore } from '../stores/ziyaratReaderStore';
import type { ZiyaratId } from '../types';

export function useZiyaratReader(id: ZiyaratId) {
  const displayMode = useZiyaratReaderStore((s) => s.displayMode);
  const translationLayer = useZiyaratReaderStore((s) => s.translationLayer);
  const fontScale = useZiyaratReaderStore((s) => s.fontScale);
  const focusMode = useZiyaratReaderStore((s) => s.focusMode);
  const lastRead = useZiyaratReaderStore((s) => s.lastRead[id]);
  const setDisplayMode = useZiyaratReaderStore((s) => s.setDisplayMode);
  const setTranslationLayer = useZiyaratReaderStore((s) => s.setTranslationLayer);
  const setFontScale = useZiyaratReaderStore((s) => s.setFontScale);
  const toggleFocusMode = useZiyaratReaderStore((s) => s.toggleFocusMode);
  const setLastRead = useZiyaratReaderStore((s) => s.setLastRead);

  const bundle = useMemo(() => ZiyaratRepository.get(id), [id]);

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
    focusMode,
    lastRead,
    setDisplayMode,
    setTranslationLayer,
    setFontScale,
    toggleFocusMode,
    cycleDisplayMode,
    cycleTranslation,
    setLastRead,
  };
}
