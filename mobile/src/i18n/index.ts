import { getDeviceLanguageCode } from '@/core/native/localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import {
  RTL_LOCALES,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/core/config/constants';
import { getString } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';

import ar from './locales/ar.json';
import en from './locales/en.json';
import ur from './locales/ur.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  ur: { translation: ur },
} as const;

function getDeviceLocale(): SupportedLocale {
  const deviceTag = getDeviceLanguageCode();
  if (SUPPORTED_LOCALES.includes(deviceTag as SupportedLocale)) {
    return deviceTag as SupportedLocale;
  }
  return 'en';
}

export function getInitialLocale(): SupportedLocale {
  const stored = getString(StorageKeys.LOCALE);
  if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
    return stored as SupportedLocale;
  }
  return getDeviceLocale();
}

export function isRtlLocale(locale: SupportedLocale): boolean {
  return RTL_LOCALES.includes(locale);
}

export async function applyRtlLayout(locale: SupportedLocale): Promise<void> {
  const shouldBeRtl = isRtlLocale(locale);
  if (I18nManager.isRTL !== shouldBeRtl) {
    I18nManager.allowRTL(shouldBeRtl);
    I18nManager.forceRTL(shouldBeRtl);
  }
}

const initialLocale = getInitialLocale();

void applyRtlLayout(initialLocale);

i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: 'en',
  supportedLngs: [...SUPPORTED_LOCALES],
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export { i18n };
