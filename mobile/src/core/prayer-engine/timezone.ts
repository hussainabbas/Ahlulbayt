import { getDeviceCalendars, getDeviceTimezone as readDeviceTimezone } from '@/core/native/localization';

const FALLBACK_TIMEZONE = 'UTC';

function coerceDate(date: Date): Date {
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

/** Returns a valid IANA timezone id, falling back to UTC. */
export function normalizeTimezone(timezone: string | undefined | null): string {
  const candidate = timezone?.trim();
  if (!candidate) return FALLBACK_TIMEZONE;

  try {
    Intl.DateTimeFormat(undefined, { timeZone: candidate });
    return candidate;
  } catch {
    return FALLBACK_TIMEZONE;
  }
}

/**
 * Resolves the device IANA timezone (handles DST via Intl).
 */
export function getDeviceTimezone(): string {
  return normalizeTimezone(getDeviceCalendars()[0]?.timeZone ?? readDeviceTimezone());
}

/**
 * UTC offset in minutes for a given IANA timezone at a specific instant.
 * Positive = east of UTC. Uses Intl formatToParts (Hermes-safe).
 */
export function getTimezoneOffsetMinutes(timezone: string, date: Date): number {
  const tz = normalizeTimezone(timezone);
  const validDate = coerceDate(date);

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(validDate);

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const asUtc = Date.UTC(
    pick('year'),
    pick('month') - 1,
    pick('day'),
    pick('hour'),
    pick('minute'),
    pick('second'),
  );

  const offset = (asUtc - validDate.getTime()) / 60_000;
  return Number.isFinite(offset) ? offset : 0;
}

/**
 * Calendar date components in the target timezone (for Julian day input).
 */
export function getLocalDateParts(
  date: Date,
  timezone: string,
): { year: number; month: number; day: number } {
  const tz = normalizeTimezone(timezone);
  const validDate = coerceDate(date);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = formatter.formatToParts(validDate);
  return {
    year: Number(parts.find((p) => p.type === 'year')?.value ?? validDate.getFullYear()),
    month: Number(parts.find((p) => p.type === 'month')?.value ?? validDate.getMonth() + 1),
    day: Number(parts.find((p) => p.type === 'day')?.value ?? validDate.getDate()),
  };
}

/**
 * Build a Date for a local wall-clock time on a given calendar day in `timezone`.
 */
export function localTimeToDate(
  year: number,
  month: number,
  day: number,
  minutesFromMidnight: number,
  timezone: string,
): Date {
  const tz = normalizeTimezone(timezone);
  const safeMinutes = Number.isFinite(minutesFromMidnight) ? minutesFromMidnight : 0;
  const hours = Math.floor(safeMinutes / 60);
  const minutes = Math.round(safeMinutes % 60);

  const guess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  let offsetMin = getTimezoneOffsetMinutes(tz, guess);
  let result = new Date(guess.getTime() - offsetMin * 60_000);

  const refinedOffset = getTimezoneOffsetMinutes(tz, result);
  if (refinedOffset !== offsetMin) {
    offsetMin = refinedOffset;
    result = new Date(guess.getTime() - offsetMin * 60_000);
  }

  if (Number.isNaN(result.getTime())) {
    return guess;
  }

  return result;
}

export function resolveTimezone(configTimezone: string): string {
  return configTimezone === 'auto'
    ? getDeviceTimezone()
    : normalizeTimezone(configTimezone);
}
