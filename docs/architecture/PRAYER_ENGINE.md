# Jafari Prayer Engine
## Fiqh Jafariya · On-Device · v1.0

---

## Overview

The prayer engine computes **Jafari (Shia Ithna Ashari)** prayer times entirely on-device. No network is required after GPS coordinates are cached.

```
mobile/src/core/prayer-engine/
├── index.ts              Public API
├── types.ts              PrayerTimeKey, PrayerConfig, PrayerTimes
├── methods.ts            Leva, Tehran, Jafari presets
├── astronomical.ts       Solar declination, hour angle, Asr altitude
├── timezone.ts           IANA timezone + DST via Intl
├── highLatitude.ts       Polar region rules
├── calculate.ts          Main calculatePrayerTimes()
├── nextPrayer.ts         Next prayer + countdown
└── format.ts             Display helpers

mobile/src/features/prayer/
├── services/prayerService.ts   GPS + calculation facade
└── hooks/usePrayerTimes.ts     React hook for UI

mobile/src/stores/prayerStore.ts   Method, offsets, timezone prefs
```

---

## Jafari Calculation Rules

| Time | Rule | Default (Leva / Sistani) |
|------|------|--------------------------|
| **Imsak** | Fajr − offset | −10 min before Fajr |
| **Fajr** | Sun depression angle | 16° below horizon |
| **Sunrise** | Astronomical + refraction | −0.833° |
| **Dhuhr** | Solar noon + offset | +5 min after zenith |
| **Asr** | Shadow factor | **1** (Jafari, not Hanafi 2) |
| **Maghrib** | Sunset + red shafaq delay | **+17 min** after sunset |
| **Isha** | Sun depression angle | 14° (must be ≥ Maghrib) |
| **Midnight** | Juridical (Jafari) | Midpoint sunset → Fajr |

### Key Jafari Differences from Sunni Methods

1. **Maghrib +17 min** — waits for red twilight (shafaq ahmar) to disappear  
2. **Asr shadow = 1** — standard Jafari/Shafi'i, not Hanafi (2)  
3. **Midnight** — `(Sunset + Fajr) / 2`, not solar midnight  
4. **Imsak** — pre-Fajr fasting stop for Ramadan  

---

## Calculation Methods

| ID | Name | Fajr | Isha | Maghrib Delay | Dhuhr +min |
|----|------|------|------|---------------|------------|
| `leva` | Leva Institute (Sistani) | 16° | 14° | 17 | 5 |
| `tehran` | Tehran (Khamenei) | 17.7° | 14° | 17 | 5 |
| `jafari` | Jafari Standard | 16° | 14° | 17 | 0 |
| `custom` | User-defined | configurable | configurable | configurable | configurable |

```typescript
import { calculatePrayerTimes, createDefaultConfig } from '@/core/prayer-engine';

const times = calculatePrayerTimes(
  new Date(),
  { latitude: 33.3152, longitude: 44.3661 }, // Baghdad
  {
    ...createDefaultConfig('Asia/Baghdad'),
    method: 'leva',
    manualOffsets: { maghrib: 2 }, // +2 min user adjustment
  },
);

// times.fajr, times.sunrise, times.dhuhr, times.asr,
// times.maghrib, times.isha, times.midnight, times.imsak
```

---

## Features

### GPS Based
- `PrayerService.refreshLocationFromGps()` uses `expo-location`
- Coordinates cached in `locationStore` (MMKV)
- Recalculates when device moves **> 5 km**

### Manual Adjustment
Per-prayer minute offsets stored in `prayerStore.manualOffsets`:

```typescript
usePrayerStore.getState().setManualOffset('maghrib', 3);  // +3 min
```

Applied after astronomical calculation.

### Multiple Calculation Methods
Switch via `usePrayerStore.getState().setMethod('tehran')`.

### Offline Calculations
Pure TypeScript — zero network. Works in airplane mode.

### DST Support
Uses IANA timezone strings (`Asia/Baghdad`, `America/New_York`) with `Intl` API:

```typescript
getTimezoneOffsetMinutes('America/New_York', date); // correct on DST transition days
localTimeToDate(year, month, day, minutes, timezone); // wall-clock → Date
```

Set `timezone: 'auto'` to follow device timezone.

---

## High Latitude Rules

When Fajr/Isha angles have no solution (polar regions):

| Rule | Behavior |
|------|----------|
| `angle_based` | Use angles; fall back to 1/7 night if invalid |
| `one_seventh` | Fajr = sunrise − 1/7 night; Isha = sunset + 1/7 night |
| `middle_of_night` | Fajr/Isha at midpoints of night segments |

---

## API Reference

```typescript
// Core
calculatePrayerTimes(date, coordinates, config): PrayerTimes
batchCalculatePrayerTimes(startDate, days, coordinates, config): PrayerTimes[]

// Navigation
getNextPrayer(times, now?, tomorrowTimes?): NextPrayerInfo
prayerTimesToSchedule(times): PrayerTimeEntry[]

// Display
formatPrayerTime(date, locale): string
formatCountdown(ms): string

// Config
createDefaultConfig(timezone): PrayerConfig
resolveMethodParams(method): PrayerMethodParams
getDeviceTimezone(): string
```

---

## Integration

### Home Dashboard
`useDashboard()` → `usePrayerTimes()` → live countdown widget

### Prayer Tab
Full schedule: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha + Imsak/Midnight meta

### Adhan Notifications (planned)
```typescript
const week = PrayerService.calculateRange(config, 7);
await NotifeeService.schedulePrayerAlarms(week);
```

**Recalculation triggers:**
- Location change > 5 km  
- Midnight local time  
- User changes method/offsets  
- DST transition (automatic via IANA timezone)  

---

## Server Role

The API **does not** compute per-request times. It validates client-submitted times for anomaly detection and serves mosque override tables from PostgreSQL.

---

## Accuracy Target

±1 minute vs Leva Institute reference tables for latitudes 25°–45°N.

---

*Prayer Engine v1.0 · AhlulBayt+ · June 2026*
