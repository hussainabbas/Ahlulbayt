import type { MafatihCollectionId } from '@/features/mafatih/types';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

import type { IslamicReference } from './types';

export type ReferenceNavigationTarget =
  | { stack: 'root'; screen: keyof RootStackParamList; params?: RootStackParamList[keyof RootStackParamList] }
  | { stack: 'tab'; screen: keyof MainTabParamList };

function mafatihCollection(collectionId: MafatihCollectionId): ReferenceNavigationTarget {
  return { stack: 'root', screen: 'Mafatih', params: { collectionId } };
}

function parseContentRef(contentRef: string): ReferenceNavigationTarget | null {
  const [kind, ...rest] = contentRef.split(':');
  const payload = rest.join(':');

  switch (kind) {
    case 'quran': {
      const [surah, ayah] = payload.split(':').map(Number);
      if (!surah) return { stack: 'tab', screen: 'Quran' };
      return {
        stack: 'root',
        screen: 'QuranReader',
        params: { surahNumber: surah, ayah: ayah || undefined },
      };
    }
    case 'hadith':
      return { stack: 'root', screen: 'HadithDetail', params: { hadithId: payload as never } };
    case 'dua':
      return { stack: 'root', screen: 'DuaReader', params: { duaId: payload as never } };
    case 'ziyarat':
      return { stack: 'root', screen: 'ZiyaratReader', params: { ziyaratId: payload as never } };
    case 'mafatih':
      return { stack: 'root', screen: 'MafatihReader', params: { ref: contentRef as never } };
    case 'calendar':
      return { stack: 'root', screen: 'Calendar' };
    default:
      return null;
  }
}

const ID_ROUTES: Partial<Record<string, ReferenceNavigationTarget>> = {
  mafatih: mafatihCollection('mafatih_al_jinan'),
  kamil: mafatihCollection('kamil_al_ziyarat'),
  taqibat: mafatihCollection('taqibat'),
  karbala: { stack: 'root', screen: 'MuharramMode' },
  calendar: { stack: 'root', screen: 'Calendar' },
  quran: { stack: 'tab', screen: 'Quran' },
  leva: { stack: 'tab', screen: 'Prayer' },
  sahifa: { stack: 'root', screen: 'Sahifa' },
};

export function resolveReferenceNavigation(
  ref: IslamicReference,
): ReferenceNavigationTarget | null {
  if (ref.verification === 'unavailable') return null;

  if (ref.contentRef) {
    const byContent = parseContentRef(ref.contentRef);
    if (byContent) return byContent;
  }

  const slug = ref.contentRef?.replace(/^ai:/, '') ?? ref.id;
  if (ID_ROUTES[slug]) return ID_ROUTES[slug]!;

  const haystack = [
    ref.primarySource.en,
    ref.bookName?.en,
    ref.scholar?.en,
    ref.chapter?.en,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/kamil.*ziyarat|کامل/.test(haystack)) {
    return mafatihCollection('kamil_al_ziyarat');
  }
  if (/mafatih|مفاتیح/.test(haystack)) {
    return mafatihCollection('mafatih_al_jinan');
  }
  if (/quran|قرآن/.test(haystack) || ref.kind === 'quran' || ref.kind === 'tafsir') {
    if (ref.surah) {
      return {
        stack: 'root',
        screen: 'QuranReader',
        params: { surahNumber: ref.surah, ayah: ref.ayah },
      };
    }
    return { stack: 'tab', screen: 'Quran' };
  }
  if (/hadith|kafi|bihar/.test(haystack) || ref.kind === 'hadith') {
    return { stack: 'root', screen: 'Hadith' };
  }
  if (ref.kind === 'dua') return { stack: 'root', screen: 'Duas' };
  if (ref.kind === 'ziyarat') return { stack: 'root', screen: 'Ziyarat' };
  if (ref.kind === 'fiqh' || ref.kind === 'scholar') {
    return { stack: 'tab', screen: 'Prayer' };
  }
  if (ref.kind === 'calendar') return { stack: 'root', screen: 'Calendar' };

  return null;
}
