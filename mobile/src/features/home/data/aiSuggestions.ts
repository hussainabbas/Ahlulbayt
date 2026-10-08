import type { AiTopicOption, InterestOption } from '@/features/onboarding/types';

import type { AiRecommendation } from '../types';

const ALL_SUGGESTIONS: AiRecommendation[] = [
  {
    id: 'quran_reflection',
    titleKey: 'home.ai.quranReflection',
    subtitleKey: 'home.ai.quranReflectionSub',
    topic: 'quran_reflection',
    icon: '📖',
  },
  {
    id: 'imam_husayn',
    titleKey: 'home.ai.imamHusayn',
    subtitleKey: 'home.ai.imamHusaynSub',
    topic: 'imam_biographies',
    icon: '🕯️',
  },
  {
    id: 'daily_amaal',
    titleKey: 'home.ai.dailyAmaal',
    subtitleKey: 'home.ai.dailyAmaalSub',
    topic: 'daily_guidance',
    icon: '✨',
  },
  {
    id: 'karbala_history',
    titleKey: 'home.ai.karbalaHistory',
    subtitleKey: 'home.ai.karbalaHistorySub',
    topic: 'history',
    icon: '🏛️',
  },
  {
    id: 'lecture_summary',
    titleKey: 'home.ai.lectureSummary',
    subtitleKey: 'home.ai.lectureSummarySub',
    topic: 'lectures',
    icon: '🎙️',
  },
  {
    id: 'prayer_guidance',
    titleKey: 'home.ai.prayerGuidance',
    subtitleKey: 'home.ai.prayerGuidanceSub',
    topic: 'daily_guidance',
    icon: '🕌',
  },
  {
    id: 'dua_meaning',
    titleKey: 'home.ai.duaMeaning',
    subtitleKey: 'home.ai.duaMeaningSub',
    topic: 'quran_reflection',
    icon: '🤲',
  },
  {
    id: 'ziyarat_guide',
    titleKey: 'home.ai.ziyaratGuide',
    subtitleKey: 'home.ai.ziyaratGuideSub',
    topic: 'history',
    icon: '🌙',
  },
];

const INTEREST_TOPIC_MAP: Partial<Record<InterestOption, string[]>> = {
  quran: ['quran_reflection', 'dua_meaning'],
  duas: ['dua_meaning', 'daily_amaal'],
  ziyarat: ['ziyarat_guide', 'imam_husayn'],
  calendar: ['daily_amaal', 'karbala_history'],
  prayer: ['prayer_guidance', 'daily_amaal'],
  learning: ['lecture_summary', 'karbala_history'],
  muharram: ['imam_husayn', 'karbala_history'],
  community: ['lecture_summary', 'daily_amaal'],
};

export function getAiRecommendations(
  interests: InterestOption[],
  aiTopics: AiTopicOption[],
  isMuharram: boolean,
  limit = 3,
): AiRecommendation[] {
  const scored = new Map<string, number>();

  for (const interest of interests) {
    const ids = INTEREST_TOPIC_MAP[interest] ?? [];
    for (const id of ids) {
      scored.set(id, (scored.get(id) ?? 0) + 2);
    }
  }

  for (const topic of aiTopics) {
    for (const suggestion of ALL_SUGGESTIONS) {
      if (suggestion.topic === topic) {
        scored.set(suggestion.id, (scored.get(suggestion.id) ?? 0) + 3);
      }
    }
  }

  if (isMuharram) {
    scored.set('imam_husayn', (scored.get('imam_husayn') ?? 0) + 5);
    scored.set('karbala_history', (scored.get('karbala_history') ?? 0) + 4);
  }

  const ranked = ALL_SUGGESTIONS.filter((s) => scored.has(s.id))
    .sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0));

  if (ranked.length >= limit) return ranked.slice(0, limit);

  const fallback = ALL_SUGGESTIONS.filter((s) => !ranked.includes(s));
  return [...ranked, ...fallback].slice(0, limit);
}
