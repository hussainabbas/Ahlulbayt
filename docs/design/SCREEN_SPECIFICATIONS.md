# Ahlulbayt+ Screen Specifications
## Production UI Specifications v1.0

**Companion to:** `DESIGN_SYSTEM.md`  
**Viewport reference:** iPhone 15 Pro (393×852pt) · Android Pixel 8 (412×915dp)  
**Safe areas:** Respect `safeAreaInsets` on all screens

---

## Screen Index

| # | Screen | Route | Priority |
|---|--------|-------|----------|
| 1 | Home | `/` | P0 |
| 2 | Prayer | `/prayer` | P0 |
| 3 | Quran | `/quran` | P0 |
| 4 | Ziyarat | `/ziyarat` | P0 |
| 5 | Dua | `/dua` | P0 |
| 6 | Muharram Mode | overlay + `/muharram` | P0 |
| 7 | AI Assistant | `/ai` | P1 |
| 8 | Calendar | `/calendar` | P1 |
| 9 | Settings | `/settings` | P1 |
| 10 | Premium Subscription | `/premium` | P1 |

---

## 1. Home Screen

### 1.1 Purpose
Daily spiritual dashboard. Answers: *What time is prayer? What should I read today? What is today in the Hijri calendar?*

### 1.2 Layout Anatomy

```
┌─────────────────────────────────────┐
│  [Hijri date]          [Profile ○]  │  ← Top bar: 56px, transparent
├─────────────────────────────────────┤
│                                     │
│         ┌───────────────┐           │
│         │  Prayer Ring  │           │  ← Hero: 200px ring, centered
│         │   12:34 PM    │           │
│         │  Dhuhr · 2h   │           │
│         └───────────────┘           │
│                                     │
│  ┌──────────┐ ┌──────────┐         │  ← Quick actions: 2×2 grid
│  │  Qibla   │ │  Tasbih  │         │
│  └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐         │
│  │  Dua     │ │  Ziyarat │         │
│  └──────────┘ └──────────┘         │
│                                     │
│  TODAY'S AMAAL                      │  ← Section: overline label
│  ┌─────────────────────────────────┐│
│  │ • Dua Kumail (Thursday)    →   ││  ← Single card, tappable rows
│  │ • Ziyarat Waritha          →   ││
│  └─────────────────────────────────┘│
│                                     │
│  CONTINUE READING                   │
│  ┌─────────────────────────────────┐│
│  │ Al-Baqarah · Ayah 142      ▶   ││  ← Quran resume card
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  Home  Prayer  [AI]  Quran  More    │  ← Tab bar
└─────────────────────────────────────┘
```

### 1.3 Component Specifications

| Element | Spec |
|---------|------|
| Hijri date (top leading) | `caption` + `heading-sm`: "١٤ جمادى الآخرة ١٤٤٧" / "14 Jumada II 1447" |
| Profile avatar | 32px circle, initials or photo, tap → Settings |
| Prayer ring | See DESIGN_SYSTEM §6.6; active prayer color token |
| Countdown label | `caption` text-secondary: "Next: Asr in 2h 14m" |
| Quick action tile | 80×80pt min, `radius-md` card, icon 24px + `caption` label below |
| Amaal row | Height 56px, chevron trailing, divider between rows |
| Resume card | Height 72px, surah name `heading-sm`, ayah `caption` |

### 1.4 States

| State | Behavior |
|-------|----------|
| Loading | Skeleton: ring placeholder + 4 tile skeletons |
| No location | Banner: "Enable location for accurate prayer times" + CTA |
| Muharram | Hero ring replaced with Ashura countdown card (see §6) |
| Premium | Subtle gold thread on profile avatar ring |

### 1.5 Interactions

- Pull to refresh: prayer times + Hijri date sync
- Long press prayer ring → Prayer screen
- Quick tiles: haptic on tap, 200ms scale 0.97

### 1.6 Scroll
Vertical scroll, `contentInset` top 0, bounce enabled. Tab bar and mini player fixed.

