export const ANALYTICS_EVENTS = {
  SESSION_START: 'app.session_start',
  SCREEN_VIEW: 'app.screen_view',
  PRAYER_COMPLETED: 'prayer.completed',
  QURAN_AYAH_READ: 'quran.ayah_read',
  QURAN_SESSION: 'quran.session_end',
  DUA_OPENED: 'dua.opened',
  ZIYARAT_OPENED: 'ziyarat.opened',
  FEATURE_USED: 'engagement.feature_used',
  NOTIFICATION_DELIVERED: 'notification.delivered',
  NOTIFICATION_OPENED: 'notification.opened',
  NOTIFICATION_DISMISSED: 'notification.dismissed',
  NOTIFICATION_SNOOZED: 'notification.snoozed',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export interface AnalyticsEvent {
  name: AnalyticsEventName | string;
  properties?: Record<string, unknown>;
  sessionId?: string;
  clientTimestamp?: string;
}

export interface UserInsights {
  days: number;
  retention: { sessions: number; activeDaysEstimate: number };
  engagement: { sessionCount: number };
  prayer: {
    totalCompleted: number;
    completionRate: number;
    byPrayer: Array<{ prayer: string; count: number }>;
  };
  reading: { sessions: number; ayahsRead: number; minutes: number };
}
