import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { clampRamadanDay } from '../engine/ramadanRepository';

interface RamadanDayPickerProps {
  activeDay: number;
  todayDay: number;
  onSelect: (day: number) => void;
}

export function RamadanDayPicker({ activeDay, todayDay, onSelect }: RamadanDayPickerProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <View style={styles.wrap}>
      <Text variant="label" color="secondary">
        {t('ramadanMode.selectDay')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {days.map((d) => {
          const active = d === activeDay;
          const isToday = d === todayDay;
          return (
            <Pressable
              key={d}
              onPress={() => onSelect(clampRamadanDay(d))}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? theme.colors.accentPrimaryMuted
                    : theme.colors.backgroundSecondary,
                  borderColor: isToday ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                },
              ]}
            >
              <Text variant="caption" weight={active ? '600' : '400'} color={active ? 'accent' : 'secondary'}>
                {d}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: layout.listGap },
  row: { gap: 8, paddingVertical: 4 },
  chip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
