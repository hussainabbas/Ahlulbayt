import { useEffect } from 'react';

import { analytics } from '../analytics';
import { networkManager } from '@/core/offline/network';
import { useSettingsStore } from '@/stores/settingsStore';

export function AnalyticsBootstrap() {
  const analyticsEnabled = useSettingsStore((s) => s.analyticsEnabled);

  useEffect(() => {
    if (!analyticsEnabled) {
      analytics.stopAutoFlush();
      return;
    }

    analytics.trackSessionStart();
    analytics.startAutoFlush();

    const unsub = networkManager.subscribe((online) => {
      if (online) {
        void analytics.flush();
      }
    });

    return () => {
      unsub();
      analytics.stopAutoFlush();
    };
  }, [analyticsEnabled]);

  return null;
}
