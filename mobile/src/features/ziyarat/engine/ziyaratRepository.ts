import { BUNDLED_ZIYARAT } from '../data/bundled';
import { ZIYARAT_CATALOG, getZiyaratMeta } from '../constants/catalog';
import type { ZiyaratBundle, ZiyaratId, ZiyaratMeta } from '../types';

const cache = new Map<ZiyaratId, ZiyaratBundle>();

export class ZiyaratRepository {
  static list(): ZiyaratMeta[] {
    return ZIYARAT_CATALOG;
  }

  static getMeta(id: ZiyaratId): ZiyaratMeta | undefined {
    return getZiyaratMeta(id);
  }

  static isAvailable(id: ZiyaratId): boolean {
    return id in BUNDLED_ZIYARAT;
  }

  static get(id: ZiyaratId): ZiyaratBundle | null {
    if (cache.has(id)) return cache.get(id)!;
    const bundled = BUNDLED_ZIYARAT[id];
    if (bundled) {
      cache.set(id, bundled);
      return bundled;
    }
    return null;
  }

  static clearCache(): void {
    cache.clear();
  }
}
