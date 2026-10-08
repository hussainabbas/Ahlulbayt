# Admin Dashboard — Notification Architecture

**Version:** 1.0 · June 2026

---

## 1. Scope

Admin notifications = **platform broadcasts** (Eid, Muharram, app updates).  
Distinct from per-user **adhan/prayer** notifications (mobile-local + `NOTIFICATION_ENGINE.md`).

---

## 2. Data model

| Table | Purpose |
|-------|---------|
| `notification_templates` | Reusable title/body with `{{variables}}` |
| `notification_campaigns` | Draft → scheduled → sending → sent |
| `notification_deliveries` | Per-device delivery tracking |
| `devices` | FCM/APNs push tokens (existing) |

---

## 3. Campaign lifecycle

```
draft ──► scheduled ──► sending ──► sent
              │
              └──► cancelled
```

| Status | Description |
|--------|-------------|
| `draft` | Editable, no sends |
| `scheduled` | `scheduled_at` set, worker queued |
| `sending` | BullMQ job in progress |
| `sent` | Completed, `recipient_count` final |
| `cancelled` | Aborted before send |

---

## 4. Segmentation

Campaign `segment` JSON:

```json
{
  "locale": ["en", "ar"],
  "tier": ["premium"],
  "platform": ["ios", "android"],
  "timezone": "America/Detroit",
  "muharram_mode": "on"
}
```

Preview: `POST /v1/admin/notifications/preview` → device count.

---

## 5. Delivery pipeline (phase 2)

```
Admin UI create campaign
  → POST /v1/admin/notifications/campaigns
  → BullMQ job: notification-send
      → Resolve segment → devices
      → Insert notification_deliveries (pending)
      → FCM/APNs batch send
      → Update delivery status
  → WebSocket: admin notifications center live progress
```

Phase 1: CRUD + preview functional; send endpoint returns stub job ID.

---

## 6. A/B testing (phase 2)

- Split campaign into variants A/B in `segment.ab_variant`
- Track `opened_at` on deliveries
- Winner auto-selected after 24h (documented in IMPLEMENTATION_PLAN)

---

## 7. Templates

| Key | Channel | Use |
|-----|---------|-----|
| `eid_mubarak` | push | Seasonal |
| `app_update` | push | Force update nudge |
| `premium_offer` | push | Monetization |

---

*Owner: Growth Engineering*
