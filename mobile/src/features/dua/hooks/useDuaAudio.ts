/**
 * Track Player is disabled in config — re-export stub so Metro never loads
 * react-native-track-player (crashes under RN New Architecture).
 *
 * When enabling audio: set NATIVE_AUDIO_ENABLED=true and switch to:
 *   export { useDuaAudioNative as useDuaAudio } from './useDuaAudioNative';
 */
export { useDuaAudio } from './useDuaAudio.stub';
