import imported from './nahjul-imported.json';

import { nahjulId } from '../../constants/entries';
import type {
  NahjulBundle,
  NahjulCategory,
  NahjulId,
  NahjulMeta,
  NahjulSection,
  NahjulSource,
} from '../../types';

import { applyMetaLocaleOverlay, applySectionLocaleOverlay } from './localeOverlay';

type ImportedBundle = {
  bundleVersion: number;
  source?: NahjulSource;
  sections: NahjulSection[];
};

type ImportedData = {
  source: NahjulSource;
  catalog: NahjulMeta[];
  bundles: Record<string, ImportedBundle>;
};

const data = imported as ImportedData;

export const NAHJUL_SOURCE = data.source;
export const NAHJUL_CATALOG = data.catalog.map(applyMetaLocaleOverlay);

const metaById = new Map<NahjulId, NahjulMeta>(NAHJUL_CATALOG.map((m) => [m.id, m]));

function createStubBundle(category: NahjulCategory, number: number): NahjulBundle {
  const meta = metaById.get(nahjulId(category, number));
  if (!meta) {
    throw new Error(`Missing catalog entry for ${category} ${number}`);
  }
  return {
    meta,
    bundleVersion: 2,
    source: data.source,
    sections: applySectionLocaleOverlay(meta.id, [
      {
        id: 'toc-excerpt',
        kind: 'body',
        title: { en: meta.titles.en, ur: meta.titles.ur, ar: meta.titles.ar },
        translations: {
          en: `${meta.titles.en}\n\nFull text from Nahjul Balagha — import pending.`,
        },
      },
    ]),
  };
}

function toBundle(id: NahjulId, raw: ImportedBundle): NahjulBundle {
  const meta = metaById.get(id);
  if (!meta) {
    throw new Error(`Missing catalog meta for ${id}`);
  }
  return {
    meta,
    bundleVersion: raw.bundleVersion,
    source: raw.source ?? data.source,
    sections: applySectionLocaleOverlay(id, raw.sections),
  };
}

export function getAllBundles(): Record<NahjulId, NahjulBundle> {
  const result = {} as Record<NahjulId, NahjulBundle>;
  for (const [id, bundle] of Object.entries(data.bundles)) {
    result[id as NahjulId] = toBundle(id as NahjulId, bundle);
  }
  return result;
}

export function createStubBundleForId(id: NahjulId): NahjulBundle | null {
  const meta = metaById.get(id);
  if (!meta) return null;
  return createStubBundle(meta.category, meta.number);
}

export const BUNDLED_NAHJUL = getAllBundles();
