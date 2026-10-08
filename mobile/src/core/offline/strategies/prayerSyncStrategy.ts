import { PrayerService } from '@/features/prayer/services/prayerService';
import { usePrayerStore } from '@/stores/prayerStore';
import { logger } from '@/core/logging/logger';

import type { DomainSyncResult } from '../types';

/**
 * Prayer times are computed entirely on-device — no remote content pull.
 * This strategy refreshes location (if permitted) and warms the calculation cache.
 */
export async function syncPrayerLocal(): Promise<DomainSyncResult> {
  const result: DomainSyncResult = {
    domain: 'prayer',
    direction: 'local',
    planned: 1,
    downloaded: 0,
    skipped: 0,
    errors: [],
  };

  try {
    await PrayerService.refreshLocationFromGps();
    const config = usePrayerStore.getState().getConfig();
    PrayerService.calculateRange(config, 7);
    result.downloaded = 1;
    logger.debug('Prayer local sync: timetable warmed for 7 days');
  } catch (error) {
    logger.warn('Prayer local sync failed', { error: String(error) });
    result.errors.push('prayer_refresh');
    result.skipped = 1;
  }

  return result;
}
