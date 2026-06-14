import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { NahjulMeta } from '../types';

interface NahjulQuoteCardProps {
  meta: NahjulMeta;
  bookmarked?: boolean;
  onPress: () => void;
  onToggleBookmark?: () => void;
}

export function NahjulQuoteCard({ meta, bookmarked, onPress, onToggleBookmark }: NahjulQuoteCardProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const quote = locale === 'ur' ? meta.excerpt.ur : meta.excerpt.en;
  const arabic = meta.titles.ar;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: theme.colors.accentPrimary }]} />
      <View style={styles.body}>
        <Text
          style={[styles.arabic, { color: theme.colors.textPrimary }]}
          numberOfLines={3}
        >
          {arabic}
        </Text>
        <Text variant="bodyMd" color="secondary" style={styles.quote} numberOfLines={3}>
          "{quote}"
        </Text>
        <View style={styles.footer}>
          <Text variant="caption" color="tertiary">
            — {locale === 'ur' ? meta.titles.ur : meta.titles.en}
          </Text>
          {onToggleBookmark ? (
            <Pressable onPress={onToggleBookmark} hitSlop={8}>
              <Text variant="bodySm" color={bookmarked ? 'accent' : 'tertiary'}>
                {bookmarked ? '★' : '☆'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontSize: 18,
    lineHeight: 32,
  },
  quote: {
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});
