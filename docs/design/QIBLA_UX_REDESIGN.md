# Qibla Finder — UX Redesign
## AhlulBayt+ · Product Design Spec

**Goal:** Qibla accessible within **1 tap** from the user's primary entry points.

**Constraints:** Fully offline (GPS + compass only). Zero API calls. Instant render — no loading states.

---

## 1. UX redesign

### Current state (problem)

| Path | Taps | Issue |
|------|------|-------|
| Profile → Quick Access → Qibla | 2 | Buried in secondary navigation |
| Profile → Tools → Qibla | 2 | Same |
| Home | — | No Qibla surface |

Qibla is a **high-frequency, time-sensitive** utility (used before prayer, while traveling). It belongs alongside Prayer and Quran — not in a tools drawer.

### Target experience

```
┌─────────────────────────────────────┐
│  HOME                               │
│  ┌─────────────────────────────┐   │
│  │ 🕋 Qibla          [Open →]  │   │  ← 1 tap
│  │ 247° · 4,821 km to Kaaba    │   │
│  │     [ mini compass dial ]   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  QIBLA (tab or full screen)         │
│  Live compass · Map · AR            │
│  Offline · Instant                  │
└─────────────────────────────────────┘
```

### Design principles

1. **Progressive disclosure** — Home shows bearing + distance + static preview (no magnetometer). Full compass activates only on Qibla screen.
2. **Zero latency** — Home card uses sync `calculateQibla()` from persisted coordinates; no spinners.
3. **Offline-first badge** — Subtle “Works offline” indicator builds trust.
4. **Alignment feedback** — Full screen retains green glow + haptic when aligned (<5°).
5. **One primary action** — “Open Qibla” CTA; entire card is tappable.

### What we rejected

| Option | Verdict | Reason |
|--------|---------|--------|
| **FAB on every screen** | ❌ Reject | Conflicts with Quran mini-player, adhan UI, thumb zones; visual clutter |
| **Replace Prayer tab** | ❌ Reject | Prayer times are the app's core loop |
| **Replace Quran tab** | ❌ Reject | Second-most-used worship surface |
| **6-tab bar** | ❌ Reject | Cognitive overload; labels truncate on small phones |
| **Loading / API gate** | ❌ Reject | Qibla must work in airplane mode |

---

## 2. Home screen placement

### Position in scroll hierarchy

```
Hero (greeting, date, weather)
Seasonal banners (conditional)
Next Prayer widget          ← worship context
★ QIBLA CARD ★               ← NEW — immediately after prayer context
Tasbih
Daily content (verse, hadith, dua)
...
```

**Rationale:** Users often check prayer time then qibla direction. Placing Qibla directly under Next Prayer creates a natural worship workflow.

### Card anatomy

| Zone | Content | Data source |
|------|---------|-------------|
| Header | “Qibla” label + offline pill | i18n |
| Hero row | Bearing (247°) + Distance (4,821 km) | `calculateQibla()` sync |
| Preview | Mini static compass dial | Bearing rotation only |
| CTA | “Open Qibla” chevron button | Navigation |

**Performance:** Home widget does **not** subscribe to magnetometer. Compass hardware starts only on `QiblaScreen` mount.

---

## 3. Navigation strategy

### Recommended tab bar (implemented)

| Tab | Role |
|-----|------|
| **Home** | Dashboard + Qibla card |
| **Prayer** | Times, tracking, adhan |
| **Qibla** | Dedicated 1-tap compass *(replaces Ask tab)* |
| **Quran** | Reader, audio |
| **Profile** | Settings, tools, AI access |

```
Home · Prayer · Qibla · Quran · Profile
```

### Evaluation: user-proposed `Home · Quran · Qibla · Duas · Profile`

| Aspect | Assessment |
|--------|------------|
| Removes Prayer tab | **Harmful** — prayer times are daily anchor |
| Adds Duas tab | Reasonable P2; duas already reachable from Home/Mafatih |
| Qibla center position | **Good** — matches Muslim Pro, Athan, etc. |

**Decision:** Keep Prayer tab. Swap **Ask → Qibla** (AI moves to Home recommendations + Profile). This yields 1-tap Qibla from any screen without sacrificing prayer prominence.

### Access matrix (post-redesign)

| Entry | Taps | Priority |
|-------|------|----------|
| **Qibla tab** | 1 | Primary — global |
| **Home Qibla card** | 1 | Primary — contextual |
| Profile → Tools | 2 | Legacy (keep for discoverability) |
| Stack deep link `Qibla` | 1 | Widgets, shortcuts |

### FAB alternative

Deferred. If analytics show users still miss Qibla, consider a **Prayer-tab-only** contextual FAB (shows only on Prayer screen, not global). Global FAB rejected.

---

## 4. Widget strategy

### Lock screen & home screen widgets (P2)

| Platform | Widget | Content | Tap action |
|----------|--------|---------|------------|
| **iOS** | Lock Screen circular | Bearing arrow + degrees | `qibla://open` |
| **iOS** | Home Screen medium | Bearing, distance, mini dial | Open Qibla tab |
| **Android** | Glance / App Widget | Same as iOS medium | `Intent` → Qibla |

**Data:** Widget extension reads shared App Group / MMKV:
- `locationStore.latitude/longitude`
- `qiblaStore.lastQiblaBearing`
- Recalculate on widget timeline refresh (no network)

**Update cadence:** iOS `WidgetKit` timeline every 15 min or on significant location change. Android `WorkManager` + location geofence.

### Quick Settings tile (Android P3)

One-tap shortcut tile → opens Qibla tab directly.

---

## 5. Technical implementation

### Architecture (unchanged core)

```
locationStore (MMKV) ──► qiblaCalculator.ts ──► bearing + distanceKm
                              │
device magnetometer ──► compassService.ts ──► useQibla.ts (full screen only)
```

### New components

| File | Purpose |
|------|---------|
| `hooks/useQiblaPreview.ts` | Sync bearing/distance; no compass subscription |
| `components/QiblaCompassMini.tsx` | Static dial for home card |
| `home/components/widgets/QiblaWidget.tsx` | Home card shell + navigation |

### Tab bar changes

- `MainTabParamList`: `AiAssistant` → `Qibla`
- `AiAssistantScreen` moved to `RootStack` for deep links
- `TabIcons`: new `qibla` glyph (compass + kaaba)

### Offline guarantee

| Layer | Offline? |
|-------|----------|
| Bearing calculation | ✅ Haversine + great-circle |
| Compass heading | ✅ Device sensor |
| Location | ✅ Last-known GPS from MMKV (default: Makkah) |
| Map view | ✅ Schematic (not tiles) |
| AR mode | ✅ Camera + local math |
| API | ✅ None |

### Performance checklist

- [x] Home card: `useMemo` on coordinates — O(1) trig
- [x] No `CompassHeading.start()` on Home mount
- [x] Qibla tab: lazy tab (`lazy: true` already set)
- [x] Persist `lastQiblaBearing` for widget cold start

### Analytics events (recommended)

- `qibla_open` — source: `home_card | tab | profile | widget`
- `qibla_aligned` — duration to alignment
- `qibla_mode_switch` — compass | map | ar

---

## Rollout phases

| Phase | Deliverable |
|-------|-------------|
| **P0** ✅ | Home Qibla card + Qibla tab |
| **P1** | Prayer screen inline qibla chip |
| **P2** | iOS/Android lock screen widgets |
| **P3** | Android Quick Settings tile |

---

## Related

- [OFFLINE_FIRST_SYNC.md](../architecture/OFFLINE_FIRST_SYNC.md)
- [ENGINES.md](../architecture/ENGINES.md)
