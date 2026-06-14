/**
 * Native audio hook loader.
 * Track Player is disabled in config — re-export stub directly so Metro never
 * evaluates the native module (which crashes under RN New Architecture).
 *
 * When enabling audio: set NATIVE_AUDIO_ENABLED=true and switch to:
 *   export { useQuranPlayerNative as useQuranPlayer } from './useQuranPlayer.native';
 */
export { useQuranPlayer } from './useQuranPlayer.stub';
