# AhlulBayt+ Design System
## Complete Design Language v2.0

**Codename:** Noor (نور) — Light through restraint  
**Product:** AhlulBayt+ · Premium Shia Ithna Ashari Islamic Companion  
**Platforms:** iOS 17+, Android 14+, Web (future)  
**Languages:** English (LTR) · العربية (RTL) · اردو (RTL)  
**Quality bar:** Apple HIG · Material 3 expressive baseline · WCAG 2.2 AA minimum

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Tokens](#2-color-tokens)
3. [Typography Scale](#3-typography-scale)
4. [Spacing System](#4-spacing-system)
5. [Border Radius](#5-border-radius)
6. [Shadows & Elevation](#6-shadows--elevation)
7. [Motion System](#7-motion-system)
8. [Icon Guidelines](#8-icon-guidelines)
9. [Component Library](#9-component-library)
10. [Accessibility Standards](#10-accessibility-standards)
11. [Theming & Modes](#11-theming--modes)
12. [Implementation Reference](#12-implementation-reference)

**Companion files:** [tokens.json](./tokens/tokens.json) · [COMPONENTS.md](./COMPONENTS.md) · [ACCESSIBILITY.md](./ACCESSIBILITY.md)

---

## 1. Design Philosophy

### 1.1 Brand Essence

AhlulBayt+ design language expresses **luxury Islamic aesthetics** without cliché: no gold overload, no ornate patterns, no stock mosque photography as wallpaper. Premium is felt through **proportion, silence, and precision** — the way fine prayer spaces use empty wall and single calligraphy.

| Pillar | Meaning | Manifestation |
|--------|---------|---------------|
| **Minimal** | Remove until only the sacred remains | One hero per screen; max 5 tab destinations |
| **Spiritual** | UI serves `ibadah`, never competes | Quran/dua occupy ≥60% viewport in readers |
| **Luxury** | Craft in micro-details | Tabular nums, hairline borders, 8pt grid fidelity |
| **Premium** | Earned depth, not decoration | Gold on ≤3 elements per Pro screen |
| **Apple-level** | Clarity, deference, depth | Native blur, 44pt targets, system motion respect |

### 1.2 Design Principles

1. **Sacred Restraint** — Spirituality through space, not ornament  
2. **Deference to Content** — Chrome recedes; scripture is hero  
3. **Luxury Through Precision** — Consistency beats embellishment  
4. **Bilingual Native** — Arabic/Urdu are first-class layouts, not afterthoughts  
5. **Seasonal Reverence** — Muharram is a full semantic theme, not a tint  
6. **Accessible Devotion** — Every believer can pray, read, and navigate

### 1.3 Anti-Patterns (Never)

- Gradient backgrounds on worship screens  
- Drop shadows on scripture cards  
- Emoji in navigation or tab bar  
- Green-domed mosque clip art  
- Pulsing “sale” banners on Premium  
- Confetti or celebration motion in Muharram  
- Pure `#FFFFFF` / `#000000` as canvas colors  

---

## 2. Color Tokens

### 2.1 Token Architecture

Colors are organized in four layers:

```
Primitive  →  Semantic  →  Component  →  Mode override
#3D9B8A       accent.primary   button.primary.bg   muharram.accent
```

**Naming convention:** `{category}.{role}.{variant?}`  
**Format:** Hex for primitives · `rgba()` for alpha variants · semantic aliases in code

### 2.2 Primitive Palette

Foundation colors — do not use directly in UI except in token definitions.

| Token | Hex | Name | Notes |
|-------|-----|------|-------|
| `primitive.ivory-50` | `#F8F6F1` | Dawn canvas | Warm off-white |
| `primitive.ivory-100` | `#F0EDE6` | Dawn secondary | |
| `primitive.ink-900` | `#1A1A18` | Warm black | Text light mode |
| `primitive.ink-950` | `#0C0D0F` | Night canvas | Default dark bg |
| `primitive.jade-600` | `#1F5C52` | Deep jade | Light accent |
| `primitive.jade-400` | `#3D9B8A` | Luminous jade | Dark accent |
| `primitive.gold-400` | `#B8956B` | Muted gold | Light premium |
| `primitive.gold-300` | `#D4B87A` | Soft gold | Dark premium |
| `primitive.burgundy-700` | `#6B2D38` | Ashura | Muharram only |
| `primitive.burgundy-500` | `#8B4A55` | Shahadat | Muharram labels |

### 2.3 Semantic Tokens — Dark Theme (Default) · "Night Vigil"

| Token | Value | Usage |
|-------|-------|-------|
| `color.background.primary` | `#0C0D0F` | App canvas |
| `color.background.secondary` | `#12141A` | Grouped sections |
| `color.surface.elevated` | `#181A22` | Cards, list rows |
| `color.surface.muted` | `#1E2129` | Inputs, chips, skeleton |
| `color.surface.overlay` | `rgba(0,0,0,0.55)` | Modal scrim |
| `color.text.primary` | `#F2F0EB` | Headlines, body |
| `color.text.secondary` | `#9B9890` | Metadata |
| `color.text.tertiary` | `#6B6860` | Placeholders, inactive icons |
| `color.text.inverse` | `#0C0D0F` | Text on accent buttons |
| `color.text.on-gold` | `#1A1A18` | Text on gold badges |
| `color.accent.primary` | `#3D9B8A` | CTAs, links, active tab |
| `color.accent.primary-hover` | `#4AAD9B` | Pressed/hover |
| `color.accent.primary-muted` | `rgba(61,155,138,0.09)` | Selected chips, tint |
| `color.accent.gold` | `#D4B87A` | Premium badge only |
| `color.accent.gold-muted` | `rgba(212,184,122,0.12)` | Pro card wash |
| `color.border.subtle` | `rgba(255,255,255,0.04)` | Card hairlines |
| `color.border.strong` | `rgba(255,255,255,0.08)` | Dividers, input borders |
| `color.border.focus` | `#3D9B8A` | Focus ring |
| `color.feedback.success` | `#3D9B8A` | Completed, synced |
| `color.feedback.warning` | `#C4A962` | Qadha pending |
| `color.feedback.error` | `#A85555` | Validation (muted) |
| `color.feedback.info` | `#4A6FA5` | Informational |

### 2.4 Semantic Tokens — Light Theme · "Dawn"

| Token | Value |
|-------|-------|
| `color.background.primary` | `#F8F6F1` |
| `color.background.secondary` | `#F0EDE6` |
| `color.surface.elevated` | `#FFFFFF` |
| `color.surface.muted` | `#E8E4DC` |
| `color.surface.overlay` | `rgba(26,26,24,0.35)` |
| `color.text.primary` | `#1A1A18` |
| `color.text.secondary` | `#5C5A54` |
| `color.text.tertiary` | `#8A877F` |
| `color.text.inverse` | `#F8F6F1` |
| `color.accent.primary` | `#1F5C52` |
| `color.accent.primary-hover` | `#174A42` |
| `color.accent.primary-muted` | `rgba(31,92,82,0.08)` |
| `color.accent.gold` | `#B8956B` |
| `color.border.subtle` | `rgba(26,26,24,0.06)` |
| `color.border.strong` | `rgba(26,26,24,0.12)` |
| `color.feedback.success` | `#2D6A4F` |
| `color.feedback.warning` | `#9A6B2E` |
| `color.feedback.error` | `#8B3A3A` |

### 2.5 Prayer Chromatic Tokens (Mode-Independent)

Each salat has a dedicated accent — used only for that prayer's indicator, ring arc, or row dot.

| Token | Hex | Inspiration |
|-------|-----|-------------|
| `color.prayer.fajr` | `#4A6FA5` | Pre-dawn blue |
| `color.prayer.dhuhr` | `#C4A962` | Midday warmth |
| `color.prayer.asr` | `#B87D4B` | Afternoon amber |
| `color.prayer.maghrib` | `#7B4B6A` | Dusk rose |
| `color.prayer.isha` | `#3D4A6B` | Night twilight |

### 2.6 Muharram Theme · "Ashura"

Full swap — not a filter. Gold tokens **disabled**.

| Token | Value |
|-------|-------|
| `color.muharram.background.primary` | `#0A0909` |
| `color.muharram.background.secondary` | `#110E0E` |
| `color.muharram.surface.elevated` | `#161212` |
| `color.muharram.accent.primary` | `#6B2D38` |
| `color.muharram.accent.muted` | `rgba(107,45,56,0.12)` |
| `color.muharram.text.accent` | `#8B4A55` |
| `color.muharram.accent.gold` | `transparent` |

### 2.7 Color Usage Rules

| Context | Token | Max per viewport |
|---------|-------|------------------|
| Primary CTA | `accent.primary` | 1 |
| Premium highlight | `accent.gold` | 3 |
| Active prayer | `prayer.{name}` | 1 arc/dot |
| Scripture body | `text.primary` on `background.primary` | — |
| Destructive | `feedback.error` | 1 action |
| AI glow (dark only) | `accent.primary` @ 4% opacity | 1 |

### 2.8 Contrast Compliance

| Pair (Dark) | Ratio | Level |
|-------------|-------|-------|
| text.primary / background.primary | 15.1:1 | AAA |
| text.secondary / surface.elevated | 4.8:1 | AA |
| accent.primary / background.primary | 5.8:1 | AA |
| text.primary / accent.primary (button) | 7.2:1 | AAA |

| Pair (Light) | Ratio | Level |
|--------------|-------|-------|
| text.primary / background.primary | 14.2:1 | AAA |
| text.secondary / surface.elevated | 4.6:1 | AA |
| accent.primary / background.primary | 6.9:1 | AA |

---

## 3. Typography Scale

### 3.1 Type System Overview

Three typographic voices:

| Voice | Role | Personality |
|-------|------|-------------|
| **UI Sans** | Navigation, settings, labels | Neutral, precise, Apple-clean |
| **Scripture** | Quran, duas, ziyarat Arabic | Reverent, generous line-height |
| **Display** | Premium headlines, Pro screen | Instrument Serif — editorial luxury |

**Base size:** 16px · **Scale ratio:** 1.25 (Major Third) · **Grid:** 4px baseline

### 3.2 UI Type Scale

| Token | Size | Line | Weight | Tracking | Use |
|-------|------|------|--------|----------|-----|
| `type.display.lg` | 34 | 40 | 600 | -0.5px | Hero prayer time |
| `type.display.md` | 28 | 34 | 600 | -0.3px | Screen titles |
| `type.heading.lg` | 22 | 28 | 600 | -0.2px | Section headers |
| `type.heading.md` | 18 | 24 | 600 | 0 | Card titles |
| `type.heading.sm` | 16 | 22 | 600 | 0 | List headers, buttons |
| `type.body.lg` | 18 | 28 | 400 | 0 | Quran translation |
| `type.body.md` | 16 | 24 | 400 | 0 | Default body |
| `type.body.sm` | 14 | 20 | 400 | 0 | Secondary copy |
| `type.caption` | 12 | 16 | 500 | +0.2px | Timestamps, tab labels |
| `type.overline` | 11 | 14 | 600 | +1.2px | SECTION LABELS (uppercase) |
| `type.mono` | 15 | 20 | 400 | 0 | Prayer times (tabular nums) |

### 3.3 Scripture Type Scale

| Token | Size | Line | Font | Use |
|-------|------|------|------|-----|
| `type.quran.md` | 28 | 52 | Uthmanic HAFS | Default reader |
| `type.quran.lg` | 36 | 64 | Uthmanic HAFS | Large accessibility mode |
| `type.quran.xl` | 44 | 76 | Uthmanic HAFS | Max user scale |
| `type.dua.ar` | 22 | 40 | Scheherazade New | Dua/ziyarat Arabic |
| `type.dua.ur` | 20 | 36 | Noto Nastaliq Urdu | Urdu translation |
| `type.transliteration` | 15 | 24 | UI Sans italic | Latin transliteration |

### 3.4 Font Stack

| Token | iOS | Android | Web |
|-------|-----|---------|-----|
| `font.ui` | SF Pro | Inter | `system-ui, Inter, sans-serif` |
| `font.ui-ar` | SF Arabic | Noto Sans Arabic | `Noto Sans Arabic, sans-serif` |
| `font.quran` | KFGQPC Uthmanic HAFS | bundled | bundled woff2 |
| `font.dua` | Scheherazade New | bundled | bundled |
| `font.urdu` | Noto Nastaliq Urdu | bundled | bundled |
| `font.display` | Instrument Serif | Instrument Serif | `Instrument Serif, Georgia` |
| `font.mono` | SF Mono | JetBrains Mono | `ui-monospace, monospace` |

### 3.5 Typography Rules

- **Alignment:** Always `text-align: start` — never hardcode left/right  
- **Quran Arabic:** Centered in reader column  
- **Translations:** `start`-aligned below ayah  
- **Numerals:** User preference Western (`123`) or Arabic-Indic (`١٢٣`)  
- **Mixed bidi:** Unicode isolates `\u2068...\u2069` for "Surah 2:255"  
- **Urdu:** `line-height ≥ 1.8` — never compress Nastaliq  
- **Prayer times:** `font-variant-numeric: tabular-nums` always  
- **Truncate:** UI chrome only — **never** truncate ayat  

### 3.6 Dynamic Type

| Platform | Range | Scripture boost |
|----------|-------|-----------------|
| iOS Dynamic Type | xSmall → AX5 | +20% max beyond UI |
| Android fontScale | 0.85× → 2.0× | +20% max beyond UI |
| Breakpoint | Reflow single column < 320pt | |

---

## 4. Spacing System

### 4.1 Base Unit

**8pt grid** with 4pt half-steps for fine alignment.

| Token | px | rem (16 base) | Common use |
|-------|-----|---------------|------------|
| `space.0` | 0 | 0 | — |
| `space.1` | 4 | 0.25 | Icon-text gap, tight stacks |
| `space.2` | 8 | 0.5 | Inline padding, chip gap |
| `space.3` | 12 | 0.75 | Compact list row padding |
| `space.4` | 16 | 1 | Default gutter, grid gap |
| `space.5` | 20 | 1.25 | Screen margin mobile, card padding |
| `space.6` | 24 | 1.5 | Section gap, card padding large |
| `space.8` | 32 | 2 | Screen margin tablet, major section |
| `space.10` | 40 | 2.5 | Hero vertical breathing room |
| `space.12` | 48 | 3 | Section header to content |
| `space.16` | 64 | 4 | Page top hero offset |
| `space.20` | 80 | 5 | Splash, onboarding |
| `space.24` | 96 | 6 | Maximum single gap |

### 4.2 Layout Constants

| Constant | Mobile | Tablet |
|----------|--------|--------|
| Screen margin horizontal | `space.5` (20) | `space.8` (32) |
| Section vertical gap | `space.6` (24) | `space.8` (32) |
| Major section gap | `space.10` (40) | `space.12` (48) |
| Card internal padding | `space.5` (20) | `space.6` (24) |
| List row min-height | 56px | 60px |
| List row padding horizontal | `space.5` | `space.6` |
| Touch target minimum | 44×44pt | 44×44pt |
| Touch target preferred | 48×48pt | 48×48pt |
| Max content width | 428px | 680px (Quran) |

### 4.3 Grid

| Breakpoint | Columns | Gutter |
|------------|---------|--------|
| Mobile (<768) | 4 | 16px |
| Tablet (≥768) | 8 | 24px |
| Foldable open | 12 | 24px |

---

## 5. Border Radius

| Token | px | Usage |
|-------|-----|-------|
| `radius.none` | 0 | Full-bleed scripture, dividers |
| `radius.xs` | 6 | Tags, small chips |
| `radius.sm` | 10 | Inputs, icon buttons, small cards |
| `radius.md` | 14 | Standard cards, list containers |
| `radius.lg` | 20 | Hero cards, prayer module |
| `radius.xl` | 28 | Bottom sheets, modals (top corners) |
| `radius.2xl` | 36 | Full-screen reader chrome (rare) |
| `radius.full` | 9999 | Pills, FAB, avatars, primary buttons |

**Rule:** Larger radius = larger surface. Never mix `radius.lg` on a 32px chip.

---

## 6. Shadows & Elevation

### 6.1 Philosophy

AhlulBayt+ uses **restraint elevation**: scripture and worship cards are **border-defined**, not shadow-defined. Shadows appear only on **floating system chrome** — tab bar, FAB, sheets, tooltips.

### 6.2 Shadow Tokens

| Token | Definition | Use |
|-------|------------|-----|
| `shadow.none` | none | Cards, lists, scripture |
| `shadow.xs` | `0 1px 2px rgba(0,0,0,0.12)` | Subtle lift (light mode chips) |
| `shadow.sm` | `0 2px 8px rgba(0,0,0,0.16)` | Tab bar (Android), mini player |
| `shadow.md` | `0 8px 24px rgba(0,0,0,0.20)` | Bottom sheet, AI FAB |
| `shadow.lg` | `0 16px 48px rgba(0,0,0,0.28)` | Modal (rare) |
| `shadow.glow-accent` | `0 0 24px rgba(61,155,138,0.15)` | AI FAB dark mode only |

**Dark mode:** Prefer **hairline border + surface step** over shadow. Max shadow level in dark: `shadow.sm`.

**iOS tab bar:** `UIBlurEffect.systemUltraThinMaterial` — no shadow token.

### 6.3 Elevation Scale

| Level | Technique | Example |
|-------|-----------|---------|
| 0 | Flat, no border | Quran ayah text |
| 1 | `border.subtle` 1px | Standard card |
| 2 | Border + `surface.elevated` step | Grouped list |
| 3 | `shadow.sm` or blur | Tab bar, mini player |
| 4 | `shadow.md` + scrim | Bottom sheet |
| 5 | `shadow.lg` + scrim 55% | Full modal |

### 6.4 Border as Depth (Primary Method)

```
Card:     1px border.subtle + surface.elevated
Pressed:  background → surface.muted (no shadow change)
Selected: 1px border.focus OR accent.primary-muted fill
```

---

## 7. Motion System

### 7.1 Motion Principles

1. **Calm by default** — worship contexts avoid bounce and slide  
2. **Purposeful** — every animation communicates state change  
3. **Respectful** — Muharram motion is slower, never playful  
4. **Accessible** — `prefers-reduced-motion` → opacity-only, 0ms travel  

### 7.2 Duration Tokens

| Token | ms | Use |
|-------|-----|-----|
| `motion.duration.instant` | 80 | Toggle, checkbox |
| `motion.duration.fast` | 120 | Button press, chip select |
| `motion.duration.normal` | 200 | Tab crossfade, fade in/out |
| `motion.duration.slow` | 320 | Sheet present, expand |
| `motion.duration.slower` | 480 | Muharram theme transition |
| `motion.duration.ambient` | 1200 | Prayer ring pulse (loop) |
| `motion.duration.stream` | 80 | AI token stagger |

### 7.3 Easing Tokens

| Token | Curve | Use |
|-------|-------|-----|
| `motion.ease.out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enter, sheet open |
| `motion.ease.in-out` | `cubic-bezier(0.45, 0, 0.55, 1)` | Reposition |
| `motion.ease.solemn` | `cubic-bezier(0.4, 0, 0.2, 1)` | Muharram |
| `motion.ease.spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Gamification only |

### 7.4 Choreography Catalog

| Interaction | Property | Duration | Easing |
|-------------|----------|----------|--------|
| Button press | scale 0.98 | 120ms | out-expo |
| Tab switch | opacity crossfade | 200ms | in-out |
| Sheet open | translateY + scrim | 320ms | out-expo |
| Card expand | height + opacity | 200ms | out-expo |
| Prayer ring tick | stroke-dashoffset | 1000ms | linear |
| Prayer ring pulse | opacity 1→0.85 | 1200ms | in-out loop |
| Locale RTL flip | layout direction | 200ms | solemn |
| Muharram activate | color tokens | 480ms | solemn |
| AI token appear | opacity 0→1 | 80ms stagger | out-expo |
| Bookmark saved | scale 1→1.15→1 | 200ms | spring (subtle) |
| Reduced motion | opacity only | 0–80ms | linear |

### 7.5 Haptic Tokens

| Token | iOS | Android | Context |
|-------|-----|---------|---------|
| `haptic.selection` | `selection` | `CLOCK_TICK` | Tab, chip |
| `haptic.light` | `light` | 10ms | Tasbih count |
| `haptic.success` | `success` | `CONFIRM` | Prayer logged, premium |
| `haptic.notification` | `notification` | `DEFAULT` | Adhan |
| `haptic.none` | — | — | Muharram default |

---

## 8. Icon Guidelines

### 8.1 System Definition

| Property | Value |
|----------|-------|
| Base grid | 24×24pt |
| Live area | 20×20pt (2px inset) |
| Stroke | 1.5px standard · 2px active |
| Caps / joins | Round |
| Style | Lucide-inspired line icons |
| Fill | None (outline only) except active bookmark |
| Optical align | Visually center, not mathematically center |

### 8.2 Icon Inventory

| Name | Context | Design note |
|------|---------|-------------|
| `home` | Home tab | Simple house — no dome |
| `prayer` | Prayer tab | Abstract mihrab arch |
| `book-open` | Quran | Minimal open book |
| `hands` | Dua | Geometric cupped hands |
| `compass` | Qibla | Compass rose, thin |
| `map-pin` | Ziyarat | Pin + subtle arc |
| `calendar` | Calendar | Grid, no crescent badge |
| `sparkle` | AI assistant | Single 4-point star |
| `moon` | Hijri date | Thin crescent line |
| `settings` | Settings | 6-tooth gear |
| `crown` | Premium | Minimal crown, gold stroke on Pro only |
| `bookmark` | Save | Outline; filled when active |
| `play` / `pause` | Audio | Standard media |
| `chevron-start/end` | Nav | Mirror in RTL |
| `check` | Success | Single stroke checkmark |
| `x` | Close | 24px hit area 44px |

### 8.3 State Colors

| State | Color token |
|-------|-------------|
| Default | `text.tertiary` |
| Hover/pressed | `text.secondary` |
| Active | `accent.primary` |
| Disabled | `text.tertiary` @ 40% opacity |
| Destructive | `feedback.error` |

### 8.4 Prohibited

- Photographic or 3D icons  
- Emoji as navigation glyphs  
- Green-domed mosque silhouettes  
- National flags  
- Animated icons (except AI sparkle pulse @ 4s loop, dark only)  

---

## 9. Component Library

See [COMPONENTS.md](./COMPONENTS.md) for full specifications. Summary:

### 9.1 Primitives

| Component | Variants |
|-----------|----------|
| `Text` | display, heading, body, caption, overline, quran, dua |
| `Button` | primary, secondary, ghost, destructive |
| `IconButton` | default, filled, ghost |
| `Card` | standard, hero, scripture (borderless) |
| `Chip` | default, selected, premium |
| `Input` | text, search, password |
| `Divider` | horizontal, inset |
| `Badge` | dot, count, premium |
| `Skeleton` | text, card, ring |

### 9.2 Composite

| Component | Notes |
|-----------|-------|
| `Screen` | Safe area, scroll, padded |
| `PrayerRing` | Hero 200px / compact 120px |
| `PrayerRow` | 64px, expandable fadilah |
| `TabBar` | Blur, center AI FAB |
| `BottomSheet` | 3 snap points |
| `MiniPlayer` | 64px docked |
| `OfflineBanner` | Animated enter/exit |
| `AyahBlock` | Arabic + translation stack |
| `SettingsRow` | 52px chevron row |

### 9.3 Component States (Universal)

Every interactive component supports:

`default` · `hover` (web) · `pressed` · `focused` · `disabled` · `loading` · `error`

Focus ring: 2px `border.focus`, offset 2px.

---

## 10. Accessibility Standards

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for full audit checklist. Summary:

| Standard | Target |
|----------|--------|
| WCAG | 2.2 Level AA minimum · AAA for scripture body |
| Touch targets | ≥44×44pt · 48pt preferred |
| Color | Never state-by-color alone |
| Motion | `prefers-reduced-motion` honored |
| Screen readers | Full VoiceOver / TalkBack labels |
| Dynamic Type | 0.85×–2.0× without clipping worship text |
| High Contrast | System setting → 2px borders, promoted text |
| Cognitive | One primary action per screen |

---

## 11. Theming & Modes

| Mode | Trigger | Default |
|------|---------|---------|
| Dark | User / system | **Yes** |
| Light | User / system | No |
| Muharram | 1–10 Muharram auto | Overlay on dark |
| High Contrast | System accessibility | Modifier on active theme |

**Theme switch:** 200ms crossfade on background + semantic colors.  
**Muharram switch:** 480ms solemn ease, gold tokens removed.

---

## 12. Implementation Reference

### 12.1 Token Files

| File | Purpose |
|------|---------|
| `docs/design/tokens/tokens.json` | Design ↔ engineering source of truth |
| `mobile/src/theme/colors.ts` | React Native color semantics |
| `mobile/src/theme/tokens.ts` | Spacing, radius, typography |
| `mobile/src/theme/motion.ts` | Duration, easing |
| `mobile/src/theme/shadows.ts` | Shadow definitions |

### 12.2 Figma Library Structure

```
AhlulBayt+ DS v2
├── 🎨 Primitives (color, type, space)
├── 🧩 Components
├── 📱 Templates (iOS 393, Android 412)
├── 🌙 Dark mode
├── ☀️ Light mode
├── 🕯 Muharram
└── ↔️ RTL (AR, UR)
```

### 12.3 Versioning

Semantic versioning for the design system:

- **Major:** Breaking token renames, component API changes  
- **Minor:** New components, new tokens (backward compatible)  
- **Patch:** Bug fixes, contrast adjustments  

Current: **v2.0.0**

---

*Document owner: Design · Version 2.0 · June 2026*
