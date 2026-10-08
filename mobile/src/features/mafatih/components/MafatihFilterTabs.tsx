import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MafatihHubFilter } from '../types';

const FILTERS: MafatihHubFilter[] = ['all', 'daily', 'weekly', 'favorites', 'bookmarks'];

interface MafatihFilterTabsProps {
  active: MafatihHubFilter;
  onChange: (filter: MafatihHubFilter) => void;
}

export function MafatihFilterTabs({ active, onChange }: MafatihFilterTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const labels: Record<MafatihHubFilter, string> = {
    all: t('mafatih.filterAll'),
    daily: t('mafatih.filterDaily'),
    weekly: t('mafatih.filterWeekly'),
    monthly: t('mafatih.filterMonthly'),
    favorites: t('mafatih.filterFavorites'),
    bookmarks: t('mafatih.filterBookmarks'),
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {FILTERS.map((f) => {
        const isActive = active === f;
        return (
          <Pressable
            key={f}
            onPress={() => onChange(f)}
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
              {labels[f]}
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
