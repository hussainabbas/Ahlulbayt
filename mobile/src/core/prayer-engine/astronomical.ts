/** Astronomical helpers — Jean Meeus / moonsighting-compatible solar ephemeris. */

export interface SolarCoordinates {
  declination: number;
  /** Equation of time in minutes. */
  equationOfTime: number;
}

const DEG = Math.PI / 180;

export function toRadians(degrees: number): number {
  return degrees * DEG;
}

export function toDegrees(radians: number): number {
  return radians / DEG;
}

export function julianDay(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

export function solarCoordinates(julianDayValue: number): SolarCoordinates {
  const d = julianDayValue - 2451545.0;
  const g = toRadians(normalizeAngle(357.529 + 0.98560028 * d));
  const q = toRadians(normalizeAngle(280.459 + 0.98564736 * d));
  const l = toRadians(
    normalizeAngle(q / DEG + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)),
  );
  const e = toRadians(23.439 - 0.00000036 * d);
  const declination = toDegrees(Math.asin(Math.sin(e) * Math.sin(l)));
  const rightAscension = normalizeAngle(
    toDegrees(Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l))),
  );
  let equationOfTime = (rightAscension - q / DEG) * 4;
  if (equationOfTime > 180) equationOfTime -= 360;
  if (equationOfTime < -180) equationOfTime += 360;
  return {
    declination,
    equationOfTime,
  };
}

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Hour angle (degrees) for a given solar altitude (degrees).
 * Returns null when the sun never reaches that altitude (polar/high latitude).
 */
export function hourAngleForAltitude(
  latitude: number,
  declination: number,
  altitude: number,
): number | null {
  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);
  const altRad = toRadians(altitude);
  const numerator = Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad);
  const denominator = Math.cos(latRad) * Math.cos(decRad);
  const cosine = numerator / denominator;
  if (cosine < -1 || cosine > 1) return null;
  return toDegrees(Math.acos(cosine));
}

export function normalizeMinutes(minutes: number): number {
  return ((minutes % 1440) + 1440) % 1440;
}

/** Standard sunrise/sunset with atmospheric refraction. */
export const SUNRISE_SUNSET_ALTITUDE = -0.833;

/** Asr solar altitude (degrees above horizon) for Jafari shadow factor. */
export function asrAltitude(latitude: number, declination: number, shadowFactor: number): number {
  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);
  const term = shadowFactor + Math.tan(Math.abs(latRad - decRad));
  return toDegrees(Math.atan(1 / term));
}
