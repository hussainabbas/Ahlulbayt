import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { MafatihCollection, MafatihCollectionId } from '../types';

interface MafatihCollectionGridProps {
  collections: MafatihCollection[];
  activeId: MafatihCollectionId | null;
  onSelect: (id: MafatihCollectionId | null) => void;
}

export function MafatihCollectionGrid({
  collections,
  activeId,
  onSelect,
}: MafatihCollectionGridProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {t('mafatih.collections')}
      </Text>
      <View style={styles.grid}>
        {collections.map((collection) => {
          const active = activeId === collection.id;
          const label =
            locale === 'ur'
              ? collection.titles.ur
              : locale === 'ar'
                ? collection.titles.ar
                : collection.titles.en;
          const desc = locale === 'ur' ? collection.description.ur : collection.description.en;

          return (
            <Pressable
              key={collection.id}
              onPress={() => onSelect(active ? null : collection.id)}
              style={({ pressed }) => [
                styles.tile,
                {
                  backgroundColor: active
                    ? theme.colors.accentPrimaryMuted
                    : theme.colors.surfaceElevated,
                  borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                  borderRadius: theme.radius.lg,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <Text variant="bodySm" weight="600" color={active ? 'accent' : 'primary'} numberOfLines={2}>
                {label}
              </Text>
              <Text variant="caption" color="tertiary" numberOfLines={2} style={styles.tileDesc}>
                {desc}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: layout.sectionGap,
    gap: layout.blockGap,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.blockGap,
  },
  tile: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
    padding: layout.blockGap + 2,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  tileDesc: {
    marginTop: 2,
  },
});
