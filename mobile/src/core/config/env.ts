import Config from 'react-native-config';

export type AppEnvironment = 'development' | 'staging' | 'production';

export const env = {
  appEnv: (Config.APP_ENV ?? 'development') as AppEnvironment,
  apiBaseUrl: Config.API_BASE_URL ?? 'http://localhost:3000/v1',
  googleWebClientId: Config.GOOGLE_WEB_CLIENT_ID ?? '',
  googleIosClientId: Config.GOOGLE_IOS_CLIENT_ID ?? '',
  googleAndroidClientId: Config.GOOGLE_ANDROID_CLIENT_ID ?? '',
  enableDevLogging: Config.ENABLE_DEV_LOGGING === 'true' || __DEV__,
  isDev: __DEV__,
  isProduction: (Config.APP_ENV ?? 'development') === 'production',
} as const;
