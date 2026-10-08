import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { ADHAN_PRAYERS } from '@/features/adhan/types';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { ADHAN_VOICES } from '../data/adhanVoices';
import { useAdhanSettings } from '../hooks/useAdhanSettings';
import type { AdhanVoiceId } from '../types';

export function AdhanSettingsPanel() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const settings = useAdhanSettings();

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text variant="headingSm">{t('adhan.master')}</Text>
          <Text variant="caption" color="secondary">
            {t('adhan.masterHint')}
          </Text>
        </View>
        <Switch
          value={settings.masterEnabled}
          onValueChange={settings.setMasterEnabled}
          trackColor={{ true: theme.colors.accentPrimary }}
        />
      </View>

      <ToggleRow
        label={t('adhan.silentOverride')}
        hint={t('adhan.silentOverrideHint')}
        value={settings.silentModeOverride}
        onChange={settings.setSilentModeOverride}
        theme={theme}
      />

      <ToggleRow
        label={t('adhan.smartReminders')}
        hint={t('adhan.smartRemindersHint', { minutes: settings.smartReminderMinutes })}
        value={settings.smartRemindersEnabled}
        onChange={settings.setSmartRemindersEnabled}
        theme={theme}
      />

      <View style={styles.section}>
        <Text variant="overline" color="secondary">
          {t('adhan.preparation')}
        </Text>
        <View style={styles.chipRow}>
          {[0, 5, 10, 15, 30].map((min) => {
            const selected = settings.preparationMinutes === min;
            return (
              <Pressable
                key={min}
                onPress={() => settings.setPreparationMinutes(min)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected
                      ? theme.colors.accentPrimaryMuted
                      : theme.colors.surfaceElevated,
                    borderColor: selected
                      ? theme.colors.accentPrimary
                      : theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="bodySm" color={selected ? 'accent' : 'primary'}>
                  {min === 0 ? t('adhan.off') : t('adhan.minutesBefore', { min })}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="overline" color="secondary">
          {t('adhan.globalVoice')}
        </Text>
        <View style={styles.chipRow}>
          {ADHAN_VOICES.map((voice) => {
            const selected = settings.globalVoiceId === voice.id;
            return (
              <Pressable
                key={voice.id}
                onPress={() => settings.setGlobalVoice(voice.id as AdhanVoiceId)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected
                      ? theme.colors.accentPrimaryMuted
                      : theme.colors.surfaceElevated,
                    borderColor: selected
                      ? theme.colors.accentPrimary
                      : theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="bodySm" color={selected ? 'accent' : 'primary'}>
                  {t(voice.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="overline" color="secondary">
          {t('adhan.perPrayer')}
        </Text>
        {ADHAN_PRAYERS.map((prayer) => {
          const prefs = settings.prayers[prayer];
          return (
            <View
              key={prayer}
              style={[styles.prayerRow, { borderColor: theme.colors.borderSubtle }]}
            >
              <View style={[styles.dot, { backgroundColor: theme.colors.prayer[prayer] }]} />
              <Text variant="bodyMd" style={{ flex: 1 }}>
                {t(`prayer.${prayer}`)}
              </Text>
              <Switch
                value={prefs.enabled}
                onValueChange={(v) => settings.setPrayerEnabled(prayer, v)}
                trackColor={{ true: theme.colors.accentPrimary }}
              />
            </View>
          );
        })}
      </View>

      <Text variant="caption" color="tertiary" style={styles.footer}>
        {t('adhan.customSoundsHint')}
      </Text>
    </View>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
  theme,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  return (
    <View style={[styles.row, { borderTopColor: theme.colors.borderSubtle }]}>
      <View style={{ flex: 1 }}>
        <Text variant="bodyMd" weight="500">
          {label}
        </Text>
        <Text variant="caption" color="secondary">
          {hint}
        </Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: theme.colors.accentPrimary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 8,
  },
  section: {
    gap: 12,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    marginTop: 12,
    lineHeight: 18,
  },
});
