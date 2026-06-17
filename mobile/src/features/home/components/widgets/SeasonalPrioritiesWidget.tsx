import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Text } from '@/components/ui/Text';
import type { HomePriorityItem, NavigationTarget } from '@/core/islamic-events';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';

interface SeasonalPrioritiesWidgetProps {
  seasonLabelKey: string;
  priorities: HomePriorityItem[];
  limit?: number;
}

function navigateTo(
  navigation: ReturnType<typeof useRootNavigation>,
  target?: NavigationTarget,
) {
  if (!target) return;
  navigation.navigate(
    target.screen,
    target.params as RootStackParamList[typeof target.screen],
  );
}

export function SeasonalPrioritiesWidget({
  seasonLabelKey,
  priorities,
  limit = 6,
}: SeasonalPrioritiesWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const tabNavigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const items = priorities.slice(0, limit);

  const onItemPress = (item: HomePriorityItem) => {
    if (item.tab) {
      tabNavigation.navigate(item.tab);
      return;
    }
    navigateTo(rootNavigation, item.route);
  };

  if (items.length === 0) return null;

  return (
    <DashboardWidget
      label={t(seasonLabelKey)}
      actionLabel={t('islamicEvents.home.viewAll')}
      onAction={() => rootNavigation.navigate('Calendar')}
      accentColor={theme.colors.accentGold}
    >
      <View style={styles.list}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onItemPress(item)}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: pressed
                  ? theme.colors.surfaceMuted
                  : theme.colors.backgroundSecondary,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <View style={styles.rowText}>
              <Text variant="bodySm" weight="600">
                {t(item.titleKey)}
              </Text>
              {item.subtitleKey ? (
                <Text variant="caption" color="secondary" numberOfLines={2}>
                  {t(item.subtitleKey)}
                </Text>
              ) : null}
            </View>
            <Text variant="caption" color="accent">
              →
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
    paddingHorizontal: layout.blockGap,
    paddingVertical: layout.listGap + 2,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
