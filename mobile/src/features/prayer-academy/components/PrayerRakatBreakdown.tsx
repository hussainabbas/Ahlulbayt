import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { PrayerRakatUnit } from '../types';
import { pickLocalized } from '../utils/localizedText';

interface PrayerRakatBreakdownProps {
  units: PrayerRakatUnit[];
}

const KIND_COLORS: Record<string, 'accent' | 'secondary' | 'tertiary'> = {
  wajib: 'accent',
  sunnah: 'secondary',
  mustahab: 'secondary',
  nafl: 'tertiary',
  witr: 'accent',
};

export function PrayerRakatBreakdown({ units }: PrayerRakatBreakdownProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      {units.map((unit) => (
        <View
          key={unit.id}
          style={[
            styles.row,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.countBadge}>
            <Text variant="label" color={KIND_COLORS[unit.kind] ?? 'secondary'}>
              {unit.count}×
            </Text>
          </View>
          <View style={styles.textCol}>
            <Text variant="bodySm" weight="600">
              {pickLocalized(unit.label, locale)}
            </Text>
            {unit.notes ? (
              <Text variant="caption" color="tertiary">
                {pickLocalized(unit.notes, locale)}
              </Text>
            ) : null}
          </View>
          <Text variant="caption" color="secondary" style={styles.kind}>
            {unit.kind}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: layout.listGap },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.listGap,
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  countBadge: { minWidth: 36, alignItems: 'center' },
  textCol: { flex: 1, gap: 2 },
  kind: { textTransform: 'capitalize' },
});
