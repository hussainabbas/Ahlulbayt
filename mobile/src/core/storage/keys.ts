export const StorageKeys = {
  ACCESS_TOKEN: 'auth.access_token',
  REFRESH_TOKEN: 'auth.refresh_token',
  LOCALE: 'settings.locale',
  THEME_MODE: 'settings.theme_mode',
  ONBOARDING_COMPLETE: 'app.onboarding_complete',
  SYNC_TOKEN: 'sync.last_pulled_at',
  LOCAL_GUEST_ID: 'auth.local_guest_id',
  ANALYTICS_ENABLED: 'settings.analytics_enabled',
} as const;
