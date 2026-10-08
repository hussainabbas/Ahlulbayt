export type {
  PrayerName,
  PrayerTimeEntry,
  NextPrayerInfo,
} from '@/core/prayer-engine';

export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
  isMuharram: boolean;
  isAshuraPeriod: boolean;
  daysUntilAshura: number | null;
  isRamadan: boolean;
  isRamadanSeason: boolean;
  isLastTenNights: boolean;
  daysUntilRamadan: number | null;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  conditionCode: number;
  unit: 'C' | 'F';
}

export interface DailyVerse {
  surah: number;
  surahName: string;
  ayah: number;
  arabic: string;
  translation: string;
  reference: string;
}

export interface DailyHadith {
  hadithId?: string;
  text: string;
  narrator: string;
  source: string;
}

export interface DailyDua {
  duaId?: string;
  title: string;
  arabic?: string;
  translation?: string;
  benefit: string;
}

export interface IslamicEvent {
  id: string;
  titleKey: string;
  hijriMonth: number;
  hijriDay: number;
  category: 'martyrdom' | 'birth' | 'occasion' | 'community';
  daysUntil: number;
}

export interface AiRecommendation {
  id: string;
  titleKey: string;
  subtitleKey: string;
  topic: string;
  icon: string;
}