---

## 2. Prayer Screen

### 2.1 Purpose
Authoritative Jafari prayer timetable, adhan, qadha tracking, and fadilah windows.

### 2.2 Layout — Default View

```
┌─────────────────────────────────────┐
│  ←  Prayer Times        [⚙] [📍]   │
├─────────────────────────────────────┤
│  Today · Friday · 14 Jumada II      │  caption + heading-sm
│  Baghdad, Iraq                      │  caption, text-secondary
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ Fajr      04:12    ┌──────────┐ ││
│  │                      │ Fadilah  │ ││  ← Expandable row
│  │                      │ until 05:│ ││
│  │                      └──────────┘ ││
│  ├─────────────────────────────────┤│
│  │ ● Dhuhr   12:34    [NOW]        ││  ← Active: accent dot + badge
│  ├─────────────────────────────────┤│
│  │   Asr     16:02                 ││
│  ├─────────────────────────────────┤│
│  │   Maghrib 19:48    (+17 min)    ││  ← Jafari note badge
│  ├─────────────────────────────────┤│
│  │   Isha    20:58                 ││
│  ├─────────────────────────────────┤│
│  │   Midnight (Shia)  23:31        ││  ← Jafari-specific
│  └─────────────────────────────────┘│
│                                     │
│  [  Full Adhan  ]  [  Qadha: 3  ]   │  ← Secondary pills
│                                     │
│  WEEK VIEW  ─────────────────────   │  ← Segmented: Day | Week | Month
│  ...                                │
└─────────────────────────────────────┘
```

### 2.3 Prayer Row Specification

| Property | Value |
|----------|-------|
| Row height | 64px (collapsed) · auto (expanded fadilah) |
| Prayer name | `heading-sm`, localized |
| Time | `heading-md`, tabular nums (`font-variant-numeric: tabular-nums`) |
| Active indicator | 8px dot, `prayer-{name}` color, leading |
| NOW badge | Pill, `accent-primary-muted` bg, `caption` weight 600 |
| Maghrib badge | `caption`: "+17 min" — tooltip explains Jafari shafaq |
| Swipe action (optional) | Leading: "Mark prayed" · Trailing: "Qadha" |

### 2.4 Fadilah Expansion

Tap row to expand:
- Fadilah end time with live countdown
- Sunrise / sunset astronomical times
- "Preferred time ends in 47m" — `body-sm`, `warning` color when < 15m

### 2.5 Adhan Sheet (Bottom Sheet 70%)

- Reciter selector: horizontal scroll chips
- Per-prayer toggle switches
- Pre-adhan alarm: 5 / 10 / 15 / 30 min chips
- "Use Shia Adhan" default: Ali Akbar Farhangi option
- Preview button: 10s sample

### 2.6 Qadha Tracker

- Badge on pill shows pending count
- Full screen: list by prayer type, date missed, "Make up" CTA
- Mark as completed: swipe + haptic success

### 2.7 Calculation Settings (Gear)

- Method: Leva Institute · Tehran · Custom
- Marja selector: Sistani · Khamenei · Custom offsets
- Per-prayer manual offset: ± minutes stepper
- High latitude rule: selector

---

## 3. Quran Screen

### 3.1 Purpose
Distraction-free Quran reading with Shia-specific features (Sajdah markers, Bismillah rules, translation stack).

### 3.2 Layout — Surah List

```
┌─────────────────────────────────────┐
│  Quran                  [🔍] [⋮]   │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │  Continue: Al-Baqarah  2:142  ▶││  ← Resume banner
│  └─────────────────────────────────┘│
│  [ Surah | Juz | Hizb | Subject ]   │  ← Segmented control
├─────────────────────────────────────┤
│  1  Al-Fatihah        الفاتحة  · 7  │
│  ─────────────────────────────────  │
│  2  Al-Baqarah        البقرة  ·286  │
│  ...                                │
└─────────────────────────────────────┘
```

### 3.3 Layout — Reader (Full Screen)

