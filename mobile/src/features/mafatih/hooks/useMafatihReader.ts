import { useMemo } from 'react';

import { useDuaAudio } from '@/features/dua/hooks/useDuaAudio';
import type { DuaId } from '@/features/dua/types';
import { useSahifaAudio } from '@/features/sahifa/hooks/useSahifaAudio';
import type { SahifaId } from '@/features/sahifa/types';
import { useZiyaratAudio } from '@/features/ziyarat/hooks/useZiyaratReader';
import type { ZiyaratId } from '@/features/ziyarat/types';

import { MafatihRepository } from '../engine/mafatihRepository';
import { useMafatihReaderStore } from '../stores/mafatihReaderStore';
import type { MafatihRef } from '../types';
import { parseMafatihRef } from '../types';

export function useMafatihReader(ref: MafatihRef) {
  const displayMode = useMafatihReaderStore((s) => s.displayMode);
  const translationLayer = useMafatihReaderStore((s) => s.translationLayer);
  const fontScale = useMafatihReaderStore((s) => s.fontScale);
  const focusMode = useMafatihReaderStore((s) => s.focusMode);
  const lastRead = useMafatihReaderStore((s) => s.lastRead[ref]);
  const setDisplayMode = useMafatihReaderStore((s) => s.setDisplayMode);
  const setTranslationLayer = useMafatihReaderStore((s) => s.setTranslationLayer);
  const setFontScale = useMafatihReaderStore((s) => s.setFontScale);
  const toggleFocusMode = useMafatihReaderStore((s) => s.toggleFocusMode);
  const setLastRead = useMafatihReaderStore((s) => s.setLastRead);

  const bundle = useMemo(() => MafatihRepository.getBundle(ref), [ref]);
  const { kind, contentId } = parseMafatihRef(ref);

  const duaAudio = useDuaAudio(kind === 'dua' ? (contentId as DuaId) : ('dua_kumail' as DuaId));
  const ziyaratAudio = useZiyaratAudio(
    kind === 'ziyarat' ? (contentId as ZiyaratId) : ('ziyarat_ashura' as ZiyaratId),
  );
  const sahifaAudio = useSahifaAudio(
    kind === 'sahifa' ? (contentId as SahifaId) : ('sahifa_001' as SahifaId),
  );

  const audio =
    kind === 'dua' ? duaAudio : kind === 'ziyarat' ? ziyaratAudio : kind === 'sahifa' ? sahifaAudio : null;

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
    entry: bundle?.entry,
    sections: bundle?.sections ?? [],
    displayMode,
    translationLayer,
    fontScale,
    focusMode,
    lastRead,
    audio: kind === 'dua' || kind === 'ziyarat' || kind === 'sahifa' ? audio : null,
    cycleDisplayMode,
    cycleTranslation,
    setFontScale,
    toggleFocusMode,
    setLastRead,
  };
}
