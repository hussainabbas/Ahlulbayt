# Deploy API + PostgreSQL on Railway

## 1. Create Railway project

1. Go to [railway.app](https://railway.app) and sign in (GitHub is easiest).
2. Click **New Project**.
3. Choose **Deploy from GitHub repo** and select your `AhlulBayt+` repository.
4. Railway creates a first service from the repo — you will configure it in step 3 below.

---

## 2. Add PostgreSQL (step-by-step)

Railway calls this a **database service** (sometimes shown as a template/plugin).

### Option A — From the project canvas (most common)

1. Open your **project** (you should see at least one service box on the canvas).
2. Click **+ New** (top-right of the project) or **Create** → **Database**.
3. Select **PostgreSQL**.
4. Wait ~30–60 seconds. A new box appears named something like **Postgres** or **PostgreSQL**.

### Option B — From the service panel

1. In the left sidebar, click **+ New Service**.
2. Pick **Database** → **Add PostgreSQL**.

### After Postgres is created

1. Click the **PostgreSQL** service box.
2. Open the **Variables** tab — you will see:
   - `DATABASE_URL` (main connection string — **use this**)
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (optional breakdown)
3. Open the **Connect** tab if you want to copy the URL or connect with a desktop client.

You do **not** need to create tables manually — the API release step runs migrations.

### (Optional) Add Redis the same way

1. **+ New** → **Database** → **Redis**.
2. Copy `REDIS_URL` from the Redis service **Variables** tab (link it to the API in step 3).

---

## 3. Configure the API service

### Set root directory to `api`

**Option A (recommended):** In Railway → API service → **Settings** → **Root Directory** → set `api`.  
Railway then uses `api/Dockerfile` and `api/railway.toml` automatically.

**Option B:** Leave root directory empty — the repo root `railway.toml` points at `api/Dockerfile`.

If deploy fails with **"couldn't locate the dockerfile at path Dockerfile"**, the service is building from repo root without the root config. Use Option A or push the root `railway.toml` / `railway.json`.

### Link `DATABASE_URL` to the API

1. Stay on the **API** service.
2. Open **Variables**.
3. Click **+ New Variable** → **Add Reference** (or **Variable reference**).
4. Choose the **PostgreSQL** service.
5. Select **`DATABASE_URL`**.
6. Confirm — Railway creates a reference like `${{Postgres.DATABASE_URL}}`.

Repeat for **`REDIS_URL`** if you added Redis.

### Other required variables (same Variables tab)

Click **+ New Variable** → **Raw** for each:

| Variable | Value |
|----------|--------|
| `NODE_ENV` | `production` |
| `JWT_ACCESS_SECRET` | Random string, ≥32 chars (see below) |
| `MONETIZATION_DEV_MODE` | `false` |
| `ADMIN_SEED_EMAIL` | Your admin email |
| `ADMIN_SEED_PASSWORD` | Strong password (one-time seed) |

Generate JWT secret (run on your PC):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Do **not** set `PORT` — Railway sets it automatically.

### Check the canvas wiring

On the project canvas you should see:

```
[ GitHub / API service ]  ----references---->  [ PostgreSQL ]
```

If `DATABASE_URL` is missing on the API service, deploy will fail at the migration step.

---

## 4. Deploy

Push to the connected branch. Railway will:

1. **Build** the Docker image (`npm ci` + `nest build`)
2. **Release** — run `node scripts/apply-migrations.mjs`
3. **Start** — `node dist/main.js`

Health check: `GET /health` → `{ "status": "ok" }`

## 5. Seed admin (one-time or on every deploy)

If `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` are set on the **API service**, each deploy runs `seed-admin-user.mjs` and creates/updates that admin (password synced to `ADMIN_SEED_PASSWORD`).

**Setting variables alone does not create a user** until seed runs (deploy or shell).

After first successful deploy, or anytime login fails with 401, open **Railway shell** on the API service:

```bash
npm run db:seed:admin
npm run db:seed:rbac   # optional
```

Sign in with the exact `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` from Railway Variables (not the local default unless you set that on Railway too).

Unset or rotate `ADMIN_SEED_PASSWORD` after seeding if you stored it in variables only for bootstrap.

## 6. Point clients at the API

| App | Variable | Live value |
|-----|----------|------------|
| Admin | `NEXT_PUBLIC_API_URL` | `https://ahlulbayt-production.up.railway.app` |
| Mobile | `API_BASE_URL` | `https://ahlulbayt-production.up.railway.app/v1` |

Configured in `admin/.env.local` and `mobile/.env`.

Optional: add a custom domain in Railway → **Settings** → **Networking**.

## 7. Troubleshooting

| Issue | Fix |
|-------|-----|
| Migrate fails on deploy | Check **Deploy logs** for release command; verify `DATABASE_URL` |
| `ECONNREFUSED` to Postgres | Ensure Postgres plugin is linked to the API service |
| SSL errors | `DATABASE_URL` should include `sslmode=require` (Railway default) |
| Build fails | Run `npm run build` locally in `api/` |
| `couldn't locate the dockerfile at path Dockerfile` | Set **Root Directory** = `api`, or push root `railway.toml` with `dockerfilePath = "api/Dockerfile"` |
| Empty API logs in admin | Request logging middleware not wired yet — table exists, ingest is Phase 2 |

## Local Docker build (optional)

```bash
cd api
docker build -t ahlulbayt-api .
docker run --env-file .env -p 3000:3000 ahlulbayt-api
```
