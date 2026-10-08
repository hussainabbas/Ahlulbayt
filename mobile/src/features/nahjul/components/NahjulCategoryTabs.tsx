import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { NahjulCategory } from '../types';

interface NahjulCategoryTabsProps {
  active: NahjulCategory | 'all';
  onChange: (category: NahjulCategory | 'all') => void;
}

const TABS: Array<{ id: NahjulCategory | 'all'; labelKey: string }> = [
  { id: 'all', labelKey: 'nahjul.filterAll' },
  { id: 'sermon', labelKey: 'nahjul.categories.sermons' },
  { id: 'letter', labelKey: 'nahjul.categories.letters' },
  { id: 'saying', labelKey: 'nahjul.categories.quotes' },
];

export function NahjulCategoryTabs({ active, onChange }: NahjulCategoryTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      {TABS.map((tab) => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
