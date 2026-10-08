import type { EventReference } from './types';

/** Build a verified scholarly reference with standard fields. */
export function verifiedRef(
  id: string,
  primarySource: { en: string; ar?: string; ur?: string },
  opts: Partial<
    Pick<
      EventReference,
      | 'bookName'
      | 'volume'
      | 'page'
      | 'hadithNumber'
      | 'scholar'
      | 'chapter'
      | 'contentRef'
      | 'notes'
      | 'surah'
      | 'ayah'
    >
  > = {},
): EventReference {
  return {
    id,
    kind: 'history',
    primarySource,
    verification: 'verified',
    unverified: false,
    ...opts,
  };
}

/** Mark content as unverified when no citable source is available. */
export function unverifiedRef(
  id: string,
  note: { en: string; ar?: string; ur?: string },
): EventReference {
  return {
    id,
    kind: 'history',
    primarySource: { en: 'Unverified — source pending review' },
    verification: 'unavailable',
    unverified: true,
    notes: note,
  };
}

export function hasVerifiedReferences(refs: EventReference[]): boolean {
  return refs.some((r) => !r.unverified && r.verification === 'verified');
}
