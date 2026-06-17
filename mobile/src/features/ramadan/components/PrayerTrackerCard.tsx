import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import {
  completionsForDate,
  usePrayerCompletionStore,
  type TrackablePrayer,
} from '@/features/prayer/stores/prayerCompletionStore';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

const PRAYERS: TrackablePrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PrayerTrackerCard() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const date = todayKey();
  const byDate = usePrayerCompletionStore((s) => s.byDate);
  const togglePrayer = usePrayerCompletionStore((s) => s.togglePrayer);
  const completed = completionsForDate(byDate, date);

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="headingSm">{t('ramadanMode.prayerTracker')}</Text>
      <Text variant="caption" color="secondary">
        {completed.length} / {PRAYERS.length}
      </Text>
      <View style={styles.row}>
        {PRAYERS.map((p) => {
          const done = completed.includes(p);
          const color = theme.colors.prayer[p];
          return (
            <Pressable
              key={p}
              onPress={() => togglePrayer(p)}
              style={[
                styles.chip,
                {
                  backgroundColor: done ? `${color}22` : theme.colors.backgroundSecondary,
                  borderColor: done ? color : theme.colors.borderSubtle,
                },
              ]}
            >
              <Text variant="caption" style={{ color: done ? color : theme.colors.textSecondary }}>
                {t(`prayer.${p}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: layout.listGap },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
