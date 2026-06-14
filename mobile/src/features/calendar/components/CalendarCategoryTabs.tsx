import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { FILTER_TABS } from '../constants/categories';
import type { CalendarFilterCategory } from '../types';

interface CalendarCategoryTabsProps {
  active: CalendarFilterCategory;
  onChange: (category: CalendarFilterCategory) => void;
}

export function CalendarCategoryTabs({ active, onChange }: CalendarCategoryTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTER_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? theme.colors.accentPrimaryMuted
                  : theme.colors.surfaceMuted,
                borderColor: isActive ? theme.colors.accentPrimary : theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="caption" color={isActive ? 'accent' : 'secondary'}>
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
