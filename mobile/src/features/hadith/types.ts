export type HadithId = `hd_${string}`;

export type HadithSource = 'nahjul' | 'kafi' | 'bihar';

export type HadithTopic =
  | 'ethics'
  | 'worship'
  | 'imamate'
  | 'knowledge'
  | 'patience'
  | 'family'
  | 'justice'
  | 'dua'
  | 'karbala'
  | 'taqwa';

export interface LocalizedText {
  en: string;
  ur: string;
  ar: string;
}

export interface HadithReference {
  source: HadithSource;
  volume?: number;
  book?: LocalizedText;
  chapter?: LocalizedText;
  hadithNumber?: string;
  page?: string;
  narrators?: LocalizedText[];
  grading?: LocalizedText;
  chainSummary?: LocalizedText;
  alternateRefs?: LocalizedText[];
}

export interface HadithEntry {
  id: HadithId;
  source: HadithSource;
  topics: HadithTopic[];
  title: LocalizedText;
  arabic?: string;
  text: LocalizedText;
  reference: HadithReference;
  summary: LocalizedText;
  keyPoints?: LocalizedText[];
  relatedIds?: HadithId[];
  nahjulId?: string;
  speaker?: LocalizedText;
}

export interface HadithSourceMeta {
  id: HadithSource;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  accentColor: string;
}

export interface HadithBookmark {
  id: string;
  hadithId: HadithId;
  createdAt: string;
}

export interface HadithSearchResult {
  id: HadithId;
  title: string;
  snippet: string;
  source: HadithSource;
  topics: HadithTopic[];
  score: number;
}

export interface HadithTopicSummary {
  topic: HadithTopic;
  summary: LocalizedText;
  count: number;
}