```
┌─────────────────────────────────────┐
│  ←  Al-Baqarah  2:255          [Aa]│  ← Minimal chrome, auto-hide
├─────────────────────────────────────┤
│                                     │
│     اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ    │  arabic-quran, centered
│           الْحَيُّ الْقَيُّومُ        │
│                                     │
│  ─────────── 255 ───────────        │  ← Ayah marker: overline
│                                     │
│  Allah — there is no deity except   │  body-lg, text-secondary
│  Him, the Ever-Living...            │  start-aligned
│                                     │
│  [Transliteration line if enabled]  │  transliteration, italic
│                                     │
├─────────────────────────────────────┤
│  ◀  ▶  🔖  📋  🎧  ⬡            │  ← Toolbar: 56px, fades on scroll
└─────────────────────────────────────┘
```

### 3.4 Reader Specifications

| Element | Spec |
|---------|------|
| Arabic text | `arabic-quran` default; user scale 24–48px |
| Ayah number | `overline` in decorative divider, not inline superscript |
| Translation | Toggle: EN / UR / AR / Hidden; stacked below ayah |
| Sajdah indicator | Small pill "Sajdah" before ayah, `accent-primary-muted` |
| Bismillah | Omitted between surahs 9→10 per Shia convention (setting) |
| Page mode | Optional mushaf page layout (15-line Madinah) |
| Audio | Tap 🎧 → mini player; word-by-word highlight optional (Premium) |
| Bookmark | Per-ayah; synced across devices (Premium) |

### 3.5 Typography Panel (Aa)

Bottom sheet:
- Arabic size slider
- Translation size slider
- Font: Uthmani / Naskh
- Theme: Sepia · Night · Light
- Line spacing: Compact · Normal · Spacious

### 3.6 Search

- Full-text search Arabic + translation
- Results: surah:ayah snippet, tap to navigate
- Subject index: 2000+ categorized verses (Shia Muslim parity)

---

## 4. Ziyarat Screen

### 4.1 Purpose
Sacred visitations with audio, context, and pilgrimage preparation.

### 4.2 Layout — Directory

```
┌─────────────────────────────────────┐
│  Ziyarat                [🔍]       │
├─────────────────────────────────────┤
│  [ All | Holy Sites | Imam | Daily ]│  Filter chips, horizontal scroll
├─────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐     │
│  │  Ashura    │ │  Waritha   │     │  ← Featured: 2-col grid, hero cards
│  │  زيارة عاشوراء │ │  زيارة وارث  │     │
│  └────────────┘ └────────────┘     │
│                                     │
│  POPULAR                            │
│  ┌─────────────────────────────────┐│
│  │ Ziyarat Ale Yasin          ▶   ││
│  │ Imam Husayn (as) — Karbala      ││  caption
│  └─────────────────────────────────┘│
│  ...                                │
│                                     │
│  BY HOLY SITE                       │
│  Karbala · Najaf · Samarra · ...    │  ← Horizontal site cards with photo
└─────────────────────────────────────┘
```

### 4.3 Layout — Reader

```
┌─────────────────────────────────────┐
│  ←  Ziyarat Ashura          [♡][⋮] │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │     ▶  Play Audio · 12:34      ││  ← Sticky audio bar
│  └─────────────────────────────────┘│
│                                     │
│  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ   │  arabic-dua
│                                     │
│  السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ...   │
│                                     │
│  Peace be upon you, O Aba Abdillah  │  body-lg translation
│                                     │
│  [ Transliteration ]                │  collapsible
│                                     │
│  ─── Context ───                    │
│  Recited on Ashura and throughout   │  body-sm, text-secondary
│  Muharram. Authored by...           │
│                                     │
│  [ View on Map ]                    │  ghost button → Karbala pin
└─────────────────────────────────────┘
```

### 4.4 Ziyarat Card (Directory)

- Height: 88px (list) · 120px (featured grid)
- Arabic subtitle: `body-sm`, text-secondary, RTL
- Trailing: duration `caption` if audio available
- Favorite: heart fill `accent-primary`

