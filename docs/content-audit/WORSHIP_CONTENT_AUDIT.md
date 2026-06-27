# Worship Content Audit

**Date:** 2026-06-26  
**Scope:** Bundled worship text in `mobile/src/features` — ziyarat, dua, sahifa, daily-life duas  
**Gold-standard references:** [duas.org](https://www.duas.org), Mafatih al-Jinan, Kamil al-Ziyarat

---

## Executive Summary

The app catalogs **93 worship items** across four modules. Only **Daily Life Duas** (~27 items) approach production quality with transliteration, citations, and verified Arabic. **Ziyarat**, **featured Duas**, and **Sahifa** are predominantly **stub bundles** — short excerpt sections with paraphrased translations and no transliteration layer.

**Ziyarat Ashura** is the priority proof-of-concept: the previous bundle had **7 stub sections** (~10% of the [duas.org reference](https://www.duas.org/ashura/z_ashura.htm)). An import pipeline now targets the full 8-section structure with transliteration, repeat counts, and hadith narration.

| Metric | Value |
|--------|-------|
| Total cataloged worship items | 93 |
| Production-ready (full text + citations) | ~27 (Daily Life Duas) |
| Partial / stub bundles | ~66 |
| Ziyarat Ashura coverage (before PoC) | 7 sections, ~10% |
| Ziyarat Ashura coverage (after PoC) | 8 sections, ~100% English + Arabic |

---

## Inventory

| Module | Catalog Count | Bundled Full Text | Transliteration | Citations | Urdu Translation |
|--------|---------------|-------------------|-----------------|-----------|------------------|
| Daily Life Duas | 27 | 27 | Yes | Yes (hadith/Quran) | Yes |
| Ziyarat | 6 | 6 (stubs) → Ashura full | Ashura only (PoC) | Ashura only (PoC) | Stubs only |
| Featured Duas | 6 | 6 (excerpts) | No | No | Partial |
| Sahifa Sajjadiya | 54 | 11 numbers | No | No | Partial |
| **Total** | **93** | **~50 partial** | **~27** | **~28** | **~38** |

### Ziyarat Detail

| ID | Sections (stub) | Estimated Minutes (stub) | Status |
|----|-----------------|--------------------------|--------|
| `ziyarat_ashura` | 7 → **8** | 15 → **~25** | **PoC complete** |
| `ziyarat_waritha` | 6 | 12 | Stub |
| `ziyarat_aminullah` | 6 | 10 | Stub |
| `ziyarat_arbaeen` | 7 | 18 | Stub |
| `ziyarat_jamia_kabira` | 8 | 25 | Stub |
| `ziyarat_ale_yasin` | 5 | 8 | Stub |

### Featured Duas Detail

| ID | Sections | Notes |
|----|----------|-------|
| `dua_kumail` | ~5 | Excerpt, ends with ellipsis patterns |
| `dua_tawassul` | ~4 | Excerpt |
| `dua_ahad` | ~3 | Excerpt |
| `dua_nudba` | ~4 | Excerpt |
| `dua_sabah` | ~3 | Excerpt |
| `dua_mashlool` | ~3 | Excerpt |

### Sahifa Detail

- **54** catalog entries; **11** with `bundled: true` in catalog
- Only `dua01.ts` exists as a bundled file; others are metadata-only stubs
- No transliteration or citation layer

---

## Missing Content

### Ziyarat (all except Ashura PoC)

- Full Arabic text from Kamil al-Ziyarat / Mafatih
- Transliteration layer
- Scholarly citations and narration chains
- Urdu translations (verified, not machine-paraphrased)
- Repeat-count instructions (e.g. 100× laʿan, 100× salām in Ashura)
- Prostration / amaal instructions

### Featured Duas

- Complete Arabic for Kumayl, Tawassul, Nudba, Ahad, Sabah, Mashlool
- Transliteration
- Source citations (Mafatih chapter refs)
- Urdu translations

### Sahifa

- 43 duas without bundled Arabic
- Transliteration for all 54
- Imam Sajjad (as) narration context
- Cross-ref to Mafatih / al-Sahifa al-Sajjadiyya editions

### Daily Life Duas

- Audio recitation (catalog marks `hasAudio: false`)
- Some situations lack Urdu in bundled sections (English-primary)

---

## Incorrect / Low-Quality Content

| Issue | Affected Modules | Example |
|-------|------------------|---------|
| Truncated / excerpt translations | Dua, Ziyarat (pre-PoC) | `…` ellipsis in Kumayl opening |
| Paraphrased EN not matching Mafatih | Ziyarat stubs | Ashura "Testimony" section oversimplified |
| Missing repeat instructions | Ziyarat Ashura (pre-PoC) | No 100× laʿan / salām blocks |
| No transliteration | Dua, Sahifa, Ziyarat (pre-PoC) | — |
| `contentStatus: metadata_only` vs bundled mismatch | Daily Life | Catalog says metadata_only but situations.ts bundles |
| Private-use Arabic glyphs | Imported sources | duas.org U+E022 artifacts — cleaned in import |
| Veranda font transliteration artifacts | duas.org imports | `¡`→`a`, `£`→`u`, `¦`→`h` — fixed in import |

---

## Formatting / Schema Recommendations

Adopt the **Daily Life Duas schema** as the worship content standard:

```typescript
interface WorshipSection {
  id: string;
  title?: { en?: string; ur?: string };
  arabic: string;
  transliteration?: string;
  translations: { en?: string; ur?: string };
  repeatCount?: number;
  instruction?: { en?: string; ur?: string };
  sacred?: boolean;
  citations?: IslamicCitation[];
}
```

### UI Recommendations

1. **Transliteration block** — muted background, italic, label from i18n (`ziyarat.transliteration`)
2. **Repeat badge** — show `100×` pill when `repeatCount` present
3. **Instruction text** — italic guidance above Arabic (Ashura shortcuts)
4. **Arabic font** — use `theme.fontFamily.arabic` token
5. **Citation footer** — `SourceCitationList` from `@/core/citations` on reader screens
6. **Narration card** — collapsible hadith chain at top of ziyarat reader

### Import Pipeline Recommendations

| Source | Script Pattern | Output |
|--------|----------------|--------|
| duas.org ziyarat | `import-ziyarat-*-duas-org.mjs` | `*-imported.json` |
| Nahjul | `import-nahjul-duas-org.mjs` | `nahjul-imported.json` |
| Mafatih daily duas | `situations.ts` (hand-curated) | inline TS |
| Validation | `validate-worship-content.mjs` | CI gate |

---

## Priority Pipeline

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| **P0** | Ziyarat Ashura full import | Done (PoC) | Muharram flagship content |
| **P1** | Ziyarat Arbaeen + Waritha | Medium | Seasonal demand |
| **P1** | Dua Kumayl + Tawassul full import | Medium | Thursday night / daily |
| **P2** | Remaining 4 ziyarat | Medium | Completeness |
| **P2** | Sahifa top-20 bundled | High | Major dua collection |
| **P3** | Urdu translations (verified) | High | Urdu locale users |
| **P3** | Audio sync for worship text | High | Accessibility |
| **P4** | `validate-worship-content.mjs` in CI | Low | Regression prevention |

---

## Next Steps

1. Run `npm run import:ziyarat-ashura` after duas.org source updates
2. Run `npm run validate:worship-content` before release
3. Add Urdu translations for Ashura sections (scholar review)
4. Extend import pattern to Ziyarat Arbaeen
5. Wire `meta.narration` and `meta.citations` into `ZiyaratReaderScreen` hero
