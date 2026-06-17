# Admin Dashboard — RBAC Model

**Version:** 1.0 · June 2026

---

## 1. Role hierarchy

```
super_admin  ──► full platform control
    │
  admin      ──► operational write (users, notifications, publish)
    │
moderator    ──► read-mostly + content editing
```

Legacy field: `users.role` (`user` | `moderator` | `admin` | `super_admin`)  
Extended model: `roles` → `role_permissions` → `permissions` + `admin_user_roles`

Phase 1 uses legacy `users.role` with `PermissionsGuard` mapping.  
Phase 2 migrates to DB-backed RBAC without breaking mobile users.

---

## 2. Permission matrix

| Permission | moderator | admin | super_admin |
|------------|:---------:|:-----:|:-----------:|
| `users.read` | ✓ | ✓ | ✓ |
| `users.write` | — | ✓ | ✓ |
| `users.delete` | — | — | ✓ |
| `analytics.read` | ✓ | ✓ | ✓ |
| `analytics.export` | — | ✓ | ✓ |
| `notifications.read` | ✓ | ✓ | ✓ |
| `notifications.write` | — | ✓ | ✓ |
| `cms.read` | ✓ | ✓ | ✓ |
| `cms.write` | ✓ | ✓ | ✓ |
| `cms.publish` | — | ✓ | ✓ |
| `guides.read` | ✓ | ✓ | ✓ |
| `guides.write` | — | ✓ | ✓ |
| `events.read` | ✓ | ✓ | ✓ |
| `events.write` | — | ✓ | ✓ |
| `flags.read` | ✓ | ✓ | ✓ |
| `flags.write` | — | ✓ | ✓ |
| `health.read` | ✓ | ✓ | ✓ |
| `logs.read` | — | ✓ | ✓ |
| `security.read` | — | ✓ | ✓ |
| `security.write` | — | — | ✓ |
| `ai.read` | — | ✓ | ✓ |
| `ai.write` | — | — | ✓ |
| `media.read` | ✓ | ✓ | ✓ |
| `media.write` | — | ✓ | ✓ |
| `rbac.read` | — | ✓ | ✓ |
| `rbac.write` | — | — | ✓ |
| `audit.read` | ✓ | ✓ | ✓ |

---

## 3. Center × role access

| Center | moderator | admin | super_admin |
|--------|:---------:|:-----:|:-----------:|
| Executive Overview | ✓ | ✓ | ✓ |
| User Management | read | read/write | full |
| Screen Analytics | ✓ | ✓ | ✓ |
| Advanced Notifications | read | read/write | full |
| Islamic CMS | edit | publish | full |
| Guide Management | read | write | full |
| Islamic Events | read | write | full |
| Feature Flags | read | write | full |
| Platform Health | ✓ | ✓ | ✓ |
| API Logs | — | ✓ | ✓ |
| Security | — | read | full |
| Analytics | ✓ | ✓ | ✓ |
| AI Management | — | read | full |
| Media Library | read | write | full |
| RBAC | — | read matrix | full |
| Audit Logs | ✓ | ✓ | ✓ |

---

## 4. Database tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin profile extension (department, MFA, last login) |
| `roles` | Role definitions (`moderator`, `admin`, `super_admin`) |
| `permissions` | Atomic grants (`resource.action`) |
| `role_permissions` | M:N role ↔ permission |
| `admin_user_roles` | M:N user ↔ role (phase 2 primary) |
| `admin_audit_log` | Immutable audit trail |

---

## 5. Promotion workflow

1. Super admin invites operator → creates `admin_users` row
2. Sets `users.role` to target role (phase 1) or assigns `admin_user_roles` (phase 2)
3. Action logged: `rbac.role_assigned`
4. Revocation: demote to `user`, revoke refresh tokens

---

## 6. Implementation

- `@Roles(...)` — coarse role check (existing)
- `@RequirePermission(...)` — fine-grained check
- `AdminAuthGuard` — JWT wrapper for admin routes
- `PermissionsGuard` — enforces permission slugs

---

*Owner: Platform Security*
