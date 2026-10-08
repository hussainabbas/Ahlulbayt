import type { HadithEntry } from '@/features/hadith/types';

import type { IslamicReference } from '../types';

export function hadithEntryToReferences(entry: HadithEntry): IslamicReference[] {
  const ref = entry.reference;
  return [
    {
      id: `hadith-${entry.id}`,
      kind: 'hadith',
      primarySource: {
        en: entry.source,
        ur: entry.source,
        ar: entry.source,
      },
      bookName: ref.book,
      volume: ref.volume,
      page: ref.page,
      hadithNumber: ref.hadithNumber,
      chapter: ref.chapter,
      narrator: ref.narrators?.[0],
      grading: ref.grading,
      scholar: ref.chainSummary,
      contentRef: `hadith:${entry.id}`,
      verification: ref.hadithNumber ? 'verified' : 'pending',
    },
  ];
}
