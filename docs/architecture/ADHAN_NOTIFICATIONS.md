# Adhan Notification System
## v1.0 — Local Scheduling · Jafari Prayer Times

---

## Overview

On-device adhan notifications scheduled from the **Jafari prayer engine**. No server required — alarms survive offline use and refresh when the app opens.

```
mobile/src/features/adhan/
├── types.ts
├── data/adhanVoices.ts
├── services/
│   ├── notificationChannels.ts   Android channels + foreground handler
│   ├── adhanScheduler.ts         Build notification requests
│   └── adhanNotificationService.ts
├── hooks/
│   ├── useAdhanNotifications.ts  Auto-reschedule hook
│   └── useAdhanSettings.ts
└── components/
    ├── AdhanBootstrap.tsx        Root mount
    └── AdhanSettingsPanel.tsx    Settings UI

mobile/src/stores/adhanStore.ts   Persisted preferences (MMKV)
mobile/assets/sounds/adhan/       Custom .wav adhan files
```

---

## Features

| Feature | Implementation |
|---------|----------------|
| **All prayers** | Fajr, Dhuhr, Asr, Maghrib, Isha — per-prayer toggles |
| **Custom sounds** | Per-prayer `customSoundUri` + bundled `.wav` voices |
| **Multiple voices** | Makkah, Madinah, Najaf, Karbala, Ali Makki, Classic |
| **Silent mode override** | Android `bypassDnd` channel · iOS `timeSensitive` interruption |
| **Smart reminders** | Configurable nudge (default 10 min before) |
| **Preparation alerts** | Wudu prep alert (default 15 min before, 0 = off) |

---

## Notification Types

| Kind | Trigger | Channel | Sound |
|------|---------|---------|-------|
| `adhan` | Exact prayer time | `adhan-primary` | Selected voice |
| `preparation` | N min before | `adhan-reminder` | Default |
| `smart` | N min before (smart) | `adhan-reminder` | Default |

---

## Scheduling Strategy

- **3 days** ahead (iOS 64-notification limit)
- **Deterministic IDs**: `adhan-{date}-{prayer}-{kind}`
- **Fingerprint dedup** — skip reschedule if times + settings unchanged
- **Refresh triggers**: app foreground, settings change, prayer recalc, onboarding grant

```typescript
await AdhanNotificationService.reschedule(week, settings, t);
```

---

## Settings Store

```typescript
useAdhanStore.getState().setMasterEnabled(true);
useAdhanStore.getState().setSilentModeOverride(true);
useAdhanStore.getState().setPreparationMinutes(15);
useAdhanStore.getState().setGlobalVoice('najaf');
useAdhanStore.getState().setPrayerEnabled('fajr', true);
useAdhanStore.getState().setPrayerCustomSound('fajr', 'file:///...');
```

---

## Custom Adhan Sounds

1. Add `.wav` files (≤30s) to `mobile/assets/sounds/adhan/`
2. Register in `app.config.ts`:

```ts
['expo-notifications', {
  color: '#3D9B8A',
  sounds: ['./assets/sounds/adhan/adhan_makkah.wav'],
}],
```

3. Rebuild native app (EAS / dev client)

---

## Permissions

- Requested during onboarding **Notifications** step
- Re-requested on reschedule if revoked
- iOS: alert + sound
- Android: `POST_NOTIFICATIONS` (API 33+) via expo-notifications

---

## Integration Points

| Location | Role |
|----------|------|
| `AppProviders` | `AdhanBootstrap` mounts scheduler |
| `SettingsScreen` | Full adhan settings panel |
| `PrayerScreen` | Status banner → Settings |
| `NotificationsStep` | Enable master + init channels on grant |

---

*Adhan System v1.0 · AhlulBayt+ · June 2026*
