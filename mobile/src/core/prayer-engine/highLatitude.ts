import type { HighLatitudeRule } from './types';

function normalizeMinutes(minutes: number): number {
  return ((minutes % 1440) + 1440) % 1440;
}

function nightDuration(sunset: number, sunrise: number): number {
  return sunrise > sunset ? sunrise - sunset : sunrise + 1440 - sunset;
}

/**
 * Adjust Fajr / Isha when solar depression angles have no solution (polar regions).
 */
export function applyHighLatitudeRule(
  rule: HighLatitudeRule,
  fajrMinutes: number | null,
  ishaMinutes: number | null,
  sunriseMinutes: number,
  sunsetMinutes: number,
): { fajr: number; isha: number } {
  const night = nightDuration(sunsetMinutes, sunriseMinutes);

  if (fajrMinutes != null && ishaMinutes != null) {
    return { fajr: fajrMinutes, isha: ishaMinutes };
  }

  if (rule === 'one_seventh') {
    const portion = night / 7;
    return {
      fajr: fajrMinutes ?? normalizeMinutes(sunriseMinutes - portion),
      isha: ishaMinutes ?? normalizeMinutes(sunsetMinutes + portion),
    };
  }

  if (rule === 'middle_of_night') {
    const half = night / 2;
    return {
      fajr: fajrMinutes ?? normalizeMinutes(sunriseMinutes - half),
      isha: ishaMinutes ?? normalizeMinutes(sunsetMinutes + half),
    };
  }

  // angle_based fallback → one-seventh when angles fail
  const portion = night / 7;
  return {
    fajr: fajrMinutes ?? normalizeMinutes(sunriseMinutes - portion),
    isha: ishaMinutes ?? normalizeMinutes(sunsetMinutes + portion),
  };
}
