# Typography System

Production typography for Ahlulbayt+ mobile (React Native 0.85).

## Audit Summary

| Issue | Before | After |
|-------|--------|-------|
| Font families | All `System` in `tokens.ts` | Linked OFL fonts per script |
| Arabic sacred text | Cramped system font, poor diacritics | Amiri (duas/ziyarat), Scheherazade New (Quran) |
| Urdu | System fallback | Noto Nastaliq Urdu |
| Quran line height | `fontSize × 1.65` (too tight for Uthmani) | `fontSize × 2.15` |
| Worship readers | Inline `fontSize` / ad-hoc line heights | `typographySystem` + `SacredText` |
| Font assets | Empty `assets/fonts/` | 10 TTF files via `npm run download:fonts` |

## Font Recommendations

| Use case | Font | Rationale |
|----------|------|-----------|
| Quran (Uthmani + tajweed) | **Scheherazade New** | Designed for Quranic typesetting; generous diacritic spacing |
| Duas, ziyarat, hadith Arabic | **Amiri** | Classical Naskh; readable at prayer-reader sizes |
| General Arabic UI | **Noto Naskh Arabic** | Neutral fallback when locale is `ar` |
| Urdu translations | **Noto Nastaliq Urdu** | Proper Nastaliq shaping for Urdu script |
| English / Latin UI | **Inter** | Clean UI sans; variable master linked for weights |

All fonts are OFL-licensed from [google/fonts](https://github.com/google/fonts).

## Type Scale

### UI roles (`getUiTextStyle`)

| Role | Font | Size | Line height | Weight | Letter spacing |
|------|------|------|-------------|--------|----------------|
| display | Inter-SemiBold | 34 | 40 | 600 | −0.6 |
| heading | Inter-SemiBold | 22 | 28 | 600 | −0.2 |
| title | Inter-SemiBold | 18 | 24 | 600 | −0.1 |
| subtitle | Inter-Medium | 16 | 22 | 500 | 0 |
| body | Inter-Regular | 16 | 24 | 400 | 0 |
| caption | Inter-Medium | 12 | 16 | 500 | 0.1 |
| button | Inter-SemiBold | 15 | 20 | 600 | 0.1 |
| label | Inter-SemiBold | 13 | 16 | 600 | 0.2 |
| overline | Inter-SemiBold | 11 | 14 | 600 | 0.8 |

When `locale` is `ar` or `ur`, `getUiTextStyle` swaps the font family and applies script-appropriate line heights.

### Sacred roles (`getSacredTextStyle`)

| Role | Font | Default size | Line height ratio | Letter spacing |
|------|------|--------------|-------------------|----------------|
| quranArabic | Scheherazade New | 26 | **2.15** | 0 |
| duaArabic | Amiri | 22 | **1.95** | 0 |
| hadithArabic | Amiri | 22 | **1.85** | 0 |
| transliteration | Inter-Regular (italic) | 13 | fixed 20 | 0.1 |
| translation | Inter-Regular | 16 | fixed 26 | 0 |
| reference | Inter-Medium | 12 | fixed 18 | 0.1 |

### Arabic / Urdu line height ratios

| Script context | Ratio |
|----------------|-------|
| Quran | 2.15 |
| Dua / ziyarat | 1.95 |
| General Arabic | 1.85 |
| Urdu | 1.9 |

Helper: `arabicLineHeight(fontSize, role)` in `src/theme/typographySystem.ts`.

## Components

- **`Text`** — UI text with optional `script` prop (`latin` | `arabic` | `urdu` | `quran`).
- **`SacredText`** — Worship blocks with `role` prop wired to sacred scale.

## Quran reader defaults

- `arabicFontSize`: **26** (was 28)
- `translationFontSize`: **15** (was 16) for clearer hierarchy under Arabic

## Accessibility

- **`useFontScale()`** reads `PixelRatio.getFontScale()` for system text scaling.
- Sacred and UI helpers accept a `fontScale` multiplier — worship readers pass user preference through this.
- Arabic and Urdu roles use **letter spacing 0** to avoid breaking ligatures and diacritic placement.
- Minimum touch targets on reader controls are unchanged; typography scaling is multiplicative, not capped — test at 200% system font size on device.
- Prefer `SacredText` / `getSacredTextStyle` over raw `fontSize` so line heights stay proportional when users enlarge text.

## Performance

1. **Download fonts**: `npm run download:fonts` (or `node scripts/download-fonts.mjs`).
2. **Link assets**: `npx react-native-asset` or rebuild after adding fonts — `react-native.config.js` already points at `./assets/fonts/`.
3. **Preload (recommended)**: On app start, render a hidden off-screen `<Text>` for each linked family once to warm the native font cache before opening Quran or worship readers. Example families: `ScheherazadeNew-Regular`, `Amiri-Regular`, `NotoNastaliqUrdu-Regular`, `Inter-Regular`.
4. **Bundle size**: ~3.5 MB total for all 10 files; variable masters (Inter, Noto Naskh, Noto Nastaliq) are shared bytes when downloaded from GitHub.

## File map

| Path | Purpose |
|------|---------|
| `scripts/download-fonts.mjs` | Fetch fonts from google/fonts GitHub |
| `assets/fonts/*.ttf` | Linked font binaries |
| `src/theme/typographySystem.ts` | Scale, helpers, constants |
| `src/theme/tokens.ts` | `fontFamily` token wiring |
| `src/components/ui/Text.tsx` | UI text + `script` prop |
| `src/components/ui/SacredText.tsx` | Sacred worship text |
