/** All calculable prayer-related times in the Jafari day. */
export type PrayerTimeKey =
  | 'imsak'
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'sunset'
  | 'maghrib'
  | 'isha'
  | 'midnight';

/** Prayers shown in schedules and "next prayer" logic. */
export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_SCHEDULE_ORDER: PrayerName[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

export const FULL_DAY_ORDER: PrayerTimeKey[] = [
  'imsak',
  'fajr',
  'sunrise',
  'dhuhr',
  'asr',
  'sunset',
  'maghrib',
  'isha',
  'midnight',
];

export type PrayerMethodId = 'leva' | 'tehran' | 'jafari' | 'custom';

export type HighLatitudeRule = 'angle_based' | 'one_seventh' | 'middle_of_night';

export type AdjustablePrayer = Exclude<PrayerTimeKey, 'imsak' | 'midnight'>;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ManualOffsets {
  imsak?: number;
  fajr?: number;
  sunrise?: number;
  dhuhr?: number;
  asr?: number;
  sunset?: number;
  maghrib?: number;
  isha?: number;
  midnight?: number;
}

export interface PrayerMethodParams {
  id: PrayerMethodId;
  labelKey: string;
  fajrAngle: number;
  ishaAngle: number;
  maghribDelayMinutes: number;
  dhuhrOffsetMinutes: number;
  imsakOffsetMinutes: number;
  asrShadowFactor: number;
}

export interface PrayerConfig {
  method: PrayerMethodId;
  methodParams: PrayerMethodParams;
  highLatitudeRule: HighLatitudeRule;
  manualOffsets: ManualOffsets;
  /** IANA timezone, e.g. `Asia/Baghdad`. Use `auto` to resolve from coordinates. */
  timezone: string;
}

export interface PrayerTimes {
  date: Date;
  coordinates: Coordinates;
  timezone: string;
  imsak: Date;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
  midnight: Date;
}

export interface PrayerTimeEntry {
  name: PrayerName;
  time: Date;
}

export interface NextPrayerInfo {
  current: PrayerName | null;
  next: PrayerName;
  nextTime: Date;
  all: PrayerTimeEntry[];
  countdownMs: number;
}
