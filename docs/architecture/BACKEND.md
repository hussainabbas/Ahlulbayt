# AhlulBayt+ Backend Architecture

Production NestJS API serving the mobile app's offline-first sync, worship tracking, content catalog, and AI assistant.

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 22 LTS |
| Framework | NestJS 11 |
| Database | PostgreSQL 16 + Drizzle ORM |
| Cache | Redis 7 (optional, graceful degrade) |
| Auth | JWT access + refresh rotation, OAuth, OTP |
| Content delivery | S3/CloudFront CDN bundles |
| Push (future) | FCM/APNs via device registry |

## Module Map

```
api/src/
├── auth/           # JWT, OAuth, OTP, guest accounts
├── users/          # Profile + preferences (extends auth /me)
├── prayer/         # Time validation, qadha CRUD
├── quran/          # Semantic search, surah catalog
├── duas/           # Dua catalog + recommendations
├── ziyarat/        # Ziyarat catalog + recommendations
├── calendar/       # Hijri events (wiladat, shahadat, occasions)
├── notifications/  # Device registration, server-side prefs mirror
├── ai/             # Islamic assistant (rule engine → LLM upgrade path)
├── content/        # Offline bundle manifest (CDN URLs)
├── sync/           # User data push/pull changelog
├── redis/          # Cache layer (global)
├── subscriptions/  # IAP, entitlements, webhooks
├── admin/          # Super admin API (/v1/admin/*)
└── database/       # Drizzle schema + connection pool
```

## API Surface (`/v1/*`)

### Public (no auth)

| Method | Path | Module |
|--------|------|--------|
| GET | `/health` | Health |
| POST | `/v1/auth/*` | Auth |
| GET | `/v1/quran/search` | Quran |
| GET | `/v1/quran/surahs` | Quran |
| GET | `/v1/duas` | Duas |
| GET | `/v1/ziyarat` | Ziyarat |
| GET | `/v1/calendar/events` | Calendar |
| GET | `/v1/calendar/today` | Calendar |
| GET | `/v1/content/manifest` | Content |
| POST | `/v1/prayer/validate` | Prayer |
| POST | `/v1/ai/chat/guest` | AI (rate-limited) |

### Authenticated (Bearer JWT)

| Method | Path | Module |
|--------|------|--------|
| GET/PATCH | `/v1/users/me` | Users |
| PATCH | `/v1/users/me/preferences` | Users |
| GET/POST/PUT/DELETE | `/v1/prayer/qadha` | Prayer |
| POST/GET | `/v1/sync/push`, `/v1/sync/pull` | Sync |
| POST/GET/PUT | `/v1/notifications/*` | Notifications |
| POST | `/v1/ai/chat` | AI |

### Admin (`/v1/admin/*`) — requires `role: admin | super_admin`

See [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) for full RBAC and UI architecture.

| Area | Key routes |
|------|------------|
| Users | `GET/PATCH/DELETE /v1/admin/users` |
| Analytics | `GET /v1/admin/analytics/overview` |
| Notifications | `GET/POST /v1/admin/notifications/campaigns` |
| Content | `GET/POST /v1/admin/content/manifest` |
| AI | `GET/PATCH /v1/admin/ai/config` |
| Audit | `GET /v1/admin/audit` (super_admin) |

## Data Architecture

### Content (read-heavy, CDN-backed)

- **Metadata** served from API (catalogs, manifest)
- **Bulk text** (Quran ayahs, dua/ziyarat bodies) as versioned gzip bundles on CDN
- Mobile compares manifest SHA256 → downloads deltas only

### User data (write-heavy, PostgreSQL)

- `user_preferences` — prayer method, theme, notification prefs
- `qadha_records` — missed prayer tracking
- `bookmarks`, `reading_progress` — via sync changelog
- `devices` — FCM/APNs tokens for server push
- `ai_conversations`, `ai_messages` — audit trail

### Sync protocol

1. Mobile pushes local changes → `POST /v1/sync/push` (batch, max 100)
2. Server appends to `sync_changelog`, returns cursor
3. Other devices pull → `GET /v1/sync/pull?cursor=N`
4. WatermelonDB applies changes idempotently

See [OFFLINE_FIRST_SYNC.md](./OFFLINE_FIRST_SYNC.md).

## Caching Strategy

| Key pattern | TTL | Invalidation |
|-------------|-----|--------------|
| `content:manifest` | 1h | Deploy new manifest version |
| `duas:catalog:*` | 10m | Catalog data change |
| `quran:surahs` | 24h | Rare |

Redis is optional — `CacheService` no-ops when `REDIS_URL` is unset.

## Security

- Global rate limiting (100 req/min default; stricter on auth/AI)
- JWT access tokens (15m), refresh rotation with family revocation
- ValidationPipe whitelist on all DTOs
- AI guardrails block sensitive/legal/violent queries
- No secrets in repo — `.env.example` documents required vars

## Deployment Topology

```
                    ┌─────────────┐
   Mobile App ─────►│  ALB / CDN  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ API (ECS)│ │ API (ECS)│ │ CloudFront│
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │           │
             └────────────┼───────────┘
                          ▼
              ┌───────────────────────┐
              │  RDS PostgreSQL       │
              │  ElastiCache Redis    │
              │  S3 (content bundles) │
              └───────────────────────┘
```

### Environment variables

See `api/.env.example`. Critical production vars:

- `DATABASE_URL`, `REDIS_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (≥32 chars)
- `CONTENT_CDN_BASE_URL`
- `AI_PROVIDER` (`local` | `openai`)

## Migrations

```bash
cd api
npm run db:migrate   # applies drizzle/migrations/*.sql
```

Migrations:

- `0000_auth.sql` — users, oauth, tokens, otp
- `0001_core_modules.sql` — preferences, sync, qadha, bookmarks, AI

## Local Development

```bash
cd api
cp .env.example .env
npm install
npm run start:dev
```

Health check: `GET http://localhost:3000/health`

## Phase 2 Roadmap

- [ ] pgvector semantic search over full Quran corpus
- [ ] OpenAI/Anthropic provider for AI module
- [ ] FCM/APNs push worker (reads `devices` + `notification_prefs`)
- [ ] Subscription module (Apple/Google IAP webhooks)
- [ ] OpenAPI/Swagger at `/docs`
- [ ] Hadith search API (align with mobile hadith feature)
