import type { DailyLifeCategory, DailyLifeCategoryId, DailyLifeSituationKey } from '../types';

/** Category tree — metadata only; dua bodies from verified import. */
export const DAILY_LIFE_CATEGORIES: DailyLifeCategory[] = [
  {
    id: 'home',
    titles: { en: 'Home', ur: 'گھر', ar: 'المنزل' },
    icon: 'home',
    sortOrder: 1,
    situations: ['entering_home', 'leaving_home'],
  },
  {
    id: 'sleep',
    titles: { en: 'Sleep', ur: 'نیند', ar: 'النوم' },
    icon: 'moon',
    sortOrder: 2,
    situations: ['before_sleeping', 'after_waking'],
  },
  {
    id: 'bathroom',
    titles: { en: 'Bathroom', ur: 'بیت الخلا', ar: 'الخلاء' },
    icon: 'droplet',
    sortOrder: 3,
    situations: ['entering_bathroom', 'leaving_bathroom'],
  },
  {
    id: 'travel',
    titles: { en: 'Travel', ur: 'سفر', ar: 'السفر' },
    icon: 'car',
    sortOrder: 4,
    situations: ['starting_journey', 'entering_vehicle', 'safe_travel'],
  },
  {
    id: 'food',
    titles: { en: 'Food', ur: 'کھانا', ar: 'الطعام' },
    icon: 'utensils',
    sortOrder: 5,
    situations: ['before_eating', 'after_eating', 'drinking_water'],
  },
  {
    id: 'family',
    titles: { en: 'Family', ur: 'خاندان', ar: 'الأسرة' },
    icon: 'heart',
    sortOrder: 6,
    situations: ['before_marriage', 'for_spouse', 'for_children'],
  },
  {
    id: 'work',
    titles: { en: 'Work', ur: 'کام', ar: 'العمل' },
    icon: 'briefcase',
    sortOrder: 7,
    situations: ['before_work', 'seeking_rizq', 'success_in_work'],
  },
  {
    id: 'health',
    titles: { en: 'Health', ur: 'صحت', ar: 'الصحة' },
    icon: 'activity',
    sortOrder: 8,
    situations: ['during_illness', 'visiting_sick', 'protection_health'],
  },
  {
    id: 'protection',
    titles: { en: 'Protection', ur: 'حفاظت', ar: 'الحماية' },
    icon: 'shield',
    sortOrder: 9,
    situations: ['evil_eye', 'from_harm', 'from_fear'],
  },
  {
    id: 'prayer',
    titles: { en: 'Prayer Related', ur: 'نماز', ar: 'الصلاة' },
    icon: 'pray',
    sortOrder: 10,
    situations: ['adhan_response', 'after_prayer', 'before_prayer'],
  },
];

export const SITUATION_LABELS: Record<
  DailyLifeSituationKey,
  { en: string; ur: string; ar?: string }
> = {
  entering_home: { en: 'Entering Home', ur: 'گھر میں داخل ہوتے وقت', ar: 'دخول المنزل' },
  leaving_home: { en: 'Leaving Home', ur: 'گھر سے نکلتے وقت', ar: 'خروج من المنزل' },
  before_sleeping: { en: 'Before Sleeping', ur: 'سونے سے پہلے', ar: 'قبل النوم' },
  after_waking: { en: 'After Waking Up', ur: 'جاگنے کے بعد', ar: 'بعد الاستيقاظ' },
  entering_bathroom: { en: 'Entering Bathroom', ur: 'بیت الخلا میں داخل ہوتے وقت' },
  leaving_bathroom: { en: 'Leaving Bathroom', ur: 'بیت الخلا سے نکلتے وقت' },
  starting_journey: { en: 'Starting Journey', ur: 'سفر شروع', ar: 'بدء السفر' },
  entering_vehicle: { en: 'Entering Vehicle', ur: 'سواری میں سوار ہوتے وقت' },
  safe_travel: { en: 'Safe Travel Dua', ur: 'محفوظ سفر کی دعا', ar: 'دعاء السفر' },
  before_eating: { en: 'Before Eating', ur: 'کھانے سے پہلے', ar: 'قبل الطعام' },
  after_eating: { en: 'After Eating', ur: 'کھانے کے بعد', ar: 'بعد الطعام' },
  drinking_water: { en: 'Drinking Water', ur: 'پانی پیتے وقت', ar: 'شرب الماء' },
  before_marriage: { en: 'Before Marriage', ur: 'شادی سے پہلے', ar: 'قبل الزواج' },
  for_spouse: { en: 'For Spouse', ur: 'شریکِ حیات کے لیے', ar: 'للزوج' },
  for_children: { en: 'For Children', ur: 'اولاد کے لیے', ar: 'للأولاد' },
  before_work: { en: 'Before Work', ur: 'کام سے پہلے', ar: 'قبل العمل' },
  seeking_rizq: { en: 'Seeking Rizq', ur: 'رزق کی دعا', ar: 'طلب الرزق' },
  success_in_work: { en: 'Success in Work', ur: 'کام میں کامیابی', ar: 'التوفيق في العمل' },
  during_illness: { en: 'During Illness', ur: 'بیماری میں', ar: 'عند المرض' },
  visiting_sick: { en: 'Visiting Sick Person', ur: 'مریض عیادت', ar: 'عيادة المريض' },
  protection_health: { en: 'Protection Dua', ur: 'حفاظت کی دعا', ar: 'دعاء الحفظ' },
  evil_eye: { en: 'Protection from Evil Eye', ur: 'نظر بد سے حفاظت', ar: 'الحسد' },
  from_harm: { en: 'Protection from Harm', ur: 'ضرر سے حفاظت', ar: 'من الضر' },
  from_fear: { en: 'Protection from Fear', ur: 'خوف سے حفاظت', ar: 'من الخوف' },
  adhan_response: { en: 'Adhan Response', ur: 'اذان کے جواب', ar: 'رد الأذان' },
  after_prayer: { en: 'After Prayer', ur: 'نماز کے بعد', ar: 'بعد الصلاة' },
  before_prayer: { en: 'Before Prayer', ur: 'نماز سے پہلے', ar: 'قبل الصلاة' },
};

export const QUICK_ACTIONS = [
  { id: 'morning_dua' as const, situation: 'after_waking' as DailyLifeSituationKey, icon: 'sunrise' },
  { id: 'evening_dua' as const, situation: 'before_sleeping' as DailyLifeSituationKey, icon: 'moon' },
  { id: 'travel_dua' as const, situation: 'safe_travel' as DailyLifeSituationKey, icon: 'car' },
  { id: 'home_dua' as const, situation: 'entering_home' as DailyLifeSituationKey, icon: 'home' },
] as const;

export function categoryById(id: DailyLifeCategoryId): DailyLifeCategory | undefined {
  return DAILY_LIFE_CATEGORIES.find((c) => c.id === id);
}
