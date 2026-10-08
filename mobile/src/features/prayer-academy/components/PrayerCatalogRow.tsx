import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { PrayerAcademyMeta } from '../types';
import { pickLocalized } from '../utils/localizedText';

interface PrayerCatalogRowProps {
  meta: PrayerAcademyMeta;
  bookmarked?: boolean;
  completed?: boolean;
  onPress: () => void;
}

export function PrayerCatalogRow({
  meta,
  bookmarked,
  completed,
  onPress,
}: PrayerCatalogRowProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.textCol}>
        <View style={styles.titleRow}>
          <Text variant="bodyMd" weight="600">
            {pickLocalized(meta.titles, locale)}
          </Text>
          {bookmarked ? (
            <Icon name="bookmark" filled size={14} color={theme.colors.accentPrimary} />
          ) : null}
          {completed ? (
            <Icon name="check" size={14} color={theme.colors.accentPrimary} />
          ) : null}
        </View>
        <Text variant="caption" color="secondary" numberOfLines={1}>
          {pickLocalized(meta.subtitles, locale)}
        </Text>
        <Text variant="caption" color="tertiary">
          {t(`prayerAcademy.obligation.${meta.obligation}`)} · {meta.estimatedMinutes}{' '}
          {t('prayerAcademy.minutes')}
        </Text>
      </View>
      <Icon name="chevron" size={18} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.blockGap,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: layout.listGap,
  },
  textCol: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
