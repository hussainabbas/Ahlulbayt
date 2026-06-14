import type {
  HadithEntry,
  HadithGrading,
  HadithId,
  HadithSearchPage,
  HadithSearchResult,
  HadithSource,
  HadithTopic,
  LocalizedText,
} from '../types';
import { pickLocalized } from '../utils/localize';
import { normalizeSearchText, tokenizeQuery } from './searchNormalizer';

function scoreMatch(text: string, query: string): number {
  const lower = normalizeSearchText(text);
  const q = normalizeSearchText(query);
  if (!q) return 0;
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 50;
  return 0;
}

function scoreTokens(text: string, tokens: string[]): number {
  const lower = normalizeSearchText(text);
  let score = 0;
  for (const token of tokens) {
    if (lower.includes(token)) score += 30;
  }
  return score;
}

function searchInLocalized(text: LocalizedText, query: string, tokens: string[]): number {
  return Math.max(
    scoreMatch(text.en, query),
    scoreMatch(text.ur, query),
    scoreMatch(text.ar, query),
    scoreTokens(text.en, tokens),
    scoreTokens(text.ur, tokens),
    scoreTokens(text.ar, tokens),
  );
}

function resolveGrading(entry: HadithEntry): HadithGrading | undefined {
  if (entry.grading) return entry.grading;
  const g = entry.reference.grading?.en?.toLowerCase() ?? '';
  if (g.includes('sahih') || g.includes('صحيح')) return 'sahih';
  if (g.includes('hasan') || g.includes('حسن')) return 'hasan';
  if (g.includes('muwaththaq') || g.includes('موثق')) return 'muwaththaq';
  if (g.includes('daif') || g.includes('ضعيف')) return 'daif';
  if (g.includes('mawdu') || g.includes('موضوع')) return 'mawdu';
  return undefined;
}

function buildSnippet(entry: HadithEntry, locale: string): string {
  const text = pickLocalized(entry.text, locale);
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export function searchHadithCorpus(
  entries: HadithEntry[],
  query: string,
  options: {
    locale?: string;
    page?: number;
    pageSize?: number;
    filters?: { source?: HadithSource | 'all'; topic?: HadithTopic | 'all'; grading?: HadithGrading | 'all' };
  } = {},
): HadithSearchPage {
  const start = performance.now();
  const trimmed = query.trim();
  const locale = options.locale ?? 'en';
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 20));
  const tokens = tokenizeQuery(trimmed);

  if (!trimmed) {
    return { query: trimmed, page, pageSize, total: 0, tookMs: 0, results: [] };
  }

  const results: HadithSearchResult[] = [];

  for (const entry of entries) {
    const filters = options.filters;
    if (filters?.source && filters.source !== 'all' && entry.source !== filters.source) continue;
    if (filters?.topic && filters.topic !== 'all' && !entry.topics.includes(filters.topic)) continue;

    const grading = resolveGrading(entry);
    if (filters?.grading && filters.grading !== 'all' && grading !== filters.grading) continue;

    let score = 0;
    let matchType: HadithSearchResult['matchType'] = 'keyword';

    score = Math.max(score, searchInLocalized(entry.title, trimmed, tokens) * 1.2);
    score = Math.max(score, searchInLocalized(entry.text, trimmed, tokens));
    score = Math.max(score, searchInLocalized(entry.summary, trimmed, tokens) * 0.6);

    if (entry.arabic) {
      score = Math.max(score, scoreMatch(entry.arabic, trimmed));
      score = Math.max(score, scoreTokens(entry.arabic, tokens));
    }

    for (const topic of entry.topics) {
      if (topic.includes(trimmed.toLowerCase())) {
        score += 20;
        matchType = 'topic';
      }
    }

    if (entry.reference.hadithNumber?.includes(trimmed)) {
      score += 40;
      matchType = 'reference';
    }
    if (entry.reference.volume?.toString() === trimmed) score += 30;

    if (score > 0) {
      results.push({
        id: entry.id,
        title: pickLocalized(entry.title, locale),
        snippet: buildSnippet(entry, locale),
        source: entry.source,
        topics: entry.topics,
        grading,
        score,
        matchType,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  const total = results.length;
  const offset = (page - 1) * pageSize;
  const pageResults = results.slice(offset, offset + pageSize);

  return {
    query: trimmed,
    page,
    pageSize,
    total,
    tookMs: Math.round(performance.now() - start),
    results: pageResults,
  };
}

export function lookupByReference(
  entries: HadithEntry[],
  source: HadithSource,
  hadithNumber: string,
  volume?: number,
): HadithEntry | null {
  return (
    entries.find(
      (e) =>
        e.source === source &&
        e.reference.hadithNumber === hadithNumber &&
        (volume == null || e.reference.volume === volume),
    ) ?? null
  );
}

export { resolveGrading };
