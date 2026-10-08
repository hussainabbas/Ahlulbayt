import { Injectable } from '@nestjs/common';

import { QURAN_TOPIC_INDEX, SYNONYM_GROUPS } from './data/quran-topics';
import {
  cosineSimilarity,
  expandQuery,
  scoreTextMatch,
  termFrequency,
  tokenize,
} from './utils/text-similarity';

export interface SemanticSearchResult {
  ref: string;
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

interface TopicMatch {
  topicId: string;
  label: string;
  score: number;
  summary?: string;
}

interface ScoredRef {
  ref: string;
  surah: number;
  ayah: number;
  score: number;
  matchType: SemanticSearchResult['matchType'];
  matchedTopics: string[];
  matchReason: string;
  topicSummary?: string;
}

const SURAH_NAMES: Record<number, string> = {
  1: 'Al-Fatiha',
  2: 'Al-Baqarah',
  3: 'Ali Imran',
  4: 'An-Nisa',
  5: 'Al-Maidah',
  7: 'Al-Araf',
  8: 'Al-Anfal',
  9: 'At-Tawbah',
  11: 'Hud',
  16: 'An-Nahl',
  17: 'Al-Isra',
  20: 'Ta-Ha',
  22: 'Al-Hajj',
  24: 'An-Nur',
  25: 'Al-Furqan',
  29: 'Al-Ankabut',
  30: 'Ar-Rum',
  31: 'Luqman',
  32: 'As-Sajdah',
  33: 'Al-Ahzab',
  39: 'Az-Zumar',
  41: 'Fussilat',
  42: 'Ash-Shura',
  46: 'Al-Ahqaf',
  47: 'Muhammad',
  56: 'Al-Waqiah',
  57: 'Al-Hadid',
  58: 'Al-Mujadila',
  59: 'Al-Hashr',
  61: 'As-Saff',
  65: 'At-Talaq',
  67: 'Al-Mulk',
  70: 'Al-Maarij',
  75: 'Al-Qiyamah',
  76: 'Al-Insan',
  90: 'Al-Balad',
  96: 'Al-Alaq',
  98: 'Al-Bayyinah',
  103: 'Al-Asr',
};

@Injectable()
export class QuranSearchService {
  /**
   * Hybrid semantic search: topic index + lexical similarity.
   * Phase 2 adds pgvector embedding retrieval over full ayah corpus.
   */
  search(query: string, limit = 25): SemanticSearchResponse {
    const start = Date.now();
    const trimmed = query.trim();

    const queryTokens = tokenize(trimmed);
    const expandedTerms = expandQuery(trimmed, SYNONYM_GROUPS);
    const expandedTokens = [...new Set([...queryTokens, ...tokenize(expandedTerms.join(' '))])];
    const queryVector = termFrequency(expandedTokens);

    const topicMatches = this.matchTopics(trimmed, expandedTokens, queryVector);
    const scored = new Map<string, ScoredRef>();

    for (const topic of topicMatches) {
      const entry = QURAN_TOPIC_INDEX.find((t) => t.id === topic.topicId)!;
      for (const ref of entry.ayahRefs) {
        const [surah, ayah] = ref.split(':').map(Number);
        const existing = scored.get(ref);
        const topicScore = topic.score * 0.85;
        if (!existing || topicScore > existing.score) {
          scored.set(ref, {
            ref,
            surah,
            ayah,
            score: topicScore,
            matchType: 'topic',
            matchedTopics: [entry.labels.en],
            matchReason: `Matched topic: ${entry.labels.en}`,
            topicSummary: entry.summary.en,
          });
        } else {
          existing.matchedTopics.push(entry.labels.en);
          existing.score = Math.max(existing.score, topicScore);
          existing.matchType = 'hybrid';
        }
      }
    }

    const results: SemanticSearchResult[] = [...scored.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => this.toResult(item));

    return {
      query: trimmed,
      expandedTerms,
      matchedTopics: topicMatches.map((t) => ({ id: t.topicId, label: t.label, score: t.score })),
      results,
      source: 'server',
      tookMs: Date.now() - start,
    };
  }

  private matchTopics(
    query: string,
    expandedTokens: string[],
    queryVector: Map<string, number>,
  ): TopicMatch[] {
    const qLower = query.toLowerCase();
    const matches: TopicMatch[] = [];

    for (const topic of QURAN_TOPIC_INDEX) {
      const topicDoc = [
        topic.labels.en,
        topic.labels.ur,
        topic.labels.ar,
        ...topic.synonyms,
        topic.summary.en,
        topic.summary.ur,
      ].join(' ');

      const topicTokens = tokenize(topicDoc);
      const vectorScore = cosineSimilarity(queryVector, termFrequency(topicTokens));
      const overlapScore = scoreTextMatch(expandedTokens, topicDoc);
      const phraseBoost = topic.synonyms.some((s) => qLower.includes(s.toLowerCase())) ? 0.35 : 0;
      const labelBoost = Object.values(topic.labels).some((l) => qLower.includes(l.toLowerCase())) ? 0.25 : 0;
      const score = Math.min(1, vectorScore * 0.5 + overlapScore * 0.35 + phraseBoost + labelBoost);

      if (score >= 0.2) {
        matches.push({
          topicId: topic.id,
          label: topic.labels.en,
          score,
          summary: topic.summary.en,
        });
      }
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  private toResult(item: ScoredRef): SemanticSearchResult {
    return {
      ref: item.ref,
      surah: item.surah,
      ayah: item.ayah,
      surahName: SURAH_NAMES[item.surah] ?? `Surah ${item.surah}`,
      snippetArabic: '—',
      snippetTranslation: item.topicSummary,
      score: Math.round(item.score * 100) / 100,
      matchType: item.matchType,
      matchedTopics: [...new Set(item.matchedTopics)],
      matchReason: item.matchReason,
      topicSummary: item.topicSummary,
    };
  }
}
