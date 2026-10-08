# Prayer Academy — System Architecture

Production architecture for the **Fiqh Jafariya Prayer Module** inside AhlulBayt+.

## Overview

Prayer Academy is an offline-first, interactive learning module covering:

- **Daily wajib:** Fajr, Dhuhr, Asr, Maghrib, Isha  
- **Special obligatory:** Namaz-e-Ayat, Namaz-e-Mayyit  
- **Special recommended:** Namaz-e-Wahshat, Ghufayla, Layl, Istikhara  
- **Eid:** Fitr & Adha  
- **Jumu'ah** (Shia conditions)  
- **Daily nafl map**

Each prayer bundle includes: Arabic/English/Urdu names, purpose, rakat breakdown, timing, conditions, Jafari vs Sunni notes, step-by-step guides (beginner/advanced), fiqh references, and audio cue hooks.

---

## Mobile module layout

```
mobile/src/features/prayer-academy/
├── types.ts                          # Domain types
├── schema/prayer-academy.schema.json # JSON Schema v1
├── constants/catalog.ts              # PRAYER_ACADEMY_CATALOG (15 prayers)
├── data/
│   ├── shared/contentHelpers.ts      # Reusable Jafari step builders
│   └── bundled/                      # Offline TypeScript bundles
├── engine/prayerAcademyRepository.ts
├── stores/
│   ├── progressStore.ts              # MMKV — step completion
│   ├── bookmarkStore.ts              # MMKV — bookmarks
│   └── readerStore.ts                # MMKV — difficulty & display prefs
├── components/                       # UI building blocks
└── screens/
    ├── PrayerAcademyHubScreen.tsx    # “Prayer Academy” catalog
    └── PrayerAcademyGuideScreen.tsx  # Guided / scroll lesson
```

---

## Data model

### `PrayerAcademyBundle`

| Field | Purpose |
|-------|---------|
| `meta` | List card metadata (id, category, obligation, titles, tags) |
| `bundleVersion` | Offline sync version |
| `rakatStructure` | Wajib / sunnah / mustahab / nafl / witr units |
| `timingRules` | Fiqh windows; optional `prayerTimeKey` links to prayer-engine |
| `conditions` | Taharah, Qibla, niyyah; optional `deepLink` (e.g. Qibla screen) |
| `sunniDifferences` | Side-by-side Jafari vs Sunni notes |
| `audioCues` | Asset keys + remote URLs for guided audio |
| `steps.beginner` / `steps.advanced` | Step-by-step guide arrays |

### Step kinds

`intro`, `preparation`, `niyyah`, `takbir`, `recitation`, `ruku`, `sujud`, `qunoot`, `tashahhud`, `salam`, `rakat_transition`, `fiqh_note`, `checklist`, `diagram`

---

## JSON Schema

Canonical schema: `mobile/src/features/prayer-academy/schema/prayer-academy.schema.json`

- `$id`: `https://ahlulbayt.app/schemas/prayer-academy/v1.json`
- Validates bundles for CI, CMS import, and API responses
- All user-facing strings use `{ en, ur?, ar? }`

---

## Storage strategy

### Bundled (ship with app)

Primary content lives in TypeScript bundles under `data/bundled/` — same pattern as Duas/Ziyarat. **100% offline** on first launch.

### MMKV (user state)

| Store key | Data |
|-----------|------|
| `ahlulbayt-prayer-academy-progress` | Per-prayer step IDs, completion, difficulty |
| `ahlulbayt-prayer-academy-bookmarks` | Prayer + optional step bookmarks |
| `ahlulbayt-prayer-academy-reader` | Beginner/advanced, guided mode, Arabic/transliteration toggles |

### Remote sync (phase 2)

Extend `contentManifestService`:

```typescript
CONTENT_PATHS.prayerAcademy = `${DocumentDirectory}/content/prayer-academy`;
ContentDomain: 'prayer-academy';
```

Manifest entry:

```json
{
  "domain": "prayer-academy",
  "id": "salat_fajr",
  "version": 2,
  "url": "https://cdn.ahlulbayt.app/bundles/prayer-academy/salat_fajr.v2.json",
  "sha256": "…",
  "minAppVersion": "1.4.0"
}
```

Downloaded JSON validated against schema → cached on disk → repository prefers cache when `version > bundled`.

---

## API design (NestJS)

