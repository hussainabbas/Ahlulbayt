# Hadith Knowledge Base — Enterprise Architecture

AhlulBayt+ Hadith KB v2: scalable Shia-first corpus with Sunni cross-reference, sub-300ms search, offline tiers, and AI-ready metadata.

---

## 1. Corpus scope

### Shia core (primary)

| Source ID | Work | Est. traditions | Tier |
|-----------|------|-----------------|------|
| `kafi` | Al-Kafi (Usul + Furu) | ~16,000 | T1 bundle |
| `faqih` | Man La Yahduruhu al-Faqih | ~6,000 | T1 |
| `tahdhib` | Tahdhib al-Ahkam | ~4,000 | T1 |
| `istibsar` | Al-Istibsar | ~5,500 | T1 |
| `bihar` | Bihar al-Anwar | ~50,000+ | T2 volume packs |
| `nahjul` | Nahjul Balagha | ~3,000 | T0 (bundled) |
| `sahifa` | Sahifa Sajjadiya narrations | ~200 | T0 |

### Sunni cross-reference (secondary)

| Source ID | Work | Use |
|-----------|------|-----|
| `bukhari` | Sahih al-Bukhari | Cross-ref only |
| `muslim` | Sahih Muslim | Cross-ref only |
| `abudawud` | Sunan Abu Dawud | Cross-ref only |
| `tirmidhi` | Jami` al-Tirmidhi | Cross-ref only |

Cross-refs link via `crossReferences[]` — never merged into Shia grading without explicit scholar note.

---

## 2. Data model (v2)

Canonical schema: `mobile/src/features/hadith/schema/hadith-entry.schema.json`

### Core entity: `HadithEntry`

```
HadithEntry
├── id: hd_{source}_{vol}_{num}     # stable globally unique
├── source: HadithSource
├── corpusTier: 0|1|2               # offline bundle tier
├── topics: HadithTopic[]           # 10+ taxonomy (extensible)
├── title, text, summary            # LocalizedText { en, ur, ar }
├── arabic?: string
├── isnad: IsnadChain               # structured sanad
├── reference: HadithReference      # vol/book/chapter/#
├── grading: HadithGrading          # sahih | hasan | muwaththaq | daif | mawdu | unknown
├── gradingNotes?: LocalizedText
├── keyPoints?: LocalizedText[]
├── relatedIds?: HadithId[]         # explicit graph edges
├── crossReferences?: CrossReference[]
├── speaker?: LocalizedText
├── nahjulId?, sahifaId?            # deep links to readers
├── embeddingId?: string            # pgvector row FK (server)
└── bundleVersion: number
```

### Isnad structure

```
IsnadChain
├── links: IsnadLink[]              # ordered narrator → narrator
│   ├── narratorId                  # FK to narrators table
│   ├── name: LocalizedText
│   ├── era?: 'sahaba'|'tabieen'|...
│   └── reliability?: number        # 0–1 scholar score
├── chainSummary?: LocalizedText    # human-readable fallback
└── gradingAuthority?: LocalizedText # e.g. Allama Majlisi
```

### Grading taxonomy

| Grade | Shia usage | Sunni parallel |
|-------|------------|----------------|
| `sahih` | Authentic per Shia rijal | Sahih |
| `hasan` | Good, reliable | Hasan |
| `muwaththaq` | Trustworthy (Shia term) | — |
| `daif` | Weak | Da'if |
| `mawdu` | Fabricated | Mawdu' |
| `unknown` | Not yet graded | — |

---

## 3. Database schema (PostgreSQL)

Migration: `api/drizzle/migrations/0011_hadith_corpus.sql`

### Tables

```sql
-- Master catalog (metadata only; text in object storage / FTS)
hadith_sources (id, name_en, name_ar, tradition, tier, total_estimate, …)

-- Flat hadith index (millions of rows)
hadith_entries (
  id VARCHAR(128) PRIMARY KEY,
  source_id VARCHAR(32) NOT NULL,
  volume SMALLINT,
  book_slug VARCHAR(64),
  chapter_slug VARCHAR(64),
  hadith_number VARCHAR(32),
  grading VARCHAR(16),
  topics TEXT[],                    -- GIN index
  title_en TEXT,
  arabic TEXT,
  text_en TEXT, text_ur TEXT, text_ar TEXT,
  summary_en TEXT,
  speaker_en TEXT,
  bundle_version INT,
  published_at TIMESTAMPTZ,
  search_vector TSVECTOR,           -- generated / trigger
  embedding VECTOR(1536)            -- optional pgvector
);

