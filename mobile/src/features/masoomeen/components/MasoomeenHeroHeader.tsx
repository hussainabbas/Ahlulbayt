import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MasoomeenMeta } from '../types';
import { pickLocalized, roleIcon } from '../utils/localize';

interface MasoomeenHeroHeaderProps {
  meta: MasoomeenMeta;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

export function MasoomeenHeroHeader({ meta, bookmarked, onToggleBookmark }: MasoomeenHeroHeaderProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const title = pickLocalized(meta.titles, locale);
  const epithet = pickLocalized(meta.epithet, locale);
  const birthPlace = meta.birthPlace ? pickLocalized(meta.birthPlace, locale) : null;
  const shrine = meta.shrine ? pickLocalized(meta.shrine, locale) : null;

  return (
    <View
      style={[
        styles.hero,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: meta.accentColor }]} />
      <View style={styles.topRow}>
        <Text variant="displayMd">{roleIcon(meta.role)}</Text>
        <Pressable onPress={onToggleBookmark} hitSlop={12}>
          <Text variant="headingMd" color={bookmarked ? 'accent' : 'tertiary'}>
            {bookmarked ? '★' : '☆'}
          </Text>
        </Pressable>
      </View>
      <Text variant="displayMd">{title}</Text>
      <Text variant="bodyMd" color="secondary" style={styles.epithet}>
        {epithet}
      </Text>
      <View style={styles.metaRow}>
        {meta.birthHijri ? (
          <View style={styles.metaItem}>
            <Text variant="caption" color="tertiary">
              {t('masoomeen.birth')}
            </Text>
            <Text variant="bodySm">{meta.birthHijri}</Text>
          </View>
        ) : null}
        {meta.deathHijri ? (
          <View style={styles.metaItem}>
            <Text variant="caption" color="tertiary">
              {t('masoomeen.death')}
            </Text>
            <Text variant="bodySm">{meta.deathHijri}</Text>
          </View>
        ) : null}
      </View>
      {birthPlace || shrine ? (
        <View style={styles.metaRow}>
          {birthPlace ? (
            <View style={styles.metaItem}>
              <Text variant="caption" color="tertiary">
                {t('masoomeen.birthPlace')}
              </Text>
              <Text variant="bodySm">{birthPlace}</Text>
            </View>
          ) : null}
          {shrine ? (
            <View style={styles.metaItem}>
              <Text variant="caption" color="tertiary">
                {t('masoomeen.shrine')}
              </Text>
              <Text variant="bodySm">{shrine}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  epithet: {
    marginTop: 4,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  metaItem: {
    minWidth: '40%',
  },
});
