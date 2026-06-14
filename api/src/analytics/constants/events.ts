export const ANALYTICS_EVENTS = {
  SESSION_START: 'app.session_start',
  SCREEN_VIEW: 'app.screen_view',
  PRAYER_COMPLETED: 'prayer.completed',
  PRAYER_QADHA: 'prayer.qadha_marked',
  QURAN_AYAH_READ: 'quran.ayah_read',
  QURAN_SESSION: 'quran.session_end',
  DUA_OPENED: 'dua.opened',
  ZIYARAT_OPENED: 'ziyarat.opened',
  AI_QUESTION: 'ai.question_asked',
  FEATURE_USED: 'engagement.feature_used',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export const READING_CONTENT_TYPES = ['quran', 'dua', 'ziyarat', 'hadith'] as const;
