import RNFS from 'react-native-fs';

import { apiGet } from '@/core/api/client';
import { logger } from '@/core/logging/logger';
import { getString, setString } from '@/core/storage/mmkv';

import { resolveBundleUrl } from './resolveBundleUrl';
import { isBundleShippedInApp } from './shippedBundles';

import type {
  ContentBundle,
  ContentManifest,
  ContentManifestLocalState,
  LocalBundleVersion,
  SyncPlanItem,
} from './types';

const MANIFEST_STATE_KEY = 'content.manifest.state';
const MANIFEST_STALE_MS = 24 * 60 * 60 * 1000;

export const CONTENT_PATHS = {
  quran: `${RNFS.DocumentDirectoryPath}/content/quran`,
  duas: `${RNFS.DocumentDirectoryPath}/content/duas`,
  ziyarat: `${RNFS.DocumentDirectoryPath}/content/ziyarat`,
} as const;

function bundleKey(domain: string, id: string): string {
  return `${domain}:${id}`;
}

function loadLocalState(): ContentManifestLocalState {
  const raw = getString(MANIFEST_STATE_KEY);
  if (!raw) {
    return { manifestVersion: null, lastCheckedAt: null, bundleVersions: {} };
  }
  try {
    return JSON.parse(raw) as ContentManifestLocalState;
  } catch {
    return { manifestVersion: null, lastCheckedAt: null, bundleVersions: {} };
  }
}

function saveLocalState(state: ContentManifestLocalState): void {
  setString(MANIFEST_STATE_KEY, JSON.stringify(state));
}

export const contentManifestService = {
  getLocalState(): ContentManifestLocalState {
    return loadLocalState();
  },

  getLocalVersion(domain: ContentBundle['domain'], id: string): LocalBundleVersion | null {
    return loadLocalState().bundleVersions[bundleKey(domain, id)] ?? null;
  },

  setLocalVersion(entry: LocalBundleVersion): void {
    const state = loadLocalState();
    state.bundleVersions[bundleKey(entry.domain, entry.id)] = entry;
    saveLocalState(state);
  },

  isManifestStale(): boolean {
    const state = loadLocalState();
    if (!state.lastCheckedAt) return true;
    return Date.now() - new Date(state.lastCheckedAt).getTime() > MANIFEST_STALE_MS;
  },

  async fetchRemoteManifest(): Promise<ContentManifest | null> {
    try {
      const manifest = await apiGet<ContentManifest>('/content/manifest');
      const state = loadLocalState();
      state.manifestVersion = manifest.version;
      state.lastCheckedAt = new Date().toISOString();
      saveLocalState(state);
      return manifest;
    } catch (error) {
      logger.warn('Content manifest fetch failed — continuing offline', { error: String(error) });
      return null;
    }
  },

  planUpdates(manifest: ContentManifest): SyncPlanItem[] {
    const state = loadLocalState();
    const plans: SyncPlanItem[] = [];

    for (const bundle of manifest.bundles) {
      if (isBundleShippedInApp(bundle.domain, bundle.id)) continue;

      const key = bundleKey(bundle.domain, bundle.id);
      const local = state.bundleVersions[key];
      const localVersion = local?.version ?? 0;

      if (localVersion >= bundle.version) continue;

      const url = resolveBundleUrl(bundle.url);
      if (!url) {
        logger.debug('Skipping bundle — URL not resolvable', { id: bundle.id });
        continue;
      }

      plans.push({
        domain: bundle.domain,
        bundleId: bundle.id,
        fromVersion: localVersion,
        toVersion: bundle.version,
        url,
        sha256: bundle.sha256,
        sizeBytes: bundle.sizeBytes,
        priority: computePriority(bundle),
        optional: bundle.optional,
      });
    }

    return plans.sort((a, b) => b.priority - a.priority);
  },

  async ensureContentDirs(): Promise<void> {
    for (const dir of Object.values(CONTENT_PATHS)) {
      const exists = await RNFS.exists(dir);
      if (!exists) await RNFS.mkdir(dir);
    }
  },
};

function computePriority(bundle: ContentBundle): number {
  let score = bundle.optional ? 10 : 50;
  if (bundle.domain === 'quran' && bundle.id.includes('surah-030')) score += 30;
  if (bundle.domain === 'quran' && parseInt(bundle.id.replace(/\D/g, ''), 10) >= 78) score += 20;
  if (bundle.id.includes('kumail') || bundle.id.includes('ashura')) score += 15;
  return score;
}
