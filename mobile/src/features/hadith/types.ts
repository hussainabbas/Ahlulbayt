export type HadithId = `hd_${string}`;

/** Primary Shia collections + Sunni cross-reference sources */
export type HadithSource =
  | 'kafi'
  | 'faqih'
  | 'tahdhib'
  | 'istibsar'
  | 'bihar'
  | 'nahjul'
  | 'sahifa'
  | 'bukhari'
  | 'muslim'
  | 'abudawud'
  | 'tirmidhi';

export type HadithSourceCategory = 'shia_core' | 'shia_derived' | 'sunni_cross_ref';

export type HadithCorpusTier = 0 | 1 | 2;

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
  | 'taqwa'
  | 'fiqh'
  | 'tawhid'
  | 'akhira';

export type HadithGrading = 'sahih' | 'hasan' | 'muwaththaq' | 'daif' | 'mawdu' | 'unknown';

export type IsnadEra = 'sahaba' | 'tabieen' | 'taba_tabieen' | 'imam' | 'unknown';

export interface LocalizedText {
  en: string;
  ur: string;
  ar: string;
}

export interface IsnadLink {
  position: number;
  narratorId?: string;
  name: LocalizedText;
  era?: IsnadEra;
  reliability?: number;
}

export interface IsnadChain {
  links?: IsnadLink[];
  chainSummary?: LocalizedText;
  gradingAuthority?: LocalizedText;
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

export interface CrossReference {
  source: Extract<HadithSource, 'bukhari' | 'muslim' | 'abudawud' | 'tirmidhi'>;
  ref: string;
  note?: LocalizedText;
  similarity?: 'parallel' | 'related' | 'contrasting';
}

export interface HadithEntry {
  id: HadithId;
  source: HadithSource;
  corpusTier?: HadithCorpusTier;
  topics: HadithTopic[];
  title: LocalizedText;
  arabic?: string;
  text: LocalizedText;
  reference: HadithReference;
  summary: LocalizedText;
  grading?: HadithGrading;
  gradingNotes?: LocalizedText;
  isnad?: IsnadChain;
  keyPoints?: LocalizedText[];
  relatedIds?: HadithId[];
  crossReferences?: CrossReference[];
  nahjulId?: string;
  sahifaId?: string;
  speaker?: LocalizedText;
  embeddingId?: string;
  bundleVersion?: number;
}

export interface HadithSourceMeta {
  id: HadithSource;
  category: HadithSourceCategory;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  accentColor: string;
  /** Estimated total traditions when corpus fully ingested */
  estimatedTotal: number;
  /** Offline availability tier */
  corpusTier: HadithCorpusTier;
  /** Whether bundled/OTA content exists today */
  available: boolean;
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
  grading?: HadithGrading;
  score: number;
  matchType?: 'keyword' | 'reference' | 'topic';
}

export interface HadithSearchPage {
  query: string;
  page: number;
  pageSize: number;
  total: number;
  tookMs: number;
  results: HadithSearchResult[];
}

export interface HadithTopicSummary {
  topic: HadithTopic;
  summary: LocalizedText;
  count: number;
}

export interface HadithRelatedResult {
  entry: HadithEntry;
  score: number;
  reason: 'explicit' | 'topic' | 'narrator' | 'source';
}

export interface DailyHadithPayload {
  hadithId: HadithId;
  title: LocalizedText;
  text: LocalizedText;
  arabic?: string;
  source: HadithSource;
  referenceLabel: LocalizedText;
}
