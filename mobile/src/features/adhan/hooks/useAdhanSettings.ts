import { useAdhanStore } from '@/stores/adhanStore';

import { ADHAN_VOICES } from '../data/adhanVoices';
import type { AdhanVoiceId } from '../types';
import type { PrayerName } from '@/core/prayer-engine';

export function useAdhanSettings() {
  const store = useAdhanStore();

  return {
    ...store,
    voices: ADHAN_VOICES,
    setGlobalVoice: store.setGlobalVoice,
    togglePrayer: (prayer: PrayerName) =>
      store.setPrayerEnabled(prayer, !store.prayers[prayer].enabled),
    setVoiceForPrayer: (prayer: PrayerName, voiceId: AdhanVoiceId | undefined) =>
      store.setPrayerVoice(prayer, voiceId),
  };
}
