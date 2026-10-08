import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { HIJRI_MONTH_KEYS } from '../constants/categories';

interface CalendarMonthHeaderProps {
  year: number;
  month: number;
  isToday: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarMonthHeader({
  year,
  month,
  isToday,
  onPrev,
  onNext,
  onToday,
}: CalendarMonthHeaderProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const monthLabel = t(HIJRI_MONTH_KEYS[month - 1] ?? HIJRI_MONTH_KEYS[0]);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPrev}
        hitSlop={12}
        style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.6 }]}
      >
        <Text variant="headingSm" color="accent">
          ‹
        </Text>
      </Pressable>

      <View style={styles.center}>
        <Text variant="headingMd">{monthLabel}</Text>
        <Text variant="caption" color="secondary">
          {year} {t('calendar.ah')}
        </Text>
      </View>

      <Pressable
        onPress={onNext}
        hitSlop={12}
        style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.6 }]}
      >
        <Text variant="headingSm" color="accent">
          ›
        </Text>
      </Pressable>

      {!isToday ? (
        <Pressable
          onPress={onToday}
          style={[
            styles.todayBtn,
            {
              backgroundColor: theme.colors.accentPrimaryMuted,
              borderColor: theme.colors.accentPrimary,
            },
          ]}
        >
          <Text variant="caption" color="accent">
            {t('calendar.today')}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  todayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
});
