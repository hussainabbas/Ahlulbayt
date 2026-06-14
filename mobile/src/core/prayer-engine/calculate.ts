import {
  asrAltitude,
  hourAngleForAltitude,
  julianDay,
  normalizeMinutes,
  solarCoordinates,
  SUNRISE_SUNSET_ALTITUDE,
} from './astronomical';
import { applyHighLatitudeRule } from './highLatitude';
import { resolveMethodParams } from './methods';
import { getLocalDateParts, getTimezoneOffsetMinutes, localTimeToDate, resolveTimezone } from './timezone';
import type { Coordinates, PrayerConfig, PrayerTimes } from './types';

export function calculatePrayerTimes(
  date: Date,
  coordinates: Coordinates,
  config: PrayerConfig,
): PrayerTimes {
  const timezone = resolveTimezone(config.timezone);
  const params = resolveMethodParams(config.method, config.methodParams);
  const { year, month, day } = getLocalDateParts(date, timezone);
  const jd = julianDay(year, month, day);
  const solar = solarCoordinates(jd);
  const tzOffsetMin = getTimezoneOffsetMinutes(timezone, date);

  const angleMinutes = (altitude: number, afterTransit: boolean): number | null => {
    const ha = hourAngleForAltitude(coordinates.latitude, solar.declination, altitude);
    if (ha == null) return null;
    const t =
      720 +
      (afterTransit ? ha * 4 : -ha * 4) -
      solar.equationOfTime -
      coordinates.longitude * 4 +
      tzOffsetMin;
    return normalizeMinutes(t);
  };

  const sunriseMin = angleMinutes(SUNRISE_SUNSET_ALTITUDE, false)!;
  const sunsetMin = angleMinutes(SUNRISE_SUNSET_ALTITUDE, true)!;

  let fajrMin = angleMinutes(-params.fajrAngle, false);
  let ishaMin = angleMinutes(-params.ishaAngle, true);

  if (fajrMin == null || ishaMin == null) {
    const adjusted = applyHighLatitudeRule(
      config.highLatitudeRule,
      fajrMin,
      ishaMin,
      sunriseMin,
      sunsetMin,
    );
    fajrMin = adjusted.fajr;
    ishaMin = adjusted.isha;
  }

  if (fajrMin == null) fajrMin = angleMinutes(-params.fajrAngle, false) ?? sunriseMin - 90;
  if (ishaMin == null) ishaMin = angleMinutes(-params.ishaAngle, true) ?? sunsetMin + 90;

  const dhuhrMin = normalizeMinutes(
    720 - solar.equationOfTime - coordinates.longitude * 4 + tzOffsetMin + params.dhuhrOffsetMinutes,
  );

  const asrAlt = asrAltitude(coordinates.latitude, solar.declination, params.asrShadowFactor);
  const asrMin = angleMinutes(asrAlt, true);
  const safeAsrMin =
    asrMin ?? normalizeMinutes(dhuhrMin + (sunsetMin - dhuhrMin) / 2);

  // Jafari Maghrib: astronomical sunset + red-shafaq delay (default 17 min)
  const maghribMin = normalizeMinutes(sunsetMin + params.maghribDelayMinutes);

  // Isha must not precede Maghrib
  if (ishaMin < maghribMin) {
    ishaMin = normalizeMinutes(maghribMin + 30);
  }

  const imsakMin = normalizeMinutes(fajrMin + params.imsakOffsetMinutes);

  // Juridical midnight: midpoint between sunset and next Fajr (Jafari fiqh)
  const midnightMin = normalizeMinutes(
    sunsetMin + normalizeNight(sunsetMin, fajrMin) / 2,
  );

  const applyOffset = (minutes: number, offsetKey: keyof typeof config.manualOffsets): Date => {
    const offset = config.manualOffsets[offsetKey] ?? 0;
    return localTimeToDate(year, month, day, minutes + offset, timezone);
  };

  return {
    date: localTimeToDate(year, month, day, 0, timezone),
    coordinates,
    timezone,
    imsak: applyOffset(imsakMin, 'imsak'),
    fajr: applyOffset(fajrMin, 'fajr'),
    sunrise: applyOffset(sunriseMin, 'sunrise'),
    dhuhr: applyOffset(dhuhrMin, 'dhuhr'),
    asr: applyOffset(safeAsrMin, 'asr'),
    sunset: applyOffset(sunsetMin, 'sunset'),
    maghrib: applyOffset(maghribMin, 'maghrib'),
    isha: applyOffset(ishaMin, 'isha'),
    midnight: applyOffset(midnightMin, 'midnight'),
  };
}

export function batchCalculatePrayerTimes(
  startDate: Date,
  days: number,
  coordinates: Coordinates,
  config: PrayerConfig,
): PrayerTimes[] {
  const results: PrayerTimes[] = [];
  const start = Number.isNaN(startDate.getTime()) ? new Date() : startDate;
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86_400_000);
    results.push(calculatePrayerTimes(d, coordinates, config));
  }
  return results;
}

function normalizeNight(sunset: number, fajr: number): number {
  return fajr > sunset ? fajr - sunset : fajr + 1440 - sunset;
}