New module: `api/src/prayer-academy/`

### Public (CDN-backed)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/prayer-academy/manifest` | Bundle index + versions |
| `GET` | `/v1/prayer-academy/bundles/:id` | Full `PrayerAcademyBundle` JSON |
| `GET` | `/v1/prayer-academy/catalog` | Metadata only (lightweight list) |

### Authenticated (user sync)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/prayer-academy/progress` | Cloud backup of progress |
| `PUT` | `/v1/prayer-academy/progress` | Merge progress (last-write-wins per prayer) |
| `GET` | `/v1/prayer-academy/bookmarks` | Bookmark list |
| `POST` | `/v1/prayer-academy/bookmarks` | Add bookmark |
| `DELETE` | `/v1/prayer-academy/bookmarks/:id` | Remove bookmark |

### Database (PostgreSQL)

```sql
CREATE TABLE prayer_academy_progress (
  user_id UUID NOT NULL,
  prayer_id VARCHAR(64) NOT NULL,
  completed_step_ids JSONB NOT NULL DEFAULT '[]',
  completed_at TIMESTAMPTZ,
  difficulty VARCHAR(16) NOT NULL DEFAULT 'beginner',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, prayer_id)
);

CREATE TABLE prayer_academy_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prayer_id VARCHAR(64) NOT NULL,
  step_id VARCHAR(64),
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prayer_academy_bundle_meta (
  id VARCHAR(64) PRIMARY KEY,
  bundle_version INT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  schema_version INT NOT NULL DEFAULT 1
);
```

Content bodies remain in object storage (S3/R2), not Postgres — DB holds versions + user state only.

---

## UX architecture

### Hub (`PrayerAcademyHubScreen`)

- Search + filter (all / bookmarked)
- Categories: daily wajib → special → eid → jumuah → nafl
- Featured card (Fajr starter lesson)
- Entry: **Prayer tab**, **Profile → Prayer Academy**, AI citations (future)

### Guide (`PrayerAcademyGuideScreen`)

- **Beginner / Advanced** toggle (extra fiqh notes, marja nuances)
- **Guided mode** — one step at a time with prev/next bar (Tasbih-style progress)
- Sections: rakat breakdown, timing, conditions, Jafari notes
- **Bookmark** prayer from header
- **Progress** persisted per step; completion badge

### Audio (phase 2)

`audioCues[]` maps step `audioCueId` → bundled MP3 or streamed URL. Hook into existing TrackPlayer when native audio enabled; otherwise inline `expo-av` / RN Sound stubs.

---

## Integration points

| System | Integration |
|--------|-------------|
| Prayer engine | `timingRules.prayerTimeKey` → live times on guide screen |
| Qibla | `conditions.deepLink: { screen: 'Qibla' }` |
| Adhan / Prayer tab | Banner → Prayer Academy hub |
| AI assistant | Extend `prayer_guidance` intent → deep link `PrayerAcademyGuide` |
| Mafatih | Optional `amaal:prayer_academy_*` refs |
| Insights | Surface `prayerAcademy` completion stats |

---

## Fiqh content governance

- Content cites **Imam Ja'far al-Sadiq (as)**, **Sayyid Sistani**, and general Jafari consensus where noted
- `marjaNotes` field (future) for Sistani vs Khamenei deltas
- UI disclaimer: educational only — not a fatwa service (aligns with AI guardrails)
- `bundleVersion` increments on any fiqh text change; manifest drives OTA updates

---

## Navigation

```typescript
RootStackParamList = {
  PrayerAcademy: undefined;
  PrayerAcademyGuide: { prayerId: string; step?: number };
};
```

---

## Testing checklist

- [ ] All 15 bundles load via repository
- [ ] Beginner steps hide `advancedOnly` entries
- [ ] Guided mode advances + persists progress
- [ ] Bookmarks survive app restart (MMKV)
- [ ] RTL layout (ur/ar) for Arabic blocks
- [ ] Schema validation in CI for bundled JSON exports

---

## Roadmap

1. **v1 (current):** Bundled content + hub + guided UI + MMKV state  
2. **v1.1:** Audio cues for takbir, ruku, sujud  
3. **v1.2:** Manifest sync + CDN bundles  
4. **v2:** Wudu/Ghusl prerequisite lessons, marja-specific branches, AI quiz mode  
