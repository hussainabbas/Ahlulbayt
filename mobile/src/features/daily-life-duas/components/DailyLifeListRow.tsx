import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { SITUATION_ICONS } from '../constants/categoryVisuals';
import type { DailyLifeDuaMeta } from '../types';
import { getDuaPreview, getMetaDescription, getMetaTitle } from '../utils/localizedContent';

interface DailyLifeListRowProps {
  meta: DailyLifeDuaMeta;
  onPress: () => void;
}

export function DailyLifeListRow({ meta, onPress }: DailyLifeListRowProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const preview = getDuaPreview(meta.id, locale);
  const situationIcon = SITUATION_ICONS[meta.situationKey] ?? '✦';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
        <Text style={styles.icon}>{situationIcon}</Text>
      </View>

      <View style={styles.textCol}>
        <Text variant="label">{getMetaTitle(meta, locale)}</Text>
        <Text variant="caption" color="secondary" numberOfLines={2}>
          {preview.translation ?? getMetaDescription(meta, locale)}
        </Text>
      </View>

      <Icon name="chevron" size={14} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
});
