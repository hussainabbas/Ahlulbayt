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
  SUPPORT_HOME_CARD_VIEW: 'support.home_card_view',
  SUPPORT_HOME_CARD_CLICK: 'support.home_card_click',
  SUPPORT_HOME_CARD_DISMISS: 'support.home_card_dismiss',
  SUPPORT_HUB_VIEW: 'support.hub_view',
  SUPPORT_OPTION_CLICK: 'support.option_click',
  SUPPORT_CRYPTO_VIEW: 'support.crypto_view',
  SUPPORT_WALLET_COPY: 'support.wallet_copy',
  SUPPORT_QR_VIEW: 'support.qr_view',
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
