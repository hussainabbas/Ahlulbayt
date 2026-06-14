import { resolveReferenceNavigation } from '@/core/references';
import type { IslamicReference } from '@/core/references';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

import type { AiCitation } from '../types';

export type CitationNavigationTarget =
  | { stack: 'root'; screen: keyof RootStackParamList; params?: RootStackParamList[keyof RootStackParamList] }
  | { stack: 'tab'; screen: keyof MainTabParamList };

/** @deprecated Prefer resolveReferenceNavigation with IslamicReference */
export function resolveCitationNavigation(citation: AiCitation): CitationNavigationTarget | null {
  if (citation.id === 'disclaimer') return null;

  return resolveReferenceNavigation({
    id: citation.id,
    kind: citation.kind === 'quran' ? 'quran' : citation.kind === 'hadith' ? 'hadith' : 'book',
    primarySource: { en: citation.title },
    bookName: citation.source ? { en: citation.source } : undefined,
    scholar: citation.reference ? { en: citation.reference } : undefined,
    contentRef: citation.id ? `ai:${citation.id}` : undefined,
    verification: citation.reference || citation.source ? 'verified' : 'pending',
  });
}

export function resolveIslamicReferenceNavigation(
  reference: IslamicReference,
): CitationNavigationTarget | null {
  return resolveReferenceNavigation(reference);
}
