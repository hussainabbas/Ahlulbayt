# Nahjul Balagha Content

## Source

English text is imported from the [duas.org Nahjul Balagha PDF](https://www.duas.org/pdfs/Nahjul-Balagha.pdf), based on the **Tahrike Tarsile Qur'an** edition (7th U.S. edition, 2009) with commentary by Martyr Ayatollah Murtada Mutahhari and English translation edited by Yasin T. Al-Jibouri.

The raw extract lives at `mobile/data-sources/nahjul/duas-org-edition.txt`.

## Import

Regenerate the bundled catalog and text from the source file:

```bash
cd mobile
npm run import:nahjul
```

This writes `mobile/src/features/nahjul/data/bundled/nahjul-imported.json`, which contains:

- Full **catalog** metadata for 239 sermons, 79 letters, and Part Ten saying sections
- **Bundles** with English body text where present in the PDF extract (currently sermons 1–59, minus gaps in the source numbering)
- Stub excerpts for entries whose full text is not yet in the extract

## Arabic text

This edition provides **English only**. Arabic text for sermons and letters requires a separate Arabic edition source and a future import pipeline. The reader UI treats Arabic as optional and defaults to English translation.

## App integration

- Catalog: `mobile/src/features/nahjul/constants/catalog.ts` (from imported JSON)
- Bundles: `mobile/src/features/nahjul/data/bundled/index.ts`
- Types: `mobile/src/features/nahjul/types.ts`

Entries with `bundled: true` in the catalog have full imported English body text. Others show the TOC title and a short “import pending” placeholder until additional PDF sections are extracted.
