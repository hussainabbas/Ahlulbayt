import type { FiqhReference, IslamicReference } from '../types';

export function fiqhRefsToIslamic(
  refs: FiqhReference[] | undefined,
  prefix: string,
): IslamicReference[] {
  return (refs ?? []).map((ref, index) => ({
    id: `${prefix}-fiqh-${index}`,
    kind: 'fiqh' as const,
    primarySource: { en: ref.source.en, ur: ref.source.ur, ar: ref.source.ar },
    chapter: ref.citation
      ? { en: ref.citation.en, ur: ref.citation.ur, ar: ref.citation.ar }
      : undefined,
    marja: ref.marja,
    verification: ref.citation ? ('verified' as const) : ('pending' as const),
  }));
}

export function fiqhRefToIslamic(ref: FiqhReference, id: string): IslamicReference {
  return fiqhRefsToIslamic([ref], id)[0]!;
}
