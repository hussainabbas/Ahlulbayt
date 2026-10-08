import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

import { SITUATION_ICONS } from '../constants/categoryVisuals';
import type { DailyLifeDuaMeta } from '../types';
import { getDuaPreview, getMetaDescription, getMetaTitle } from '../utils/localizedContent';

interface DailyLifeDuaCardProps {
  meta: DailyLifeDuaMeta;
  index: number;
  onPress: () => void;
}

export function DailyLifeDuaCard({ meta, index, onPress }: DailyLifeDuaCardProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const shadow = getShadow('xs', theme.scheme);
  const preview = getDuaPreview(meta.id, locale);
  const situationIcon = SITUATION_ICONS[meta.situationKey] ?? '✦';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.92 }]}
    >
      <View
        style={[
          styles.card,
          shadow,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
              <Text style={styles.situationIcon}>{situationIcon}</Text>
            </View>
            <View style={[styles.indexBadge, { backgroundColor: theme.colors.backgroundSecondary }]}>
              <Text variant="caption" color="secondary" weight="600">
                {index + 1}
              </Text>
            </View>
          </View>

          <Text variant="headingSm">{getMetaTitle(meta, locale)}</Text>

          {preview.arabic ? (
            <Text
              variant="bodyMd"
              numberOfLines={2}
              style={[styles.arabic, { color: theme.colors.textPrimary }]}
            >
              {preview.arabic}
            </Text>
          ) : null}

          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {preview.translation ?? getMetaDescription(meta, locale)}
          </Text>

          <View style={styles.footer}>
            <Text variant="caption" color="accent" weight="600">
              {t('dailyLifeDuas.readDua')}
            </Text>
            <Icon name="chevron" size={14} color={theme.colors.accentPrimary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  accent: {
    width: 3,
  },
  body: {
    flex: 1,
    padding: layout.blockGap + 2,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  situationIcon: {
    fontSize: 18,
  },
  indexBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  arabic: {
    lineHeight: 26,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