### 4.5 Holy Site Map

- Full-screen map, muted style
- Pins: Imam shrines, historical Karbala sites
- Tap pin → site detail + related ziyarat list
- Offline map download (Premium)

### 4.6 Audio Sync

- Highlight current phrase during playback (karaoke-style, subtle `accent-primary-muted` bg)
- Speed: 0.75× · 1× · 1.25×
- Reciter: Abu Thar Al-Halawaji + others

---

## 5. Dua Screen

### 5.1 Purpose
Mafatih-aligned supplication library with daily/weekly/monthly amaal routing.

### 5.2 Layout — Hub

```
┌─────────────────────────────────────┐
│  Duas & Amaal           [🔍]       │
├─────────────────────────────────────┤
│  TODAY · THURSDAY                   │
│  ┌─────────────────────────────────┐│
│  │  📿  Dua Kumail                  ││  ← Today card: hero, accent left border 3px
│  │      Recommended tonight          ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  [ Daily | Weekly | Monthly | All ] │
├─────────────────────────────────────┤
│  Sahifa Sajjadia                    │  ← Collection rows
│  Mafatih al-Jinan                   │
│  Specific Purpose                     │
│  Taqibat al-Salat                     │
│  ...                                  │
└─────────────────────────────────────┘
```

### 5.3 Layout — Dua Reader

Same structure as Ziyarat reader with additions:
- **Repeat counter** for sections (e.g., 3×, 7×, 100×) — tap to track
- **Rakat counter** integration for namaaz duas
- **Bilingual toggle**: AR only · AR+EN · AR+UR · All
- **Night mode dim**: auto after Isha (optional)

### 5.4 Mafatih Structure

Mirror printed Mafatih indexes:
1. Duas & Munajat
2. Aamal (daily/monthly/occasions)
3. Ziyarat (cross-link)
4. Namaaz (cross-link)

### 5.5 Custom Mafatih (Premium)

- User selects duas to compile personal collection
- Reorder via drag handle
- Export PDF (Premium)

---

## 6. Muharram Mode

### 6.1 Purpose
Transform the entire app into a solemn commemoration experience for the Sacred Month.

### 6.2 Activation

| Trigger | Behavior |
|---------|----------|
| Auto | 1 Muharram 00:00 local Hijri |
| Manual | Settings → "Observe Muharram" toggle |
| Duration | Default: 1–10 Muharram; option extend to Arbaeen |

### 6.3 Home Screen (Muharram)

```
┌─────────────────────────────────────┐
│  Muharram 1447          [Profile ○] │  ← No gold; burgundy accent
├─────────────────────────────────────┤
│                                     │
│         ┌───────────────┐           │
│         │   Ashura      │           │
│         │   Day 7 of 10 │           │  ← Countdown to 10 Muharram
│         │               │           │
│         └───────────────┘           │
│                                     │
│  DAILY AMAAL                        │
│  ┌─────────────────────────────────┐│
│  │ Ziyarat Ashura              →  ││
│  │ Dua Alqamah                 →  ││
│  │ Nauha: Asghar (audio)       ▶  ││
│  └─────────────────────────────────┘│
│                                     │
│  MAJLIS TONIGHT                     │
│  ┌─────────────────────────────────┐│
│  │ 7:30 PM · Community Center      ││  ← Optional community events
│  │ "The Women of Karbala"          ││
│  └─────────────────────────────────┘│
│                                     │
│  KARBALA LIVE                       │  ← Optional live stream card
│  [ thumbnail ]  Shrine of Imam Husayn│
└─────────────────────────────────────┘
```

### 6.4 Visual Transformations

| Element | Standard | Muharram |
|---------|----------|----------|
| Background | `#0C0D0F` | `#0A0909` |
| Accent | Jade | Burgundy `#6B2D38` |
| Gold | Available | **Removed** |
| App icon | Standard | Black alternate |
| Tab bar | Standard | Same structure, burgundy active |
| Illustrations | — | None added |
| Confetti | — | **Disabled** |

