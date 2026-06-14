import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { shouldShowSubscriptionUi } from '@/features/monetization/config';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { useAuthStore } from '@/stores/authStore';
import { layout } from '@/theme/layout';

import { MoreMenuSection } from '../components/MoreMenuSection';
import { MoreProfileHero } from '../components/MoreProfileHero';
import { MoreQuickActions } from '../components/MoreQuickActions';
import { MORE_MENU_SECTIONS, type MoreMenuItem } from '../constants/menuConfig';

export function MoreScreen() {
  const { t } = useLocale();
  const rootNavigation = useRootNavigation();
  const displayName = useAuthStore((s) => s.user?.displayName);
  const email = useAuthStore((s) => s.user?.email);
  const isGuest = useAuthStore((s) => s.isGuest);
  const showSubscription = shouldShowSubscriptionUi();

  const openItem = useCallback(
    (item: MoreMenuItem) => {
      rootNavigation.navigate(item.route);
    },
    [rootNavigation],
  );

  const sections = useMemo(
    () =>
      MORE_MENU_SECTIONS.map((section) => ({
        section,
        items: section.items.filter((item) => {
          if (item.subscriptionOnly && !showSubscription) return false;
          return true;
        }),
      })),
    [showSubscription],
  );

  return (
    <Screen scroll padded={false} safeBottom={false}>
      <View style={styles.container}>
        <MoreProfileHero
          displayName={displayName ?? t('tabs.profile')}
          email={email}
          isGuest={isGuest}
          onSignIn={() => rootNavigation.navigate('Auth', { screen: 'Welcome' })}
          onSettings={() => rootNavigation.navigate('Settings')}
        />

        <MoreQuickActions onPress={openItem} />

        {sections.map(({ section, items }) => (
          <MoreMenuSection
            key={section.id}
            section={section}
            items={items}
            onPress={openItem}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.screenPaddingY,
    paddingBottom: 120,
    gap: layout.sectionGap,
  },
});
