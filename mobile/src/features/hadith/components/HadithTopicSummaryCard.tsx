import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { HadithTopicSummary } from '../types';
import { pickLocalized } from '../utils/localize';

interface HadithTopicSummaryCardProps {
  topicSummary: HadithTopicSummary;
  active?: boolean;
  onPress: () => void;
}

export function HadithTopicSummaryCard({
  topicSummary,
  active,
  onPress,
}: HadithTopicSummaryCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <Card
        style={[
          styles.card,
          active && {
            borderColor: theme.colors.accentPrimary,
            backgroundColor: theme.colors.accentPrimaryMuted,
          },
        ]}
      >
        <View style={styles.header}>
          <Text variant="headingSm">{t(`hadith.topics.${topicSummary.topic}`)}</Text>
          <Text variant="caption" color="accent">
            {topicSummary.count}
          </Text>
        </View>
        <Text variant="bodySm" color="secondary" numberOfLines={3}>
          {pickLocalized(topicSummary.summary, locale)}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