### 6.5 Muharram Dedicated Screen (`/muharram`)

Full timeline of 1–10 Muharram:
- Day cards: historical event summary (1–2 sentences, scholarly sourced)
- Required aamal checklist per day
- Audio: maqtal narration chapters
- "I am fasting" toggle for Ashura + 9th Muharram

### 6.6 Audio Policy

- Nauha playlist: opt-in only
- Default notification sound: subdued tone, not celebratory
- User can enable "Majlis mode" → streams recommended lectures

---

## 7. AI Assistant Screen

### 7.1 Purpose
Scholarly-grounded Shia knowledge companion. **Not a fatwa engine.**

### 7.2 Layout

```
┌─────────────────────────────────────┐
│  ←  Ask Ahlulbayt            [ℹ]   │
├─────────────────────────────────────┤
│                                     │
│         ✦                           │  ← sparkle icon, 48px, accent
│    How can I help you today?        │  heading-md, centered
│                                     │
│  SUGGESTED                          │
│  ┌──────────────┐ ┌──────────────┐ │
│  │ Who are the  │ │ Explain      │ │  ← Chips, horizontal scroll
│  │ Twelve Imams?│ │ Ghadir Khumm │ │
│  └──────────────┘ └──────────────┘ │
│  ┌──────────────┐ ┌──────────────┐ │
│  │ Summarize    │ │ Dua for      │ │
│  │ Ziyarat Ashura│ │ anxiety     │ │
│  └──────────────┘ └──────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ Ask a question...            [↑]││  ← Input: 52px, pinned bottom
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 7.3 Conversation View

| Element | Spec |
|---------|------|
| User bubble | `surface-elevated`, `radius-lg`, trailing aligned, max 85% width |
| AI bubble | borderless, leading aligned, `body-md` |
| Citation chip | `caption`, tappable → source sheet (book, chapter) |
| Streaming | Token fade-in 80ms stagger |
| Disclaimer | Fixed footer above input: "Not for fiqh rulings. Consult your marja." `caption`, text-tertiary |
| Modes | General · Lecture Summary · Quran Reflection (segmented) |

### 7.4 Source Sheet

- Book title, author, excerpt
- "Open in Library" if book available in app
- Share citation button

### 7.5 Premium Gates

- Free: 10 questions/day
- Premium: unlimited + lecture upload summarization + book generation

---

## 8. Calendar Screen

### 8.1 Purpose
Shia Hijri calendar with 80+ wiladat/shahadat events, amaal routing, moon visibility.

### 8.2 Layout — Month View

```
┌─────────────────────────────────────┐
│  ←  Jumada II 1447        [Today]   │
├─────────────────────────────────────┤
│  S  M  T  W  T  F  S                │  ← Week starts Saturday (configurable)
│        1  2  3  4  5                │
│  6  7  8  9 10 11 12                │
│ 13 14●15 16 17 18 19                │  ← Dot: event; ● today
│ ...                                 │
├─────────────────────────────────────┤
│  15 Jumada II                       │
│  ┌─────────────────────────────────┐│
│  │ 🕯 Shahadat Imam Ali al-Naqi    ││  ← Event card: burgundy dot if shahadat
│  │    (as) — 29 Dhul Hijjah        ││
│  │    [ View Amaal ]               ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 🌙 Wiladat Imam Muhammad Taqi   ││  ← Jade dot if wiladat
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 8.3 Event Dot Colors

| Type | Color |
|------|-------|
| Wiladat (celebration) | `accent-primary` |
| Shahadat (commemoration) | `accent-primary` dark mode · `#8B4A55` Muharram |
| Islamic holiday | `accent-gold` (hidden in Muharram) |
| User reminder | `text-secondary` outline dot |

### 8.4 Event Detail Sheet

- Hijri + Gregorian date
- Event description (2–3 paragraphs, expandable)
- Related duas/ziyarat links
- "Add to device calendar" export
- Notification toggle per event

