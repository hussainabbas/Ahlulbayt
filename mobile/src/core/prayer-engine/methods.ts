import type { PrayerConfig, PrayerMethodId, PrayerMethodParams } from './types';

export const PRAYER_METHODS: Record<Exclude<PrayerMethodId, 'custom'>, PrayerMethodParams> = {
  leva: {
    id: 'leva',
    labelKey: 'prayer.methods.leva',
    fajrAngle: 16,
    ishaAngle: 14,
    maghribDelayMinutes: 17,
    dhuhrOffsetMinutes: 5,
    imsakOffsetMinutes: -10,
    asrShadowFactor: 1,
  },
  tehran: {
    id: 'tehran',
    labelKey: 'prayer.methods.tehran',
    fajrAngle: 17.7,
    ishaAngle: 14,
    maghribDelayMinutes: 17,
    dhuhrOffsetMinutes: 5,
    imsakOffsetMinutes: -10,
    asrShadowFactor: 1,
  },
  jafari: {
    id: 'jafari',
    labelKey: 'prayer.methods.jafari',
    fajrAngle: 16,
    ishaAngle: 14,
    maghribDelayMinutes: 17,
    dhuhrOffsetMinutes: 0,
    imsakOffsetMinutes: -10,
    asrShadowFactor: 1,
  },
};

export function resolveMethodParams(
  method: PrayerMethodId,
  custom?: Partial<PrayerMethodParams>,
): PrayerMethodParams {
  if (method === 'custom') {
    const base = PRAYER_METHODS.leva;
    return {
      ...base,
      ...custom,
      id: 'custom',
      labelKey: custom?.labelKey ?? 'prayer.methods.custom',
    };
  }
  return PRAYER_METHODS[method];
}

export function createDefaultConfig(timezone: string): PrayerConfig {
  return {
    method: 'leva',
    methodParams: PRAYER_METHODS.leva,
    highLatitudeRule: 'angle_based',
    manualOffsets: {},
    timezone,
  };
}
