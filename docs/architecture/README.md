# Ahlulbayt+ Architecture Documentation

Enterprise architecture for the production-scale Shia Ithna Ashari Islamic super app.

## Documents

| Document | Scope |
|----------|-------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System overview, mobile, backend, auth, notifications, offline, analytics, CI/CD, security, scalability |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | PostgreSQL schema, indexes, partitioning, migrations |
| [ENGINES.md](./ENGINES.md) | Prayer times, Qibla, Quran data, AI pipeline |
| [OFFLINE_FIRST_SYNC.md](./OFFLINE_FIRST_SYNC.md) | Offline-first design, Quran/Duas/Ziyarat/Prayer sync strategy |
| [NOTIFICATION_ENGINE.md](./NOTIFICATION_ENGINE.md) | Intelligent local notification orchestration |
| [QURAN_DATA_INTEGRITY.md](./QURAN_DATA_INTEGRITY.md) | Verified Tanzil corpus, validation pipeline, offline bundles |
| [DAILY_LIFE_DUAS.md](./DAILY_LIFE_DUAS.md) | Daily life duas module — schema, categories, search, offline, UI, API |
| [SUPPORT_DONATIONS.md](./SUPPORT_DONATIONS.md) | Community support — crypto donations, admin config, analytics, App Store compliance |
| [ADMIN_PLATFORM_REBUILD.md](./ADMIN_PLATFORM_REBUILD.md) | Admin audit, CMS architecture, realtime sync, rebuild roadmap |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native 0.76+ (New Architecture) |
| Backend | NestJS 11, TypeScript 5 |
| Database | PostgreSQL 16 (RDS Aurora) |
| Cache | Redis 7 (ElastiCache) |
| Push / Auth bridge | Firebase (FCM, App Check, Dynamic Links) |
| Cloud | AWS (ECS Fargate, S3, CloudFront, SQS, EventBridge) |

## Architecture Principles

1. **Offline-first worship** — Prayer, Quran, Duas work without network
2. **Edge compute for latency** — Prayer/Qibla calculated on-device; server validates
3. **Scholarly guardrails** — AI never issues fatwa; citations required
4. **Privacy by default** — Location stays on-device unless user opts in
5. **Multi-tenant marja** — Calculation methods are configuration, not code forks
6. **Horizontally scalable** — Stateless API; async workers for heavy jobs

## Version

Architecture v1.0 — June 2026
