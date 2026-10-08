import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { ListRow } from '@/components/ui/ListRow';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { DuaMeta } from '../types';

interface DuaListRowProps {
  meta: DuaMeta;
  bookmarked?: boolean;
  offline?: boolean;
  isLast?: boolean;
  onPress: () => void;
}

export function DuaListRow({ meta, bookmarked, offline, isLast, onPress }: DuaListRowProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const time =
    locale === 'ur'
      ? meta.recommendedTime.ur
      : locale === 'ar'
        ? meta.recommendedTime.ar
        : meta.recommendedTime.en;
  const desc = locale === 'ur' ? meta.description.ur : meta.description.en;

  return (
    <ListRow
      title={title}
      subtitle={desc}
      meta={`${time} · ${meta.estimatedMinutes} min · ${meta.sectionCount} sections`}
      onPress={onPress}
      isLast={isLast}
      trailing={
        <View style={styles.badges}>
          {bookmarked ? <Icon name="bookmark" size={14} color={theme.colors.accentPrimary} /> : null}
          {offline ? <Icon name="download" size={14} color={theme.colors.accentPrimary} /> : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
