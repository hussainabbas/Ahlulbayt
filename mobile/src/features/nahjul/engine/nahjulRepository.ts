import { BUNDLED_NAHJUL } from '../data/bundled';
import { NAHJUL_CATALOG, getNahjulMeta } from '../constants/catalog';
import type {
  NahjulBundle,
  NahjulCategory,
  NahjulId,
  NahjulMeta,
  NahjulSearchResult,
} from '../types';

const cache = new Map<NahjulId, NahjulBundle>();

function scoreMatch(text: string, query: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 50;
  const words = q.split(/\s+/).filter(Boolean);
  const matched = words.filter((w) => lower.includes(w)).length;
  if (matched > 0) return 20 + matched * 10;
  return 0;
}

export class NahjulRepository {
  static listAll(): NahjulMeta[] {
    return NAHJUL_CATALOG;
  }

  static listByCategory(category: NahjulCategory): NahjulMeta[] {
    return NAHJUL_CATALOG.filter((n) => n.category === category);
  }

  static getMeta(id: NahjulId): NahjulMeta | undefined {
    return getNahjulMeta(id);
  }

  static isAvailable(id: NahjulId): boolean {
    return id in BUNDLED_NAHJUL;
  }

  static getItem(id: NahjulId): NahjulBundle | null {
    if (cache.has(id)) {
      return cache.get(id)!;
    }
    const bundled = BUNDLED_NAHJUL[id];
    if (bundled) {
      cache.set(id, bundled);
      return bundled;
    }
    return null;
  }

  static getSection(id: NahjulId, sectionId: string) {
    return this.getItem(id)?.sections.find((s) => s.id === sectionId);
  }

  static search(query: string, category?: NahjulCategory | 'all'): NahjulSearchResult[] {
    const q = query.trim();
    if (!q) return [];

    const pool =
      category && category !== 'all'
        ? NAHJUL_CATALOG.filter((n) => n.category === category)
        : NAHJUL_CATALOG;

    const results: NahjulSearchResult[] = [];

    for (const meta of pool) {
      const bundle = BUNDLED_NAHJUL[meta.id];
      const haystack = [
        meta.titles.en,
        meta.titles.ur,
        meta.titles.ar,
        meta.subtitles.en,
        meta.subtitles.ur,
        meta.excerpt.en,
        meta.excerpt.ur,
        ...meta.themes,
        String(meta.number),
        meta.category,
      ].join(' ');

      let score = scoreMatch(haystack, q);

      if (bundle) {
        for (const section of bundle.sections) {
          const sectionText = [
            section.title?.en,
            section.title?.ur,
            section.arabic,
            section.translations.en,
            section.translations.ur,
            section.translations.ar,
          ]
            .filter(Boolean)
            .join(' ');
          score = Math.max(score, scoreMatch(sectionText, q));
        }
      }

      if (score > 0) {
        const title = meta.titles.en;
        const bodySnippet =
          bundle?.sections.find((s) => s.kind !== 'commentary' && s.translations.en)?.translations
            .en ?? meta.excerpt.en;
        const snippet =
          bodySnippet.length > 160 ? `${bodySnippet.slice(0, 157)}…` : bodySnippet;
        results.push({
          id: meta.id,
          title,
          snippet,
          category: meta.category,
          score,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  static getFeaturedQuotes(limit = 5): NahjulMeta[] {
    const bundledSayings = NAHJUL_CATALOG.filter((n) => n.category === 'saying' && n.bundled);
    if (bundledSayings.length >= limit) {
      return bundledSayings.slice(0, limit);
    }
    const bundledSermons = NAHJUL_CATALOG.filter(
      (n) => n.category === 'sermon' && n.bundled && [1, 2, 3, 7, 28, 109].includes(n.number),
    );
    return [...bundledSayings, ...bundledSermons].slice(0, limit);
  }

  static clearCache(): void {
    cache.clear();
  }
}
