import { SURAH_METADATA } from '../../constants/surahMetadata';
import { QuranRepository } from '../../engine/quranRepository';
import { QuranSearchIndex } from '../../engine/quranSearchIndex';
import { QURAN_TOPIC_INDEX } from '../data/quranTopics';
import type { SemanticSearchResponse, SemanticSearchResult, TopicMatch } from '../types';
import {
  cosineSimilarity,
  expandQuery,
  scoreTextMatch,
  snippet,
  termFrequency,
  tokenize,
} from './textSimilarity';

const SYNONYM_GROUPS = QURAN_TOPIC_INDEX.map((t) => t.synonyms);

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

export class SemanticQuranSearchEngine {
  static search(query: string, limit = 20): SemanticSearchResponse {
    const start = Date.now();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return {
        query: trimmed,
        expandedTerms: [],
        matchedTopics: [],
        results: [],
        source: 'local',
        tookMs: 0,
      };
    }

    const queryTokens = tokenize(trimmed);
    const expandedTerms = expandQuery(trimmed, SYNONYM_GROUPS);
    const expandedTokens = [...new Set([...queryTokens, ...tokenize(expandedTerms.join(' '))])];
    const queryVector = termFrequency(expandedTokens);

    const topicMatches = this.matchTopics(trimmed, expandedTokens, queryVector);
    const scored = new Map<string, ScoredRef>();

    for (const topic of topicMatches) {
      const entry = QURAN_TOPIC_INDEX.find((t) => t.id === topic.topicId)!;
      for (const ref of entry.ayahRefs) {
        const [surah, ayah] = ref.split(':').map(Number) as [number, number];
        const key = ref;
        const existing = scored.get(key);
        const topicScore = topic.score * 0.85;
        if (!existing || topicScore > existing.score) {
          scored.set(key, {
            ref: key,
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

    for (const ayah of QuranRepository.getAllIndexedAyahs()) {
      const ref = `${ayah.surah}:${ayah.ayah}`;
      const doc = [
        ayah.arabic,
        ayah.translations.en,
        ayah.translations.ur,
        ayah.translations.roman_ur,
        ayah.tafsir?.en,
      ]
        .filter(Boolean)
        .join(' ');

      const docTokens = tokenize(doc);
      const semanticScore = cosineSimilarity(queryVector, termFrequency(docTokens));
      const keywordScore = scoreTextMatch(expandedTokens, doc);
      const combined = semanticScore * 0.55 + keywordScore * 0.45;

      if (combined < 0.12) continue;

      const existing = scored.get(ref);
      const mergedScore = Math.max(existing?.score ?? 0, combined);
      scored.set(ref, {
        ref,
        surah: ayah.surah,
        ayah: ayah.ayah,
        score: mergedScore,
        matchType: existing ? 'hybrid' : keywordScore > semanticScore ? 'keyword' : 'semantic',
        matchedTopics: existing?.matchedTopics ?? [],
        matchReason: existing?.matchReason ?? 'Semantic similarity to ayah text',
        topicSummary: existing?.topicSummary,
      });
    }

    const keywordResults = QuranSearchIndex.search(trimmed, limit);
    for (const kr of keywordResults) {
      const ref = kr.ref;
      const existing = scored.get(ref);
      const kwScore = 0.35;
      if (!existing) {
        scored.set(ref, {
          ref,
          surah: kr.surah,
          ayah: kr.ayah,
          score: kwScore,
          matchType: 'keyword',
          matchedTopics: [],
          matchReason: `Keyword match in ${kr.matchField}`,
        });
      } else {
        existing.score += kwScore * 0.3;
        existing.matchType = 'hybrid';
      }
    }

    const results: SemanticSearchResult[] = [...scored.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => this.toResult(item, trimmed));

    return {
      query: trimmed,
      expandedTerms,
      matchedTopics: topicMatches.map((t) => ({ id: t.topicId, label: t.label, score: t.score })),
      results,
      source: 'local',
      tookMs: Date.now() - start,
    };
  }

  private static matchTopics(
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

  private static toResult(item: ScoredRef, query: string): SemanticSearchResult {
    const meta = SURAH_METADATA.find((s) => s.number === item.surah);
    const ayah = QuranRepository.getAyah(item.surah, item.ayah);

    return {
      ref: `${item.surah}:${item.ayah}` as `${number}:${number}`,
      surah: item.surah,
      ayah: item.ayah,
      surahName: meta?.nameEnglish ?? `Surah ${item.surah}`,
      snippetArabic: ayah ? snippet(ayah.arabic, query, 80) : meta?.nameArabic ?? '—',
      snippetTranslation: ayah
        ? snippet(ayah.translations.en ?? ayah.translations.ur ?? '', query, 120)
        : item.topicSummary,
      score: Math.round(item.score * 100) / 100,
      matchType: item.matchType,
      matchedTopics: [...new Set(item.matchedTopics)],
      matchReason: item.matchReason,
      topicSummary: item.topicSummary,
    };
  }
}
