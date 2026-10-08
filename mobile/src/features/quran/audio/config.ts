/**
 * react-native-track-player v4 crashes under RN 0.85+ New Architecture.
 * Re-enable when migrating to a New Arch-compatible player.
 *
 * Keep in sync with `mobile/nativeAudio.config.js` (Metro reads that file too).
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { NATIVE_AUDIO_ENABLED } = require('../../../../nativeAudio.config.js') as {
  NATIVE_AUDIO_ENABLED: boolean;
};

export { NATIVE_AUDIO_ENABLED };
