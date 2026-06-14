# AhlulBayt+ Design System

**Codename:** Noor (نور) · **Version:** 2.0.0  
Luxury Islamic aesthetics · Apple-level quality · Minimal · Spiritual · Premium

## Documents

| Document | Description |
|----------|-------------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Master spec — colors, type, space, radius, shadows, motion, icons |
| [COMPONENTS.md](./COMPONENTS.md) | Full component library specifications |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | WCAG 2.2, screen readers, motion, testing |
| [SCREEN_SPECIFICATIONS.md](./SCREEN_SPECIFICATIONS.md) | Screen layouts and flows |
| [ONBOARDING.md](./ONBOARDING.md) | 7-step onboarding UX & copy |
| [tokens/tokens.json](./tokens/tokens.json) | Machine-readable design tokens |

## Design Philosophy

| Pillar | Expression |
|--------|------------|
| **Minimal** | One hero per screen; typography as visual |
| **Spiritual** | Scripture ≥60% viewport in readers |
| **Luxury** | Hairlines, 8pt grid, tabular nums |
| **Premium** | Gold on ≤3 elements per Pro screen |
| **Apple-level** | Native blur, 44pt targets, calm motion |

## Quick Reference

### Themes
| Mode | Canvas | Accent |
|------|--------|--------|
| Dark (default) | `#0C0D0F` | `#3D9B8A` jade |
| Light | `#F8F6F1` ivory | `#1F5C52` jade |
| Muharram | `#0A0909` | `#6B2D38` burgundy |

### Tokens
```
Spacing:  8pt grid (4–96px)
Radius:   6–28px + full pill
Shadow:   none on cards · sm–md on floating chrome only
Motion:   120ms press · 200ms tabs · 480ms Muharram
```

### Languages
English (LTR) · العربية (RTL) · اردو (RTL)

## Engineering

React Native tokens: `mobile/src/theme/`

```
colors.ts   — semantic color themes
tokens.ts   — spacing, radius, typography
motion.ts   — duration + easing (Reanimated)
shadows.ts  — elevation shadows
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Jun 2026 | Full token architecture, shadows, expanded components & a11y |
| 1.0.0 | Jun 2026 | Initial design system |
