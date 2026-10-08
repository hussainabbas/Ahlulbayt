# Admin Dashboard — Analytics Architecture

**Version:** 1.0 · June 2026

---

## 1. Data sources

| Source | Data | Admin center |
|--------|------|--------------|
| **PostgreSQL** | `analytics_event_log`, rollups, prayer/reading | Analytics, Overview |
| **PostHog** | Screen views, funnels, session replay | Screen Analytics (phase 2 embed) |
| **Firebase Analytics** | Mobile acquisition, crashes | Overview KPIs (phase 2) |
| **NestJS aggregates** | User counts, subscriptions, AI volume | Executive Overview |

---

## 2. Pipeline

```
Mobile app
  ├─► POST /v1/analytics/events ──► analytics_event_log
  ├─► PostHog SDK (batch) ──► PostHog cloud
  └─► Firebase SDK ──► Firebase console

Cron (hourly)
  └─► analytics-rollup.service ──► analytics_daily_rollups

Admin dashboard
  ├─► GET /v1/admin/analytics/* (NestJS)
  └─► PostHog iframe embed (phase 2)
```

---

## 3. Rollup metrics

| Metric key | Dimension | Source |
|------------|-----------|--------|
| `dau` | platform | session_start events |
| `mau` | platform | unique users 30d |
| `prayer_completion_rate` | prayer | prayer_completions |
| `quran_ayahs_read` | content | reading_sessions |
| `premium_conversion` | tier | subscriptions |
| `ai_queries` | intent | ai_messages |

---

## 4. Screen analytics (phase 2)

- PostHog project: `ahlulbayt-mobile`
- Events: `app.screen_view` with `{ screen, params }`
- Admin embed: `/analytics/screens` → PostHog dashboard ID
- Heatmaps: session replay + rage click detection

---

## 5. Caching

| Endpoint | TTL | Store |
|----------|-----|-------|
| `/admin/analytics/overview` | 5 min | Redis `admin:analytics:overview` |
| `/admin/overview` | 5 min | Redis `admin:executive` |
| Rollup queries | 1 hour | Redis per metric |

Stub: Redis keys documented; wiring in phase 2.

---

## 6. Privacy

- Admin views aggregated data by default
- Per-user drill-down requires `users.read` + audit log
- PII redaction in AI conversation audit exports
- `analyticsEnabled` user preference respected in mobile ingest

---

*Owner: Data Platform*
