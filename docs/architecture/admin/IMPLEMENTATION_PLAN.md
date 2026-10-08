# Admin Dashboard — Implementation Plan

**Version:** 1.0 · June 2026

---

## Phase 1 — Foundation ✅ (this delivery)

| Deliverable | Status |
|-------------|--------|
| Architecture docs (`docs/architecture/admin/`) | ✅ |
| DB schema + migration `0012_admin_platform.sql` | ✅ |
| NestJS AdminModule (16 controller areas) | ✅ |
| Next.js admin app shell (`admin/`) | ✅ |
| RBAC guards + permission decorator | ✅ |
| Executive dashboard with API stubs | ✅ |

---

## Phase 2 — Realtime & integrations

| Task | Effort | Dependencies |
|------|--------|--------------|
| WebSocket gateway (`/admin/ws`) for live health + notification send progress | M | Redis pub/sub |
| PostHog embedded dashboards in Screen Analytics | S | PostHog project + API key |
| R2 presigned upload + CDN invalidation | M | Cloudflare R2 credentials |
| Notification send worker (BullMQ + FCM) | L | devices table populated |
| A/B notification experiments | M | notification_deliveries tracking |
| Screen heatmaps via PostHog session replay | S | Mobile screen_view events |
| API request logging middleware → `api_request_logs` | M | Partition management |
| DB-backed RBAC (replace legacy role map) | M | Seed permissions |
| CMS polymorphic CRUD + citation editor | L | cms_content API |
| Google Workspace SSO + MFA | L | admin_users.mfa_enabled |

---

## Phase 3 — Production hardening

| Task | Effort |
|------|--------|
| WAF IP allowlist for `/v1/admin/*` | S |
| Slack alerts on publish / security critical | S |
| GDPR hard-delete workflow | M |
| Read replica for analytics queries | M |
| Monthly partition automation for api_request_logs | M |
| E2E tests (Playwright admin flows) | L |
| Feature flag evaluate endpoint for mobile | M |

---

## Phase 4 — Advanced ops

| Task | Effort |
|------|--------|
| Impersonation mode (support) with audit | M |
| Content staging → review → publish workflow | L |
| AI knowledge corpus upload + pgvector reindex | L |
| Cross-region failover runbook | L |

---

## File map (Phase 1)

```
docs/architecture/admin/
├── INFORMATION_ARCHITECTURE.md
├── API_DESIGN.md
├── RBAC.md
├── ANALYTICS_ARCHITECTURE.md
├── NOTIFICATION_ARCHITECTURE.md
├── SECURITY_ARCHITECTURE.md
├── DEPLOYMENT.md
└── IMPLEMENTATION_PLAN.md

api/
├── drizzle/migrations/0012_admin_platform.sql
└── src/admin/
    ├── admin.module.ts
    ├── guards/ (admin-auth, roles, permissions)
    ├── decorators/ (roles, permissions)
    ├── overview/
    ├── users/ analytics/ notifications/ content/
    ├── guides/ events/ flags/ health/ logs/
    ├── security/ ai/ media/ rbac/ audit/

admin/
├── package.json
├── src/app/ (dashboard + 16 centers)
├── src/components/ (layout, ui)
└── src/lib/api.ts
```

---

## Success criteria (production)

- [ ] All 16 centers have functional CRUD where applicable
- [ ] < 200ms p95 for overview KPI endpoint (cached)
- [ ] 100% mutating actions audited
- [ ] Mobile consumes feature flags + CMS manifest
- [ ] Security review sign-off
- [ ] Operator onboarding doc + 2FA enforced

---

*Owner: Platform Engineering*
