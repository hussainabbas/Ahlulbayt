import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { SahifaMeta } from '../types';

interface SahifaListRowProps {
  meta: SahifaMeta;
  bookmarked?: boolean;
  offline?: boolean;
  onPress: () => void;
}

export function SahifaListRow({ meta, bookmarked, offline, onPress }: SahifaListRowProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const desc =
    locale === 'ur' ? meta.description.ur : meta.description.en;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent',
          borderBottomColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <View style={[styles.numberBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
        <Text variant="caption" color="accent">
          {meta.number}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text variant="headingSm" style={styles.title}>
            {title}
          </Text>
          <View style={styles.badges}>
            {bookmarked ? (
              <Text variant="caption" color="accent">
                ★
              </Text>
            ) : null}
            {offline ? (
              <View style={[styles.offlineBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
                <Text variant="caption" color="accent">
                  ↓
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <Text variant="bodySm" color="secondary" numberOfLines={2}>
          {desc}
        </Text>
        <View style={styles.meta}>
          <Text variant="caption" color="tertiary">
            {meta.estimatedMinutes} min · {meta.sectionCount} sections
          </Text>
          {meta.bundled ? (
            <Text variant="caption" color="accent">
              · offline
            </Text>
          ) : null}
        </View>
      </View>
      <Text variant="bodyMd" color="tertiary">
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  offlineBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
});
