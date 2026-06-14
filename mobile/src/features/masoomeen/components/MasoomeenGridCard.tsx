import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MasoomeenMeta } from '../types';
import { pickLocalized, roleIcon } from '../utils/localize';

interface MasoomeenGridCardProps {
  meta: MasoomeenMeta;
  bookmarked?: boolean;
  onPress: () => void;
}

export function MasoomeenGridCard({ meta, bookmarked, onPress }: MasoomeenGridCardProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const title = pickLocalized(meta.titles, locale);
  const epithet = pickLocalized(meta.epithet, locale);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <Card
        style={[
          styles.card,
          { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceMuted },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: meta.accentColor }]} />
        <Text variant="headingLg" style={styles.icon}>
          {roleIcon(meta.role)}
        </Text>
        <Text variant="headingSm" numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <Text variant="bodySm" color="secondary" numberOfLines={2}>
          {epithet}
        </Text>
        {bookmarked ? (
          <Text variant="caption" color="accent" style={styles.bookmark}>
            ★
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