-- Narrator biographies (for isnad UI)
hadith_narrators (id, name_en, name_ar, era, reliability, bio_en, …)

-- Isnad edges
hadith_isnad_links (
  hadith_id, position, narrator_id, raw_name_ar
);

-- Explicit related graph
hadith_relations (
  from_id, to_id, relation_type, weight
);  -- types: same_topic | same_narrator | scholar_linked | ai_similar

-- User state (sync)
hadith_bookmarks (user_id, hadith_id, created_at)
hadith_reading_sessions (user_id, hadith_id, duration_ms, …)

-- Cross refs
hadith_cross_refs (shia_id, sunni_source, sunni_ref, note_en)
```

### Indexing strategy

| Index | Purpose |
|-------|---------|
| `GIN(search_vector)` | Full-text `< 50ms` on 1M rows |
| `GIN(topics)` | Topic filter |
| `(source_id, volume, hadith_number)` | Reference lookup |
| `IVFFlat(embedding)` | Semantic “related” / AI search |
| Partial `(source_id) WHERE tier = 0` | Hot bundled subset |

**Target:** p95 search `< 300ms` including network (mobile → API → Postgres FTS).

### Elasticsearch (optional scale-out)

When Postgres FTS exceeds ~2M active rows or multi-region:

- Index: `hadith_entries_v1`
- Fields: `id`, `source`, `topics`, `title_*`, `text_*`, `arabic`, `grading`, `reference`
- Analyzers: `arabic` (normalization), `english`, `urdu` (custom)
- Mobile hits API gateway → ES with Postgres fallback

---

## 4. API design

Module: `api/src/hadith/`

### Public read

| Method | Path | Description | SLA |
|--------|------|-------------|-----|
| `GET` | `/v1/hadith/search` | FTS + semantic hybrid | < 300ms |
| `GET` | `/v1/hadith/entries/:id` | Full entry + isnad | < 100ms |
| `GET` | `/v1/hadith/sources` | Source catalog + counts | cached |
| `GET` | `/v1/hadith/sources/:id/volumes` | Volume list (lazy) | cached |
| `GET` | `/v1/hadith/sources/:id/volumes/:vol` | Paginated chapter/hadith list | < 200ms |
| `GET` | `/v1/hadith/entries/:id/related` | Related engine | < 150ms |
| `GET` | `/v1/hadith/daily` | Deterministic daily hadith | cached |
| `GET` | `/v1/hadith/manifest` | OTA bundle manifest | CDN |

### Search query params

```
?q=imamate&source=kafi&topic=imamate&grading=sahih
&locale=en&page=1&limit=20&mode=hybrid|keyword|semantic
```

Response:

```json
{
  "query": "imamate",
  "tookMs": 42,
  "page": 1,
  "total": 1842,
  "results": [{
    "id": "hd_kafi_1_1",
    "title": "Earth Never Without a Hujjah",
    "snippet": "…",
    "source": "kafi",
    "grading": "sahih",
    "score": 0.94,
    "matchType": "hybrid"
  }]
}
```

### Authenticated

| Method | Path | Description |
|--------|------|-------------|
| `GET/POST/DELETE` | `/v1/hadith/bookmarks` | Sync bookmarks |
| `POST` | `/v1/hadith/entries/:id/explain` | AI explanation (RAG) |
| `POST` | `/v1/hadith/entries/:id/summarize` | AI summary |

---

## 5. Mobile offline strategy

### Tier 0 — Bundled (app binary)

- Curated ~500 “essential” hadith across Nahjul, Kafi samples, Sahifa, Bihar highlights
- Full search in-memory / SQLite FTS (< 5ms)
- Current: 24 entries → expand incrementally

### Tier 1 — OTA SQLite packs

```
DocumentDirectory/hadith/
├── manifest.json
├── tier1_kafi_usul.sqlite      # FTS5 inside
├── tier1_faqih.sqlite
└── index.meta
```

- Download per book on Wi‑Fi
- `react-native-quick-sqlite` + FTS5 virtual tables
- Repository: `bundled → sqlite → remote API` fallback chain

### Tier 2 — Streaming

- Bihar volumes streamed paginated from API
- Only metadata + snippet cached locally
- Infinite scroll on volume reader

### Sync manifest

Extend `ContentDomain`:

```typescript
type ContentDomain = 'quran' | 'duas' | 'ziyarat' | 'prayer' | 'hadith';
```

---

## 6. Search engine (mobile)

`hadithSearchEngine.ts`:

1. Normalize query (Arabic diacritics, alef variants, Urdu digits)
2. Score: title > text > summary > reference number
3. Locale-aware snippets in results
4. Pagination: `{ page, pageSize, total }`
5. Future: delegate to `/v1/hadith/search` when online + corpus tier > 0

`relatedHadithEngine.ts`:

1. Explicit `relatedIds` (weight 1.0)
2. Topic Jaccard similarity (weight 0.6)
3. Same narrator overlap (weight 0.4)
4. Server: pgvector cosine on `embedding` (weight 0.8)

---

## 7. AI integration

### “Explain this Hadith”

1. Mobile sends `{ hadithId, locale, marja? }` → `POST /v1/hadith/entries/:id/explain`
2. Server RAG: retrieve hadith chunk + 3 related + topic context from `ai_knowledge_chunks`
3. Guardrails: no fatwa, cite source, no fabrication
4. Offline: bundled `summary` + template enrichment (`summaryEngine.ts`)

### Daily Hadith

- Deterministic: `hash(date + userId) % corpusSize`
- Deep link → `HadithDetail { hadithId }`
- Unified with `HadithRepository.getDailyHadith()`

---

## 8. UX structure

```
HadithHubScreen
├── SearchBar (debounced, locale snippets)
├── SourceGrid (all 11 sources; locked icon if not downloaded)
├── TopicGrid
├── FeaturedCard
├── DailyHadithBanner → HadithDetail
└── Infinite FlatList (paginated)

