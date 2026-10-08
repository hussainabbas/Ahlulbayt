import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

import { SyncOrchestrator } from '@/core/offline/syncOrchestrator';
import { networkManager } from '@/core/offline/network';
import { contentManifestService } from '@/core/offline/contentManifestService';
import { logger } from '@/core/logging/logger';

/**
 * Background worship-content sync after first paint and on reconnect.
 * Prayer: always local refresh. Content: manifest pull when stale (24h).
 */
export function ContentSyncBootstrap() {
  const ran = useRef(false);

  useEffect(() => {
    async function initialSync() {
      if (ran.current) return;
      ran.current = true;

      try {
        await contentManifestService.ensureContentDirs();
        const report = await SyncOrchestrator.syncAll({ wifiOnly: true });
        logger.info('Content sync bootstrap complete', {
          manifest: report.manifestVersion,
          domains: report.domains.map((d) => `${d.domain}:${d.downloaded}/${d.planned}`),
        });
      } catch (error) {
        logger.warn('Content sync bootstrap failed', { error: String(error) });
      }
    }

    const task = InteractionManager.runAfterInteractions(() => {
      void initialSync();
    });

    return () => task.cancel();
  }, []);

  useEffect(() => {
    return networkManager.subscribe((connected) => {
      if (connected) {
        void SyncOrchestrator.syncAll({ wifiOnly: true }).catch((error) => {
          logger.warn('Reconnect sync failed', { error: String(error) });
        });
      }
    });
  }, []);

  return null;
}
