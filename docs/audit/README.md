# AhlulBayt+ audit — 12 November 2026

Scope of this pass: Quran integrity (complete), critical security (API, admin, build), and a
first survey of content, offline, admin connectivity, notifications and performance.
Everything below was established by reading or running the code in this repository.
Nothing was run on a phone or simulator, and no production system was touched.

Status words used throughout:

- **Fixed** — changed in this pass and checked by a test, a build or a script.
- **Verified** — checked and found correct; no change needed.
- **Pending** — confirmed problem, not yet fixed.
- **Needs you** — cannot be finished without a credential, a decision or a scholar.

## 1. Headline findings

| # | Priority | Finding | Status |
| --- | --- | --- | --- |
| 1 | P0 | The app shipped with **no Quran text**. Arabic was downloaded at runtime from a third-party API (alquran.cloud) with no verification and cached as if trusted. Offline, the reader showed empty verses. | Fixed |
| 2 | P0 | iOS project could not build: unresolved merge-conflict markers in `Info.plist` and `project.pbxproj`. | Fixed (files lint clean; not built in Xcode) |
| 3 | P0 | A super-admin password was published in the repository (seed script, `.env.example`, and inside the admin login page's browser code), and the seed re-applied the env password on every deploy. | Fixed in code — **you must still change the live password** |
| 4 | P0 | Store webhooks were open to anyone: a caller who knew a transaction id could expire, refund or renew any subscription. | Fixed with a shared-secret gate; full signature verification pending |
| 5 | P0 | Purchases are never verified with Apple or Google. Any signed-in user can post any string and receive premium. | Needs you (store credentials) |
| 6 | P0 | Behind Railway's proxy every user shared one rate-limit bucket (100 requests/minute for the whole user base), because the proxy was not trusted for the client IP. | Fixed |
| 7 | P0 | 69 Arabic/Urdu strings in duas and Nahjul Balagha end in "…" — the text is cut short. | Needs you (see §5) |
| 8 | P1 | Account takeover by pre-registration: an attacker could register a victim's email with a password, then keep access after the victim signed in with Google/Apple. | Fixed |
| 9 | P1 | Refresh tokens rotated but replay was not detected. | Fixed |
| 10 | P1 | Verification and password-reset codes are generated but never sent (no email provider). Email verification and reset do not work in production. | Needs you (email provider) |
| 11 | P1 | Mobile app does not typecheck: 68 errors before this pass, 61 now (none in files changed here). No CI existed. | CI added; errors pending |
| 12 | P1 | Login tokens (including the 30-day refresh token) are stored in unencrypted MMKV on the phone. | Pending (needs a native keychain dependency and a device build) |

## 2. Quran integrity verification

Full machine-generated report: [quran-integrity-report.md](quran-integrity-report.md).

**Source.** Tanzil.net Uthmani v1.1 (Creative Commons Attribution 3.0, verbatim copies only).
A fresh download on 12 Nov 2026 is byte-identical to the checksum the project pinned on
17 Jun 2026 (`bf4f57b9…12c8`). The source file, with Tanzil's copyright block, is now committed
at `api/data/quran/source/quran-uthmani.txt`, alongside Tanzil's own metadata file.

**Result for the bundled text.**

| Check | Result |
| --- | --- |
| Surahs | 114 of 114 |
| Ayahs | 6,236 of 6,236 |
| Missing / duplicate / re-ordered ayahs | 0 / 0 / 0 |
| Modified or truncated ayahs (code-point comparison) | 0 |
| Encoding errors (anything outside the Arabic block) | 0 |
| Checksum mismatches | 0 |

**Al-Fatiha 1:7.** Bundled complete, nine words, identical to Tanzil:
`صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ`.
This is Uthmani orthography. The spelling quoted in the brief (`صِرَاطَ … الضَّالِّينَ`) is the
same verse in simple orthography; the two differ in spelling conventions only, not in words.
The cut-off display itself was not reproduced here because the app was not run on a device.
What was found and removed are the causes visible in the data: the reader had no text of its
own, and the prayer guide carried shortened "…" placeholders (see below).

**What the app showed before.** The alquran.cloud "quran-uthmani" edition was compared with
Tanzil v1.1 for all 6,236 ayahs:

- 1,876 ayahs identical and one more identical apart from a byte-order mark; 4,359 differ in
  encoding (pause marks, sajdah and rub-el-hizb signs, and older encodings of small letters).
- Letter-for-letter, 6,234 ayahs are the same. Two differ: 12:39 and 12:41, where the remote
  text has one extra letter (an older Tanzil spelling).
- No ayah was missing words. The text was labelled "Tanzil.net Uthmani v1.1" in the app,
  which was not accurate.

**Changes made.**

- All 114 surahs now ship inside the app (`mobile/src/features/quran/data/bundled/generated/`,
  2.2 MB), each loaded only when opened. Arabic is never taken from the network again.
- Tanzil prefixes the basmala to verse 1 of every surah except 1 and 9. It is now stored
  separately and shown above verse 1; the validator rebuilds the original line and compares
  it, so nothing is altered.
- Juz and page numbers come from Tanzil metadata. Previously every ayah of a surah carried
  the juz of its first ayah, and page was always 0.
- Translations (still Sahih International and Jalandhry from alquran.cloud) are overlaid by
  ayah number, accepted only when complete, and saved atomically.
- `npm run quran:validate` fails on any discrepancy. It runs in the API build, in CI, and
  inside `metro.config.js`, so no debug or release JS bundle can be produced from text that
  differs from the pin. A truncated 1:7 was used to confirm the bundle is refused.
- A re-fetch that differs from the pinned text is saved as a candidate and rejected until a
  person reviews it and passes `--accept-update`.
- 15 automated tests cover truncation, a single changed diacritic, missing, duplicated and
  re-ordered verses, and a missing surah file.

**Verified correction recorded.** Prayer guide, Surah Al-Qadr 97:1
(`mobile/src/features/prayer-academy/data/shared/recitationContent.ts`):

| | Text |
| --- | --- |
| Original | `أَنْزَلْنَاهُ` (sukun on the nun) |
| Replacement | `أَنزَلْنَاهُ` |
| Source | Tanzil simple-script text, downloaded 12 Nov 2026 |

The rest of the prayer guide's Al-Fatiha and Al-Qadr is canonically identical to Tanzil.

**Open Quran items.**

| Priority | Item | Status |
| --- | --- | --- |
| P1 | Translations are not bundled, so they are offline only after a surah has been opened or downloaded once. Bundling needs a decision on which translations to license. The current ones (Sahih International, Jalandhry) are not Shia translations. | Needs you |
| P1 | Sajdah marks follow Tanzil metadata: 15 positions, obligatory at 32:15, 41:38, 53:62, 96:19. Ja'fari rulings place the obligatory sajdah of Surah Fussilat at 41:37 and do not treat all 15 as recommended. | Needs you (scholar) |
| P2 | The pinned text has no pause (waqf) marks; the project's Tanzil download options do not produce them. Adding them means re-pinning. | Needs you |
| P2 | Word-by-word and tajweed colouring have no data; the settings exist but show nothing. | Pending |
| P2 | Quran audio mapping, background playback and downloads were not tested; native audio is switched off (`NATIVE_AUDIO_ENABLED: false`). | Pending |
| P2 | Offline search matches Arabic only (translations are not in the bundle). Query folding was fixed so `الله` finds `ٱللَّهِ`; words spelled differently in Uthmani script (e.g. `صراط`) still do not match. | Pending |

## 3. Security assessment

Tested by reading every controller, guard and auth path in `api/`, the admin session code and
the mobile token storage. No penetration test was run against a live server.

**Fixed.**

| Priority | Issue | Fix |
| --- | --- | --- |
| P0 | Published admin password; seed overwrote the password on each boot | Seed needs `ADMIN_SEED_EMAIL` and a 12+ character `ADMIN_SEED_PASSWORD`, rejects the old default, and leaves an existing admin's password alone unless `ADMIN_SEED_RESET_PASSWORD=true`. Removed from `.env.example` and the login page. |
| P0 | Open store webhooks | `WEBHOOK_TOKEN` required (`?token=`); refused in production when unset. |
| P0 | Shared rate-limit bucket behind the proxy | `trust proxy` set (default one hop in production, `TRUST_PROXY` to override). |
| P1 | OAuth pre-registration takeover | Linking by email only when the provider marks it verified; an unverified existing account loses its password and sessions when claimed. |
| P1 | Refresh-token replay undetected | Tokens keep their family through rotation; replay of a used token revokes the family; consumption is atomic. |
| P1 | CORS reflected any origin with credentials | `CORS_ORIGINS` allow-list; cross-origin browser calls are off in production until it is set. |
| P1 | No start-up check on secrets | API refuses to start in production with a short or placeholder `JWT_ACCESS_SECRET`, no `DATABASE_URL`, or `MONETIZATION_DEV_MODE=true`. |
| P2 | Guest, Google, Apple, refresh and reset endpoints had no specific rate limit | Limits added. |
| P2 | Login timing revealed which emails exist | One bcrypt comparison always runs. |
| P2 | No security headers | `nosniff`, frame denial, referrer policy, HSTS in production; `X-Powered-By` removed. |

**Verified.** Every `/v1/admin/*` route requires a valid token and an admin role. Passwords use
bcrypt (12 rounds). Refresh, reset and one-time codes are stored hashed. Database access is
through Drizzle with bound parameters; no string-built SQL was found. Request bodies are
whitelisted by a global validation pipe. Admin tokens are in httpOnly cookies. iOS App
Transport Security disallows arbitrary loads.

**Pending or needs you.**

| Priority | Issue | Status |
| --- | --- | --- |
| P0 | Purchases not verified with Apple/Google (`subscriptions.service.ts`) | Needs you |
| P0 | Change the live admin password and rotate `JWT_ACCESS_SECRET` if it was ever the template value | Needs you |
| P1 | Webhook payload signatures (Apple JWS, Google Pub/Sub identity token) not verified | Pending |
| P1 | No email delivery for verification and reset codes | Needs you |
| P1 | Mobile tokens in unencrypted storage | Pending |
| P2 | Admin role is read from the 15-minute access token, so a demoted admin keeps access until it expires | Pending |
| P2 | `quran-audio` and `worship-guide` progress endpoints accept writes without authentication and do not persist them | Pending |
| P2 | Admin dashboard session lasts 15 minutes with no refresh | Pending |
| P2 | Any admin role, including moderator, can read users, logs and AI conversations; only a few routes use the permission system | Pending |
| P2 | Root/jailbreak detection, certificate pinning, deep-link validation: not assessed | Pending |
| P3 | Two lockfiles in `mobile/` (`package-lock.json`, `yarn.lock`); the npm one was out of sync and is now updated | Partly fixed |

The repository history still contains the malware loader removed earlier today
(commit `3232b31`), and the cleanup is on a branch that has not been pushed.

## 4. Architecture assessment

- **Shape.** NestJS API (9.3k lines, Postgres via Drizzle, Redis), Next.js admin (2.3k lines),
  React Native 0.85 app (77.6k lines, Zustand, React Query, MMKV). Feature folders on the
  mobile side are consistent and readable.
- **Content lives in the app, not the backend.** Duas, ziyarat, guides and Nahjul Balagha are
  TypeScript files in the mobile bundle. The API's content manifest
  (`api/src/content/data/manifest.bundles.ts`) lists downloadable bundles that are not produced
  anywhere in this repository.
- **No tests** existed apart from four Quran count checks; no CI; mobile did not typecheck.
- **Duplication.** Quran topic data and text-similarity code are duplicated between API and
  mobile and kept in sync by hand.

## 5. Islamic content authenticity

Not audited line by line; that needs a qualified reviewer. What the code shows:

| Priority | Finding | Status |
| --- | --- | --- |
| P0 | 69 Arabic-script strings end in "…": Dua Kumayl (7), Sabah (5), Mashlool (4), Ahad (3), Nudba (2), Tawassul (2) and Nahjul Balagha (46). Readers see cut-off text. These must be completed from duas.org by a person; none were written here. | Needs you |
| P1 | 11 cut-off strings in the prayer guide (Al-Fatiha, Al-Qadr, tashahhud, salam, tasbihat) — the Arabic-locale slots and the Urdu slot for Al-Qadr | Fixed, using the complete text already present in the same file |
| P1 | No review workflow. Only daily-life duas have a `verification_status` column; there is no Draft → Review → Scholar approval → Published path in the API or admin. | Pending |
| P1 | Source fields (book, volume, page, URL, reviewer) are not uniform across content types. | Pending |
| P2 | Hadith search and "explain" API endpoints are stubs that return empty results. | Pending |

## 6. Admin dashboard and backend connectivity

| Priority | Finding | Status |
| --- | --- | --- |
| P1 | Dashboard charts drew random numbers when there was no data | Fixed — empty state shown |
| P1 | Guides, media upload, platform health and parts of security and overview return hard-coded "stub" responses; nothing an admin does there reaches the app | Pending |
| P1 | No admin screens for Quran metadata, duas, ziyarat, hadith or scholar approval | Pending |
| — | Support (wallets, bank details, campaigns), users, feature flags, events, notification campaigns and audit log are backed by real tables | Verified by reading; not exercised against a database |

## 7. Offline, notifications, performance, UI

These areas were surveyed, not tested on a device.

- **Offline.** Quran Arabic: now fully offline (fixed). Duas, ziyarat, guides: bundled, so
  offline by construction. Translations and audio: online first.
- **Performance.** One measured change: opening a surah no longer waits for a network
  round-trip before showing Arabic, and concurrent translation requests are de-duplicated.
  No before/after timings were taken — that needs a device. Release JS bundle is 12.0 MB.
- **Fonts.** `Inter-Medium.ttf` and `Inter-SemiBold.ttf` are byte-for-byte copies of
  `Inter-Regular.ttf`, so medium and semibold weights do not exist on iOS (P2, pending).
  Scheherazade New covers every character in the Quran text. Noto Nastaliq Urdu lacks eight
  Quranic marks and must not be used for Quran text.
- **iOS.** The location permission text was empty, which App Review rejects; filled in.
- **Notifications, calendar engine, UI review.** Not assessed in this pass.

## 8. Test execution

| Suite | Result |
| --- | --- |
| Quran integrity + tamper tests (`npm run quran:test`) | 15 of 15 pass |
| Quran gate on shipped corpus | Pass — 114 surahs, 6,236 ayahs |
| API typecheck and build | Pass |
| Admin typecheck | Pass |
| Mobile typecheck | 61 errors, all pre-existing (68 before) |
| Mobile release JS bundle (Android, Metro) | Builds; contains the complete 1:7 |
| API against a database, admin against the API, iOS/Android native builds, device tests | Not run |

## 9. Production readiness

**Not ready.** Blocking items, in order:

1. Change the admin password; set `CORS_ORIGINS`, `WEBHOOK_TOKEN`, `ADMIN_SEED_EMAIL`.
2. Verify purchases with Apple and Google, or switch premium off.
3. Complete the 69 cut-off dua and Nahjul Balagha texts and have them reviewed.
4. Connect an email provider for verification and reset codes.
5. Build and run on iOS and Android; confirm the Quran reader on a device.
6. Fix the 61 mobile type errors and make the CI job blocking.
7. Decide on bundled translations and have sajdah marks reviewed.

## 10. New configuration

| Variable | Purpose |
| --- | --- |
| `CORS_ORIGINS` | Admin dashboard origin(s), comma separated. Required in production. |
| `TRUST_PROXY` | Proxy hops to trust for the client IP. Defaults to 1 in production. |
| `WEBHOOK_TOKEN` | Secret appended to the store webhook URLs. Required in production. |
| `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` | First admin account. No default. |
| `ADMIN_SEED_RESET_PASSWORD` | `true` to overwrite an existing admin's password once. |
