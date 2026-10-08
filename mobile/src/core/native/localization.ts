import * as RNLocalize from 'react-native-localize';

export function getDeviceLanguageCode(): string {
  return RNLocalize.getLocales()[0]?.languageCode ?? 'en';
}

export function getDeviceTimezone(): string {
  try {
    const tz = RNLocalize.getTimeZone();
    if (tz?.trim()) return tz;
  } catch {
    // fall through
  }
  return 'UTC';
}

export function getDeviceLocales() {
  return RNLocalize.getLocales();
}

export function getDeviceCalendars() {
  return [{ timeZone: RNLocalize.getTimeZone() }];
}
