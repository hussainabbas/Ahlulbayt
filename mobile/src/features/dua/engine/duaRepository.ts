import { BUNDLED_DUAS } from '../data/bundled';
import { DUA_CATALOG, getDuaMeta } from '../constants/catalog';
import type { DuaBundle, DuaId, DuaMeta } from '../types';

const cache = new Map<DuaId, DuaBundle>();

export class DuaRepository {
  static listDuas(): DuaMeta[] {
    return DUA_CATALOG;
  }

  static getMeta(id: DuaId): DuaMeta | undefined {
    return getDuaMeta(id);
  }

  static isAvailable(id: DuaId): boolean {
    return id in BUNDLED_DUAS;
  }

  static getDua(id: DuaId): DuaBundle | null {
    if (cache.has(id)) {
      return cache.get(id)!;
    }

    const bundled = BUNDLED_DUAS[id];
    if (bundled) {
      cache.set(id, bundled);
      return bundled;
    }

    return null;
  }

  static getSection(id: DuaId, sectionId: string) {
    const dua = this.getDua(id);
    return dua?.sections.find((s) => s.id === sectionId);
  }

  static clearCache(): void {
    cache.clear();
  }
}
