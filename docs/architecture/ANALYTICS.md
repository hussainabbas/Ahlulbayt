# Analytics Platform

Event-driven analytics for retention, engagement, prayer completion, and reading habits.

## Architecture

```
Mobile (queue + flush)
    → POST /v1/analytics/events
    → analytics_event_log (+ domain tables)

Admin dashboard
    → GET /v1/admin/analytics/{retention|engagement|prayer|reading}

User insights
    → GET /v1/analytics/me
```

## Data model

| Table | Purpose |
|-------|---------|
| `analytics_event_log` | Raw events (session, screen, feature) |
| `prayer_completions` | One row per user/prayer/date |
| `reading_sessions` | Quran/dua/ziyarat/hadith sessions |
| `analytics_daily_rollups` | Pre-aggregated DAU, prayers, ayahs |

Migration: `api/drizzle/migrations/0010_analytics_platform.sql`

## Event catalog

| Event | Trigger |
|-------|---------|
| `app.session_start` | App launch (AnalyticsBootstrap) |
| `app.screen_view` | Navigation (optional) |
| `prayer.completed` | Prayer marked on Prayer screen |
| `quran.ayah_read` | Ayah scrolled/read in Quran reader |
| `quran.session_end` | Reading session API |
| `engagement.feature_used` | Generic feature usage |

## API

### Ingest (optional auth)

`POST /v1/analytics/events`

```json
{
  "events": [{ "name": "app.session_start", "sessionId": "...", "properties": {} }],
  "platform": "ios",
  "appVersion": "1.0.0"
}
```

### Prayer / reading (auth required)

- `POST /v1/analytics/prayer` — `{ "prayer": "fajr", "completedDate": "2026-06-12" }`
- `POST /v1/analytics/reading` — `{ "contentType": "quran", "surah": 1, "ayahsRead": 7 }`

### Personal insights

`GET /v1/analytics/me?days=30`

### Admin metrics

- `GET /v1/admin/analytics/retention?days=30` — D1/D7/D30 cohort rates
- `GET /v1/admin/analytics/engagement?days=30` — DAU/WAU/MAU, top events
- `GET /v1/admin/analytics/prayer?days=30` — completion adoption & trends
- `GET /v1/admin/analytics/reading?days=30` — content mix, top surahs

## Mobile

- `mobile/src/core/analytics/` — queue, flush, bootstrap
- Respects `analyticsEnabled` in settings
- Offline-first: events queued in MMKV, flushed on reconnect
- Prayer toggles on `PrayerScreen` sync when signed in
- **My Insights** screen under More tab

## Privacy

- Analytics can be disabled in Settings
- Guest events stored without `user_id`
- Signed-in users link events to account for insights & admin aggregates

## Rollups

Call `AnalyticsRollupService.runDailyRollups()` via cron or admin job to populate `analytics_daily_rollups`.
