const HIJRI_EPOCH_APPROX = new Date(Date.UTC(622, 6, 16));

export interface HijriParts {
  day: number;
  month: number;
  year: number;
}

export function parseHijriDate(date: Date, locale = 'en'): HijriParts {
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const formatter = new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(validDate);
  return {
    day: Number(parts.find((p) => p.type === 'day')?.value ?? 1),
    month: Number(parts.find((p) => p.type === 'month')?.value ?? 1),
    year: Number(parts.find((p) => p.type === 'year')?.value ?? 1447),
  };
}

export function formatHijriDate(date: Date, locale = 'en'): string {
  return new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function addHijriMonths(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  let m = month + delta;
  let y = year;
  while (m > 12) {
    m -= 12;
    y += 1;
  }
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  return { year: y, month: m };
}

function findGregorianForHijri(
  hYear: number,
  hMonth: number,
  hDay: number,
  locale = 'en',
): Date | null {
  const targetSerial = hYear * 400 + hMonth * 32 + hDay;
  const base = new Date();
  const baseParts = parseHijriDate(base, locale);
  const baseSerial = baseParts.year * 400 + baseParts.month * 32 + baseParts.day;
  const startOffset = Math.floor((targetSerial - baseSerial) * 0.97);

  for (let offset = startOffset - 5; offset <= startOffset + 5; offset++) {
    const candidate = new Date(base);
    candidate.setDate(candidate.getDate() + offset);
    const parts = parseHijriDate(candidate, locale);
    if (parts.year === hYear && parts.month === hMonth && parts.day === hDay) {
      return candidate;
    }
  }

  const approxDays =
    (hYear - 1) * 354.367 + (hMonth - 1) * 29.53 + hDay;
  const approx = new Date(HIJRI_EPOCH_APPROX.getTime() + approxDays * 86_400_000);
  for (let offset = -3; offset <= 3; offset++) {
    const candidate = new Date(approx);
    candidate.setDate(candidate.getDate() + offset);
    const parts = parseHijriDate(candidate, locale);
    if (parts.year === hYear && parts.month === hMonth && parts.day === hDay) {
      return candidate;
    }
  }

  return null;
}

export function getDaysInHijriMonth(year: number, month: number, locale = 'en'): number {
  if (findGregorianForHijri(year, month, 30, locale)) return 30;
  return 29;
}

/** Approximate day offset within Hijri year (for sorting upcoming events). */
export function hijriDayOfYear(month: number, day: number): number {
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  let total = day;
  for (let i = 0; i < month - 1; i++) {
    total += monthLengths[i] ?? 29;
  }
  return total;
}

export function daysUntilHijriDate(
  currentMonth: number,
  currentDay: number,
  eventMonth: number,
  eventDay: number,
): number {
  const current = hijriDayOfYear(currentMonth, currentDay);
  let event = hijriDayOfYear(eventMonth, eventDay);
  if (event < current) {
    event += hijriDayOfYear(12, 30);
  }
  return Math.round(event - current);
}

export function getGregorianForHijri(
  year: number,
  month: number,
  day: number,
  locale = 'en',
): Date | null {
  return findGregorianForHijri(year, month, day, locale);
}
