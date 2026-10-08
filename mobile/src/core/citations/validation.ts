import type { CitableContent, IslamicCitation } from './types';

export function hasVerifiedCitation(citations: IslamicCitation[] | undefined): boolean {
  return (citations ?? []).some((c) => c.verified && c.source.trim().length > 0);
}

export function hasExplicitUnverified(citations: IslamicCitation[] | undefined): boolean {
  return (citations ?? []).some((c) => !c.verified);
}

/**
 * Dev-time guard: every Islamic claim must ship citation metadata or an explicit unverified flag.
 */
export function requireCitationsOrUnverified(
  content: Partial<CitableContent>,
  context?: string,
): void {
  if (!__DEV__) return;

  const citations = content.citations ?? [];
  const label = context ? ` (${context})` : '';

  if (citations.length === 0) {
    console.warn(`[citations] Missing citations${label}`);
    return;
  }

  if (!hasVerifiedCitation(citations) && !hasExplicitUnverified(citations)) {
    console.warn(
      `[citations] Citations present but none verified or explicitly unverified${label}`,
    );
  }
}
