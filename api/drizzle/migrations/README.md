# Database Migrations

PostgreSQL migrations for AhlulBayt+. Apply **in numeric order**.

## Quick start

```bash
cd api
export DATABASE_URL=postgresql://ahlulbayt:ahlulbayt@localhost:5432/ahlulbayt

# Apply all (PowerShell)
Get-ChildItem drizzle/migrations/*.sql | Sort-Object Name | ForEach-Object {
  psql $env:DATABASE_URL -f $_.FullName
}
```

## Migration index

| File | Phase | Description |
|------|-------|-------------|
| `0000_auth.sql` | MVP | users, oauth, refresh_tokens, otp, password_reset |
| `0001_core_modules.sql` | MVP | preferences, devices, sync, qadha, bookmarks, AI |
| `0002_indexes_constraints.sql` | MVP | Partial indexes, unique constraints, FK fixes |
| `0003_content_catalog.sql` | Content | Quran, duas, ziyarat, calendar, manifests |
| `0004_subscriptions.sql` | Premium | IAP subscriptions, family, tier sync trigger |
| `0005_ai_extended.sql` | AI | Citations, rate limits, pgvector RAG |
| `0006_community.sql` | Social | Community events, RSVPs, tasbih |
| `0012_admin_platform.sql` | Admin | Platform admin extensions |
| `0013_quran_corpus.sql` | Content | Quran indexes, tafsir, audio tracks, translation_source |

## Seeds (optional, after 0003)

```bash
psql $DATABASE_URL -f drizzle/seeds/001_quran_surahs.sql
psql $DATABASE_URL -f drizzle/seeds/002_calendar_events.sql
node scripts/seed-admin-user.mjs   # default admin@ahlulbayt.com (see script)
```

## Production checklist

1. Snapshot RDS before migration
2. Run migrations via ECS one-off task (not in app startup)
3. Verify: `SELECT * FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;`
4. After 0005 + embedding load: create IVFFlat index manually
5. Monthly: `SELECT create_analytics_partition(...)` for new partition

## Rollback

Each migration includes `-- DOWN` comments. Production rollbacks use forward-fix migrations, not DROP TABLE.

## Design reference

See [`docs/architecture/POSTGRES_DESIGN.md`](../../docs/architecture/POSTGRES_DESIGN.md) for ERD, relationships, index rationale, and performance strategy.
