# Intelligent Notification Engine

Unified offline-first notification orchestration for AhlulBayt+. Schedules context-aware local notifications via **Notifee**, integrates with the existing **Adhan** prayer system, and respects user preferences, quiet hours, and Hijri calendar context.

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     NotificationBootstrap                        │
│              (app root — useNotificationEngine)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NotificationEngine                           │
│  • fingerprint-based reschedule (skip if unchanged)              │
│  • permission gate (onboarding store)                            │
│  • orchestrates prayer + smart notifications                     │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             ▼                               ▼
┌────────────────────────┐    ┌──────────────────────────────────┐
│ AdhanNotificationService│    │ schedulePlanner + catalog rules   │
│ (prayer / adhan)        │    │ events · duas · muharram · amaal │
│ prefix: adhan-*         │    │ · fasting                         │
└────────────────────────┘    │ prefix: smart-*                   │
                               └──────────────────────────────────┘
```

## Notification Categories

| Category | Source | Intelligence |
|----------|--------|--------------|
| **Prayer** | `AdhanNotificationService` | Prayer times, per-salah toggles, prep/smart reminders |
| **Islamic Events** | `calendarEngine` | Upcoming Shia events (priority ≥ 7), eve + morning alerts |
| **Duas** | Rule catalog | Thursday Kumayl, morning Sabah, Friday Tawassul, nightly Ahad |
| **Muharram** | Rule catalog + season | Daily during Muharram, Tasua/Ashura eve, Arbaeen |
| **Amaal** | Rule catalog | Daily tasbih, Friday salawat, Ramadan Qadr, Ghadeer |
| **Fasting** | Rule catalog | Mon/Thu sunnah, Ashura, Arafah, Ramadan start |

## Module Structure

```
mobile/src/features/notifications/
├── types.ts                          # Categories, prefs, PlannedNotification
├── constants/
│   ├── channels.ts                   # Android channels, IDs, horizon (7 days)
│   └── catalog.ts                    # NOTIFICATION_RULES (offline rules)
├── engine/
│   ├── contextBuilder.ts             # Hijri, Muharram season, Ramadan
│   ├── schedulePlanner.ts            # Rule matching, event planning, dedupe
│   └── notificationEngine.ts         # Orchestrator + Notifee scheduling
├── stores/
│   └── notificationPreferencesStore.ts  # MMKV persisted prefs
├── hooks/
│   └── useNotificationEngine.ts      # Reschedule on mount + app foreground
├── components/
│   ├── NotificationBootstrap.tsx
│   └── NotificationSettingsPanel.tsx # Settings → category toggles
└── index.ts
```

## Scheduling Flow

1. **Build context** — `buildNotificationContext(now, locale)`  
   Hijri date, day of week, Muharram season, Ramadan flag.

2. **Plan notifications** — `planAllNotifications(ctx, prefs)`  
   - Match `NOTIFICATION_RULES` against each day in 7-day horizon  
   - Plan calendar event notifications (morning of + eve before)  
   - Plan Muharram day-specific content when in season  
   - Dedupe by ID, cap at 40 smart notifications (iOS limit headroom)

3. **Apply preferences**  
   - Master toggle, per-category toggles  
   - Quiet hours (default 23:00–05:00) skip non-critical slots

4. **Schedule via Notifee**  
   - Cancel all `smart-*` trigger notifications  
   - Schedule new batch with localized title/body  
   - Deep-link `data`: `{ category, route, routeParams, eventId, duaId }`

5. **Prayer branch** — if `categories.prayer.enabled`, delegate to `AdhanNotificationService.reschedule()`.

6. **Fingerprint** — skip reschedule if context + prefs + planned IDs unchanged.

## Rule Catalog

Rules are declarative in `constants/catalog.ts`:

```typescript
{
  id: 'dua_kumail_thursday',
  category: 'duas',
  dayOfWeek: 4,        // Thursday
  hour: 19,
  titleKey: 'notifications.duas.kumail.title',
  payload: { route: 'DuaReader', routeParams: { duaId: 'dua_kumail' } },
}
```

Supported matchers: `dayOfWeek`, `hijriMonth`, `hijriDay`, `daysBefore`, `muharramOnly`, `ramadanOnly`.

## User Preferences

Stored in MMKV (`ahlulbayt-notification-prefs`):

- `masterEnabled` — global kill switch  
- `quietHoursEnabled`, `quietStartHour`, `quietEndHour`  
- `categories.*.enabled` — per-type toggles  
- Optional `digestHour` / `eveningHour` per category  

Settings UI: **Settings → Intelligent Notifications** (above Adhan panel).

## Integration Points

| System | Integration |
|--------|-------------|
| Prayer times | `usePrayerTimes().week` → Adhan scheduler |
| Calendar | `getUpcomingCalendarEvents()` → event notifications |
| Muharram | `isMuharramSeason()` → daily + Ashura rules |
| Recommendations | Shared patterns with `ai/recommendations/catalog` |
| Onboarding | `notificationsGranted` gate |

## Deep Links (future)

Notification `data.route` maps to stack screens:

- `DuaReader`, `Calendar`, `MuharramMode`, `TasbihCounter`, `Prayer`, `Mafatih`

Wire in `notifee.onForegroundEvent` / cold-start handler when navigation ref is available.

## Extending

1. Add rule to `NOTIFICATION_RULES` + i18n keys under `notifications.*`  
2. For dynamic content, add provider function in `schedulePlanner.ts`  
3. Add Android channel in `constants/channels.ts` if new category  
4. Extend `NotificationCategory` type and preferences store defaults  

## Limits

- **7-day horizon** — refreshed on app open (iOS local notification cap)  
- **40 smart notifications max** — adhan uses separate `adhan-*` IDs  
- **Offline only** — no push server; all triggers are local timestamp  
