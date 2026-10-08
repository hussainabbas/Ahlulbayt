import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { DailyLifeDuaMeta } from '../types';
import { getMetaTitle } from '../utils/localizedContent';

interface DiscoverDuaCardProps {
  meta: DailyLifeDuaMeta;
  onPress: () => void;
  onShuffle: () => void;
}

export function DiscoverDuaCard({ meta, onPress, onShuffle }: DiscoverDuaCardProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();

  return (
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
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.main, pressed && { opacity: 0.9 }]}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text style={styles.iconGlyph}>✦</Text>
        </View>

        <View style={styles.textCol}>
          <Text variant="overline" color="tertiary">
            {t('dailyLifeDuas.randomDua')}
          </Text>
          <Text variant="label" numberOfLines={1}>
            {getMetaTitle(meta, locale)}
          </Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {t('dailyLifeDuas.discoverHint')}
          </Text>
        </View>

        <Icon name="chevron" size={16} color={theme.colors.textTertiary} />
      </Pressable>

      <Pressable
        onPress={onShuffle}
        accessibilityRole="button"
        accessibilityLabel={t('dailyLifeDuas.shuffle')}
        hitSlop={8}
        style={({ pressed }) => [
          styles.shuffleBtn,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            borderLeftColor: theme.colors.borderSubtle,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.shuffleGlyph}>↻</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: layout.blockGap + 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontSize: 18,
    lineHeight: 22,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  shuffleBtn: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  shuffleGlyph: {
    fontSize: 22,
    lineHeight: 26,
  },
});
