# AhlulBayt+ Authentication System
## v1.0 — Security, API & Implementation

---

## Overview

| Method | Flow |
|--------|------|
| Email + Password | Register → OTP verify → Login |
| Google | ID token → server verify → JWT |
| Apple | Identity token → server verify → JWT |
| Guest | Anonymous user + JWT (`isGuest: true`) |
| Password Reset | Forgot → OTP + reset token → new password |
| OTP | 6-digit code, 10 min TTL, 5 attempts |

---

## API Endpoints

Base URL: `https://api.ahlulbayt.app` (dev: `http://localhost:3000`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/auth/register` | — | Email registration |
| `POST` | `/v1/auth/login` | — | Email login |
| `POST` | `/v1/auth/guest` | — | Create guest session |
| `POST` | `/v1/auth/google` | — | Google ID token |
| `POST` | `/v1/auth/apple` | — | Apple identity token |
| `POST` | `/v1/auth/refresh` | — | Rotate refresh token |
| `POST` | `/v1/auth/logout` | Bearer | Revoke refresh token |
| `GET` | `/v1/auth/me` | Bearer | Current user profile |
| `POST` | `/v1/auth/password/forgot` | — | Initiate reset |
| `POST` | `/v1/auth/password/reset` | — | Set new password |
| `POST` | `/v1/auth/otp/send` | — | Send OTP |
| `POST` | `/v1/auth/otp/verify` | — | Verify OTP |
| `POST` | `/v1/auth/guest/merge` | Bearer (guest) | Upgrade guest account |

### Register

```http
POST /v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123",
  "displayName": "Hussein",
  "locale": "en"
}
```

**Response 201:**
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "emailVerified": false, "isGuest": false },
  "tokens": { "accessToken": "...", "refreshToken": "...", "expiresIn": 900 }
}
```

### Login

```http
POST /v1/auth/login
{ "email": "user@example.com", "password": "securepass123" }
```

### Guest

```http
POST /v1/auth/guest
```

### Google / Apple

```http
POST /v1/auth/google
{ "idToken": "eyJ..." }

POST /v1/auth/apple
{ "identityToken": "eyJ...", "fullName": "Hussein Ali" }
```

### Refresh

```http
POST /v1/auth/refresh
{ "refreshToken": "opaque-token" }
```

### OTP

```http
POST /v1/auth/otp/send
{ "email": "user@example.com", "purpose": "email_verify" }

POST /v1/auth/otp/verify
{ "email": "user@example.com", "code": "123456", "purpose": "login" }
```

`purpose`: `email_verify` | `login` | `password_reset`

### Password Reset

```http
POST /v1/auth/password/forgot
{ "email": "user@example.com" }

POST /v1/auth/password/reset
{ "token": "opaque-reset-token", "password": "newsecurepass" }
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Identity, password hash, guest flag |
| `oauth_accounts` | Google/Apple provider links |
| `refresh_tokens` | Opaque refresh rotation families |
| `otp_codes` | Hashed 6-digit codes |
| `password_reset_tokens` | Hashed reset tokens |

Migration: `api/drizzle/migrations/0000_auth.sql`

---

## Security

### Passwords
- bcrypt cost factor **12**
- Minimum length **8** characters
- Never logged or returned in API

### Tokens
| Token | Type | Lifetime | Storage (mobile) |
|-------|------|----------|------------------|
| Access | JWT HS256 | 15 min | MMKV (memory preferred) |
| Refresh | Opaque SHA-256 stored | 30 days | MMKV secure |
| Reset | Opaque SHA-256 stored | 60 min | Email link only |
| OTP | SHA-256 hashed | 10 min | Never stored client-side |

### Refresh Rotation
- Each refresh revokes previous token in family
- Reuse of revoked token → revoke entire family (future enhancement)

### Rate Limiting
| Endpoint | Limit |
|----------|-------|
| `/register` | 5/min |
| `/login` | 10/min |
| `/otp/send` | 3/min |
| `/password/forgot` | 3/min |
| Global | 100/min |

### OAuth Verification
- **Google:** `google-auth-library` ID token verify against `GOOGLE_CLIENT_ID`
- **Apple:** `apple-signin-auth` JWT verify against `APPLE_CLIENT_ID`

### Guest Mode
- `is_anonymous: true` on user row
- JWT claim `isGuest: true`
- Limited: no cloud sync until merge
- Merge via `/guest/merge` with email or OAuth

### Privacy
- Forgot password returns same message whether email exists
- OTP codes logged only in `development`

---

## Mobile Implementation

```
mobile/src/features/auth/
├── services/authApi.ts
├── hooks/useAuth.ts
├── components/AuthInput.tsx
└── screens/
    ├── AuthScreen.tsx
    ├── EmailLoginScreen.tsx
    ├── EmailRegisterScreen.tsx
    ├── ForgotPasswordScreen.tsx
    └── OtpVerifyScreen.tsx

app/(auth)/
├── _layout.tsx
├── index.tsx
├── login.tsx
├── register.tsx
├── forgot-password.tsx
└── verify-otp.tsx
```

---

## Local Development

```bash
docker compose up -d
cd api && cp .env.example .env && npm install && npm run db:push && npm run start:dev
cd mobile && npm start
```

OTP codes print to API console in development.

---

*Auth System v1.0 · June 2026*