HadithDetailScreen
├── Tabs: Text | Isnad | Reference | AI Explain
├── Actions: Bookmark | Share | Audio (optional)
├── GradingBadge (Sahih / Hasan / …)
├── CrossReferenceCard (Sunni parallels)
└── RelatedHadithList (related engine)

HadithVolumeReaderScreen (phase 2)
├── Breadcrumb: Kafi → Vol 1 → Kitab al-Hujjah
└── Infinite scroll hadith rows
```

---

## 9. Ingestion pipeline

```
Source TEI/XML or CSV
    → normalize script (Python)
    → validate against hadith-entry.schema.json
    → upload JSONL to S3
    → batch job: Postgres COPY + tsvector update + embed
    → manifest bump → mobile OTA sync
```

Quality gates:

- Required: id, source, text.en, reference, grading
- Arabic optional for Nahjul sayings; required for Kafi/Bihar
- Duplicate detection: `(source, volume, hadith_number)` unique constraint

---

## 10. Performance budget

| Operation | Target | Strategy |
|-----------|--------|----------|
| Hub list (Tier 0) | < 16ms | Static array |
| Search (Tier 0) | < 50ms | In-memory + normalization |
| Search (Tier 1+) | < 300ms | SQLite FTS / API |
| Detail load | < 100ms | Bundled or cached |
| Related (5 items) | < 80ms | Precomputed graph + Jaccard |
| Volume page | < 200ms | API pagination 30/page |

---

## 11. Implementation roadmap

| Phase | Deliverable |
|-------|-------------|
| **v2.0 (now)** | Extended types, schema, search/related engines, API skeleton, architecture |
| **v2.1** | Tier 0 expansion to 500 hadith; daily hadith unified; share/explain UI |
| **v2.2** | SQLite OTA packs for Al-Kafi Usul; `/v1/hadith/search` live |
| **v2.3** | Full Kafi + Four Books ingest; isnad UI with narrators |
| **v2.4** | Bihar volume streaming; ES cluster; semantic related |
| **v3.0** | RAG explain + audio recitation; cross-ref Sunni panel |

---

## 12. File map (implemented foundation)

| Path | Role |
|------|------|
| `mobile/src/features/hadith/types.ts` | v2 domain model |
| `mobile/src/features/hadith/schema/hadith-entry.schema.json` | Validation |
| `mobile/src/features/hadith/constants/catalog.ts` | All sources + corpus stats |
| `mobile/src/features/hadith/engine/hadithSearchEngine.ts` | Normalized search + pagination |
| `mobile/src/features/hadith/engine/relatedHadithEngine.ts` | Recommendations |
| `mobile/src/features/hadith/engine/dailyHadithService.ts` | Daily rotation |
| `api/src/hadith/*` | NestJS module skeleton |
| `api/drizzle/migrations/0011_hadith_corpus.sql` | DB schema |
