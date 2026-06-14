import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { HADITH_SOURCES } from '../constants/catalog';
import type { HadithSource } from '../types';

interface HadithSourceGridProps {
  activeId: HadithSource | 'all';
  counts: Record<HadithSource | 'all', number>;
  onSelect: (id: HadithSource | 'all') => void;
}

export function HadithSourceGrid({ activeId, counts, onSelect }: HadithSourceGridProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {t('hadith.sourcesLabel')}
      </Text>
      <View style={styles.grid}>
        <Pressable
          onPress={() => onSelect('all')}
          style={({ pressed }) => [
            styles.tile,
            {
              backgroundColor:
                activeId === 'all' ? theme.colors.accentPrimaryMuted : theme.colors.surfaceElevated,
              borderColor: activeId === 'all' ? theme.colors.accentPrimary : theme.colors.borderSubtle,
              borderRadius: theme.radius.lg,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          {activeId === 'all' ? (
            <View style={[styles.tileAccent, { backgroundColor: theme.colors.accentPrimary }]} />
          ) : null}
          <Text variant="bodySm" weight="600" color={activeId === 'all' ? 'accent' : 'primary'}>
            {t('hadith.filter.all')}
          </Text>
          <Text variant="caption" color="tertiary" numberOfLines={2} style={styles.tileDesc}>
            {t('hadith.filter.allDesc')}
          </Text>
          <Text variant="caption" color="accent" style={styles.count}>
            {counts.all}
          </Text>
        </Pressable>
        {HADITH_SOURCES.map((source) => {
          const active = activeId === source.id;
          return (
            <Pressable
              key={source.id}
              onPress={() => onSelect(active ? 'all' : source.id)}
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
              {active ? (
                <View style={[styles.tileAccent, { backgroundColor: source.accentColor }]} />
              ) : null}
              <Text variant="bodySm" weight="600" color={active ? 'accent' : 'primary'} numberOfLines={2}>
                {source.icon} {t(source.nameKey)}
              </Text>
              <Text variant="caption" color="tertiary" numberOfLines={2} style={styles.tileDesc}>
                {t(source.descriptionKey)}
              </Text>
              <Text variant="caption" style={[styles.count, { color: source.accentColor }]}>
                {counts[source.id]}
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
    overflow: 'hidden',
    position: 'relative',
  },
  tileAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  tileDesc: {
    marginTop: 2,
  },
  count: {
    marginTop: 4,
    fontWeight: '600',
  },
});
