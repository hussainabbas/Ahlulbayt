# Admin Dashboard — Deployment Strategy

**Version:** 1.0 · June 2026

---

## 1. Topology

```
┌──────────────────┐     ┌──────────────────┐
│  Vercel          │     │  ECS Fargate     │
│  admin/ Next.js  │────►│  api/ NestJS     │
│  admin.*.app     │     │  (shared cluster)│
└──────────────────┘     └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
         Aurora PG            ElastiCache          Cloudflare R2
         (Drizzle)              Redis              (media)
              │
              ▼
         PostHog / Firebase (SaaS)
```

---

## 2. Environments

| Env | Admin URL | API | Notes |
|-----|-----------|-----|-------|
| **local** | `localhost:3001` | `localhost:3000` | Docker Compose PG + Redis |
| **staging** | `admin-staging.ahlulbayt.app` | `api-staging.*` | Synthetic data |
| **prod** | `admin.ahlulbayt.app` | `api.ahlulbayt.app` | IP allowlist + MFA |

---

## 3. Admin app (`admin/`)

```bash
# Build
cd admin && npm run build

# Env
NEXT_PUBLIC_API_URL=https://api.ahlulbayt.app
```

Deploy: Vercel project linked to `admin/` directory.  
Preview deployments per PR.

---

## 4. API extensions

- Migration `0012_admin_platform.sql` before deploy
- No new ECS service — same NestJS container
- Redis stub keys for admin cache (documented)

---

## 5. Redis configuration (stub)

```env
REDIS_URL=redis://localhost:6379
REDIS_ADMIN_CACHE_TTL=300
```

Keys:
- `admin:analytics:overview`
- `admin:executive`
- `admin:health:snapshot`

---

## 6. R2 storage (documented)

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=ahlulbayt-media
R2_PUBLIC_URL=https://media.ahlulbayt.app
```

Presigned upload flow in phase 2.

---

## 7. CI/CD

| Step | Tool |
|------|------|
| API typecheck + build | GitHub Actions |
| Admin lint + build | GitHub Actions |
| DB migrate | `drizzle-kit migrate` in deploy hook |
| Smoke test | `GET /v1/admin/health` with service token |

---

## 8. Rollback

- Admin UI: Vercel instant rollback
- API: ECS previous task definition
- DB: Forward-only migrations; feature flags for soft rollback

---

*Owner: DevOps*
