import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { SOURCE_BY_ID } from '../constants/catalog';
import type { HadithEntry } from '../types';
import { pickLocalized } from '../utils/localize';

interface HadithListRowProps {
  entry: HadithEntry;
  bookmarked?: boolean;
  isLast?: boolean;
  onPress: () => void;
}

export function HadithListRow({ entry, bookmarked, isLast, onPress }: HadithListRowProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const sourceMeta = SOURCE_BY_ID[entry.source];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor: theme.colors.borderSubtle,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent',
        },
      ]}
      accessibilityRole="button"
    >
      <View style={[styles.accent, { backgroundColor: sourceMeta.accentColor }]} />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={[styles.sourceBadge, { backgroundColor: `${sourceMeta.accentColor}22` }]}>
            <Text variant="caption" style={{ color: sourceMeta.accentColor }}>
              {sourceMeta.icon} {t(sourceMeta.nameKey)}
            </Text>
          </View>
          {bookmarked ? <Icon name="bookmark" size={14} color={theme.colors.accentPrimary} /> : null}
        </View>
        <Text variant="bodyMd" weight="500" numberOfLines={2}>
          {pickLocalized(entry.title, locale)}
        </Text>
        <Text variant="bodySm" color="secondary" numberOfLines={2} style={styles.subtitle}>
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
      </View>
      <Icon name="chevron" size={16} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.blockGap,
    paddingHorizontal: layout.listRowPaddingX,
    paddingVertical: layout.listRowPaddingY,
    minHeight: layout.listRowMinHeight,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginVertical: 2,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  subtitle: {
    marginTop: 2,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  topicChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
});
