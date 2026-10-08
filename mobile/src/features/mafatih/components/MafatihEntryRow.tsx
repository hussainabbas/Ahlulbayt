import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { ListRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MafatihEntry } from '../types';

interface MafatihEntryRowProps {
  entry: MafatihEntry;
  bookmarked?: boolean;
  favorited?: boolean;
  offline?: boolean;
  isLast?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export function MafatihEntryRow({
  entry,
  bookmarked,
  favorited,
  offline,
  isLast,
  onPress,
  onToggleFavorite,
}: MafatihEntryRowProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? entry.titles.ur : locale === 'ar' ? entry.titles.ar : entry.titles.en;
  const subtitle = locale === 'ur' ? entry.subtitles?.ur : entry.subtitles?.en;
  const desc = (locale === 'ur' ? entry.description?.ur : entry.description?.en) ?? '';

  const kindLabel =
    entry.kind === 'dua'
      ? t('mafatih.kinds.dua')
      : entry.kind === 'ziyarat'
        ? t('mafatih.kinds.ziyarat')
        : entry.kind === 'sahifa'
          ? t('mafatih.kinds.sahifa')
          : t('mafatih.kinds.amaal');

  const accentColor =
    entry.kind === 'ziyarat'
      ? theme.colors.accentGold
      : entry.kind === 'sahifa'
        ? theme.colors.accentPrimary
        : undefined;

  const meta = `§ ${entry.mafatihRef} · ${kindLabel} · ${entry.estimatedMinutes} min`;

  return (
    <ListRow
      title={title}
      subtitle={subtitle || desc}
      meta={meta}
      onPress={onPress}
      isLast={isLast}
      accentColor={accentColor}
      trailing={
        <View style={styles.badges}>
          {onToggleFavorite ? (
            <Pressable onPress={onToggleFavorite} hitSlop={10} style={styles.favoriteBtn}>
              <Text variant="bodySm" color={favorited ? 'accent' : 'tertiary'}>
                {favorited ? '♥' : '♡'}
              </Text>
            </Pressable>
          ) : null}
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
    alignItems: 'center',
    gap: 8,
  },
  favoriteBtn: {
    padding: 2,
  },
});
