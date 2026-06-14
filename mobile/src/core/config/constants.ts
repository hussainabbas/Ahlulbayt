export const APP_NAME = 'AhlulBayt+';

export const QUERY_STALE_TIME = {
  short: 60 * 1000,
  medium: 5 * 60 * 1000,
  long: 24 * 60 * 60 * 1000,
} as const;

export const API_TIMEOUT_MS = 30_000;

export const SUPPORTED_LOCALES = ['en', 'ar', 'ur'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const RTL_LOCALES: SupportedLocale[] = ['ar', 'ur'];

export const THEME_MODES = ['system', 'light', 'dark'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
