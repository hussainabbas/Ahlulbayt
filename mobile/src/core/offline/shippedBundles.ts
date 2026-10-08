import { BUNDLED_DUAS } from '@/features/dua/data/bundled';
import { BUNDLED_SURAHS } from '@/features/quran/data/bundled';
import { BUNDLED_ZIYARAT } from '@/features/ziyarat/data/bundled';

import type { ContentDomain } from './types';

/** Manifest bundle IDs that ship inside the app binary — no CDN pull needed. */
export function isBundleShippedInApp(domain: ContentDomain, bundleId: string): boolean {
  switch (domain) {
    case 'ziyarat': {
      const key = bundleId.replace(/-/g, '_');
      return key in BUNDLED_ZIYARAT;
    }
    case 'duas': {
      const key = bundleId.replace(/-/g, '_');
      return key in BUNDLED_DUAS;
    }
    case 'quran': {
      const match = /^surah-(\d{1,3})$/i.exec(bundleId);
      if (!match) return false;
      const num = parseInt(match[1]!, 10);
      return num in BUNDLED_SURAHS;
    }
    default:
      return false;
  }
}
