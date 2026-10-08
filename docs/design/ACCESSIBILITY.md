# AhlulBayt+ Accessibility Standards
## v2.0 — Inclusive Devotion

**Target:** WCAG 2.2 Level AA minimum · AAA for scripture body text  
**Platforms:** iOS VoiceOver · Android TalkBack · Dynamic Type · system accessibility settings

---

## 1. Commitment

Every believer — regardless of vision, motor, cognitive, or hearing ability — must be able to:

- Read prayer times and schedule adhan  
- Read Quran, duas, and ziyarat  
- Navigate the app in Arabic, Urdu, or English  
- Complete core worship flows **offline**

---

## 2. WCAG 2.2 Mapping

| Criterion | Level | Implementation |
|-----------|-------|----------------|
| 1.1.1 Non-text Content | A | All icons have accessibilityLabel; decorative icons hidden |
| 1.3.1 Info and Relationships | A | Headings hierarchy; lists use proper roles |
| 1.4.3 Contrast (Minimum) | AA | All UI text pairs verified (see DESIGN_SYSTEM §2.8) |
| 1.4.6 Contrast (Enhanced) | AAA | Scripture body on reader background |
| 1.4.11 Non-text Contrast | AA | Focus rings, prayer dots, input borders ≥3:1 |
| 1.4.12 Text Spacing | AA | No clipping at 1.5× line, 0.12× letter spacing |
| 2.1.1 Keyboard | A | Web: full tab order (future) |
| 2.4.3 Focus Order | A | Logical focus in forms and settings |
| 2.5.5 Target Size | AAA | 44×44pt minimum (we target 48pt primary) |
| 2.5.8 Target Size (Minimum) | AA | 24×24 minimum with 44×44 hit slop |
| 3.2.1 On Focus | A | No context change on focus alone |
| 3.3.1 Error Identification | A | Form errors: text + icon, not color alone |
| 3.3.2 Labels or Instructions | A | All inputs labeled |
| 4.1.2 Name, Role, Value | A | RN accessibility props on all interactives |

---

## 3. Color & Visual

### 3.1 Never Color-Only State

| Element | Required non-color indicator |
|---------|------------------------------|
| Prayer active | Dot + "Now" badge + label |
| Selected chip | Border + weight change |
| Error input | Icon + caption text |
| Bookmark saved | Filled icon + haptic |
| Offline | Banner text + icon |
| Premium | "Pro" text badge |

### 3.2 Color Blindness

Prayer colors are **supplementary** — always pair with prayer name text.  
Don't rely on red/green for success/error without icon.

### 3.3 High Contrast Mode

When system high contrast enabled:

- `border.subtle` → 2px `border.strong`  
- `text.secondary` → promoted to `text.primary` where needed  
- Focus ring → 3px solid  
- Shadow tokens → disabled; borders only  

---

## 4. Typography & Dynamic Type

### 4.1 Scaling Rules

| Content | Scales with system | Max override |
|---------|-------------------|--------------|
| UI chrome | Yes | 2.0× |
| Quran Arabic | Yes | 2.2× |
| Dua Arabic/Urdu | Yes | 2.0× |
| Prayer times | Yes | tabular nums preserved |

### 4.2 Layout at Large Sizes

- Reflow to single column below 320pt effective width  
- Truncate **only** metadata — never ayat or dua body  
- Scroll containers for all text beyond viewport  
- Tab bar labels may hide in "minimal mode" — icons retain labels via accessibility  

### 4.3 Bold Text (iOS)

When Bold Text enabled: scripture +2px additional; weight 600 → 700 for headings.

---

## 5. Screen Readers

### 5.1 Labeling Conventions

| Component | accessibilityLabel pattern |
|-----------|---------------------------|
| Prayer row | "{Prayer name}, {time}, {status}" |
| Prayer ring | "Next prayer {name} at {time}, {countdown} remaining" |
| Ayah block | "Ayah {n} of Surah {name}. {first 100 chars Arabic}" |
| Tab | "{Tab name}, tab, {n} of {total}" |
| AI message | "Assistant said: {content}" |
| Premium badge | "Premium feature" |

