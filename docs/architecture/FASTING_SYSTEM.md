# Fasting System

Mobile-first, offline fasting module for AhlulBayt+ (`mobile/src/features/fasting/`).

## Overview

| Feature | Implementation |
|---------|----------------|
| Sehri countdown | `engine/fastingClock.ts` — countdown to **imsak** (Jafari) |
| Iftar countdown | Same engine — countdown to **maghrib** |
| Fast tracker | `stores/fastingStore.ts` — mark Ramadan & sunnah fasts |
| Missed fast / qada | `MissedFast` records in store + `MissedFastList` |
| Kaffara calculator | `engine/kaffaraCalculator.ts` + `KaffaraCalculatorScreen` |
| Fidya calculator | `engine/fidyaCalculator.ts` + `FidyaCalculatorScreen` |
| Ramadan progress | `engine/ramadanProgress.ts` — streak, ring, heatmap calendar |

## Prayer integration

- Reads **`usePrayerClockStore`** via `useFastingHub` (shared Jafari prayer engine).
- Sehri window ends at `times.imsak`; iftar at `times.maghrib`.
- After maghrib, countdown targets **tomorrow's imsak**.

## Hijri / Ramadan detection

- `getHijriDate()` extended with `isRamadan` (`month === 9`).
- `isRamadanMonth()` in `ramadanProgress.ts` for engine use.
- Home shows `RamadanBanner` during Ramadan; `FastingWidget` year-round.

## Persistence

- Zustand + MMKV key: `ahlulbayt-fasting`.
- Records keyed by Gregorian `YYYY-MM-DD` with hijri metadata.

## Citations

- Uses **`IslamicReference`** from `@/core/references/types` (alias `IslamicCitation` in `types.ts`).
- Seeded rulings in `data/jafariRulings.ts` with Sistani/Khamenei/Manhaj references.
- Most kaffara quantities marked **`verification: pending`** / `unverified: true`.
- Calculators show **`FiqhDisclaimerBanner`** + `ReferenceList`.

### Kaffara formulas (educational)

| Case | Output |
|------|--------|
| Forgetful | No kaffara |
| Coerced | Consult marja |
| Intentional Ramadan break | 60 consecutive fast days + feed 60 poor (general Jafari summary) |
| Non-Ramadan | Make-up / vow rules — consult marja |

### Fidya formula

```
totalGrams = missedDays × gramsPerDay (default 750g staple food per day)
```

Per general Sistani-aligned guidance for those permanently unable to fast.

## Navigation

| Route | Screen |
|-------|--------|
| `Fasting` | `FastingHubScreen` |
| `KaffaraCalculator` | `KaffaraCalculatorScreen` |
| `FidyaCalculator` | `FidyaCalculatorScreen` |

Registered in `RootNavigator.tsx`.

## Home & seasonal integration

- **Home**: `FastingWidget` / `RamadanBanner` in `HomeScreen`.
- **Islamic events**: `prioritiesCatalog.ts` Ramadan priorities route to `Fasting` (`fasting_tracker`, `sehri_countdown`, `iftar_countdown`).
- **More menu**: Worship section → Fasting Hub.

## Coordination with `features/ramadan/`

`RamadanHub` is the seasonal dashboard (daily amaal, Quran goal, charity, Laylat al-Qadr). It **consumes** `useFastingHub()` for sehri/iftar countdown and links to `Fasting` for full tracking + calculators.

| Concern | Owner module |
|---------|----------------|
| Sehri/iftar countdown UI (hero) | `ramadan/` (`RamadanHeroWidget`) + `fasting/` (`SehriIftarCountdown`) |
| Countdown engine | Equivalent logic in `fasting/engine/fastingClock.ts` and `ramadan/engine/sehriIftarEngine.ts` |
| Fast / missed / qada persistence | `fasting/stores/fastingStore.ts` (canonical) |
| Ramadan day picker, amaal, Quran goal | `ramadan/stores/*` |
| Kaffara / fidya calculators | `fasting/` only |

Do not duplicate calculator or missed-fast stores in `ramadan/`.

## i18n

All user-facing strings under `fasting.*` in `en.json`.

## Offline constraints

- No network calls; prayer times from local Jafari engine.
- Calendar heatmap uses approximate hijri→Gregorian mapping (device `Intl` Islamic calendar).
