import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { SOURCE_BY_ID } from '../constants/catalog';
import type { HadithEntry } from '../types';
import { pickLocalized } from '../utils/localize';

interface HadithListRowProps {
  entry: HadithEntry;
  bookmarked?: boolean;
  onPress: () => void;
}

export function HadithListRow({ entry, bookmarked, onPress }: HadithListRowProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const sourceMeta = SOURCE_BY_ID[entry.source];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: sourceMeta.accentColor + '22' }]}>
            <Text variant="caption" style={{ color: sourceMeta.accentColor }}>
              {sourceMeta.icon} {t(sourceMeta.nameKey)}
            </Text>
          </View>
          {bookmarked ? (
            <Text variant="caption" color="accent">
              ★
            </Text>
          ) : null}
        </View>
        <Text variant="headingSm" numberOfLines={2}>
          {pickLocalized(entry.title, locale)}
        </Text>
        <Text variant="bodySm" color="secondary" numberOfLines={2} style={styles.snippet}>
          {pickLocalized(entry.summary, locale)}
        </Text>
        <View style={styles.topics}>
          {entry.topics.slice(0, 3).map((topic) => (
            <View
              key={topic}
              style={[styles.topicChip, { backgroundColor: theme.colors.surfaceMuted }]}
            >
              <Text variant="caption" color="tertiary">
                {t(`hadith.topics.${topic}`)}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  snippet: { lineHeight: 20 },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  topicChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
