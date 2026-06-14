import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

import type { AiCitation } from '../types';

export type CitationNavigationTarget =
  | { stack: 'root'; screen: keyof RootStackParamList; params?: RootStackParamList[keyof RootStackParamList] }
  | { stack: 'tab'; screen: keyof MainTabParamList };

const ID_ROUTES: Partial<Record<string, CitationNavigationTarget>> = {
  mafatih: { stack: 'root', screen: 'Mafatih' },
  kamil: { stack: 'root', screen: 'Mafatih' },
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

  if (/mafatih|مفاتیح|مفاتيح/.test(haystack)) {
    return { stack: 'root', screen: 'Mafatih' };
  }
  if (/kamil.*ziyarat|کامل/.test(haystack)) {
    return { stack: 'root', screen: 'Mafatih' };
  }
  if (/sahifa|sajjadiya|صحیف|الصحيفة/.test(haystack)) {
    return { stack: 'root', screen: 'Sahifa' };
  }
  if (/quran|قرآن|qur'an/.test(haystack)) {
    return { stack: 'tab', screen: 'Quran' };
  }
  if (/hadith|kafi|bihar|nahjul|maqtal/.test(haystack)) {
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
    return { stack: 'root', screen: 'Mafatih' };
  }

  return null;
}
