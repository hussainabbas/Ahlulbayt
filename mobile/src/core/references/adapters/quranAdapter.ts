import type { AyahRef, AyahTafsir } from '@/features/quran/types';

import type { IslamicReference } from '../types';

function parseAyahRef(ref: AyahRef): { surah: number; ayah: number } {
  const [s, a] = ref.split(':').map(Number);
  return { surah: s!, ayah: a! };
}

export function quranAyahReference(
  ayahRef: AyahRef,
  options?: {
    translationSource?: string;
    id?: string;
  },
): IslamicReference {
  const { surah, ayah } = parseAyahRef(ayahRef);
  return {
    id: options?.id ?? `quran-${ayahRef}`,
    kind: 'quran',
    primarySource: {
      en: 'Holy Quran',
      ur: 'قرآن مجید',
      ar: 'القرآن الكريم',
    },
    surah,
    ayah,
    translationSource: options?.translationSource
      ? { en: options.translationSource }
      : { en: 'Bundled translation' },
    contentRef: `quran:${ayahRef}`,
    verification: 'verified',
  };
}

export function tafsirToReference(
  ayahRef: AyahRef,
  tafsir: AyahTafsir | undefined,
): IslamicReference | null {
  if (!tafsir?.source) return null;
  const { surah, ayah } = parseAyahRef(ayahRef);
  return {
    id: `tafsir-${ayahRef}`,
    kind: 'tafsir',
    primarySource: {
      en: 'Holy Quran',
      ur: 'قرآن مجید',
      ar: 'القرآن الكريم',
    },
    surah,
    ayah,
    tafsirSource: { en: tafsir.source },
    contentRef: `quran:${ayahRef}`,
    verification: 'verified',
  };
}

export function quranTafsirReferences(
  ayahRef: AyahRef,
  tafsir: AyahTafsir | undefined,
  translationSource?: string,
): IslamicReference[] {
  const refs: IslamicReference[] = [quranAyahReference(ayahRef, { translationSource })];
  const tafsirRef = tafsirToReference(ayahRef, tafsir);
  if (tafsirRef) refs.push(tafsirRef);
  return refs;
}
