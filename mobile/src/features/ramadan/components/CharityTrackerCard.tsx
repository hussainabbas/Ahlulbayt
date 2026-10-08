import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { useCharityTrackerStore } from '../stores/charityTrackerStore';

export function CharityTrackerCard() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const entries = useCharityTrackerStore((s) => s.entries);
  const addEntry = useCharityTrackerStore((s) => s.addEntry);
  const toggleFulfilled = useCharityTrackerStore((s) => s.toggleFulfilled);

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="headingSm">{t('ramadanMode.charityTracker')}</Text>
      <View style={styles.actions}>
        <Pressable
          onPress={() => addEntry({ type: 'sadaqah', amount: 10, note: t('ramadanMode.charityQuick') })}
          style={[styles.btn, { backgroundColor: theme.colors.accentPrimaryMuted }]}
        >
          <Text variant="caption" color="accent">
            + {t('ramadanMode.sadaqah')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => addEntry({ type: 'zakat_fitr', note: t('ramadanMode.zakatFitrNote') })}
          style={[styles.btn, { backgroundColor: theme.colors.backgroundSecondary }]}
        >
          <Text variant="caption" color="secondary">
            + {t('ramadanMode.zakatFitr')}
          </Text>
        </Pressable>
      </View>
      {entries.slice(0, 5).map((e) => (
        <Pressable key={e.id} onPress={() => toggleFulfilled(e.id)} style={styles.entry}>
          <Text variant="bodySm" style={e.fulfilled ? styles.done : undefined}>
            {t(`ramadanMode.charityType.${e.type}`)}
            {e.amount != null ? ` · ${e.amount} ${e.currency ?? ''}` : ''}
          </Text>
          <Text variant="caption" color="tertiary">
            {e.fulfilled ? t('ramadanMode.fulfilled') : t('ramadanMode.pending')}
          </Text>
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: layout.listGap },
  actions: { flexDirection: 'row', gap: 8 },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  done: { textDecorationLine: 'line-through', opacity: 0.6 },
});
