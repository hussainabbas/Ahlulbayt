import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { FILTER_TABS } from '../constants/categories';
import type { CalendarFilterCategory } from '../types';

/** Chip row height — explicit so the horizontal ScrollView does not stretch vertically. */
const TOOLBAR_HEIGHT = 36;

interface CalendarCategoryTabsProps {
  active: CalendarFilterCategory;
  onChange: (category: CalendarFilterCategory) => void;
}

export function CalendarCategoryTabs({ active, onChange }: CalendarCategoryTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={styles.scroll}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: TOOLBAR_HEIGHT,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: TOOLBAR_HEIGHT,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    height: TOOLBAR_HEIGHT,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
