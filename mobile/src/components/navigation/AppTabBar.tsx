import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { memo, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useEffectiveSafeInsets } from '@/core/native/safeArea';

import { hapticTabSelection } from '@/core/haptics/navigationHaptics';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { TabBarItem } from './TabBarItem';
import type { TabIconName } from './TabIcons';

type TabRouteName = 'Home' | 'Prayer' | 'Quran' | 'AiAssistant' | 'Profile';

const TAB_META: Record<TabRouteName, { icon: TabIconName; labelKey: string }> = {
  Home: { icon: 'home', labelKey: 'tabs.home' },
  Prayer: { icon: 'prayer', labelKey: 'tabs.prayer' },
  Quran: { icon: 'quran', labelKey: 'tabs.quran' },
  AiAssistant: { icon: 'ai', labelKey: 'tabs.ai' },
  Profile: { icon: 'profile', labelKey: 'tabs.profile' },
};

export const AppTabBar = memo(function AppTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const insets = useEffectiveSafeInsets();

  const barStyle = useMemo(
    () => [
      styles.bar,
      {
        backgroundColor: theme.colors.tabBar,
        borderTopColor: theme.colors.tabBarBorder,
        paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 6 : 8),
        height: 56 + Math.max(insets.bottom, Platform.OS === 'ios' ? 6 : 8),
      },
    ],
    [insets.bottom, theme.colors.tabBar, theme.colors.tabBarBorder],
  );

  return (
    <View style={barStyle} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name as TabRouteName];
        if (!meta) return null;

        const { options } = descriptors[route.key]!;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
              ? options.title
              : t(meta.labelKey);

        const onPress = () => {
          hapticTabSelection();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.key}
            label={label}
            icon={meta.icon}
            focused={focused}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityHint={
              focused ? undefined : t('tabs.switchHint', { tab: label })
            }
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});
