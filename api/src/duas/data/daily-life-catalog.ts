/**
 * Daily Life Duas API catalog — metadata mirror of mobile bundle.
 * Arabic bodies served via /:slug/body after verified import.
 */

export interface DailyLifeCatalogEntry {
  id: string;
  slug: string;
  situationKey: string;
  categoryIds: string[];
  titles: { en: string; ur: string; ar?: string };
  description: { en: string; ur: string };
  tags: string[];
  quickAction?: string;
  hasAudio: boolean;
  repeatCount?: number;
  estimatedSeconds: number;
  contentStatus: 'metadata_only' | 'bundled' | 'synced';
  mafatihRef?: string;
  attribution: {
    sourceBook: { en: string; ur: string; ar?: string };
    narrator?: { en: string; ur: string };
    sourceRef?: string;
    citations: Array<{
      source: string;
      scholar?: string;
      verified: boolean;
      note?: string;
    }>;
  };
}

const MAFATIH = { en: 'Mafatih al-Jinan', ur: 'مفاتیح الجنان', ar: 'مفاتيح الجنان' };

function entry(
  situationKey: string,
  categoryIds: string[],
  tags: string[],
  opts: Partial<DailyLifeCatalogEntry> = {},
): DailyLifeCatalogEntry {
  const slug = situationKey.replace(/_/g, '-');
  const titleEn = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: `dl_${situationKey}`,
    slug,
    situationKey,
    categoryIds,
    titles: opts.titles ?? { en: titleEn, ur: titleEn, ar: titleEn },
    description: opts.description ?? {
      en: `Supplication for ${titleEn.toLowerCase()}.`,
      ur: `${titleEn} — تصدیق شدہ مآخذ سے`,
    },
    tags,
    quickAction: opts.quickAction,
    hasAudio: false,
    repeatCount: opts.repeatCount,
    estimatedSeconds: opts.estimatedSeconds ?? 45,
    contentStatus: 'metadata_only',
    mafatihRef: opts.mafatihRef ?? `daily-life/${slug}`,
    attribution: {
      sourceBook: MAFATIH,
      narrator: { en: 'See source citation', ur: 'ماخذ دیکھیں' },
      sourceRef: opts.mafatihRef,
      citations: [
        {
          source: 'Mafatih al-Jinan',
          scholar: 'Shaykh Abbas Qummi',
          verified: false,
          note: 'Pending licensed import and scholar review',
        },
      ],
    },
  };
}

