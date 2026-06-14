import { Platform } from 'react-native';

import { analyticsApi } from './analyticsApi';
import { ANALYTICS_EVENTS, type AnalyticsEvent } from './types';
import { logger } from '@/core/logging/logger';
import { networkManager } from '@/core/offline/network';
import { getString, setString } from '@/core/storage/mmkv';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';

const QUEUE_KEY = 'analytics-event-queue';
const SESSION_KEY = 'analytics-session-id';
const FLUSH_INTERVAL_MS = 30_000;
const MAX_QUEUE = 100;

let sessionId: string | null = null;
let flushTimer: ReturnType<typeof setInterval> | null = null;

function createSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getSessionId(): string {
  if (sessionId) return sessionId;
  const stored = getString(SESSION_KEY);
  if (stored) {
    sessionId = stored;
    return stored;
  }
  sessionId = createSessionId();
  setString(SESSION_KEY, sessionId);
  return sessionId;
}

function loadQueue(): AnalyticsEvent[] {
  try {
    const raw = getString(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: AnalyticsEvent[]) {
  setString(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
}

function isEnabled(): boolean {
  return useSettingsStore.getState().analyticsEnabled;
}

export const analytics = {
  track(name: string, properties?: Record<string, unknown>) {
    if (!isEnabled()) return;

    const event: AnalyticsEvent = {
      name,
      properties,
      sessionId: getSessionId(),
      clientTimestamp: new Date().toISOString(),
    };

    const queue = loadQueue();
    queue.push(event);
    saveQueue(queue);

    if (networkManager.getIsConnected() && useAuthStore.getState().isAuthenticated) {
      void analytics.flush();
    }
  },

  trackSessionStart() {
    analytics.track(ANALYTICS_EVENTS.SESSION_START, {
      platform: Platform.OS,
    });
  },

  trackScreen(screen: string) {
    analytics.track(ANALYTICS_EVENTS.SCREEN_VIEW, { screen });
  },

  trackPrayerCompleted(prayer: string) {
    const date = new Date().toISOString().slice(0, 10);
    analytics.track(ANALYTICS_EVENTS.PRAYER_COMPLETED, { prayer, date, source: 'manual' });

    if (networkManager.getIsConnected() && useAuthStore.getState().isAuthenticated) {
      void analyticsApi.recordPrayer(prayer, date).catch(() => undefined);
    }
  },

  trackAyahRead(surah: number, ayah: number) {
    analytics.track(ANALYTICS_EVENTS.QURAN_AYAH_READ, { surah, ayah, ayahsRead: 1 });
  },

  async flush(): Promise<void> {
    if (!isEnabled()) return;

    const queue = loadQueue();
    if (queue.length === 0) return;
    if (!networkManager.getIsConnected()) return;

    const batch = queue.splice(0, 50);
    saveQueue(queue);

    try {
      await analyticsApi.ingest({
        events: batch,
        platform: Platform.OS,
        appVersion: '1.0.0',
      });
    } catch {
      const restored = [...batch, ...loadQueue()];
      saveQueue(restored);
      logger.debug('Analytics flush deferred — events re-queued');
    }
  },

  startAutoFlush() {
    if (flushTimer) return;
    flushTimer = setInterval(() => {
      void analytics.flush();
    }, FLUSH_INTERVAL_MS);
  },

  stopAutoFlush() {
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
  },
};
