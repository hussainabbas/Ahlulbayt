# AhlulBayt+ Component Library
## v2.0 — Production Specifications

Companion to [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

---

## 1. Text

### Anatomy
Universal typography primitive wrapping all copy.

### Props (conceptual)

| Prop | Values | Default |
|------|--------|---------|
| `variant` | display.lg · display.md · heading.* · body.* · caption · overline · quran.* · dua.* | body.md |
| `color` | primary · secondary · tertiary · accent · inverse · error | primary |
| `weight` | 400 · 500 · 600 · 700 | per variant |
| `align` | start · center · end | start |

### Specs by variant

| Variant | Font | Size/Line |
|---------|------|-----------|
| display.lg | UI | 34/40 |
| quran.md | Uthmanic | 28/52 |
| overline | UI | 11/14, uppercase, +1.2 tracking |

### Accessibility
- Scripture variants never `numberOfLines` truncate  
- `accessibilityRole="text"` default  
- Quran ayah: announce number in accessibilityLabel  

---

## 2. Button

### Variants

#### Primary
```
Height:        52px
Padding:       0 space.6 (24px horizontal)
Radius:        radius.full
Background:    color.accent.primary
Text:          type.heading.sm, color.text.inverse
Min width:     120px
```

| State | Style |
|-------|-------|
| Default | accent.primary |
| Pressed | scale 0.98, accent.primary-hover |
| Disabled | 40% opacity, no press |
| Loading | label → ellipsis, disabled |
| Focused | 2px focus ring, offset 2 |

#### Secondary
```
Background:    transparent
Border:        1px color.border.strong
Text:          color.text.primary
```

#### Ghost
```
Height:        44px
Background:    transparent
Text:          color.accent.primary
```

#### Destructive
```
Background:    transparent
Border:        1px color.feedback.error @ 40%
Text:          color.feedback.error
```

### Accessibility
- `accessibilityRole="button"`  
- `accessibilityState={{ disabled, busy }}`  
- Min hit area 44×44 even for ghost  

---

## 3. IconButton

```
Size:          44×44pt (hit area)
Icon:          24×24
Radius:        radius.sm
Background:    transparent → surface.muted on press
Icon color:    text.secondary → accent.primary when active
```

---

## 4. Card

### Standard
```
Background:    color.surface.elevated
Border:        1px color.border.subtle
Radius:        radius.md
Padding:       space.5 (20)
Shadow:        shadow.none
```

### Hero (Prayer module)
```
Radius:        radius.lg
Padding:       space.6 (24)
Min height:    200px
Align:         center
Optional wash: accent.primary-muted @ 3% (light only)
```

### Scripture
```
Border:        none
Padding:       0
Background:    transparent
Shadow:        none
```

### States
| State | Change |
|-------|--------|
| Pressed | background → surface.muted |
| Selected | border → accent.primary |

---

## 5. Chip / Segmented Control

### Chip
```
Height:        36px
Padding:       space.2 space.4 (8/16)
Radius:        radius.full
Border:        1px border.subtle
```

| State | Style |
|-------|-------|
| Default | surface.elevated |
| Selected | accent.primary-muted fill, accent.primary border |
| Premium | gold-muted fill, gold border (Pro screens only) |

### Segmented
```
Container:     surface.muted, radius.sm, padding space.1
Segment:       radius.xs, selected → surface.elevated
Height:        36px
```

---

## 6. Input

### Text Input
```
Height:        48px
Padding:       space.3 space.4
Radius:        radius.sm
Background:    surface.muted
Border:        1px border.subtle
Font:          type.body.md
Placeholder:   text.tertiary
```

| State | Style |
|-------|-------|
| Focus | 2px border.focus ring |
| Error | border feedback.error, caption error below |
| Disabled | 50% opacity |

### Search Input
```
Leading:       search icon 20px, text.tertiary
Trailing:      clear button when value present
```

---

## 7. List Row

```
Min height:    56px (settings) · 64px (prayer)
Padding H:     space.5
Divider:       1px border.subtle inset (not last)
Leading:       optional 8px dot or 24px icon
Trailing:      chevron or value caption
```

### Prayer Row (expandable)
```
Collapsed:     64px
Expanded:      auto — fadilah countdown block +12px padding bottom
Active:        8px prayer-color dot + NOW badge
```

---

## 8. Tab Bar

```
Height:        83px iOS (incl. safe area) · 64px Android
Background:    tabBar token + blur iOS
Border top:    1px tabBarBorder
Active icon:   accent.primary, 2px stroke
Inactive:      text.tertiary, 1.5px stroke
Label:         type.caption
```

### Center AI FAB
```
Size:          56×56
Offset:        -8px vertical above bar
Background:    accent.primary
Icon:          sparkle, white, 24px
Shadow:        shadow.md (dark), shadow.sm (light)
```

---

## 9. Top Navigation Bar

```
Height:        56px
Background:    transparent (scroll) · background.primary (solid)
Title:         type.heading.md
Title align:   center (AR) · start (EN) — locale rule
Max actions:   2 trailing icon buttons
Back:          chevron-start, accent.primary
```

---

## 10. Bottom Sheet

```
Top radius:    radius.xl (28)
Handle:        36×4px, radius.full, border.strong, top space.2
Scrim:         surface.overlay
Shadow:        shadow.md
Snap:          40% · 70% · 95%
Enter:         translateY 320ms ease.out-expo
```

---

## 11. Prayer Ring

### Hero
```
Diameter:      200px
Track:         3px border.subtle, round cap
Progress:      3px prayer.{active}, round cap
Center time:   type.display.lg, tabular nums
Subtitle:      type.caption, text.secondary
Animation:     progress 1000ms linear/tick
Pulse:         opacity 1→0.85, 1200ms loop
```

### Compact (widgets)
```
Diameter:      120px
Track:         2px
Center:        type.heading.md
```

---

## 12. Mini Player

```
Height:        64px
Position:      above tab bar
Background:    surface.elevated + blur
Border top:    1px border.subtle
Shadow:        shadow.sm
Progress:      2px height, accent.primary
Controls:      play/pause 44px, title truncates
Dismiss:       swipe down
```

---

## 13. Ayah Block (Quran Reader)

```
Layout:        vertical stack, center Arabic
Arabic:        type.quran.md, centered
Marker:        overline divider with ayah number
Translation:   type.body.lg, text.secondary, start-aligned
Gap:           space.6 between ayat
Sajdah pill:   radius.xs, accent.primary-muted, caption
Chrome:        auto-hide on scroll, 56px toolbar
```

---

## 14. Offline Banner

```
Position:      top, below safe area
Background:    surface.muted
Padding:       space.3 space.4
Enter:         fade + translateY -8, 200ms
Text:          body.sm bold + caption secondary
```

---

## 15. Empty State

```
Icon:          48px, text.tertiary, single stroke
Title:         type.heading.sm
Body:          type.body.sm, text.secondary, max 2 lines
CTA:           ghost button optional
Illustration:  none
```

---

## 16. Skeleton

```
Base:          surface.muted
Shimmer:       surface.elevated, 1.2s loop
Radius:        match target component
No shimmer:    when prefers-reduced-motion
```

---

## 17. Premium Badge

```
Label:         "Pro" or localized
Font:          type.caption, weight 600
Color:         accent.gold
Background:    accent.gold-muted
Padding:       space.1 space.2
Radius:        radius.xs
Max per view:  3 instances
```

---

## 18. Component Composition Patterns

### Screen template
```
Screen (scroll, padded)
  ├─ overline section label
  ├─ display.md title (optional if nav bar shows title)
  ├─ space.6
  ├─ hero Card | PrayerRing
  ├─ space.8
  └─ section(s) with Card rows
```

### Reader template
```
Screen (no pad, no scroll on outer)
  ├─ minimal TopBar (auto-hide)
  ├─ AyahBlock × n (FlashList)
  └─ toolbar (auto-hide)
```

---

## 19. Do / Don't

| Do | Don't |
|----|-------|
| Use semantic color tokens | Hardcode hex in components |
| 44pt minimum touch targets | 32px icon-only buttons |
| Tabular nums for times | Proportional nums in prayer UI |
| hairline borders on cards | drop shadows on scripture |
| Crossfade tab transitions | horizontal slide between worship tabs |
| Test RTL for every component | assume LTR padding |

---

*Component Library v2.0 · June 2026*
