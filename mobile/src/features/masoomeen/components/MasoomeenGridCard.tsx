import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.92 }]}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: meta.accentColor }]} />
        <View style={styles.topRow}>
          <View style={[styles.orderBadge, { backgroundColor: theme.colors.surfaceMuted }]}>
            <Text variant="caption" color="secondary">
              {meta.order}
            </Text>
          </View>
          {bookmarked ? (
            <Icon name="bookmark" size={14} color={theme.colors.accentPrimary} />
          ) : (
            <Text variant="bodyMd">{roleIcon(meta.role)}</Text>
          )}
        </View>
        <Text variant="bodyMd" weight="600" numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <Text variant="caption" color="secondary" numberOfLines={2}>
          {epithet}
        </Text>
        <View style={styles.footer}>
          <Text variant="caption" color="tertiary" numberOfLines={1}>
            {meta.birthHijri ?? '—'}
          </Text>
          <Icon name="chevron" size={14} color={theme.colors.textTertiary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    minHeight: 148,
    padding: layout.blockGap + 2,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    gap: 6,
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  orderBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  title: {
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 4,
  },
});
