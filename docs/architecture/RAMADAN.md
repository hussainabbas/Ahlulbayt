# Ramadan Experience Architecture

## Overview

The Ramadan module (`mobile/src/features/ramadan/`) delivers a premium seasonal experience during Hijri month 9. It mirrors the Muharram pattern: bundled offline content with **mandatory scholarly citations** on every claim, local persistence via MMKV, and Home screen prioritization.

## Integration map

```
┌─────────────────────────────────────────────────────────────┐
│ HomeScreen (month === 9)                                    │
│  RamadanHeroWidget ──► features/fasting (sehri/iftar clock) │
│  LaylatAlQadrBanner ──► LaylatAlQadrScreen                  │
│  QuranGoalWidget ──► quranGoalStore                         │
│  RamadanDailyWidget ──► dailyContent (30-day seed)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ RamadanHubScreen                                            │
│  Daily dua/hadith/amaal · prayer tracker · charity · links  │
│  to FastingHub (qada/kaffara/fidya)                         │
└─────────────────────────────────────────────────────────────┘
```

## Detection

| Function | Location | Rule |
|----------|----------|------|
| `isRamadanMonth` | `ramadanRepository.ts` | `hijri.month === 9` |
| `isRamadanSeason` | `ramadanRepository.ts` | month 9 or Sha'ban 15+ |
| `isLastTenNights` | `ramadanRepository.ts` | month 9, day ≥ 21 |
| `getHijriDate()` | `home/services/hijriDate.ts` | exposes `isRamadan`, `isLastTenNights` |

## Prayer times (Sehri / Iftar)

Reuses `features/fasting/engine/fastingClock.ts`:

- **Sehri ends** at `imsak` (Jafari: fajr − 10 min by default)
- **Iftar** at `maghrib`
- After maghrib, countdown targets tomorrow's `imsak`

## Stores (MMKV)

| Store | Key | Purpose |
|-------|-----|---------|
| `ramadanStore` | `ahlulbayt-ramadan` | mode auto/on/off, selected day |
| `quranGoalStore` | `ahlulbayt-ramadan-quran-goal` | daily pages/ayahs/juz target |
| `charityTrackerStore` | `ahlulbayt-ramadan-charity` | sadaqah & zakat al-fitr intentions |
| `useFastingStore` | `ahlulbayt-fasting` | fast days, missed, qada (shared with Fasting Hub) |
| `usePrayerCompletionStore` | `ahlulbayt-prayer-completions` | daily prayer marks |

## Content & references

- **30-day seed**: `data/dailyContent.ts` — dua, hadith, amaal per day
- **Laylat al-Qadr**: `data/laylatAlQadr.ts` — nights 19, 21, 23, 25, 27, 29
- **Citations**: `data/citations.ts` — Bihar, Mafatih, Sahifa, Wasail, Quran, etc.
- Every item includes `citations[]` or `unverified: true`

## Navigation routes

| Route | Screen |
|-------|--------|
| `RamadanHub` | `RamadanHubScreen` |
| `LaylatAlQadr` | `LaylatAlQadrScreen` |
| `Fasting` | existing Fasting Hub (qada calculators) |

## API stub (future sync)

See `api/src/database/schema.ts` → `ramadan_progress` table for optional cloud sync of Quran goals, charity logs, and fasting notes.

## Related engines

- `core/islamic-events` — seasonal home priorities
- `features/calendar` — Ramadan events in `shiaEvents.ts`
- `features/notifications` — `ramadanOnly` rules already filtered by `isRamadan`
