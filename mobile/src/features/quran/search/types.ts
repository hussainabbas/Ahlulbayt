import type { AyahRef } from '../types';

export interface SemanticSearchResult {
  ref: AyahRef;
  surah: number;
  ayah: number;
  surahName: string;
  snippetArabic: string;
  snippetTranslation?: string;
  score: number;
  matchType: 'topic' | 'semantic' | 'keyword' | 'hybrid';
  matchedTopics: string[];
  matchReason: string;
  topicSummary?: string;
}

export interface SemanticSearchResponse {
  query: string;
  expandedTerms: string[];
  matchedTopics: Array<{ id: string; label: string; score: number }>;
  results: SemanticSearchResult[];
  source: 'local' | 'server' | 'hybrid';
  tookMs: number;
}

export interface TopicMatch {
  topicId: string;
  label: string;
  score: number;
  summary?: string;
}

export type SearchMode = 'semantic' | 'keyword';
