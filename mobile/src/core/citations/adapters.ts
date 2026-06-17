import type { AiCitation } from '@/features/ai/types';
import type { HadithReference } from '@/features/hadith/types';
import type { IslamicSourceCitation } from '@/features/muharram/types';
import type { AppLocale, FiqhReference, IslamicReference } from '@/core/references';
import { pickReferenceText } from '@/core/references';

import type { IslamicCitation } from './types';

function localizedToString(
  text: { en: string; ur?: string; ar?: string } | undefined,
  locale: AppLocale,
): string | undefined {
  if (!text) return undefined;
  return pickReferenceText(text, locale);
}

export function citationToReference(
  citation: IslamicCitation,
  kind: IslamicReference['kind'] = 'book',
): IslamicReference {
  return {
    id: citation.id ?? `cite-${citation.source}-${Date.now()}`,
    kind,
    primarySource: { en: citation.source },
    volume: citation.volume,
    page: citation.page,
    hadithNumber: citation.hadithNumber,
    narrator: citation.narrator ? { en: citation.narrator } : undefined,
    scholar: citation.scholar ? { en: citation.scholar } : undefined,
    notes: citation.note ? { en: citation.note } : undefined,
    verification: citation.verified ? 'verified' : 'unavailable',
  };
}

export function referenceToCitation(
  ref: IslamicReference,
  locale: AppLocale = 'en',
): IslamicCitation {
  return {
    id: ref.id,
    source: pickReferenceText(ref.primarySource, locale),
    volume: ref.volume,
    page: ref.page,
    hadithNumber: ref.hadithNumber,
    narrator: localizedToString(ref.narrator, locale),
    scholar: localizedToString(ref.scholar, locale),
    verified: ref.verification === 'verified',
    note: localizedToString(ref.notes, locale),
  };
}

export function citationsFromReferences(
  refs: IslamicReference[] | undefined,
  locale: AppLocale = 'en',
): IslamicCitation[] {
  return (refs ?? []).map((r) => referenceToCitation(r, locale));
}

export function citationsFromFiqhRefs(
  refs: FiqhReference[] | undefined,
  locale: AppLocale = 'en',
): IslamicCitation[] {
  return (refs ?? []).map((ref, index) => ({
    id: `fiqh-${index}`,
    source: pickReferenceText(ref.source, locale),
    scholar: ref.citation ? pickReferenceText(ref.citation, locale) : undefined,
    verified: Boolean(ref.citation?.en?.trim()),
    note: ref.marja ? `Marja: ${ref.marja}` : undefined,
  }));
}

export function citationsFromMuharram(
  refs: IslamicSourceCitation[] | undefined,
): IslamicCitation[] {
  return (refs ?? []).map((ref, index) => ({
    id: `muharram-${index}`,
    source: ref.book,
    volume: ref.volume,
    page: ref.page,
    hadithNumber: ref.hadithNumber,
    scholar: ref.scholar,
    verified: !ref.unverified,
    note: ref.note ?? ref.chapter,
  }));
}

export function citationsFromHadithReference(
  ref: HadithReference,
  sourceLabel: string,
  locale: AppLocale = 'en',
): IslamicCitation[] {
  const narrator = ref.narrators?.[0]
    ? pickReferenceText(ref.narrators[0], locale)
    : undefined;

  return [
    {
      id: `hadith-ref-${ref.hadithNumber ?? sourceLabel}`,
      source: sourceLabel,
      volume: ref.volume,
      page: ref.page,
      hadithNumber: ref.hadithNumber,
      narrator,
      scholar: ref.chainSummary ? pickReferenceText(ref.chainSummary, locale) : undefined,
      verified: Boolean(ref.hadithNumber),
      note: ref.book ? pickReferenceText(ref.book, locale) : undefined,
    },
  ];
}

export function citationsFromAi(ai: AiCitation[] | undefined): IslamicCitation[] {
  return (ai ?? []).map((c) => ({
    id: c.id,
    source: c.title,
    scholar: c.reference,
    note: c.source,
    verified: Boolean(c.reference || c.source),
  }));
}

export function mergeCitations(
  ...groups: Array<IslamicCitation[] | undefined>
): IslamicCitation[] {
  const seen = new Set<string>();
  const merged: IslamicCitation[] = [];

  for (const group of groups) {
    for (const cite of group ?? []) {
      const key = cite.id ?? `${cite.source}-${cite.volume}-${cite.page}-${cite.hadithNumber}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(cite);
    }
  }

  return merged;
}
