# Adhan Sound Assets

Place `.wav` adhan files here, register each file in `app.config.ts`, then run:

```bash
npm run sync:adhan-sounds
```

| File | Voice ID | Status |
|------|----------|--------|
| `azan.wav` | `default` (Classic) | **Registered** |
| `adhan_makkah.wav` | makkah | Not bundled yet |
| `adhan_madina.wav` | madina | Not bundled yet |
| `adhan_najaf.wav` | najaf | Not bundled yet |
| `adhan_karbala.wav` | karbala | Not bundled yet |
| `adhan_ali_makki.wav` | ali_makki | Not bundled yet |

## Register a new sound

1. Add the `.wav` file to this folder.
2. Add an entry to `adhanSoundAssets` in `app.config.ts`.
3. Run `npm run sync:adhan-sounds` (Android also syncs automatically on preBuild).

```ts
// app.config.ts
export const adhanSoundAssets = [
  {
    id: 'azan',
    assetPath: './assets/sounds/adhan/azan.wav',
    iosSound: 'azan.wav',
    androidSound: 'azan',
    voiceId: 'default',
  },
];
```

**iOS note:** Notification sounds should be under 30 seconds. Trim long recordings before bundling.

**Android:** Files are copied to `android/app/src/main/res/raw/` and referenced by Notifee as the resource name without extension (e.g. `azan`).
