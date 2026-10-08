import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useFastingStore } from '@/features/fasting/stores/fastingStore';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function FastingTrackerCard() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const date = todayKey();
  const isFasted = useFastingStore((s) => s.isFasted(date));
  const toggleFast = useFastingStore((s) => s.toggleFast);
  const missed = useFastingStore((s) => s.getMissedForDate(date));

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="headingSm">{t('ramadanMode.fastingTracker')}</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => toggleFast(date, 'ramadan')}
          style={[
            styles.chip,
            {
              backgroundColor: isFasted
                ? theme.colors.accentPrimaryMuted
                : theme.colors.backgroundSecondary,
              borderColor: isFasted ? theme.colors.accentPrimary : theme.colors.borderSubtle,
            },
          ]}
        >
          <Text variant="caption" color={isFasted ? 'accent' : 'secondary'}>
            {t('ramadanMode.fastStatus.fasted')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() =>
            useFastingStore.getState().addMissedFast({ dateKey: date, reason: 'illness' })
          }
          style={[
            styles.chip,
            {
              backgroundColor: missed
                ? theme.colors.accentPrimaryMuted
                : theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Text variant="caption" color="secondary">
            {t('ramadanMode.fastStatus.missed')}
          </Text>
        </Pressable>
      </View>
      {missed ? (
        <Text variant="caption" color="tertiary">
          {t('ramadanMode.makeupNote')}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: layout.listGap },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
