import type { PrayerName } from '@/core/prayer-engine';

/** Bundled or default adhan voice identifiers. */
export type AdhanVoiceId =
  | 'default'
  | 'makkah'
  | 'madina'
  | 'najaf'
  | 'karbala'
  | 'ali_makki'
  | 'custom';

export type NotificationKind = 'adhan' | 'preparation' | 'smart';

export interface AdhanVoice {
  id: AdhanVoiceId;
  labelKey: string;
  descriptionKey: string;
  /** iOS bundle sound filename (without path). Use `default` for system sound. */
  soundIos: string | 'default';
  /** Android raw resource name (no extension). */
  soundAndroid: string | 'default';
}

export interface PrayerNotificationPrefs {
  enabled: boolean;
  /** Override voice for this prayer; falls back to globalVoiceId. */
  voiceId?: AdhanVoiceId;
  /** Custom sound URI from device (expo document picker). */
  customSoundUri?: string | null;
}

export interface AdhanSettings {
  masterEnabled: boolean;
  silentModeOverride: boolean;
  smartRemindersEnabled: boolean;
  /** Minutes before prayer for smart nudge (default 10). */
  smartReminderMinutes: number;
  /** Minutes before prayer for wudu/preparation alert (0 = off). */
  preparationMinutes: number;
  globalVoiceId: AdhanVoiceId;
  /** Per-prayer toggles and overrides. */
  prayers: Record<PrayerName, PrayerNotificationPrefs>;
}

export interface ScheduledAdhanMeta {
  prayer: PrayerName;
  kind: NotificationKind;
  scheduledAt: string;
  triggerAt: string;
}

export const ADHAN_PRAYERS: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const DEFAULT_PRAYER_PREFS: Record<PrayerName, PrayerNotificationPrefs> = {
  fajr: { enabled: true },
  dhuhr: { enabled: true },
  asr: { enabled: true },
  maghrib: { enabled: true },
  isha: { enabled: true },
};

export function createDefaultAdhanSettings(): AdhanSettings {
  return {
    masterEnabled: true,
    silentModeOverride: false,
    smartRemindersEnabled: true,
    smartReminderMinutes: 10,
    preparationMinutes: 15,
    globalVoiceId: 'default',
    prayers: { ...DEFAULT_PRAYER_PREFS },
  };
}

/** Settings slice for scheduling — excludes persisted store metadata. */
export function pickAdhanSettings(
  source: AdhanSettings & { lastScheduledFingerprint?: string | null },
): AdhanSettings {
  const defaults = createDefaultAdhanSettings();
  return {
    masterEnabled: source.masterEnabled ?? defaults.masterEnabled,
    silentModeOverride: source.silentModeOverride ?? defaults.silentModeOverride,
    smartRemindersEnabled: source.smartRemindersEnabled ?? defaults.smartRemindersEnabled,
    smartReminderMinutes: source.smartReminderMinutes ?? defaults.smartReminderMinutes,
    preparationMinutes: source.preparationMinutes ?? defaults.preparationMinutes,
    globalVoiceId: source.globalVoiceId ?? defaults.globalVoiceId,
    prayers: {
      ...defaults.prayers,
      ...(source.prayers ?? {}),
    },
  };
}

/** Compact snapshot for change-detection fingerprints (avoids huge custom sound URIs). */
export function snapshotAdhanSettingsForFingerprint(settings: AdhanSettings): AdhanSettings {
  const normalized = pickAdhanSettings(settings);
  const prayers = {} as Record<PrayerName, PrayerNotificationPrefs>;
  for (const prayer of ADHAN_PRAYERS) {
    const prefs = normalized.prayers[prayer];
    prayers[prayer] = {
      enabled: prefs.enabled,
      voiceId: prefs.voiceId,
      customSoundUri: prefs.customSoundUri ? 'custom' : null,
    };
  }

  return {
    masterEnabled: normalized.masterEnabled,
    silentModeOverride: normalized.silentModeOverride,
    smartRemindersEnabled: normalized.smartRemindersEnabled,
    smartReminderMinutes: normalized.smartReminderMinutes,
    preparationMinutes: normalized.preparationMinutes,
    globalVoiceId: normalized.globalVoiceId,
    prayers,
  };
}
