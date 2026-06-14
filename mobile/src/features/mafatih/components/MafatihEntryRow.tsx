import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MafatihEntry } from '../types';

interface MafatihEntryRowProps {
  entry: MafatihEntry;
  bookmarked?: boolean;
  favorited?: boolean;
  offline?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export function MafatihEntryRow({
  entry,
  bookmarked,
  favorited,
  offline,
  onPress,
  onToggleFavorite,
}: MafatihEntryRowProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? entry.titles.ur : locale === 'ar' ? entry.titles.ar : entry.titles.en;
  const desc = locale === 'ur' ? entry.description.ur : entry.description.en;

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
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text variant="bodyMd" style={{ flex: 1 }}>
            {title}
          </Text>
          <View style={styles.icons}>
            {onToggleFavorite ? (
              <Pressable onPress={onToggleFavorite} hitSlop={8}>
                <Text variant="caption" color={favorited ? 'accent' : 'tertiary'}>
                  {favorited ? '♥' : '♡'}
                </Text>
              </Pressable>
            ) : null}
            {bookmarked ? (
              <Text variant="caption" color="accent" style={{ marginLeft: 8 }}>
                ★
              </Text>
            ) : null}
            {offline ? (
              <Text variant="caption" color="accent" style={{ marginLeft: 8 }}>
                ↓
              </Text>
            ) : null}
          </View>
        </View>
        <Text variant="caption" color="tertiary">
          § {entry.mafatihRef} · {entry.kind} · {desc.slice(0, 60)}…
        </Text>
      </View>
      <Text variant="bodySm" color="tertiary">
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    gap: 8,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