export const DAILY_LIFE_CATALOG: DailyLifeCatalogEntry[] = [
  entry('entering_home', ['home'], ['home', 'daily'], { quickAction: 'home_dua', titles: { en: 'Entering Home', ur: 'گھر میں داخل ہوتے وقت' } }),
  entry('leaving_home', ['home'], ['home', 'travel'], { titles: { en: 'Leaving Home', ur: 'گھر سے نکلتے وقت' } }),
  entry('before_sleeping', ['sleep'], ['sleep', 'night'], { quickAction: 'evening_dua', titles: { en: 'Before Sleeping', ur: 'سونے سے پہلے' } }),
  entry('after_waking', ['sleep'], ['sleep', 'morning'], { quickAction: 'morning_dua', titles: { en: 'After Waking Up', ur: 'جاگنے کے بعد' } }),
  entry('entering_bathroom', ['bathroom'], ['bathroom'], { titles: { en: 'Entering Bathroom', ur: 'بیت الخلا میں داخل ہوتے وقت' } }),
  entry('leaving_bathroom', ['bathroom'], ['bathroom'], { titles: { en: 'Leaving Bathroom', ur: 'بیت الخلا سے نکلتے وقت' } }),
  entry('starting_journey', ['travel'], ['travel'], { titles: { en: 'Starting Journey', ur: 'سفر شروع' } }),
  entry('entering_vehicle', ['travel'], ['travel'], { titles: { en: 'Entering Vehicle', ur: 'سواری میں سوار ہوتے وقت' } }),
  entry('safe_travel', ['travel'], ['travel', 'protection'], { quickAction: 'travel_dua', titles: { en: 'Safe Travel Dua', ur: 'محفوظ سفر کی دعا' } }),
  entry('before_eating', ['food'], ['food'], { titles: { en: 'Before Eating', ur: 'کھانے سے پہلے' } }),
  entry('after_eating', ['food'], ['food'], { titles: { en: 'After Eating', ur: 'کھانے کے بعد' } }),
  entry('drinking_water', ['food'], ['food'], { titles: { en: 'Drinking Water', ur: 'پانی پیتے وقت' } }),
  entry('before_marriage', ['family'], ['family'], { titles: { en: 'Before Marriage', ur: 'شادی سے پہلے' } }),
  entry('for_spouse', ['family'], ['family'], { titles: { en: 'For Spouse', ur: 'شریکِ حیات کے لیے' } }),
  entry('for_children', ['family'], ['family'], { titles: { en: 'For Children', ur: 'اولاد کے لیے' } }),
  entry('before_work', ['work'], ['work'], { titles: { en: 'Before Work', ur: 'کام سے پہلے' } }),
  entry('seeking_rizq', ['work'], ['work', 'rizq'], { titles: { en: 'Seeking Rizq', ur: 'رزق کی دعا' } }),
  entry('success_in_work', ['work'], ['work'], { titles: { en: 'Success in Work', ur: 'کام میں کامیابی' } }),
  entry('during_illness', ['health'], ['health'], { titles: { en: 'During Illness', ur: 'بیماری میں' } }),
  entry('visiting_sick', ['health'], ['health'], { titles: { en: 'Visiting Sick Person', ur: 'مریض عیادت' } }),
  entry('protection_health', ['health', 'protection'], ['health'], { titles: { en: 'Protection Dua', ur: 'حفاظت کی دعا' } }),
  entry('evil_eye', ['protection'], ['protection'], { repeatCount: 3, titles: { en: 'Protection from Evil Eye', ur: 'نظر بد سے حفاظت' } }),
  entry('from_harm', ['protection'], ['protection'], { titles: { en: 'Protection from Harm', ur: 'ضرر سے حفاظت' } }),
  entry('from_fear', ['protection'], ['protection'], { titles: { en: 'Protection from Fear', ur: 'خوف سے حفاظت' } }),
  entry('adhan_response', ['prayer'], ['prayer'], { titles: { en: 'Adhan Response', ur: 'اذان کے جواب' } }),
  entry('after_prayer', ['prayer'], ['prayer'], { titles: { en: 'After Prayer', ur: 'نماز کے بعد' } }),
  entry('before_prayer', ['prayer'], ['prayer'], { titles: { en: 'Before Prayer', ur: 'نماز سے پہلے' } }),
];

export const DAILY_LIFE_CATEGORIES = [
  { slug: 'home', titles: { en: 'Home', ur: 'گھر' }, icon: 'home', sortOrder: 1 },
  { slug: 'sleep', titles: { en: 'Sleep', ur: 'نیند' }, icon: 'moon', sortOrder: 2 },
  { slug: 'bathroom', titles: { en: 'Bathroom', ur: 'بیت الخلا' }, icon: 'droplet', sortOrder: 3 },
  { slug: 'travel', titles: { en: 'Travel', ur: 'سفر' }, icon: 'car', sortOrder: 4 },
  { slug: 'food', titles: { en: 'Food', ur: 'کھانا' }, icon: 'utensils', sortOrder: 5 },
  { slug: 'family', titles: { en: 'Family', ur: 'خاندان' }, icon: 'heart', sortOrder: 6 },
  { slug: 'work', titles: { en: 'Work', ur: 'کام' }, icon: 'briefcase', sortOrder: 7 },
  { slug: 'health', titles: { en: 'Health', ur: 'صحت' }, icon: 'activity', sortOrder: 8 },
  { slug: 'protection', titles: { en: 'Protection', ur: 'حفاظت' }, icon: 'shield', sortOrder: 9 },
  { slug: 'prayer', titles: { en: 'Prayer Related', ur: 'نماز' }, icon: 'pray', sortOrder: 10 },
];

export function pickTodaysDua(date = new Date()): DailyLifeCatalogEntry {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayIndex = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const sorted = [...DAILY_LIFE_CATALOG].sort((a, b) => a.slug.localeCompare(b.slug));
  return sorted[dayIndex % sorted.length]!;
}
