import type {
  CrossReference,
  HadithEntry,
  HadithGrading,
  HadithId,
  HadithReference,
  HadithSource,
  HadithTopic,
  IsnadChain,
  LocalizedText,
} from '../../types';

export function loc(en: string, ur: string, ar: string): LocalizedText {
  return { en, ur, ar };
}

function inferGrading(reference: HadithReference): HadithGrading | undefined {
  const g = reference.grading?.en?.toLowerCase() ?? '';
  if (g.includes('sahih') || g.includes('صحيح')) return 'sahih';
  if (g.includes('hasan') || g.includes('حسن')) return 'hasan';
  if (g.includes('muwaththaq') || g.includes('موثق')) return 'muwaththaq';
  if (g.includes('daif') || g.includes('ضعيف')) return 'daif';
  if (g.includes('mawdu') || g.includes('موضوع')) return 'mawdu';
  return undefined;
}

function isnadFromReference(reference: HadithReference): IsnadChain | undefined {
  if (!reference.narrators?.length && !reference.chainSummary) return undefined;
  return {
    links: reference.narrators?.map((name, position) => ({
      position,
      name,
      era: position === reference.narrators!.length - 1 ? 'imam' : 'tabieen',
    })),
    chainSummary: reference.chainSummary,
  };
}

export function hadith(
  id: string,
  source: HadithSource,
  topics: HadithTopic[],
  titleEn: string,
  titleUr: string,
  titleAr: string,
  textEn: string,
  textUr: string,
  textAr: string,
  summaryEn: string,
  summaryUr: string,
  summaryAr: string,
  reference: HadithReference,
  opts?: {
    arabic?: string;
    speaker?: LocalizedText;
    keyPoints?: LocalizedText[];
    relatedIds?: HadithId[];
    crossReferences?: CrossReference[];
    nahjulId?: string;
    sahifaId?: string;
    isnad?: IsnadChain;
    grading?: HadithGrading;
    corpusTier?: 0 | 1 | 2;
  },
): HadithEntry {
  const grading = opts?.grading ?? inferGrading(reference);
  return {
    id: `hd_${id}` as HadithId,
    source,
    corpusTier: opts?.corpusTier ?? 0,
    topics,
    title: loc(titleEn, titleUr, titleAr),
    text: loc(textEn, textUr, textAr),
    summary: loc(summaryEn, summaryUr, summaryAr),
    reference,
    grading,
    isnad: opts?.isnad ?? isnadFromReference(reference),
    bundleVersion: 1,
    ...opts,
  };
}
