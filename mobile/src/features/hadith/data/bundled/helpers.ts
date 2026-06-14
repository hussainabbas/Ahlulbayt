import type {
  HadithEntry,
  HadithId,
  HadithReference,
  HadithSource,
  HadithTopic,
  LocalizedText,
} from '../../types';

export function loc(en: string, ur: string, ar: string): LocalizedText {
  return { en, ur, ar };
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
    nahjulId?: string;
  },
): HadithEntry {
  return {
    id: `hd_${id}` as HadithId,
    source,
    topics,
    title: loc(titleEn, titleUr, titleAr),
    text: loc(textEn, textUr, textAr),
    summary: loc(summaryEn, summaryUr, summaryAr),
    reference,
    ...opts,
  };
}
