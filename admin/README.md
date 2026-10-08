# AhlulBayt+ Admin Dashboard

Internal operations console for the AhlulBayt+ platform.

## Prerequisites

- Node.js 20+
- PostgreSQL (via docker-compose)
- NestJS API running on port 3000

## Local development

```bash
# Terminal 1 — API
cd api
npm install
npm run start:dev

# Terminal 2 — Admin UI
cd admin
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Environment

Admin and mobile must point at the **same API / database**.

| App | Variable | Production example |
|-----|----------|-------------------|
| **Mobile** | `API_BASE_URL` in `mobile/.env` | `https://ahlulbayt-production.up.railway.app/v1` |
| **Admin** | `NEXT_PUBLIC_API_URL` in `admin/.env.local` | `https://ahlulbayt-production.up.railway.app` |

```env
# admin/.env.local (production — matches mobile)
NEXT_PUBLIC_API_URL=https://ahlulbayt-production.up.railway.app
```

For local full-stack dev, set both to `http://localhost:3000` (admin) and `http://localhost:3000/v1` (mobile).

Restart the admin dev server after changing `.env.local`.

## Auth (phase 1)

Admin routes require a JWT for a user with `role` of `moderator`, `admin`, or `super_admin`.
Pass token via API client in phase 2 cookie auth.

## Docs

See `docs/architecture/admin/` for full architecture.
