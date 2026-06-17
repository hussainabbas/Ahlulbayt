# Muharram & Karbala Module

Mobile-first, offline-bundled content for Muharram (days 1–13), Karbala battle timeline, martyrs, Arbaeen, and Safar observances.

## Architecture

```
mobile/src/features/muharram/
├── data/
│   ├── dailyContent.ts          # Legacy i18n-backed day cards (mode screen)
│   └── bundled/
│       ├── days.ts              # MuharramDayEntry (narrative + worship packs)
│       ├── karbalaEvents.ts     # KarbalaEvent battle timeline
│       ├── martyrs.ts           # MartyrProfile
│       ├── arbaeen.ts           # ArbaeenStage
│       ├── safar.ts             # SafarEvent
│       └── citations.ts         # cite() helper
├── engine/
│   ├── muharramRepository.ts    # Data access API
│   └── karbalaTimeline.ts       # Timeline grouping & citation formatting
├── screens/                     # Hub + detail screens
├── components/                  # Cards, citations, hub links
└── types.ts                     # Shared TypeScript types
```

## Data model

### IslamicSourceCitation

Every historical claim must include at least one citation **or** `unverified: true`:

```typescript
interface IslamicSourceCitation {
  book: string;
  volume?: number | string;
  page?: string | number;
  hadithNumber?: string;
  scholar?: string;
  chapter?: string;
  unverified?: boolean;
  note?: string;
}
```

Primary sources used in seed data:

- *Tarikh al-Tabari* (al-Tabari)
- *Bihar al-Anwar* (Allama Majlisi)
- *Maqtal al-Husayn* (al-Khwarazmi)
- *Al-Luhuf fi Qatla al-Tufuf* (Ibn Tawus)
- *Kitab al-Irshad* (Shaykh al-Mufid)
- *Mafatih al-Jinan* (Shaykh Abbas Qummi) — amaal
- *Kamil al-Ziyarat* / *Ma'alim al-Ziyarat* — ziyarat

### MuharramDayEntry

Rich per-day content: narrative, significance, `HistoricalClaim[]`, `DailyWorshipPack` (amaal, dua IDs, ziyarat IDs, Quran surahs), links to Karbala events and Masoomeen IDs.

### Integration points

| Feature | Link |
|---------|------|
| Duas | `DuaId` → `DuaReader` |
| Ziyarat | `ZiyaratId` → `ZiyaratReader` |
| Quran | `surahNumbers` → `QuranReader` |
| Ahlul Bayt | `masoomeenId` → `MasoomeenProfile` |

## Navigation routes

| Route | Params | Screen |
|-------|--------|--------|
| `MuharramMode` | — | Hub (mode controls + daily preview + section links) |
| `MuharramDayDetail` | `{ day: number }` | Tabbed day guide |
| `KarbalaTimeline` | — | Full battle timeline |
| `MartyrsList` | — | Martyrs list |
| `MartyrProfile` | `{ martyrId: string }` | Martyr detail |
| `ArbaeenJourney` | — | Arbaeen stages |
| `SafarEvents` | — | Safar observances |

Entry points:

- Home `MuharramBanner` → `MuharramMode`
- Muharram hub section cards → respective screens
- Karbala event card tap → `MuharramDayDetail`

## Seeded vs stubbed

| Section | Status |
|---------|--------|
| Muharram days 1–10 | **Seeded** — narrative, claims, worship, citations |
| Muharram days 11–13 | **Seeded** — full structure, fewer Karbala sub-events |
| Karbala timeline | **Seeded** — 16 key events (days 1–4, 7–11, 13 + Ashura sequence) |
| Martyrs | **Seeded** — 8 profiles (Husayn, Abbas, Ali Akbar, Asghar, Muslim, Habib, Zainab, Sajjad) |
| Arbaeen | **Seeded** — 5 stages through Safar 20 |
| Safar | **Seeded** — 5 events (days 1, 7, 20, 28, 29) |
| Days 5–6 Karbala events | **Partial** — narrative in day entries; no separate timeline rows |
| Urdu/Arabic copy | **Partial** — key fields have `ur` stubs; UI falls back to `en` |
| API sync | **Stub** — see `api/drizzle/migrations/0001_muharram_karbala.sql` |

## API (future)

Content is bundled in mobile for offline use. The API already has `islamic_events` and `content_citations` tables that can mirror bundled JSON for CMS updates. A migration stub is provided; no runtime API dependency today.

## Testing

```bash
cd mobile && npm run typecheck
```

Manual:

1. Open app → Home → tap Muharram banner
2. Verify hub sections navigate correctly
3. Open Day 10 → check Events / Amaal / Duas / Ziyarat / Quran tabs
4. Open Karbala timeline → verify Ashura sequence
5. Open Martyrs → tap Imam Husayn → verify Masoomeen link
6. Open Arbaeen → tap Ziyarat Arbaeen link
7. Toggle airplane mode — all content should load
