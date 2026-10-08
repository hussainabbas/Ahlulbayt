import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { FeaturedContentItem } from '@/core/islamic-events';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';

interface FeaturedSeasonalWidgetProps {
  items: FeaturedContentItem[];
  limit?: number;
}

export function FeaturedSeasonalWidget({ items, limit = 3 }: FeaturedSeasonalWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const featured = items.slice(0, limit);

  if (featured.length === 0) return null;

  return (
    <DashboardWidget label={t('islamicEvents.featured.title')} variant="inset">
      <View style={styles.list}>
        {featured.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              if (item.route) {
                rootNavigation.navigate(
                  item.route.screen,
                  item.route.params as RootStackParamList[typeof item.route.screen],
                );
              }
            }}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: pressed
                  ? theme.colors.surfaceMuted
                  : theme.colors.surfaceElevated,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="caption" color="tertiary">
              {t(`islamicEvents.featured.kind.${item.kind}`)}
            </Text>
            <Text variant="bodySm" weight="600">
              {t(item.titleKey)}
            </Text>
            {item.subtitleKey ? (
              <Text variant="caption" color="secondary" numberOfLines={2}>
                {t(item.subtitleKey)}
              </Text>
            ) : null}
            <Text variant="caption" color={item.unverified ? 'tertiary' : 'accent'}>
              {item.unverified
                ? t('islamicEvents.references.unverified')
                : t('islamicEvents.references.verified', {
                    count: item.references.length,
                  })}
            </Text>
          </Pressable>
        ))}
      </View>
    </DashboardWidget>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: layout.listGap,
  },
  card: {
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
});
