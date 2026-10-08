import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { HADITH_TOPICS } from '../constants/catalog';
import type { HadithTopicSummary } from '../types';
import { pickLocalized } from '../utils/localize';

interface HadithTopicGridProps {
  summaries: HadithTopicSummary[];
  activeTopic: HadithTopicSummary['topic'] | 'all';
  onSelect: (topic: HadithTopicSummary['topic']) => void;
}

export function HadithTopicGrid({ summaries, activeTopic, onSelect }: HadithTopicGridProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const topicIcons = Object.fromEntries(HADITH_TOPICS.map((topic) => [topic.id, topic.icon]));

  return (
    <View style={styles.grid}>
      {summaries.map((summary) => {
        const active = activeTopic === summary.topic;
        return (
          <Pressable
            key={summary.topic}
            onPress={() => onSelect(summary.topic)}
            style={({ pressed }) => [
              styles.tile,
              {
                backgroundColor: active
                  ? theme.colors.accentPrimaryMuted
                  : theme.colors.surfaceElevated,
                borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                borderRadius: theme.radius.lg,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <View style={styles.tileHeader}>
              <Text variant="bodySm" weight="600" color={active ? 'accent' : 'primary'} numberOfLines={1}>
                {topicIcons[summary.topic]} {t(`hadith.topics.${summary.topic}`)}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: theme.colors.surfaceMuted }]}>
                <Text variant="caption" color="accent">
                  {summary.count}
                </Text>
              </View>
            </View>
            <Text variant="caption" color="tertiary" numberOfLines={3}>
              {pickLocalized(summary.summary, locale)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.blockGap,
  },
  tile: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
    padding: layout.blockGap + 2,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});
