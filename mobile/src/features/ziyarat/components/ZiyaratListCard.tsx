import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { ListRow } from '@/components/ui/ListRow';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { OCCASION_LABELS } from '../constants/catalog';
import type { ZiyaratMeta } from '../types';

interface ZiyaratListCardProps {
  meta: ZiyaratMeta;
  bookmarked?: boolean;
  offline?: boolean;
  isLast?: boolean;
  onPress: () => void;
}

export function ZiyaratListCard({
  meta,
  bookmarked,
  offline,
  isLast,
  onPress,
}: ZiyaratListCardProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const imam = locale === 'ur' ? meta.imam.ur : locale === 'ar' ? meta.imam.ar : meta.imam.en;
  const time =
    locale === 'ur'
      ? meta.recommendedTime.ur
      : locale === 'ar'
        ? meta.recommendedTime.ar
        : meta.recommendedTime.en;
  const occasion = OCCASION_LABELS[meta.occasion];
  const occasionLabel =
    locale === 'ur' ? occasion.ur : locale === 'ar' ? occasion.ar : occasion.en;

  return (
    <ListRow
      title={title}
      subtitle={imam}
      meta={`${occasionLabel} · ${time} · ${meta.estimatedMinutes} min`}
      accentColor={theme.colors.accentGold}
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
