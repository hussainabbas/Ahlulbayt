# Islamic Calendar AI Engine

Mobile-first orchestrator that unifies Hijri date detection, Shia calendar events, seasonal worship context, content recommendations, home widget priority, and notification planning.

## Location

```
mobile/src/core/islamic-calendar-ai/
├── types.ts
├── index.ts
├── data/
│   └── eventContentCatalog.ts   # Event → dua/ziyarat/amaal links + citations
└── engine/
    ├── recommendationBuilder.ts
    ├── homeWidgetPlan.ts
    └── notificationPlanner.ts
```

## Related modules (do not duplicate)

| Module | Role |
|--------|------|
| `features/calendar/` | Hijri math (`hijriUtils`), bundled `shiaEvents`, `calendarEngine` queries |
| `core/islamic-events/` | Season resolution, Muharram/Ramadan timelines, home priority cards |
| `features/muharram/` | Muharram Mode screen, daily content, theme/icon bootstraps |
| `features/notifications/` | `NotificationEngine`, `planEventNotifications`, catalog rules |
| `features/ai/recommendations/` | Personalized scoring (interests, bookmarks) |

**Calendar AI** sits above these: it reads calendar events, enriches them with worship content IDs and scholarly references, and exposes a single snapshot API for dashboard and notifications.

## Public API

```ts
import {
  getIslamicCalendarAiSnapshot,
  getTodayContext,
  getTodayEvents,
  getTodayRecommendations,
  getHomeWidgetPlan,
  planCalendarAiNotifications,
  scheduleTodayNotifications,
} from '@/core/islamic-calendar-ai';

const snapshot = getIslamicCalendarAiSnapshot(new Date(), 'en');
// snapshot.context       → IslamicDateContext
// snapshot.todayEvents   → CalendarEvent[]
// snapshot.recommendations → ContentRecommendation[]
// snapshot.homeWidgetPlan  → HomeWidgetId[] (ordered)
```

### Example: 21 Ramadan (Shahadat Imam Ali)

```ts
const { todayEvents, recommendations } = getIslamicCalendarAiSnapshot(
  hijriDateForRamadan21,
  'en',
);

// todayEvents[0].id === 'shahadat_imam_ali'
// recommendations include:
//   - MasoomeenProfile (masoom_ali)
//   - DuaReader (dua_tawassul)
//   - ZiyaratReader (ziyarat_jamia_kabira)
//   - Calendar amaal + history narrative
// Each item has references[] or unverified: true
```

## Seeded events (content catalog)

| Event ID | Hijri | Content linked |
|----------|-------|----------------|
| `ashura` | 1/10 | Ziyarat Ashura, Muharram Mode, amaal |
| `tasua` | 1/9 | Ziyarat Waritha, Muharram timeline |
| `arbaeen` | 2/20 | Ziyarat Arbaeen, amaal |
| `shahadat_imam_ali` | 9/21 | Imam Ali profile, Dua Tawassul, Ziyarat Jamia, amaal |
| `laylat_qadr` | 9/23 | Dua Kumail, qadr amaal |
| `eid_fitr` | 10/1 | Eid guidance |
| `eid_adha` | 12/10 | Eid guidance |
| `ghadeer` | 12/18 | Dua Nudba, Ghadeer amaal |
| `mubahila` | 12/24 | Mubahila amaal + history |
| `wiladat_imam_mahdi` | 8/15 | Imam Mahdi profile, Dua Ahad |

All other dates still surface via `features/calendar/data/shiaEvents.ts` and `core/islamic-events/catalog/timelineCatalog.ts` (Muharram days 1–10).

## Home dashboard integration

- `useDashboard` calls `getIslamicCalendarAiSnapshot(now, locale)` alongside `getIslamicEventsSnapshot`.
- **`CalendarTodayWidget`** renders when `homeWidgetPlan` includes `calendar_today` and there are events or recommendations.
- **`DailyTimelineWidget`**, **`SeasonalPrioritiesWidget`**, **`FeaturedSeasonalWidget`** remain driven by `core/islamic-events` for season-wide UX.
- On high-observance days (Muharram ≤10, Ramadan, Eids, Ghadeer, Mubahila, Arbaeen), `calendar_today` is prioritized near the top.

## Notifications

`planCalendarAiNotifications` is merged in `planAllNotifications` (`schedulePlanner.ts`):

- **Day-of**: morning digest with deep link to top `ContentRecommendation` (dua, ziyarat, profile).
- **Eve**: evening reminder for upcoming seeded events with content catalog entries.

Complements existing `planEventNotifications` (generic Calendar deep links) without replacing them.

`scheduleTodayNotifications()` is a bootstrap hook; actual scheduling runs through `NotificationBootstrap` → `NotificationEngine.reschedule`.

## Data constraints

- Offline bundled data only (no API sync).
- Every catalog item includes `references[]` from `verifiedRef` / `unverifiedRef`, or `unverified: true`.
- i18n keys under `islamicCalendarAi.*` in `en.json` (ar/ur widget stubs).

## Future work

- `features/ramadan/` mode (parallel to Muharram) — season priorities exist in `islamic-events` but no dedicated screen yet.
- Consolidate `home/services/hijriDate.ts` with `calendar/engine/hijriUtils.ts`.
- Wire `buildRecommendationContext` to import `getTodayRecommendations` for AI scoring boosts on event days.
