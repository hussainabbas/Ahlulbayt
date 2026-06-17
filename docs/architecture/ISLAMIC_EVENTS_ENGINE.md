# Islamic Events Engine
## v1.0 — Context-Aware Home & Timeline

---

## Overview

The Islamic Events Engine makes AhlulBayt+ **adapt automatically** to the current Hijri date — promoting Muharram, Ramadan, Eid, Arbaeen, Ghadeer, and Mubahila content on the home screen without manual configuration.

```
mobile/src/core/islamic-events/
├── types.ts              # Seasons, timeline, priorities, featured content
├── context.ts            # Hijri → season detection
├── references.ts         # Verified / unverified citation helpers
├── engine.ts             # Public API
├── catalog/
│   ├── timelineCatalog.ts  # Daily timeline entries (Muharram 1–10 seeded)
│   └── prioritiesCatalog.ts # Home priorities + featured content per season
└── index.ts
```

---

## Public API

```typescript
import {
  getCurrentContext,
  getHomePriorities,
  getDailyTimeline,
  getFeaturedContent,
  getIslamicEventsSnapshot,
} from '@/core/islamic-events';

const snapshot = getIslamicEventsSnapshot(new Date(), 'en');
// snapshot.context.season → 'muharram' | 'ramadan' | ...
// snapshot.homePriorities → prioritized home widgets
// snapshot.dailyTimeline → today's historical entries
// snapshot.featuredContent → books, duas, ziyarat, quran
```

| Function | Purpose |
|----------|---------|
| `getCurrentContext(date, locale)` | Active season + Hijri flags |
| `getHomePriorities(date, locale, limit?)` | Ordered home widget promotions |
| `getDailyTimeline(date, locale)` | Timeline entries for today's Hijri day |
| `getFeaturedContent(date, locale, limit?)` | Seasonal featured content cards |
| `getIslamicEventsSnapshot(date, locale)` | Full bundle for dashboard |

---

## Reference Policy

Every timeline and featured item includes `references: EventReference[]`.

- **Verified** — `verification: 'verified'`, scholarly source with book/volume/page/hadith where available
- **Unverified** — `verification: 'unavailable'`, `unverified: true` — UI shows "Unverified — source pending"

Never present historical claims as verified without a citable source.

---

## Home Integration

`useDashboard` calls `getIslamicEventsSnapshot` via `useHijriClock()` and exposes:

- `islamicContext`
- `homePriorities`
- `dailyTimeline`
- `featuredSeasonal`

`HomeScreen` renders (when season ≠ `general`):

1. `DailyTimelineWidget` — today's event + reference badge
2. `SeasonalPrioritiesWidget` — tappable priority list
3. `FeaturedSeasonalWidget` — duas, ziyarat, quran, guides

Existing `MuharramBanner` remains for pre-Muharram season countdown.

---

## Seeded vs Stubbed Data

| Area | Status |
|------|--------|
| Muharram days 1–10 timeline | **Seeded** with Tabari, Mufid, Maqtal references |
| Muharram home priorities | **Seeded** (8 widgets) |
| Muharram featured content | **Seeded** (Ashura ziyarat, Dua Kumayl, Quran 2:153) |
| Arbaeen (20 Safar) | **Seeded** timeline + featured |
| Ramadan | **Stub** timeline (start, Laylat al-Qadr) + priorities |
| Eid Fitr / Adha | **Stub** priorities + featured |
| Ghadeer / Mubahila | **Stub** priorities |
| Safar (non-Arbaeen days) | Uses Arbaeen priority subset |
| General season | Calendar link only |

---

## Extension Guide

1. Add timeline entry in `catalog/timelineCatalog.ts` with `references[]`
2. Add i18n keys under `islamicEvents.*` in `en.json` (and `ar.json` / `ur.json`)
3. Extend `PRIORITY_MAP` / `FEATURED_MAP` in `prioritiesCatalog.ts`
4. Link `route`, `duaId`, `ziyaratId` to existing app content IDs

Calendar feature (`features/calendar/data/shiaEvents.ts`) remains the recurring event catalog; this engine adds **rich timeline + home promotion** layered on top.

---

## Related

- [PRAYER_ENGINE.md](./PRAYER_ENGINE.md)
- [ADHAN_NOTIFICATIONS.md](./ADHAN_NOTIFICATIONS.md)
- `features/calendar/engine/calendarEngine.ts`
- `core/references/types.ts`
