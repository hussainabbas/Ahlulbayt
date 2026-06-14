import type { HijriDate } from '../types';

const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
];

function parseIslamicDate(date: Date, locale: string): { day: number; month: number; year: number } {
  const formatter = new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  const day = Number(parts.find((p) => p.type === 'day')?.value ?? 1);
  const month = Number(parts.find((p) => p.type === 'month')?.value ?? 1);
  const year = Number(parts.find((p) => p.type === 'year')?.value ?? 1447);
  return { day, month, year };
}

export function getHijriDate(date: Date = new Date(), locale = 'en'): HijriDate {
  const { day, month, year } = parseIslamicDate(date, locale);
  const monthName = HIJRI_MONTHS_EN[month - 1] ?? 'Muharram';
  const isMuharram = month === 1;
  const isAshuraPeriod = month === 1 && day >= 1 && day <= 10;
  const daysUntilAshura = month === 1 ? Math.max(0, 10 - day) : month === 12 ? null : null;

  let ashuraCountdown: number | null = null;
  if (month === 1) {
    ashuraCountdown = Math.max(0, 10 - day);
  } else if (month === 12) {
    const daysLeftInMonth = 30 - day;
    ashuraCountdown = daysLeftInMonth + 10;
  }

  const formatted = new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  return {
    day,
    month,
    monthName,
    year,
    formatted,
    isMuharram,
    isAshuraPeriod,
    daysUntilAshura: ashuraCountdown,
  };
}

export function getGregorianFormatted(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
