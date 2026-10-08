import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { DailyLifeDuaMeta } from '../types';
import { getDuaPreview, getMetaDescription, getMetaTitle } from '../utils/localizedContent';

interface TodaysDuaHeroCardProps {
  meta: DailyLifeDuaMeta;
  onPress: () => void;
}

export function TodaysDuaHeroCard({ meta, onPress }: TodaysDuaHeroCardProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const preview = getDuaPreview(meta.id, locale);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [pressed && { opacity: 0.94 }]}
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
        <View style={[styles.labelStrip, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="overline" color="accent">
            {t('dailyLifeDuas.todaysDua')}
          </Text>
        </View>

        <View style={styles.body}>
          <Text variant="headingSm">{getMetaTitle(meta, locale)}</Text>

          {preview.arabic ? (
            <View
              style={[
                styles.arabicBox,
                { backgroundColor: theme.colors.backgroundSecondary },
              ]}
            >
              <Text
                variant="bodyMd"
                numberOfLines={3}
                style={[styles.arabic, { color: theme.colors.textPrimary }]}
              >
                {preview.arabic}
              </Text>
            </View>
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
  card: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  labelStrip: {
    paddingHorizontal: layout.blockGap + 2,
    paddingVertical: 8,
  },
  body: {
    padding: layout.blockGap + 2,
    paddingTop: layout.blockGap,
    gap: 10,
  },
  arabicBox: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  arabic: {
    lineHeight: 30,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
