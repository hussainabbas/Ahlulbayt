import type { AdhanVoice, AdhanVoiceId } from '../types';
import { getAdhanSoundAssetForVoice } from '../../../../app.config';

/**
 * Adhan voice catalog. Bundle `.wav` files under `assets/sounds/adhan/` and
 * register them in `app.config.ts`, then run `npm run sync:adhan-sounds`.
 */
function bundledSounds(voiceId: AdhanVoiceId): Pick<AdhanVoice, 'soundIos' | 'soundAndroid'> {
  if (voiceId === 'custom') {
    return { soundIos: 'default', soundAndroid: 'default' };
  }

  const asset = getAdhanSoundAssetForVoice(voiceId);
  if (!asset) {
    return { soundIos: 'default', soundAndroid: 'default' };
  }

  return { soundIos: asset.iosSound, soundAndroid: asset.androidSound };
}

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: 'default',
    labelKey: 'adhan.voices.default',
    descriptionKey: 'adhan.voices.defaultDesc',
    ...bundledSounds('default'),
  },  {
    id: 'makkah',
    labelKey: 'adhan.voices.makkah',
    descriptionKey: 'adhan.voices.makkahDesc',
    soundIos: 'adhan_makkah.wav',
    soundAndroid: 'adhan_makkah',
  },
  {
    id: 'madina',
    labelKey: 'adhan.voices.madina',
    descriptionKey: 'adhan.voices.madinaDesc',
    soundIos: 'adhan_madina.wav',
    soundAndroid: 'adhan_madina',
  },
  {
    id: 'najaf',
    labelKey: 'adhan.voices.najaf',
    descriptionKey: 'adhan.voices.najafDesc',
    soundIos: 'adhan_najaf.wav',
    soundAndroid: 'adhan_najaf',
  },
  {
    id: 'karbala',
    labelKey: 'adhan.voices.karbala',
    descriptionKey: 'adhan.voices.karbalaDesc',
    soundIos: 'adhan_karbala.wav',
    soundAndroid: 'adhan_karbala',
  },
  {
    id: 'ali_makki',
    labelKey: 'adhan.voices.aliMakki',
    descriptionKey: 'adhan.voices.aliMakkiDesc',
    soundIos: 'adhan_ali_makki.wav',
    soundAndroid: 'adhan_ali_makki',
  },
];

export function getAdhanVoice(id: AdhanVoiceId): AdhanVoice {
  return ADHAN_VOICES.find((v) => v.id === id) ?? ADHAN_VOICES[0]!;
}

export function resolveVoiceForPrayer(
  globalVoiceId: AdhanVoiceId,
  prayerVoiceId?: AdhanVoiceId,
): AdhanVoice {
  const id = prayerVoiceId ?? globalVoiceId;
  return getAdhanVoice(id);
}
