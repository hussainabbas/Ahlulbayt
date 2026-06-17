# Admin Dashboard — API Design

**Base path:** `/v1/admin/*`  
**Auth:** `Authorization: Bearer <JWT>` · `users.role ∈ {moderator, admin, super_admin}`  
**Rate limit:** 30 req/min per admin (stricter than mobile)

---

## 1. Conventions

| Concern | Pattern |
|---------|---------|
| Pagination | `?limit=50&offset=0` |
| Sorting | `?sort=-created_at` (phase 2) |
| Filtering | Query params per resource |
| Errors | NestJS standard `{ statusCode, message }` |
| Audit | All `POST/PATCH/DELETE` → `admin_audit_log` |
| IDs | UUID v4 for entities; bigint for logs |

---

## 2. Route catalog

### Executive Overview
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/overview` | `analytics.read` | **Functional** (KPIs + chart data) |

### User Management
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/users` | `users.read` | **Functional** |
| GET | `/v1/admin/users/stats` | `users.read` | **Functional** |
| GET | `/v1/admin/users/:id` | `users.read` | **Functional** |
| PATCH | `/v1/admin/users/:id` | `users.write` | **Functional** |
| DELETE | `/v1/admin/users/:id` | `users.delete` | **Functional** |

### Analytics
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/analytics/overview` | `analytics.read` | **Functional** |
| GET | `/v1/admin/analytics/features` | `analytics.read` | **Functional** |
| GET | `/v1/admin/analytics/signups?days=30` | `analytics.read` | **Functional** |
| GET | `/v1/admin/analytics/retention?days=30` | `analytics.read` | **Functional** |
| GET | `/v1/admin/analytics/engagement?days=30` | `analytics.read` | **Functional** |
| GET | `/v1/admin/analytics/prayer?days=30` | `analytics.read` | **Functional** |
| GET | `/v1/admin/analytics/reading?days=30` | `analytics.read` | **Functional** |
| GET | `/v1/admin/analytics/screens` | `analytics.read` | **Stub** (phase 2 PostHog) |

### Notifications
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/notifications/campaigns` | `notifications.read` | **Functional** |
| POST | `/v1/admin/notifications/campaigns` | `notifications.write` | **Functional** |
| POST | `/v1/admin/notifications/campaigns/:id/send` | `notifications.write` | **Stub** (no FCM worker) |
| POST | `/v1/admin/notifications/preview` | `notifications.read` | **Functional** |
| GET | `/v1/admin/notifications/templates` | `notifications.read` | **Stub** |

### Islamic CMS
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/content/manifest` | `cms.read` | **Functional** |
| POST | `/v1/admin/content/manifest/publish` | `cms.publish` | **Functional** |
| GET | `/v1/admin/content/:domain` | `cms.read` | **Functional** |
| POST/PATCH/DELETE | `/v1/admin/content/:domain/:id` | `cms.write` | **Functional** |
| GET | `/v1/admin/cms` | `cms.read` | **Stub** (polymorphic `cms_content`) |
| POST | `/v1/admin/cms` | `cms.write` | **Stub** |
| GET | `/v1/admin/cms/:id/citations` | `cms.read` | **Stub** |

### Guides
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/guides` | `guides.read` | **Stub** |
| GET | `/v1/admin/guides/:id` | `guides.read` | **Stub** |

### Islamic Events
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/events` | `events.read` | **Functional** (list) |
| GET | `/v1/admin/events/:id` | `events.read` | **Functional** |
| POST/PATCH/DELETE | `/v1/admin/events` | `events.write` | **Stub** |

### Feature Flags
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/flags` | `flags.read` | **Functional** (list) |
| GET | `/v1/admin/flags/:key` | `flags.read` | **Functional** |
| POST/PATCH | `/v1/admin/flags` | `flags.write` | **Stub** |

### Platform Health
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/health` | `health.read` | **Stub** (static services map) |

### API Logs
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/logs/requests` | `logs.read` | **Functional** (empty until middleware) |

### Security
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/security/overview` | `security.read` | **Stub** |
| GET | `/v1/admin/security/events` | `security.read` | **Functional** (list) |

### AI Management
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET/PATCH | `/v1/admin/ai/config` | `ai.write` | **Functional** |
| GET | `/v1/admin/ai/conversations` | `ai.read` | **Functional** |
| GET/PUT | `/v1/admin/ai/guardrails` | `ai.write` | **Functional** |
| GET/POST/DELETE | `/v1/admin/ai/knowledge` | `ai.write` | **Stub** |

### Media Library
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/media` | `media.read` | **Functional** (list) |
| POST | `/v1/admin/media/upload-url` | `media.write` | **Stub** (R2 presign phase 2) |

### RBAC
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/rbac/roles` | `rbac.read` | **Functional** |
| GET | `/v1/admin/rbac/permissions` | `rbac.read` | **Functional** |
| GET | `/v1/admin/rbac/matrix` | `rbac.read` | **Functional** (super_admin) |

### Audit Logs
| Method | Path | Permission | Status |
|--------|------|------------|--------|
| GET | `/v1/admin/audit` | `audit.read` | **Functional** |

---

## 3. Public mobile endpoints (admin publishes to)

| Method | Path | Consumer |
|--------|------|----------|
| GET | `/v1/content/manifest` | Mobile sync |
| GET | `/v1/flags/evaluate` | Mobile remote config (phase 2) |
| GET | `/v1/calendar/events` | Islamic calendar |

---

## 4. Guards

```typescript
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@RequirePermission('users.write')
```

Phase 1 maps `users.role` → permission set in `PermissionsGuard`. Phase 2 reads `admin_user_roles` + `role_permissions`.

---

## 5. Response shapes

### Overview
```json
{
  "generatedAt": "2026-06-17T12:00:00.000Z",
  "kpis": { "totalUsers": 1200, "premiumSubscriptions": 45 },
  "platform": { "activeFeatureFlags": 3 },
  "charts": { "signups30d": [], "engagement30d": [] }
}
```

### Paginated list
```json
{ "items": [], "total": 0, "limit": 50, "offset": 0 }
```

---

*Owner: Platform Architecture*
