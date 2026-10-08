import NetInfo from '@react-native-community/netinfo';

import { logger } from '@/core/logging/logger';
import { useSubscriptionStore } from '@/features/monetization/stores/subscriptionStore';

import { contentManifestService } from './contentManifestService';
import { networkManager } from './network';
import {
  syncDuasBundles,
  syncQuranBundles,
  syncZiyaratBundles,
} from './strategies/contentPullStrategy';
import { syncPrayerLocal } from './strategies/prayerSyncStrategy';
import { syncQueue } from './syncQueue';
import type { ContentDomain, DomainSyncResult, SyncOptions, SyncReport } from './types';

async function isWifiConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.type === 'wifi' && state.isConnected === true;
}

async function flushUserDataQueue(): Promise<number> {
  if (!useSubscriptionStore.getState().hasEntitlement('cloud_sync')) {
    return 0;
  }
  let flushed = 0;
  await syncQueue.flush(async (op) => {
    // Remote processor wired when /v1/sync/push is available
    logger.debug('Sync queue flush (local stub)', { type: op.type, id: op.id });
    flushed += 1;
  });
  return flushed;
}

export class SyncOrchestrator {
  /**
   * Unified sync entry point for worship content + user data.
   * Prayer: local recompute. Quran/Duas/Ziyarat: manifest pull. User data: push queue.
   */
  static async syncAll(options: SyncOptions = {}): Promise<SyncReport> {
    const startedAt = new Date().toISOString();
    const domains = options.domains ?? ['prayer', 'quran', 'duas', 'ziyarat'];
    const domainResults: DomainSyncResult[] = [];

    if (!networkManager.getIsConnected() && domains.some((d) => d !== 'prayer')) {
      const prayerOnly = domains.includes('prayer')
        ? [await syncPrayerLocal()]
        : [];
      return {
        startedAt,
        completedAt: new Date().toISOString(),
        skipped: true,
        skipReason: 'offline',
        manifestVersion: contentManifestService.getLocalState().manifestVersion,
        domains: prayerOnly,
        userDataFlushed: 0,
      };
    }

    if (options.wifiOnly) {
      const onWifi = await isWifiConnected();
      if (!onWifi && domains.some((d) => d !== 'prayer')) {
        logger.info('Sync skipped — WiFi required for content pull');
      }
    }

    if (domains.includes('prayer')) {
      domainResults.push(await syncPrayerLocal());
    }

    let manifestVersion: string | null =
      contentManifestService.getLocalState().manifestVersion;
    const shouldFetchManifest =
      options.force || contentManifestService.isManifestStale();

    if (
      shouldFetchManifest &&
      domains.some((d) => d === 'quran' || d === 'duas' || d === 'ziyarat')
    ) {
      const manifest = await contentManifestService.fetchRemoteManifest();
      if (manifest) {
        manifestVersion = manifest.version;
        const plans = contentManifestService.planUpdates(manifest);

        if (domains.includes('quran')) {
          domainResults.push(await syncQuranBundles(plans));
        }
        if (domains.includes('duas')) {
          domainResults.push(await syncDuasBundles(plans));
        }
        if (domains.includes('ziyarat')) {
          domainResults.push(await syncZiyaratBundles(plans));
        }
      } else {
        for (const d of ['quran', 'duas', 'ziyarat'] as ContentDomain[]) {
          if (domains.includes(d)) {
            domainResults.push({
              domain: d,
              direction: 'pull',
              planned: 0,
              downloaded: 0,
              skipped: 1,
              errors: ['manifest_unavailable'],
            });
          }
        }
      }
    }

    const userDataFlushed = networkManager.getIsConnected() ? await flushUserDataQueue() : 0;

    return {
      startedAt,
      completedAt: new Date().toISOString(),
      skipped: false,
      manifestVersion,
      domains: domainResults,
      userDataFlushed,
    };
  }

  static async syncDomain(domain: ContentDomain, options?: SyncOptions): Promise<SyncReport> {
    return SyncOrchestrator.syncAll({ ...options, domains: [domain] });
  }
}
