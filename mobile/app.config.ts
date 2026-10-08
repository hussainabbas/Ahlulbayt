/**
 * App configuration — adhan notification sound registry.
 *
 * Source files live under `assets/sounds/adhan/`.
 * Run `npm run sync:adhan-sounds` (or Android preBuild) to copy them into native bundles.
 *
 * Android (Notifee): `android/app/src/main/res/raw/<androidSound>.wav`
 * iOS (Notifee): app bundle root, referenced as `<iosSound>`
 */

export interface AdhanSoundAsset {
  /** Stable asset id (filename without extension). */
  id: string;
  /** Path relative to the mobile project root. */
  assetPath: `./assets/sounds/adhan/${string}`;
  /** iOS notification sound filename (with extension). */
  iosSound: string;
  /** Android raw resource name (no extension). */
  androidSound: string;
  /** Maps to `AdhanVoiceId` in adhanVoices.ts */
  voiceId: 'default' | 'makkah' | 'madina' | 'najaf' | 'karbala' | 'ali_makki';
}

export const adhanSoundAssets: AdhanSoundAsset[] = [
  {
    id: 'azan',
    assetPath: './assets/sounds/adhan/azan.wav',
    iosSound: 'azan.wav',
    androidSound: 'azan',
    voiceId: 'default',
  },
];

/** Expo-style plugin block kept for docs / future prebuild migration. */
export const notificationSoundPluginConfig = {
  sounds: adhanSoundAssets.map((sound) => sound.assetPath),
} as const;

export function getAdhanSoundAsset(id: string): AdhanSoundAsset | undefined {
  return adhanSoundAssets.find((sound) => sound.id === id);
}

export function getAdhanSoundAssetForVoice(
  voiceId: AdhanSoundAsset['voiceId'],
): AdhanSoundAsset | undefined {
  return adhanSoundAssets.find((sound) => sound.voiceId === voiceId);
}
