# AI Islamic Assistant — Architecture

## Overview

The **Ahlulbayt+ AI Assistant** is a context-aware Islamic companion for Shia Ithna Ashari users. It combines **local intelligence** (offline-first) with an optional **remote RAG pipeline** when the API is available.

```
┌─────────────────────────────────────────────────────────────────┐
│                     AiAssistantScreen (UI)                       │
│  Chat · Quick prompts · Citations · Action cards (Dua/Ziyarat)  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    useAiAssistant (hook)                         │
│  sendMessage · streaming state · conversation history            │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌─────────────────┐   ┌──────────────────┐
│ ResponseEngine│   │ ContextAssembler │   │  aiChatApi       │
│ (offline)     │   │ (live app state) │   │  (remote /v1/ai) │
└───────┬───────┘   └────────┬─────────┘   └────────┬─────────┘
        │                    │                      │
        ▼                    ▼                      ▼
 IntentClassifier    Prayer · Calendar      NestJS RAG (future)
 Guardrails           Dua · Ziyarat catalogs SSE streaming
 FAQ knowledge base   Marja · Locale · Hijri
```

## Capabilities

| Capability | Intent | Context sources | Output |
|------------|--------|-----------------|--------|
| **Islamic Q&A** | `islamic_qa` | FAQ corpus, guardrails | Educational answer + citations |
| **Prayer Guidance** | `prayer_guidance` | Prayer engine, marja, next prayer | Times, Jafari rules, reminders |
| **Duas Recommendation** | `dua_recommendation` | Dua catalog, time/occasion | Ranked duas + deep links |
| **Ziyarat Recommendation** | `ziyarat_recommendation` | Ziyarat catalog, calendar | Ranked ziyarat + deep links |
| **Calendar Awareness** | `calendar_awareness` | Shia calendar, Muharram mode | Today/upcoming events |

## Mobile Module Layout

```
mobile/src/features/ai/
├── types.ts
├── constants/
│   ├── intents.ts
│   ├── faqKnowledge.ts      # Offline Q&A snippets
│   └── quickPrompts.ts
├── context/
│   └── buildAssistantContext.ts
├── engine/
│   ├── intentClassifier.ts
│   ├── guardrails.ts
│   └── responseEngine.ts
├── services/
│   └── aiChatApi.ts
├── stores/
│   └── aiChatStore.ts
├── hooks/
│   └── useAiAssistant.ts
├── components/
└── screens/
    └── AiAssistantScreen.tsx
```

## Context Assembly

Every request builds an `AssistantContext` snapshot:

```typescript
interface AssistantContext {
  locale: SupportedLocale;
  marja: MarjaOption;
  hijri: { day: number; month: number; year: number };
  prayer: { next: string; countdown: string; city: string };
  calendar: { todayEvents: string[]; upcoming: string[] };
  muharramActive: boolean;
}
```

Context is injected into responses — never sent to third parties in offline mode.

## Intent Pipeline (Offline)

1. **Guardrails** — block fatwa requests, sectarian abuse, prompt injection patterns
2. **Intent classification** — keyword + pattern scoring (`intentClassifier.ts`)
3. **Context assembly** — pull live prayer/calendar/catalog data
4. **Response generation** — template + data merge (`responseEngine.ts`)
5. **Action cards** — optional navigation targets (DuaReader, ZiyaratReader, Calendar)

## Remote API (Future / Hybrid)

```
POST /v1/ai/chat
{
  "message": "What dua for Thursday night?",
  "context": { "marja": "sistani", "locale": "en", "hijriMonth": 7 },
  "mode": "general"
}

Response: SSE stream (token, citation, done events)
```

Mobile tries remote when online + `aiEnabled`; falls back to `ResponseEngine` on failure.

## Guardrails

- Never issue wajib/mustahab/haram verdicts
- Redirect fiqh rulings to marja official sources
- Honorifics for Ahlul Bayt (as/s/aj)
- Decline political agitation and sectarian attacks
- Educational disclaimer on every session

## Privacy

- Conversations persisted locally (MMKV) — user deletable
- Offline mode: zero network for AI processing
- Remote mode: message content sent only when user opts in (`settings.aiEnabled`)

## Integration Points

| Feature | Integration |
|---------|-------------|
| Home widget | `AiRecommendationsWidget` → `AiAssistant` with seed prompt |
| More tab | `Ask AhlulBayt` entry |
| Onboarding | `aiEnabled`, `aiTopics` from settings store |
| Prayer | `usePrayerTimes` via context builder |
| Calendar | `calendarEngine` upcoming/today events |
| Duas/Ziyarat | Catalog metadata + navigation actions |

## Recommendation Engine

Personalized content scoring (`features/ai/recommendations/`):

| Signal | Weight | Sources |
|--------|--------|---------|
| Date | 35% | Hijri month/day, day of week, hour, Ramadan/Muharram |
| User behavior | 30% | Interests, AI topics, bookmarks, tasbih progress |
| Islamic events | 35% | Today's & upcoming calendar observances |

Categories: **Verse · Dua · Ziyarat · Fasting · Amaal**

Output: ranked feed with reason labels and deep links to readers.

---

| Tier | Limit |
|------|-------|
| Free | 10 queries / 24h |
| Premium | 500 queries / 24h |

Enforced server-side via Redis; client shows `Retry-After` banner.

---

*Version 1.0 · June 2026 · Ahlulbayt+ Platform*
