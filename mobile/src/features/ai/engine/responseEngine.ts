import { DUA_CATALOG } from '@/features/dua/constants/catalog';
import { ZIYARAT_CATALOG } from '@/features/ziyarat/constants/catalog';

import { FAQ_KNOWLEDGE } from '../constants/faqKnowledge';
import { classifyIntent } from './intentClassifier';
import { checkGuardrails } from './guardrails';
import type { AiAction, AiCitation, AiResponseDraft, AssistantContext } from '../types';

function scoreFaq(query: string) {
  const lower = query.toLowerCase();
  let best = FAQ_KNOWLEDGE[0];
  let bestScore = 0;
  for (const entry of FAQ_KNOWLEDGE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) score += kw.length;
    }
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : null;
}

function recommendDuas(ctx: AssistantContext, query: string): AiResponseDraft {
  const lower = query.toLowerCase();
  const isThursday = lower.includes('thursday') || lower.includes('kumail') || lower.includes('خميس');
  const isMorning = lower.includes('morning') || lower.includes('sabah') || lower.includes('صبح');
  const isMuharram = ctx.muharramSeason || lower.includes('muharram') || lower.includes('ashura');

  const picks: typeof DUA_CATALOG = [];
  if (isMuharram) {
    picks.push(...DUA_CATALOG.filter((d) => d.id === 'dua_mashlool' || d.id === 'dua_tawassul'));
  }
  if (isThursday) {
    picks.push(DUA_CATALOG.find((d) => d.id === 'dua_kumail')!);
  }
  if (isMorning) {
    picks.push(DUA_CATALOG.find((d) => d.id === 'dua_sabah')!);
  }
  if (picks.length === 0) {
    picks.push(DUA_CATALOG.find((d) => d.id === 'dua_tawassul')!);
    picks.push(DUA_CATALOG.find((d) => d.id === 'dua_ahad')!);
  }

  const unique = [...new Map(picks.filter(Boolean).map((d) => [d.id, d])).values()].slice(0, 3);

  return {
    intent: 'dua_recommendation',
    bodyKey: 'ai.responses.dua_recommendation',
    bodyParams: { count: unique.length },
    actions: unique.map((d) => ({
      type: 'dua' as const,
      labelKey: d.titles.en,
      payload: { duaId: d.id },
    })),
    citations: [{ id: 'mafatih', title: 'Mafatih al-Jinan', source: 'Duas & Amaal', kind: 'book' }],
  };
}

function recommendZiyarat(ctx: AssistantContext, query: string): AiResponseDraft {
  const lower = query.toLowerCase();
  const isAshura = ctx.muharramDay === 10 || lower.includes('ashura') || lower.includes('عاشور');
  const isArbaeen = lower.includes('arbaeen') || lower.includes('اربعین');
  const isDaily = lower.includes('daily') || lower.includes('every day');

  const ids: string[] = [];
  if (isAshura || ctx.muharramSeason) ids.push('ziyarat_ashura');
  if (isArbaeen) ids.push('ziyarat_arbaeen');
  if (isDaily) ids.push('ziyarat_ale_yasin');
  if (ids.length === 0) ids.push('ziyarat_waritha', 'ziyarat_aminullah');

  const unique = [...new Set(ids)]
    .map((id) => ZIYARAT_CATALOG.find((z) => z.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return {
    intent: 'ziyarat_recommendation',
    bodyKey: 'ai.responses.ziyarat_recommendation',
    bodyParams: { count: unique.length },
    actions: unique.map((z) => ({
      type: 'ziyarat' as const,
      labelKey: z!.titles.en,
      payload: { ziyaratId: z!.id },
    })),
    citations: [{ id: 'kamil', title: 'Kamil al-Ziyarat', source: 'Ziyarat collection', kind: 'book' }],
  };
}

function prayerGuidance(ctx: AssistantContext): AiResponseDraft {
  return {
    intent: 'prayer_guidance',
    bodyKey: 'ai.responses.prayer_guidance',
    bodyParams: {
      next: ctx.nextPrayerName,
      time: ctx.nextPrayerTime,
      countdown: ctx.prayerCountdown,
      city: ctx.cityName,
      marja: ctx.marja,
    },
    actions: [{ type: 'prayer', labelKey: 'ai.actions.openPrayer', payload: { route: 'Prayer' } }],
    citations: [
      { id: 'leva', title: 'Leva Institute Method', source: 'Jafari prayer times' },
    ],
  };
}

function calendarAwareness(ctx: AssistantContext): AiResponseDraft {
  const todayCount = ctx.todayCalendarEvents.length;
  const upcomingCount = ctx.upcomingCalendarEvents.length;

  return {
    intent: 'calendar_awareness',
    bodyKey:
      todayCount > 0 ? 'ai.responses.calendar_today' : 'ai.responses.calendar_upcoming',
    bodyParams: {
      hijri: ctx.hijriFormatted,
      todayCount,
      upcomingCount,
      muharram: ctx.muharramSeason ? 'yes' : 'no',
    },
    actions: [
      { type: 'calendar', labelKey: 'ai.actions.openCalendar', payload: { route: 'Calendar' } },
      ...(ctx.muharramSeason
        ? [{ type: 'muharram' as const, labelKey: 'ai.actions.openMuharram', payload: { route: 'MuharramMode' } }]
        : []),
    ],
    citations: [{ id: 'calendar', title: 'Shia Islamic Calendar', source: 'Bundled observances' }],
  };
}

function islamicQa(query: string, guardFatwa: boolean): AiResponseDraft {
  if (guardFatwa) {
    return {
      intent: 'islamic_qa',
      bodyKey: 'ai.responses.fatwa_redirect',
      bodyParams: {},
      citations: [{ id: 'disclaimer', title: 'Educational only', source: 'Ahlulbayt+ AI policy' }],
    };
  }

  const faq = scoreFaq(query);
  if (faq) {
    return {
      intent: 'islamic_qa',
      bodyKey: faq.bodyKey,
      citations: faq.citationKey
        ? [{ id: faq.id, title: faq.titleKey, source: faq.citationKey }]
        : [{ id: faq.id, title: faq.titleKey }],
    };
  }

  return {
    intent: 'islamic_qa',
    bodyKey: 'ai.responses.general_fallback',
    citations: [{ id: 'quran', title: 'Holy Quran', source: 'Refer to Quran & Ahlul Bayt teachings', kind: 'quran' }],
  };
}

export function generateLocalResponse(
  message: string,
  context: AssistantContext,
): AiResponseDraft {
  const guard = checkGuardrails(message);
  if (guard.blocked) {
    return {
      intent: 'blocked',
      bodyKey: guard.reasonKey ?? 'ai.guardrails.blocked',
      blocked: true,
      blockReasonKey: guard.reasonKey,
    };
  }

  const intent = classifyIntent(message);

  switch (intent) {
    case 'greeting':
      return {
        intent: 'greeting',
        bodyKey: 'ai.responses.greeting',
        bodyParams: { hijri: context.hijriFormatted },
      };
    case 'prayer_guidance':
      return prayerGuidance(context);
    case 'dua_recommendation':
      return recommendDuas(context, message);
    case 'ziyarat_recommendation':
      return recommendZiyarat(context, message);
    case 'calendar_awareness':
      return calendarAwareness(context);
    case 'islamic_qa':
    default:
      return islamicQa(message, guard.isFatwaRequest);
  }
}
