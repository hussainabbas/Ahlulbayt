import { Injectable } from '@nestjs/common';

import { DUAS_CATALOG } from '../duas/data/duas-catalog';
import { ZIYARAT_CATALOG } from '../ziyarat/data/ziyarat-catalog';
import { AiChatDto, AiResponsePayload } from './dto/ai.dto';

const BLOCKED_PATTERNS = [
  /\b(fatwa|legal ruling)\b/i,
  /\b(kill|violence|suicide)\b/i,
];

const FAQ: Array<{ keywords: string[]; bodyKey: string; intent: string }> = [
  {
    keywords: ['ghadeer', 'ghadir', 'غدیر'],
    bodyKey: 'ai.responses.ghadeer',
    intent: 'islamic_qa',
  },
  {
    keywords: ['ashura', 'karbala', 'عاشور', 'کربلا'],
    bodyKey: 'ai.responses.ashura',
    intent: 'islamic_qa',
  },
  {
    keywords: ['wiladat', 'birth', 'ولادت'],
    bodyKey: 'ai.responses.wiladat',
    intent: 'islamic_qa',
  },
  {
    keywords: ['shahadat', 'martyrdom', 'شهادت'],
    bodyKey: 'ai.responses.shahadat',
    intent: 'islamic_qa',
  },
];

@Injectable()
export class AiResponseEngine {
  generate(dto: AiChatDto): AiResponsePayload {
    const query = dto.message.trim();
    const lower = query.toLowerCase();
    const ctx = dto.context;

    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(lower)) {
        return {
          intent: 'blocked',
          bodyKey: 'ai.responses.blocked',
          blocked: true,
          blockReasonKey: 'ai.blockReasons.sensitive',
        };
      }
    }

    if (/^(salam|assalam|hello|hi|السلام)/i.test(lower)) {
      return {
        intent: 'greeting',
        bodyKey: 'ai.responses.greeting',
        bodyParams: { hijri: ctx.hijriFormatted },
      };
    }

    const intent = dto.intentHint ?? this.classifyIntent(lower, ctx);

    switch (intent) {
      case 'prayer_guidance':
        return this.prayerGuidance(ctx);
      case 'dua_recommendation':
        return this.duaRecommendation(ctx, lower);
      case 'ziyarat_recommendation':
        return this.ziyaratRecommendation(ctx, lower);
      case 'calendar_awareness':
        return this.calendarAwareness(ctx);
      default:
        return this.islamicQa(lower, ctx);
    }
  }

  private classifyIntent(lower: string, ctx: AiChatDto['context']): string {
    if (/prayer|salah|namaz|صلاة|نماز|wudu|ghusl/.test(lower)) return 'prayer_guidance';
    if (/dua|supplication|دعاء|دعا/.test(lower)) return 'dua_recommendation';
    if (/ziyarat|ziarat|زيارة|زیارت/.test(lower)) return 'ziyarat_recommendation';
    if (/calendar|event|muharram|hijri|تقويم|تقویم/.test(lower) || ctx.muharramSeason) {
      return 'calendar_awareness';
    }
    return 'islamic_qa';
  }

  private prayerGuidance(ctx: AiChatDto['context']): AiResponsePayload {
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
      citations: [{ id: 'leva', title: 'Leva Institute Method', source: 'Jafari prayer times' }],
    };
  }

  private duaRecommendation(ctx: AiChatDto['context'], lower: string): AiResponsePayload {
    const picks = [];
    if (ctx.muharramSeason || lower.includes('muharram')) {
      picks.push(DUAS_CATALOG.find((d) => d.id === 'dua_mashlool')!);
    }
    if (lower.includes('thursday') || lower.includes('kumail')) {
      picks.push(DUAS_CATALOG.find((d) => d.id === 'dua_kumail')!);
    }
    if (lower.includes('morning') || lower.includes('sabah')) {
      picks.push(DUAS_CATALOG.find((d) => d.id === 'dua_sabah')!);
    }
    const unique = [...new Map(picks.filter(Boolean).map((d) => [d!.id, d!])).values()];
    if (unique.length === 0) {
      unique.push(DUAS_CATALOG.find((d) => d.id === 'dua_tawassul')!);
    }

    return {
      intent: 'dua_recommendation',
      bodyKey: 'ai.responses.dua_recommendation',
      bodyParams: { count: unique.length },
      actions: unique.slice(0, 3).map((d) => ({
        type: 'dua',
        labelKey: d.titles.en,
        payload: { duaId: d.id },
      })),
      citations: [{ id: 'mafatih', title: 'Mafatih al-Jinan', source: 'Duas & Amaal' }],
    };
  }

  private ziyaratRecommendation(ctx: AiChatDto['context'], lower: string): AiResponsePayload {
    const ids: string[] = [];
    if (ctx.muharramDay === 10 || ctx.muharramSeason || lower.includes('ashura')) {
      ids.push('ziyarat_ashura');
    }
    if (lower.includes('arbaeen')) ids.push('ziyarat_arbaeen');
    if (lower.includes('daily')) ids.push('ziyarat_ale_yasin');
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
        type: 'ziyarat',
        labelKey: z!.titles.en,
        payload: { ziyaratId: z!.id },
      })),
      citations: [{ id: 'kamil', title: 'Kamil al-Ziyarat', source: 'Ziyarat collection' }],
    };
  }

  private calendarAwareness(ctx: AiChatDto['context']): AiResponsePayload {
    const todayCount = ctx.todayCalendarEvents.length;
    return {
      intent: 'calendar_awareness',
      bodyKey: todayCount > 0 ? 'ai.responses.calendar_today' : 'ai.responses.calendar_upcoming',
      bodyParams: {
        hijri: ctx.hijriFormatted,
        todayCount,
        upcomingCount: ctx.upcomingCalendarEvents.length,
      },
      actions: ctx.muharramSeason
        ? [{ type: 'muharram', labelKey: 'ai.actions.openMuharram', payload: { route: 'MuharramMode' } }]
        : [{ type: 'calendar', labelKey: 'ai.actions.openCalendar', payload: { route: 'Calendar' } }],
    };
  }

  private islamicQa(lower: string, ctx: AiChatDto['context']): AiResponsePayload {
    let best = FAQ[0]!;
    let bestScore = 0;
    for (const entry of FAQ) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (lower.includes(kw.toLowerCase())) score += kw.length;
      }
      if (score > bestScore) {
        best = entry;
        bestScore = score;
      }
    }

    if (bestScore > 0) {
      return {
        intent: best.intent,
        bodyKey: best.bodyKey,
        bodyParams: { marja: ctx.marja },
        citations: [{ id: 'ahlebayt', title: 'AhlulBayt+ Knowledge Base' }],
      };
    }

    return {
      intent: 'islamic_qa',
      bodyKey: 'ai.responses.general',
      bodyParams: { marja: ctx.marja },
      citations: [{ id: 'ahlebayt', title: 'AhlulBayt+ Knowledge Base' }],
    };
  }
}