### 8.5 Alternate Views

- **List view:** chronological upcoming 30 days
- **Moon phase:** hilal confirmation card (community-sourced, disclaimer)
- **Syriac calendar toggle** (for Iraqi/Syrian communities)

---

## 9. Settings Screen

### 9.1 Layout

```
┌─────────────────────────────────────┐
│  Settings                           │
├─────────────────────────────────────┤
│  ┌──── Premium ────────────────────┐│
│  │  ✦ Ahlulbayt+ Pro         [→]  ││  ← Gold accent card, tap → Premium
│  │  Unlock offline, AI, themes     ││
│  └─────────────────────────────────┘│
│                                     │
│  ACCOUNT                            │
│  Profile · Sync · Sign in           │
│                                     │
│  PRAYER                             │
│  Calculation method · Marja · Adhan │
│  Notifications · Qadha              │
│                                     │
│  APPEARANCE                         │
│  Theme: Dark / Light / System       │
│  Language: English ▾                │
│  Muharram mode: Auto                │
│                                     │
│  QURAN & AUDIO                      │
│  Translation prefs · Reciter · DL   │
│                                     │
│  PRIVACY                            │
│  Analytics · Location · Data export │
│                                     │
│  ABOUT                              │
│  Version · Licenses · Contact       │
│                                     │
│  [ Sign Out ]                       │  ghost, destructive color
└─────────────────────────────────────┘
```

### 9.2 Settings Row Spec

| Property | Value |
|----------|-------|
| Row height | 52px |
| Label | `body-md` |
| Value | `body-sm`, text-secondary, trailing |
| Chevron | 16px, text-tertiary |
| Section header | `overline`, 32px top margin |
| Destructive | `error` text color |

### 9.3 Language Picker

Bottom sheet:
- English · العربية · اردو
- Instant apply with 200ms layout direction animation
- Preview: "السلام عليكم" sample text

### 9.4 Marja Selector

- Sistani (Leva Institute default)
- Khamenei (Tehran)
- Shirazi · Fayyad · Custom
- Changing marja shows non-blocking toast: "Prayer times updated per your marja"

---

## 10. Premium Subscription Screen

### 10.1 Purpose
Convert free users with clear value, spiritual tone — never aggressive.

### 10.2 Layout

```
┌─────────────────────────────────────┐
│  ✕                                  │  ← Dismiss only, no dark pattern
├─────────────────────────────────────┤
│                                     │
│            ✦ Ahlulbayt+ Pro         │  display-md, Instrument Serif
│                                     │
│     Deepen your journey with        │  body-md, text-secondary, centered
│     the complete experience         │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  ✓  Offline Quran & Duas        ││
│  │  ✓  Unlimited AI assistant        ││
│  │  ✓  Lecture summaries           ││
│  │  ✓  Custom themes & widgets     ││
│  │  ✓  Ziyarat offline maps        ││
│  │  ✓  Family sharing (5 members)  ││
│  │  ✓  No advertisements           ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  YEARLY · Best value             ││  ← Selected: gold border 1px
│  │  $39.99/year · $3.33/mo          ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  MONTHLY                         ││
│  │  $6.99/month                     ││
│  └─────────────────────────────────┘│
│                                     │
│  [  Start 7-Day Free Trial  ]       │  ← Primary CTA
│                                     │
│  Restore · Terms · Privacy          │  caption links, centered
│                                     │
│  "Supporting Ahlulbayt+ helps us      │  caption, text-tertiary
│   serve the global Shia community"  │
└─────────────────────────────────────┘
```

### 10.3 Visual Rules

| Rule | Detail |
|------|--------|
| Gold usage | Checkmarks + selected plan border + ✦ icon ONLY |
| No urgency timers | Forbidden |
| No "limited offer" banners | Forbidden |
| Background | `background-primary` with subtle radial wash `accent-gold-muted` at 5% top center |
| Illustration | None — typography carries premium feel |
| Trial CTA | Primary button; secondary "Continue free" as ghost below fold |

