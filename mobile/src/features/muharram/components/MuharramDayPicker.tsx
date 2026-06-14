import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { MUHARRAM_DAY_COUNT } from '../data/dailyContent';

interface MuharramDayPickerProps {
  activeDay: number;
  todayDay: number;
  onSelect: (day: number) => void;
}

export function MuharramDayPicker({ activeDay, todayDay, onSelect }: MuharramDayPickerProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {t('muharramMode.selectDay')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {Array.from({ length: MUHARRAM_DAY_COUNT }, (_, i) => i + 1).map((day) => {
          const isActive = day === activeDay;
          const isToday = day === todayDay;
          return (
            <Pressable
              key={day}
              onPress={() => onSelect(day)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive
                    ? theme.colors.accentPrimaryMuted
                    : theme.colors.surfaceMuted,
                  borderColor: isToday
                    ? theme.colors.accentGold
                    : isActive
                      ? theme.colors.accentPrimary
                      : theme.colors.borderSubtle,
                },
              ]}
            >
              <Text variant="caption" color={isActive ? 'accent' : 'secondary'}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  chip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
