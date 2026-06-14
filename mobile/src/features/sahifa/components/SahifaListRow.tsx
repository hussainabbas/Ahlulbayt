import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { ListRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { SahifaMeta } from '../types';

interface SahifaListRowProps {
  meta: SahifaMeta;
  bookmarked?: boolean;
  offline?: boolean;
  isLast?: boolean;
  onPress: () => void;
}

export function SahifaListRow({
  meta,
  bookmarked,
  offline,
  isLast,
  onPress,
}: SahifaListRowProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const subtitle = locale === 'ur' ? meta.description.ur : meta.description.en;

  return (
    <ListRow
      title={title}
      subtitle={subtitle}
      meta={t('sahifa.entryMeta', {
        number: meta.number,
        minutes: meta.estimatedMinutes,
        sections: meta.sectionCount,
      })}
      onPress={onPress}
      isLast={isLast}
      accentColor={theme.colors.accentPrimary}
      leading={
        <View style={[styles.numberBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="caption" color="accent" weight="600">
            {meta.number}
          </Text>
        </View>
      }
      trailing={
        <View style={styles.trailing}>
          {bookmarked ? <Icon name="bookmark" size={14} color={theme.colors.accentPrimary} /> : null}
          {offline ? <Icon name="download" size={14} color={theme.colors.accentPrimary} /> : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  numberBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
});
