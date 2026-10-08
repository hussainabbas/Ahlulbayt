import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { HADITH_TOPICS } from '../constants/catalog';
import type { HadithTopic } from '../types';

interface HadithTopicTabsProps {
  active: HadithTopic | 'all';
  onChange: (topic: HadithTopic | 'all') => void;
}

export function HadithTopicTabs({ active, onChange }: HadithTopicTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const tabs: Array<{ id: HadithTopic | 'all'; label: string }> = [
    { id: 'all', label: t('hadith.filter.allTopics') },
    ...HADITH_TOPICS.map((topic) => ({
      id: topic.id,
      label: `${topic.icon} ${t(topic.labelKey)}`,
    })),
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
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
              {tab.label}
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
