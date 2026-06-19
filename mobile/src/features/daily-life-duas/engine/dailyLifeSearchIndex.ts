import type { DailyLifeDuaMeta, DailyLifeSearchHit } from '../types';

function normalize(text: string | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  const norm = normalize(text);
  return norm ? norm.split(' ') : [];
}

export class DailyLifeSearchIndex {
  private readonly entries: Array<{ meta: DailyLifeDuaMeta; tokens: Set<string> }>;

  constructor(catalog: DailyLifeDuaMeta[]) {
    this.entries = catalog.map((meta) => ({
      meta,
      tokens: new Set(
        tokenize(
          [
            meta.titles.en,
            meta.titles.ur,
            meta.titles.ar ?? '',
            meta.description.en,
            meta.description.ur,
            ...meta.tags,
            ...meta.categoryIds,
            meta.situationKey,
            meta.slug,
          ].join(' '),
        ),
      ),
    }));
  }

  search(query: string, limit = 40): DailyLifeSearchHit[] {
    if (!query?.trim()) return [];
    const q = normalize(query);
    if (q.length < 2) return [];

    const qTokens = tokenize(q);
    const hits: DailyLifeSearchHit[] = [];

    for (const { meta, tokens } of this.entries) {
      let score = 0;

      const titleNorm = normalize(meta.titles.en);
      if (titleNorm === q) score += 100;
      else if (titleNorm.includes(q)) score += 50;

      for (const tag of meta.tags) {
        if (normalize(tag).includes(q)) score += 20;
      }

      for (const qt of qTokens) {
        if (tokens.has(qt)) score += 10;
      }

      if (score > 0) {
        hits.push({ meta, score });
      }
    }

    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
