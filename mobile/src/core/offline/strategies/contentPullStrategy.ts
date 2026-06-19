import RNFS from 'react-native-fs';

import { logger } from '@/core/logging/logger';

import { CONTENT_PATHS, contentManifestService } from '../contentManifestService';
import { resolveBundleUrl } from '../resolveBundleUrl';
import type { DomainSyncResult, SyncPlanItem } from '../types';

async function downloadBundle(item: SyncPlanItem): Promise<boolean> {
  const dir = CONTENT_PATHS[item.domain as keyof typeof CONTENT_PATHS];
  if (!dir) return false;

  const downloadUrl = resolveBundleUrl(item.url);
  if (!downloadUrl) {
    logger.warn('Bundle download skipped — invalid URL', { id: item.bundleId, url: item.url });
    return false;
  }

  await contentManifestService.ensureContentDirs();
  const filename = `${item.bundleId}.json`;
  const localPath = `${dir}/${filename}`;

  try {
    const result = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: localPath,
    }).promise;

    if (result.statusCode !== 200) {
      logger.warn('Bundle download failed', { id: item.bundleId, status: result.statusCode });
      return false;
    }

    contentManifestService.setLocalVersion({
      domain: item.domain,
      id: item.bundleId,
      version: item.toVersion,
      localPath,
      sha256: item.sha256,
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    if (item.optional) {
      logger.warn('Optional bundle download skipped', { id: item.bundleId, error: String(error) });
    } else {
      logger.warn('Bundle download error', { id: item.bundleId, error: String(error) });
    }
    return false;
  }
}

export async function syncQuranBundles(plans: SyncPlanItem[]): Promise<DomainSyncResult> {
  const quranPlans = plans.filter((p) => p.domain === 'quran');
  const result: DomainSyncResult = {
    domain: 'quran',
    direction: 'pull',
    planned: quranPlans.length,
    downloaded: 0,
    skipped: 0,
    errors: [],
  };

  for (const plan of quranPlans) {
    const ok = await downloadBundle(plan);
    if (ok) result.downloaded += 1;
    else result.errors.push(plan.bundleId);
  }

  return result;
}

export async function syncDuasBundles(plans: SyncPlanItem[]): Promise<DomainSyncResult> {
  const duaPlans = plans.filter((p) => p.domain === 'duas');
  const result: DomainSyncResult = {
    domain: 'duas',
    direction: 'pull',
    planned: duaPlans.length,
    downloaded: 0,
    skipped: 0,
    errors: [],
  };

  for (const plan of duaPlans) {
    const ok = await downloadBundle(plan);
    if (ok) result.downloaded += 1;
    else result.errors.push(plan.bundleId);
  }

  return result;
}

export async function syncZiyaratBundles(plans: SyncPlanItem[]): Promise<DomainSyncResult> {
  const ziyaratPlans = plans.filter((p) => p.domain === 'ziyarat');
  const result: DomainSyncResult = {
    domain: 'ziyarat',
    direction: 'pull',
    planned: ziyaratPlans.length,
    downloaded: 0,
    skipped: 0,
    errors: [],
  };

  for (const plan of ziyaratPlans) {
    const ok = await downloadBundle(plan);
    if (ok) result.downloaded += 1;
    else result.errors.push(plan.bundleId);
  }

  return result;
}
