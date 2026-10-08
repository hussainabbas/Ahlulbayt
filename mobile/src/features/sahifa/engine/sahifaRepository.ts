import { BUNDLED_SAHIFA } from '../data/bundled';
import { SAHIFA_CATALOG, getSahifaMeta } from '../constants/catalog';
import type { SahifaBundle, SahifaId, SahifaMeta } from '../types';

const cache = new Map<SahifaId, SahifaBundle>();

export class SahifaRepository {
  static listAll(): SahifaMeta[] {
    return SAHIFA_CATALOG;
  }

  static getMeta(id: SahifaId): SahifaMeta | undefined {
    return getSahifaMeta(id);
  }

  static isAvailable(id: SahifaId): boolean {
    return id in BUNDLED_SAHIFA;
  }

  static getSupplication(id: SahifaId): SahifaBundle | null {
    if (cache.has(id)) {
      return cache.get(id)!;
    }

    const bundled = BUNDLED_SAHIFA[id];
    if (bundled) {
      cache.set(id, bundled);
      return bundled;
    }

    return null;
  }

  static getSection(id: SahifaId, sectionId: string) {
    const supplication = this.getSupplication(id);
    return supplication?.sections.find((s) => s.id === sectionId);
  }

  static search(query: string): SahifaMeta[] {
    const q = query.trim().toLowerCase();
    if (!q) return SAHIFA_CATALOG;

    return SAHIFA_CATALOG.filter((s) => {
      const haystack = [
        s.titles.en,
        s.titles.ur,
        s.titles.ar,
        s.subtitles.en,
        s.subtitles.ur,
        s.description.en,
        s.description.ur,
        ...s.themes,
        String(s.number),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  static clearCache(): void {
    cache.clear();
  }
}
