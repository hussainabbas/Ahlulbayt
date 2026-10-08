import { CitationList } from '@/components/citations';
import { citationsFromMuharram } from '@/core/citations';

import type { IslamicSourceCitation } from '../types';

interface SourceCitationListProps {
  citations: IslamicSourceCitation[];
  compact?: boolean;
}

/** Bridges muharram `IslamicSourceCitation` to the universal citation UI. */
export function SourceCitationList({ citations, compact }: SourceCitationListProps) {
  const mapped = citationsFromMuharram(citations);
  if (mapped.length === 0) return null;

  return <CitationList citations={mapped} compact={compact} />;
}
