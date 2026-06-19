/**
 * Daily Life Duas catalog — metadata only.
 * Arabic bodies ship via verified Mafatih import (see docs/architecture/DAILY_LIFE_DUAS.md).
 */

import type {
  DailyLifeCategoryId,
  DailyLifeDuaId,
  DailyLifeDuaMeta,
  DailyLifeSituationKey,
  QuickActionId,
} from '../types';
import { DAILY_LIFE_CATEGORIES, SITUATION_LABELS } from './categories';

const MAFATIH = {
  en: 'Mafatih al-Jinan',
  ur: 'مفاتیح الجنان',
  ar: 'مفاتيح الجنان',
};

function slugFromSituation(key: DailyLifeSituationKey): string {
  return key.replace(/_/g, '-');
}

function categoriesForSituation(key: DailyLifeSituationKey): DailyLifeCategoryId[] {
  return DAILY_LIFE_CATEGORIES.filter((c) => c.situations.includes(key)).map((c) => c.id);
}

interface SituationSpec {
  situation: DailyLifeSituationKey;
  tags: string[];
  mafatihRef?: string;
  quickAction?: QuickActionId;
  estimatedSeconds?: number;
  repeatCount?: number;
  description?: { en: string; ur: string };
}

const SITUATIONS: SituationSpec[] = [
  { situation: 'entering_home', tags: ['home', 'daily'], mafatihRef: 'daily-life/entering-home', quickAction: 'home_dua' },
  { situation: 'leaving_home', tags: ['home', 'daily', 'travel'], mafatihRef: 'daily-life/leaving-home' },
  { situation: 'before_sleeping', tags: ['sleep', 'night'], mafatihRef: 'daily-life/before-sleep', quickAction: 'evening_dua' },
  { situation: 'after_waking', tags: ['sleep', 'morning'], mafatihRef: 'daily-life/after-waking', quickAction: 'morning_dua' },
  { situation: 'entering_bathroom', tags: ['bathroom', 'adab'], mafatihRef: 'daily-life/entering-bathroom' },
  { situation: 'leaving_bathroom', tags: ['bathroom', 'adab'], mafatihRef: 'daily-life/leaving-bathroom' },
  { situation: 'starting_journey', tags: ['travel'], mafatihRef: 'daily-life/starting-journey' },
  { situation: 'entering_vehicle', tags: ['travel'], mafatihRef: 'daily-life/entering-vehicle' },
  { situation: 'safe_travel', tags: ['travel', 'protection'], mafatihRef: 'daily-life/safe-travel', quickAction: 'travel_dua', repeatCount: 1 },
  { situation: 'before_eating', tags: ['food', 'adab'], mafatihRef: 'daily-life/before-eating' },
  { situation: 'after_eating', tags: ['food', 'adab'], mafatihRef: 'daily-life/after-eating' },
  { situation: 'drinking_water', tags: ['food'], mafatihRef: 'daily-life/drinking-water' },
  { situation: 'before_marriage', tags: ['family', 'marriage'], mafatihRef: 'daily-life/before-marriage' },
  { situation: 'for_spouse', tags: ['family'], mafatihRef: 'daily-life/for-spouse' },
  { situation: 'for_children', tags: ['family'], mafatihRef: 'daily-life/for-children' },
  { situation: 'before_work', tags: ['work'], mafatihRef: 'daily-life/before-work' },
  { situation: 'seeking_rizq', tags: ['work', 'rizq'], mafatihRef: 'daily-life/seeking-rizq' },
  { situation: 'success_in_work', tags: ['work'], mafatihRef: 'daily-life/success-in-work' },
  { situation: 'during_illness', tags: ['health'], mafatihRef: 'daily-life/during-illness' },
  { situation: 'visiting_sick', tags: ['health'], mafatihRef: 'daily-life/visiting-sick' },
  { situation: 'protection_health', tags: ['health', 'protection'], mafatihRef: 'daily-life/protection-health' },
  { situation: 'evil_eye', tags: ['protection'], mafatihRef: 'daily-life/evil-eye', repeatCount: 3 },
  { situation: 'from_harm', tags: ['protection'], mafatihRef: 'daily-life/from-harm' },
  { situation: 'from_fear', tags: ['protection'], mafatihRef: 'daily-life/from-fear' },
  { situation: 'adhan_response', tags: ['prayer', 'adhan'], mafatihRef: 'daily-life/adhan-response' },
  { situation: 'after_prayer', tags: ['prayer', 'taqibat'], mafatihRef: 'daily-life/after-prayer' },
  { situation: 'before_prayer', tags: ['prayer'], mafatihRef: 'daily-life/before-prayer' },
];

function buildMeta(spec: SituationSpec): DailyLifeDuaMeta {
  const labels = SITUATION_LABELS[spec.situation];
  const id = `dl_${spec.situation}` as DailyLifeDuaId;

  return {
    id,
    slug: slugFromSituation(spec.situation),
    situationKey: spec.situation,
    categoryIds: categoriesForSituation(spec.situation),
    titles: labels,
    description: spec.description ?? {
      en: `Supplication for ${labels.en.toLowerCase()} — from verified sources.`,
      ur: `${labels.ur} — تصدیق شدہ مآخذ سے`,
    },
    tags: spec.tags,
    quickAction: spec.quickAction,
    hasAudio: false,
    repeatCount: spec.repeatCount,
    estimatedSeconds: spec.estimatedSeconds ?? 45,
    contentStatus: 'metadata_only',
    mafatihRef: spec.mafatihRef,
    attribution: {
      sourceBook: MAFATIH,
      narrator: {
        en: 'See source citation',
        ur: 'ماخذ دیکھیں',
      },
      sourceRef: spec.mafatihRef,
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

export const DAILY_LIFE_CATALOG: DailyLifeDuaMeta[] = SITUATIONS.map(buildMeta);

export function getDailyLifeMeta(id: DailyLifeDuaId): DailyLifeDuaMeta | undefined {
  return DAILY_LIFE_CATALOG.find((d) => d.id === id);
}

export function getDailyLifeBySituation(
  situation: DailyLifeSituationKey,
): DailyLifeDuaMeta | undefined {
  return DAILY_LIFE_CATALOG.find((d) => d.situationKey === situation);
}

export function getDailyLifeBySlug(slug: string): DailyLifeDuaMeta | undefined {
  return DAILY_LIFE_CATALOG.find((d) => d.slug === slug);
}

export function listByCategory(categoryId: DailyLifeCategoryId): DailyLifeDuaMeta[] {
  return DAILY_LIFE_CATALOG.filter((d) => d.categoryIds.includes(categoryId));
}

/** Deterministic daily pick from catalog rotation. */
export function pickForDayIndex(dayIndex: number): DailyLifeDuaMeta {
  const sorted = [...DAILY_LIFE_CATALOG].sort((a, b) => a.slug.localeCompare(b.slug));
  return sorted[dayIndex % sorted.length]!;
}

/** Pseudo-random pick stable for a given calendar day. */
export function pickRandomForDay(date: Date = new Date()): DailyLifeDuaMeta {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const seed = dayOfYear * 31 + date.getDay();
  const idx = seed % DAILY_LIFE_CATALOG.length;
  return DAILY_LIFE_CATALOG[idx]!;
}

export function getQuickActionDua(actionId: QuickActionId): DailyLifeDuaMeta | undefined {
  return DAILY_LIFE_CATALOG.find((d) => d.quickAction === actionId);
}
