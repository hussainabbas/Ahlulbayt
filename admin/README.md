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

```env
# admin/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Auth (phase 1)

Admin routes require a JWT for a user with `role` of `moderator`, `admin`, or `super_admin`.
Pass token via API client in phase 2 cookie auth.

## Docs

See `docs/architecture/admin/` for full architecture.
