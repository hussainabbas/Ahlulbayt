import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

type HadithListFilter = 'all' | 'bookmarked';

interface HadithFilterTabsProps {
  active: HadithListFilter;
  showTopics: boolean;
  onChange: (filter: HadithListFilter) => void;
  onToggleTopics: () => void;
}

export function HadithFilterTabs({
  active,
  showTopics,
  onChange,
  onToggleTopics,
}: HadithFilterTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const filters: Array<{ id: HadithListFilter | 'topics'; label: string; onPress: () => void }> = [
    { id: 'all', label: t('hadith.filter.showAll'), onPress: () => onChange('all') },
    {
      id: 'bookmarked',
      label: t('hadith.filter.bookmarked'),
      onPress: () => onChange('bookmarked'),
    },
    {
      id: 'topics',
      label: t('hadith.topicsOverview'),
      onPress: onToggleTopics,
    },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {filters.map((filter) => {
        const isTopics = filter.id === 'topics';
        const isActive = isTopics ? showTopics : active === filter.id;

        return (
          <Pressable
            key={filter.id}
            onPress={filter.onPress}
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
              {filter.label}
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