### 10.4 Plan Card Spec

- Height: 72px
- Selected: 1px `accent-gold` border + `accent-gold-muted` 8% bg
- Unselected: 1px `border-subtle`
- Radio: trailing, 22px

### 10.5 Paywall Triggers (Soft)

Show Premium screen on:
- 11th AI question of the day
- Offline download attempt
- Custom theme selection
- Never on prayer times, qibla, or basic dua reading

---

## 11. Cross-Screen Patterns

### 11.1 Loading

- Skeleton shimmer: `surface-muted` → `surface-elevated`, 1.2s loop
- Never block prayer times with full-screen loader

### 11.2 Empty States

```
[ 48px icon, text-tertiary ]
heading-sm: "No bookmarks yet"
body-sm: "Save ayahs and duas to find them quickly"
[ Ghost CTA optional ]
```

### 11.3 Error States

- Inline banner, top of content (not modal)
- `error` color icon + `body-sm` message + "Retry" text button

### 11.4 Search (Global Pattern)

- Expandable top bar search
- Debounce 300ms
- Recent searches: max 5, clear all option

### 11.5 Share Sheet

- Share ayah: Arabic + translation + "via Ahlulbayt+" watermark
- Share dua: truncated with link to open in app (deep link)

---

## 12. Widget Specifications (iOS / Android)

### 12.1 Prayer Widget — Small (155×155)

- Next prayer name + time
- Countdown
- Background: `surface-elevated` / widget tint

### 12.2 Prayer Widget — Medium (329×155)

- All 5 prayers, compact list
- Active prayer highlighted

### 12.3 Hijri Date Widget — Small

- Hijri date large
- Gregorian small
- Today's event label if any

---

## 13. Deep Link Routes

| Route | Screen |
|-------|--------|
| `ahlulbayt://prayer` | Prayer |
| `ahlulbayt://quran/{surah}/{ayah}` | Quran reader |
| `ahlulbayt://dua/{id}` | Dua reader |
| `ahlulbayt://ziyarat/{id}` | Ziyarat reader |
| `ahlulbayt://calendar/{hijri-date}` | Calendar day |
| `ahlulbayt://ai?q={query}` | AI with prefilled question |
| `ahlulbayt://muharram` | Muharram hub |
| `ahlulbayt://premium` | Subscription |

---

## 14. Figma Handoff Notes

### 14.1 File Structure

```
📁 Ahlulbayt+ Design
├── 📁 00 — Tokens (variables)
├── 📁 01 — Components
├── 📁 02 — Screens — Light
├── 📁 03 — Screens — Dark
├── 📁 04 — Screens — Muharram
├── 📁 05 — Screens — RTL (AR/UR)
├── 📁 06 — Prototypes
└── 📁 07 — Icons
```

### 14.2 Variable Collections

- `color/mode/{light|dark|muharram}`
- `space/{0-24}`
- `radius/{xs-full}`
- `font/{role}/{size}`

### 14.3 Export Assets

| Asset | Format | Scales |
|-------|--------|--------|
| Icons | SVG | 1× |
| App icon | PNG | 1024, 180, 120, 87, 80, 76, 60, 58, 40, 29, 20 |
| Muharram icon | PNG | Same set |
| Widget bg | PNG @3x | iOS |

---

## 15. Engineering Handoff Checklist

- [ ] All colors as semantic tokens (no hardcoded hex in components)
- [ ] `start`/`end` layout properties throughout
- [ ] Tab bar safe area tested on iPhone SE + iPad
- [ ] Quran fonts bundled in app binary
- [ ] Muharram theme: CSS/Tailwind variable swap or equivalent
- [ ] Prayer times: tabular nums font feature enabled
- [ ] AI disclaimer always visible when keyboard open
- [ ] Premium: StoreKit 2 + Play Billing Library 6
- [ ] Screenshot tests for all 15 screens × 3 themes × 2 directions

---

*Document owner: Design · Version 1.0 · Last updated: June 2026*
