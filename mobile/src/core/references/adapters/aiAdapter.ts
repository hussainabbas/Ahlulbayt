import type { AiCitation } from '@/features/ai/types';

import type { IslamicReference } from '../types';

export function aiCitationToReference(citation: AiCitation, index: number): IslamicReference {
  const kindMap = {
    quran: 'quran' as const,
    hadith: 'hadith' as const,
    book: 'book' as const,
    general: 'scholar' as const,
  };

  const kind = citation.kind ? kindMap[citation.kind] : 'scholar';

  return {
    id: citation.id || `ai-citation-${index}`,
    kind,
    primarySource: {
      en: citation.title,
    },
    bookName: citation.source ? { en: citation.source } : undefined,
    scholar: citation.reference ? { en: citation.reference } : undefined,
    contentRef: citation.id ? `ai:${citation.id}` : undefined,
    verification: citation.reference || citation.source ? 'verified' : 'pending',
  };
}

export function aiCitationsToReferences(citations: AiCitation[] | undefined): IslamicReference[] {
  return (citations ?? []).map(aiCitationToReference);
}
