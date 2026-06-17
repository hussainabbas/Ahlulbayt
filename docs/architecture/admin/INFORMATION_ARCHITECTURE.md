# Admin Dashboard — Information Architecture

**Version:** 1.0 · June 2026  
**Surface:** `admin.ahlulbayt.app` (Next.js 15) · API: `/v1/admin/*`

---

## 1. Navigation model

16 operational centers grouped into 5 zones. Sidebar order reflects daily operator workflow (overview → users → ops → content → platform).

```
AhlulBayt+ Admin
├── Executive Overview          /dashboard
├── Users & Access
│   ├── User Management         /users
│   └── RBAC                    /settings/rbac
├── Engagement
│   ├── Screen Analytics        /analytics/screens
│   ├── Analytics               /analytics
│   └── Advanced Notifications  /notifications
├── Islamic Content
│   ├── Islamic CMS             /cms
│   ├── Guide Management        /guides
│   ├── Islamic Events Engine   /events
│   └── Media Library           /media
├── Platform
│   ├── Feature Flags           /flags
│   ├── AI Management           /ai
│   ├── Platform Health         /health
│   ├── API Logs                /logs
│   ├── Security                /security
│   └── Audit Logs              /audit
└── Settings                    /settings
```

---

## 2. Center definitions

| Center | Primary persona | Purpose | Key entities |
|--------|----------------|---------|--------------|
| **Executive Overview** | Leadership, PM | KPIs, trends, incident summary | users, subscriptions, analytics rollups |
| **User Management** | Support, Ops | Search, tier, ban, device view | `user_admin_view`, devices |
| **Screen Analytics** | Product | Funnel, screen heatmaps, retention | `analytics_event_log`, PostHog |
| **Advanced Notifications** | Growth, Ops | Campaigns, A/B, segments | `notification_campaigns`, deliveries |
| **Islamic CMS** | Content editors | Polymorphic worship content + citations | `cms_content`, `content_citations` |
| **Guide Management** | Content | Worship guide steps, simulator flows | `cms_content` (guide_step) |
| **Islamic Events Engine** | Content | Hijri/Gregorian calendar curation | `islamic_events` |
| **Feature Flags** | Engineering | Rollouts, overrides for mobile | `feature_flags`, `flag_overrides` |
| **Platform Health** | SRE | Service status, latency, queues | Redis, PG, R2, FCM stubs |
| **API Logs** | Engineering | Request tracing, error rates | `api_request_logs` (partitioned) |
| **Security** | Security | Auth failures, WAF, incidents | `security_events` |
| **Analytics** | Product | DAU/MAU, prayer, reading habits | rollups + admin analytics API |
| **AI Management** | AI ops | Prompts, guardrails, corpus | `ai_admin_config`, conversations |
| **Media Library** | Content | R2 assets, CDN URLs | `media_assets` |
| **RBAC** | Super admin | Roles, permissions matrix | `roles`, `permissions` |
| **Audit Logs** | Compliance | Immutable admin action trail | `admin_audit_log` |

---

## 3. URL & breadcrumb hierarchy

| Path | Breadcrumb | Parent |
|------|------------|--------|
| `/dashboard` | Overview | — |
| `/users` | Users | — |
| `/users/[id]` | Users › {email} | Users |
| `/analytics` | Analytics | — |
| `/analytics/screens` | Analytics › Screens | Analytics |
| `/notifications` | Notifications | — |
| `/notifications/[id]` | Notifications › {title} | Notifications |
| `/cms` | CMS | — |
| `/cms/[type]/[id]` | CMS › {type} › {title} | CMS |
| `/guides` | Guides | — |
| `/events` | Events | — |
| `/flags` | Feature Flags | — |
| `/health` | Platform Health | — |
| `/logs` | API Logs | — |
| `/security` | Security | — |
| `/ai` | AI Management | — |
| `/media` | Media Library | — |
| `/audit` | Audit Logs | — |
| `/settings` | Settings | — |
| `/settings/rbac` | Settings › RBAC | Settings |

---

## 4. Content types (CMS polymorphism)

All types share `cms_content` + optional `content_citations`:

| `content_type` | Mobile consumer | Citation fields |
|----------------|-----------------|-----------------|
| `quran_meta` | Quran reader meta, topics | surah, ayah_from/to |
| `hadith` | Hadith KB | hadith_collection, hadith_number |
| `dua` | Duas module | source_ref, page_ref |
| `ziyarat` | Ziyarat catalog | source_ref |
| `event` | Muharram / calendar cards | linked `islamic_events` |
| `amaal` | Daily amaal | source_ref |
| `guide_step` | Worship guide simulator | step metadata + citations |

Citations align with mobile `core/references` and AI citation cards.

---

## 5. Cross-cutting UX patterns

| Pattern | Usage |
|---------|-------|
| **Dense data tables** | Users, logs, audit — TanStack Table, 40px rows |
| **Metric cards** | Overview, analytics — 4-up grid, sparkline |
| **Split panel** | CMS editor — form left, preview/citations right |
| **Command palette** | ⌘K global search (users, flags, content) |
| **Status chips** | draft / published / sending / critical |
| **Dark/light** | System preference + manual toggle in top bar |

Design reference: Firebase Console density + Datadog observability + Stripe polish + Linear navigation + Vercel typography.

---

## 6. Mobile integration map

```
Admin CMS publish ──► content manifest bump ──► mobile sync pull
Feature flags API ──► GET /v1/flags/evaluate ──► mobile remote config
Events admin ──► islamic_events ──► islamic-calendar-ai module
Citations ──► content_citations ──► core/references engine
Notifications ──► campaigns ──► FCM/APNs (existing devices table)
Analytics ──► PostHog + Firebase ──► unified in admin analytics center
```

---

## 7. Phase 2 IA additions (documented only)

- Realtime ops wall (`/health/live`) — WebSocket feed
- PostHog embedded dashboards (`/analytics/posthog`)
- Notification A/B experiment builder
- Screen heatmap viewer (PostHog session replay embed)

---

*Owner: Platform Architecture*
