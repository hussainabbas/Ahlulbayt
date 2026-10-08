import { MASOOMEEN_CATALOG } from '../constants/catalog';
import { BUNDLED_BY_ID } from '../data/bundled';
import type {
  LocalizedText,
  MasoomeenId,
  MasoomeenMeta,
  MasoomeenProfile,
  MasoomeenSearchResult,
} from '../types';

function scoreMatch(text: string, query: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 50;
  return 0;
}

function searchInLocalized(text: LocalizedText, query: string): number {
  return Math.max(scoreMatch(text.en, query), scoreMatch(text.ur, query), scoreMatch(text.ar, query));
}

export class MasoomeenRepository {
  static listAll(): MasoomeenMeta[] {
    return [...MASOOMEEN_CATALOG].sort((a, b) => a.order - b.order);
  }

  static getMeta(id: MasoomeenId): MasoomeenMeta | undefined {
    return MASOOMEEN_CATALOG.find((m) => m.id === id);
  }

  static getProfile(id: MasoomeenId): MasoomeenProfile | null {
    return BUNDLED_BY_ID[id] ?? null;
  }

  static search(query: string): MasoomeenSearchResult[] {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const results: MasoomeenSearchResult[] = [];

    for (const profile of Object.values(BUNDLED_BY_ID)) {
      const { meta } = profile;
      let score = 0;
      score = Math.max(score, searchInLocalized(meta.titles, trimmed));
      score = Math.max(score, searchInLocalized(meta.epithet, trimmed));
      score = Math.max(score, searchInLocalized(meta.titles, trimmed));

      for (const section of profile.biography) {
        score = Math.max(score, searchInLocalized(section.title, trimmed) * 0.8);
        score = Math.max(score, searchInLocalized(section.body, trimmed) * 0.5);
      }
      for (const q of profile.quotes) {
        score = Math.max(score, searchInLocalized(q.text, trimmed) * 0.7);
      }

      if (score > 0) {
        const title = meta.titles.en;
        const snippet =
          profile.biography[0]?.body.en.slice(0, 120) ??
          profile.quotes[0]?.text.en.slice(0, 120) ??
          meta.epithet.en;
        results.push({ id: meta.id, title, snippet, score });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  static getFeaturedQuotes(limit = 4): Array<{ masoomeenId: MasoomeenId; quoteId: string }> {
    const picks: Array<{ masoomeenId: MasoomeenId; quoteId: string }> = [];
    for (const profile of Object.values(BUNDLED_BY_ID)) {
      const first = profile.quotes[0];
      if (first) picks.push({ masoomeenId: profile.meta.id, quoteId: first.id });
      if (picks.length >= limit) break;
    }
    return picks;
  }
}