### 5.2 Hints

Use `accessibilityHint` sparingly — only when action non-obvious:

- "Double tap to bookmark this ayah"  
- "Double tap to mark prayer as completed"  

### 5.3 Live Regions

| Event | Announcement |
|-------|--------------|
| Adhan scheduled | "Adhan notifications updated" |
| Offline | "You are offline. Worship tools still available." |
| Sync complete | "Your data has synced" |
| AI stream complete | "Response finished" |

### 5.4 Language Announcement

When screen reader language differs from content:

- `accessibilityLanguage="ar-SA"` on Arabic blocks  
- `accessibilityLanguage="ur-PK"` on Urdu blocks  

### 5.5 Decorative Elements

`accessible={false}` and `importantForAccessibility="no-hide-descendants"` for:

- Background gradients (if any)  
- Ornamental dividers  
- Prayer ring track (progress announced separately)  

---

## 6. Motor & Touch

| Requirement | Spec |
|-------------|------|
| Min touch target | 44×44pt |
| Preferred primary CTA | 52px height |
| Spacing between targets | ≥8px |
| Swipe gestures | Always have button alternative |
| Tasbih tap | Full screen tap zone |
| Long press | Never required for core flows |
| Dwell / timing | No time-limited worship interactions |

---

## 7. Motion & Vestibular

### 7.1 Reduced Motion

When `prefers-reduced-motion` / `AccessibilityInfo.isReduceMotionEnabled()`:

| Normal | Reduced |
|--------|---------|
| Sheet slide 320ms | Opacity fade 80ms |
| Tab crossfade 200ms | Instant cut |
| Prayer ring pulse | Static ring |
| AI token stagger | Instant block appear |
| Muharram 480ms | 80ms opacity |
| Parallax | Disabled |

### 7.2 Flashing

No content flashes more than 3 times per second. No strobe on notifications.

---

## 8. Hearing & Audio

| Feature | Accessibility |
|---------|---------------|
| Adhan | Visual notification + optional vibration |
| Dua audio | Transcript always on screen |
| AI responses | Text stream — no audio-only |
| Nauha (Muharram) | Opt-in; captions where available |
| System mute | Adhan still shows visual alert |

---

## 9. Cognitive

- **One primary action** per screen  
- **Consistent navigation** — tabs never reorder  
- **Plain language** in errors — no HTTP codes shown to users  
- **Confirmation** for destructive actions only  
- **No dark patterns** on Premium or notifications  
- **Progress saved** — reading position persists without user action  

---

## 10. RTL Accessibility

- Screen reader traversal follows visual order in RTL  
- Back gesture matches platform locale direction  
- Chevrons mirror; don't rely on "left = back" visually without mirrored asset  

---

## 11. Testing Checklist

### Per release
- [ ] VoiceOver walkthrough: Home → Prayer → Quran → Settings  
- [ ] TalkBack walkthrough: same path  
- [ ] Dynamic Type at maximum — no clipped worship text  
- [ ] Bold Text enabled — scripture readable  
- [ ] Reduce Motion — no essential info in motion only  
- [ ] High Contrast — all states distinguishable  
- [ ] RTL: AR and UR screenshot + reader pass  
- [ ] Offline: core flows without network  
- [ ] Color contrast spot-check (Stark / APCA)  

### Automated
- [ ] eslint-plugin-react-native-a11y (where applicable)  
- [ ] Detox accessibility ID coverage on primary flows  

---

## 12. Accessibility IDs (Engineering)

Naming: `a11y.{screen}.{element}`

Examples:
```
a11y.home.prayer-ring
a11y.prayer.row.fajr
a11y.quran.ayah.2.255
a11y.settings.theme.dark
a11y.tab.quran
```

---

*Accessibility Standards v2.0 · June 2026*
