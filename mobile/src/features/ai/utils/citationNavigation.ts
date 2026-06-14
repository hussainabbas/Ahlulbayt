import type { MafatihCollectionId } from '@/features/mafatih/types';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

import type { AiCitation } from '../types';

export type CitationNavigationTarget =
  | { stack: 'root'; screen: keyof RootStackParamList; params?: RootStackParamList[keyof RootStackParamList] }
  | { stack: 'tab'; screen: keyof MainTabParamList };

function mafatihCollection(collectionId: MafatihCollectionId): CitationNavigationTarget {
  return { stack: 'root', screen: 'Mafatih', params: { collectionId } };
}

const ID_ROUTES: Partial<Record<string, CitationNavigationTarget>> = {
  mafatih: mafatihCollection('mafatih_al_jinan'),
  kamil: mafatihCollection('kamil_al_ziyarat'),
  taqibat: mafatihCollection('taqibat'),
  karbala: { stack: 'root', screen: 'MuharramMode' },
  calendar: { stack: 'root', screen: 'Calendar' },
  quran: { stack: 'tab', screen: 'Quran' },
  leva: { stack: 'tab', screen: 'Prayer' },
  sahifa: { stack: 'root', screen: 'Sahifa' },
};

const NON_NAVIGABLE_IDS = new Set(['disclaimer']);

export function resolveCitationNavigation(citation: AiCitation): CitationNavigationTarget | null {
  if (NON_NAVIGABLE_IDS.has(citation.id)) return null;

  const byId = ID_ROUTES[citation.id];
  if (byId) return byId;

  const haystack = `${citation.title} ${citation.source ?? ''}`.toLowerCase();

  if (/kamil.*ziyarat|کامل/.test(haystack)) {
    return mafatihCollection('kamil_al_ziyarat');
  }
  if (/taqibat|تعقیبات/.test(haystack)) {
    return mafatihCollection('taqibat');
  }
  if (/mafatih|مفاتیح|مفاتيح/.test(haystack)) {
    return mafatihCollection('mafatih_al_jinan');
  }
  if (/sahifa|sajjadiya|صحیف|الصحيفة/.test(haystack)) {
    return { stack: 'root', screen: 'Sahifa' };
  }
  if (/quran|قرآن|qur'an/.test(haystack)) {
    return { stack: 'tab', screen: 'Quran' };
  }
  if (/karbala|ashura|husayn|husain|maqtal|کربلا|حسین|عاشور/.test(haystack)) {
    return { stack: 'root', screen: 'MuharramMode' };
  }
  if (/hadith|kafi|bihar|nahjul/.test(haystack)) {
    return { stack: 'root', screen: 'Hadith' };
  }
  if (/\bduas?\b|amaal|دعا/.test(haystack)) {
    return { stack: 'root', screen: 'Duas' };
  }
  if (/ziyarat|زیارت|زيارة/.test(haystack)) {
    return { stack: 'root', screen: 'Ziyarat' };
  }
  if (/prayer time|leva|jafari/.test(haystack)) {
    return { stack: 'tab', screen: 'Prayer' };
  }
  if (/calendar|observance|hijri/.test(haystack)) {
    return { stack: 'root', screen: 'Calendar' };
  }

  if (citation.kind === 'book') {
    return mafatihCollection('mafatih_al_jinan');
  }

  return null;
}
