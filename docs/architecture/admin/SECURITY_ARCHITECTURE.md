# Admin Dashboard — Security Architecture

**Version:** 1.0 · June 2026

---

## 1. Threat model

| Threat | Mitigation |
|--------|------------|
| Unauthorized admin access | JWT + RBAC + WAF IP allowlist |
| Privilege escalation | super_admin-only role promotion + audit |
| Data exfiltration | Rate limits, export audit, PII redaction |
| CSRF on admin UI | SameSite cookies, CSRF token (phase 2) |
| API abuse | 30 req/min admin throttle |
| Credential stuffing | `security_events` + account lockout (phase 2) |

---

## 2. Authentication

1. Admin users: `users.role ∈ {moderator, admin, super_admin}`
2. Same JWT issuer as mobile (`JWT_ACCESS_SECRET`)
3. Admin UI stores tokens in **httpOnly cookies** (not localStorage)
4. Optional: Google Workspace SSO `@ahlulbayt.app` (phase 2)
5. MFA via `admin_users.mfa_enabled` (phase 2)

---

## 3. Network controls

```
Internet
  → Cloudflare WAF
      → /v1/admin/* : office IP + admin VPC only (prod)
      → admin.ahlulbayt.app : separate origin
  → NestJS API
```

---

## 4. Security events

`security_events` captures:

| event_type | severity | Trigger |
|------------|----------|---------|
| `auth.failed_login` | medium | Invalid credentials |
| `auth.token_reuse` | high | Refresh token family reuse |
| `admin.permission_denied` | low | RBAC rejection |
| `waf.blocked` | medium | WAF rule hit |
| `user.ban` | info | Admin soft-delete |

---

## 5. Audit

All mutating admin actions → `admin_audit_log`:

```json
{
  "action": "user.ban",
  "targetType": "user",
  "targetId": "uuid",
  "payload": { "reason": "abuse" },
  "ipAddress": "203.0.113.1"
}
```

Retention: 2 years. Immutable append-only.

---

## 6. Sensitive operations

| Operation | Guard |
|-----------|-------|
| User hard-delete | super_admin + audit |
| Manifest publish | admin + audit + Slack webhook |
| AI guardrails change | super_admin + audit |
| RBAC matrix edit | super_admin + audit |
| R2 presigned upload | admin + content-type allowlist |

---

## 7. Secrets

| Secret | Storage |
|--------|---------|
| JWT secrets | AWS Secrets Manager / env |
| R2 credentials | Env, never in admin UI |
| PostHog API key | Server-side only |
| FCM service account | ECS task role |

---

*Owner: Platform Security*
