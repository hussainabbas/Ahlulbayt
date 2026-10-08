import type { AiIntent } from '../types';

export const INTENT_PATTERNS: Record<AiIntent, RegExp[]> = {
  greeting: [
    /^(hi|hello|salam|assalam|salaam|hey|good morning|good evening)/i,
    /^(السلام|مرحب|أهلا)/,
    /^(سلام|السلام علیکم)/,
  ],
  prayer_guidance: [
    /\b(pray|prayer|fajr|dhuhr|asr|maghrib|isha|adhan|azan|wudu|ghusl|imsak|midnight)\b/i,
    /\b(namaz|namaz|وقت الصلاة|نماز|اذان)\b/i,
    /\b(jafari|leva|marja|qibla direction for prayer)\b/i,
  ],
  dua_recommendation: [
    /\b(dua|duas|supplication|recommend.*dua|which dua|what dua)\b/i,
    /\b(دعا|دعاء|دعائیں)\b/,
  ],
  ziyarat_recommendation: [
    /\b(ziyarat|visit|ashura ziyarat|arbaeen|warith|recommend.*ziyarat)\b/i,
    /\b(زیارت|زيارة)\b/,
  ],
  calendar_awareness: [
    /\b(muharram|ashura|arbaeen|ghadeer|wiladat|shahadat|hijri|calendar|event|observance)\b/i,
    /\b(محرم|عاشور|تقويم|کیلنڈر|تقریب)\b/,
    /\b(when is|what today|upcoming|this month)\b/i,
  ],
  islamic_qa: [
    /\b(who is|what is|why|explain|tell me|history|imam|prophet|karbala|ahlul bayt)\b/i,
    /\b(کیا|کون|کیوں|تاریخ)\b/,
  ],
  blocked: [],
};

export const INTENT_PRIORITY: AiIntent[] = [
  'blocked',
  'prayer_guidance',
  'dua_recommendation',
  'ziyarat_recommendation',
  'calendar_awareness',
  'greeting',
  'islamic_qa',
];
