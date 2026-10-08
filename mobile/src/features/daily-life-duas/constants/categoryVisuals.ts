import type { DailyLifeCategoryId, DailyLifeSituationKey, LocalizedText } from '../types';

export const CATEGORY_ICON_GLYPH: Record<string, string> = {
  home: '🏠',
  moon: '🌙',
  droplet: '💧',
  car: '🚗',
  utensils: '🍽',
  heart: '❤',
  briefcase: '💼',
  activity: '🩺',
  shield: '🛡',
  pray: '🕌',
};

export const CATEGORY_TINT: Record<DailyLifeCategoryId, string> = {
  home: 'rgba(31, 92, 82, 0.14)',
  sleep: 'rgba(74, 111, 165, 0.14)',
  bathroom: 'rgba(61, 155, 138, 0.12)',
  travel: 'rgba(184, 149, 107, 0.16)',
  food: 'rgba(196, 169, 98, 0.16)',
  family: 'rgba(123, 75, 106, 0.14)',
  work: 'rgba(45, 106, 79, 0.14)',
  health: 'rgba(155, 125, 75, 0.14)',
  protection: 'rgba(61, 74, 107, 0.14)',
  prayer: 'rgba(31, 92, 82, 0.12)',
};

export const CATEGORY_DESCRIPTIONS: Record<DailyLifeCategoryId, LocalizedText> = {
  home: {
    en: 'Supplications when entering or leaving your home.',
    ur: 'گھر میں داخل ہونے اور گھر سے نکلنے کی دعائیں۔',
    ar: 'أدعية دخول المنزل والخروج منه.',
  },
  sleep: {
    en: 'Remembrance before sleep and upon waking.',
    ur: 'سونے سے پہلے اور جاگنے کے بعد کے اذکار۔',
    ar: 'أذكار قبل النوم وبعد الاستيقاظ.',
  },
  bathroom: {
    en: 'Etiquette and duas for entering and leaving the bathroom.',
    ur: 'بیت الخلا میں داخل ہونے اور نکلنے کی دعائیں۔',
    ar: 'أدعية دخول الخلاء والخروج منه.',
  },
  travel: {
    en: 'Protection and blessings for journeys near and far.',
    ur: 'قریبی اور دور دراز سفر کی دعائیں۔',
    ar: 'أدعية السفر والحفظ في الطريق.',
  },
  food: {
    en: 'Gratitude and remembrance around meals and drink.',
    ur: 'کھانے پینے سے پہلے اور بعد کی دعائیں۔',
    ar: 'أدعية قبل الطعام وبعده وعند الشرب.',
  },
  family: {
    en: 'Duas for marriage, spouse, and children.',
    ur: 'شادی، شریکِ حیات اور اولاد کی دعائیں۔',
    ar: 'أدعية الزواج والزوج والأولاد.',
  },
  work: {
    en: 'Seeking barakah, rizq, and success in your work.',
    ur: 'کام، رزق اور کامیابی کی دعائیں۔',
    ar: 'أدعية العمل والرزق والتوفيق.',
  },
  health: {
    en: 'Healing, visiting the sick, and protection of health.',
    ur: 'بیماری، عیادت اور صحت کی دعائیں۔',
    ar: 'أدعية المرض وعيادة المريض والحفظ.',
  },
  protection: {
    en: 'Seeking refuge from harm, fear, and the evil eye.',
    ur: 'ضرر، خوف اور نظر بد سے حفاظت کی دعائیں۔',
    ar: 'أدعية الحفظ من الضر والخوف والحسد.',
  },
  prayer: {
    en: 'Duas connected to salah and the adhan.',
    ur: 'نماز اور اذان سے متعلق دعائیں۔',
    ar: 'أدعية مرتبطة بالصلاة والأذان.',
  },
};

export const SITUATION_ICONS: Partial<Record<DailyLifeSituationKey, string>> = {
  entering_home: '🚪',
  leaving_home: '🚶',
  before_sleeping: '😴',
  after_waking: '☀️',
  entering_bathroom: '🚿',
  leaving_bathroom: '✓',
  starting_journey: '🧳',
  entering_vehicle: '🚗',
  safe_travel: '🛡',
  before_eating: '🍽',
  after_eating: '🙏',
  drinking_water: '💧',
  before_marriage: '💍',
  for_spouse: '💑',
  for_children: '👶',
  before_work: '💼',
  seeking_rizq: '🌾',
  success_in_work: '⭐',
  during_illness: '🩺',
  visiting_sick: '🤲',
  protection_health: '❤',
  evil_eye: '👁',
  from_harm: '🛡',
  from_fear: '🕊',
  adhan_response: '📢',
  after_prayer: '🕌',
  before_prayer: '🧎',
};
