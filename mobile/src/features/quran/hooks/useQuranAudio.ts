/**
 * Ayah audio hook loader.
 * Track Player is disabled in config — stub avoids evaluating the native module.
 *
 * When enabling audio: set NATIVE_AUDIO_ENABLED=true and switch to:
 *   export { useQuranAudioNative as useQuranAudio } from './useQuranAudioNative';
 */
export { useQuranAudioStub as useQuranAudio } from './useQuranAudio.stub';
