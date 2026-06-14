import type {
  IslamicReference,
  LocalizedReferenceText,
  ReferenceDisplayRow,
  ReferenceKind,
  ReferenceValidationIssue,
  ReferenceValidationResult,
  ReferenceVerificationReport,
} from '../types';

export type AppLocale = 'en' | 'ur' | 'ar';

export function pickReferenceText(
  text: LocalizedReferenceText | undefined,
  locale: AppLocale,
): string {
  if (!text) return '';
  if (locale === 'ur' && text.ur) return text.ur;
  if (locale === 'ar' && text.ar) return text.ar;
  return text.en;
}

const REQUIRED_BY_KIND: Partial<Record<ReferenceKind, (keyof IslamicReference)[]>> = {
  quran: ['primarySource', 'surah', 'ayah'],
  tafsir: ['primarySource', 'tafsirSource', 'surah', 'ayah'],
  hadith: ['primarySource'],
  dua: ['primarySource', 'bookName'],
  ziyarat: ['primarySource', 'bookName'],
  fiqh: ['primarySource'],
  calendar: ['primarySource'],
  history: ['primarySource'],
  amaal: ['primarySource'],
  book: ['primarySource'],
  scholar: ['primarySource', 'scholar'],
  external: ['primarySource', 'url'],
};

export function validateReference(ref: IslamicReference): ReferenceValidationResult {
  const issues: ReferenceValidationIssue[] = [];

  if (!ref.id?.trim()) {
    issues.push({ field: 'id', message: 'Reference id is required' });
  }
  if (!ref.primarySource?.en?.trim()) {
    issues.push({ field: 'primarySource', message: 'Primary source (en) is required' });
  }

  const required = REQUIRED_BY_KIND[ref.kind] ?? ['primarySource'];
  for (const field of required) {
    const value = ref[field as keyof IslamicReference];
    if (value == null || value === '') {
      issues.push({ field: String(field), message: `${String(field)} is required for ${ref.kind}` });
    }
  }

  return { valid: issues.length === 0, issues };
}

export function verifyReferences(refs: IslamicReference[]): ReferenceVerificationReport {
  const issues: ReferenceValidationIssue[] = [];
  let verified = 0;
  let pending = 0;
  let unavailable = 0;

  for (const ref of refs) {
    const result = validateReference(ref);
    issues.push(...result.issues);

    switch (ref.verification) {
      case 'verified':
        verified += 1;
        break;
      case 'pending':
        pending += 1;
        break;
      case 'unavailable':
        unavailable += 1;
        break;
    }
  }

  return {
    total: refs.length,
    verified,
    pending,
    unavailable,
    hasVerifiedSource: verified > 0,
    issues,
  };
}

export function filterReferencesByMarja(
  refs: IslamicReference[],
  marja: string | undefined,
): IslamicReference[] {
  if (!marja || marja === 'unsure' || marja === 'local') return refs;

  const fiqhRefs = refs.filter((r) => r.kind === 'fiqh');
  const otherRefs = refs.filter((r) => r.kind !== 'fiqh');
  if (fiqhRefs.length === 0) return refs;

  const marjaMatches = fiqhRefs.filter(
    (r) => r.marja === marja || r.marja === 'general' || !r.marja,
  );
  return [...otherRefs, ...(marjaMatches.length > 0 ? marjaMatches : fiqhRefs)];
}

export function formatSurahAyah(ref: IslamicReference): string | null {
  if (ref.surah == null || ref.ayah == null) return null;
  if (ref.ayahEnd != null && ref.ayahEnd !== ref.ayah) {
    return `${ref.surah}:${ref.ayah}–${ref.ayahEnd}`;
  }
  return `${ref.surah}:${ref.ayah}`;
}

export function formatReferenceRows(
  ref: IslamicReference,
  locale: AppLocale,
): ReferenceDisplayRow[] {
  const rows: ReferenceDisplayRow[] = [];

  rows.push({
    labelKey: 'references.primarySource',
    value: pickReferenceText(ref.primarySource, locale),
  });

  if (ref.bookName) {
    rows.push({
      labelKey: 'references.bookName',
      value: pickReferenceText(ref.bookName, locale),
    });
  }
  if (ref.volume != null) {
    rows.push({ labelKey: 'references.volume', value: String(ref.volume) });
  }
  if (ref.page != null) {
    rows.push({ labelKey: 'references.page', value: String(ref.page) });
  }
  if (ref.hadithNumber) {
    rows.push({ labelKey: 'references.hadithNumber', value: ref.hadithNumber });
  }
  if (ref.chapter) {
    rows.push({
      labelKey: 'references.chapter',
      value: pickReferenceText(ref.chapter, locale),
    });
  }

  const ayahRef = formatSurahAyah(ref);
  if (ayahRef) {
    rows.push({ labelKey: 'references.surahAyah', value: ayahRef });
  }

  if (ref.translationSource) {
    rows.push({
      labelKey: 'references.translationSource',
      value: pickReferenceText(ref.translationSource, locale),
    });
  }
  if (ref.tafsirSource) {
    rows.push({
      labelKey: 'references.tafsirSource',
      value: pickReferenceText(ref.tafsirSource, locale),
    });
  }
  if (ref.narrator) {
    rows.push({
      labelKey: 'references.narrator',
      value: pickReferenceText(ref.narrator, locale),
    });
  }
  if (ref.scholar) {
    rows.push({
      labelKey: 'references.scholar',
      value: pickReferenceText(ref.scholar, locale),
    });
  }
  if (ref.marja) {
    rows.push({ labelKey: 'references.marja', value: ref.marja });
  }
  if (ref.grading) {
    rows.push({
      labelKey: 'references.grading',
      value: pickReferenceText(ref.grading, locale),
    });
  }
  if (ref.url) {
    rows.push({ labelKey: 'references.url', value: ref.url });
  }

  return rows;
}

export function referenceKindLabelKey(kind: ReferenceKind): string {
  return `references.kinds.${kind}`;
}

export const REFERENCE_UNAVAILABLE: IslamicReference = {
  id: 'reference-unavailable',
  kind: 'scholar',
  primarySource: {
    en: 'Reference unavailable',
    ur: 'حوالہ دستیاب نہیں',
    ar: 'المرجع غير متوفر',
  },
  scholar: {
    en: 'Please verify with a qualified scholar',
    ur: 'براہ کرم کسی مجاز عالم سے تصدیق کریں',
    ar: 'يرجى التحقق من عالم مؤهل',
  },
  verification: 'unavailable',
};

export function normalizeReferences(
  refs: IslamicReference[] | undefined,
): IslamicReference[] {
  return (refs ?? []).filter((r) => r.primarySource?.en?.trim());
}

export function mergeReferences(
  ...groups: Array<IslamicReference[] | undefined>
): IslamicReference[] {
  const seen = new Set<string>();
  const merged: IslamicReference[] = [];
  for (const group of groups) {
    for (const ref of normalizeReferences(group)) {
      if (seen.has(ref.id)) continue;
      seen.add(ref.id);
      merged.push(ref);
    }
  }
  return merged;
}
