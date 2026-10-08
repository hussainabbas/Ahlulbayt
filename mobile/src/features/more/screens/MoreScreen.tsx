import { useCallback, useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { shouldShowSubscriptionUi } from '@/features/monetization/config';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { useAuthStore } from '@/stores/authStore';
import { layout } from '@/theme/layout';

import { MoreAccountSection } from '../components/MoreAccountSection';
import { MoreMenuSection } from '../components/MoreMenuSection';
import { MoreProfileHero } from '../components/MoreProfileHero';
import { MoreQuickActions } from '../components/MoreQuickActions';
import { MORE_MENU_SECTIONS, type MoreMenuItem } from '../constants/menuConfig';

export function MoreScreen() {
  const { t } = useLocale();
  const rootNavigation = useRootNavigation();
  const { signOut } = useAuth();
  const displayName = useAuthStore((s) => s.user?.displayName);
  const email = useAuthStore((s) => s.user?.email);
  const isGuest = useAuthStore((s) => s.isGuest);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showSubscription = shouldShowSubscriptionUi();

  const openItem = useCallback(
    (item: MoreMenuItem) => {
      rootNavigation.navigate(item.route);
    },
    [rootNavigation],
  );

  const handleSignOut = useCallback(() => {
    Alert.alert(
      isGuest ? t('more.exitGuestTitle') : t('more.signOutTitle'),
      isGuest ? t('more.exitGuestConfirm') : t('more.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: isGuest ? t('more.exitGuest') : t('more.signOut'),
          style: 'destructive',
          onPress: () => {
            void (async () => {
              await signOut();
              rootNavigation.reset('Auth');
            })();
          },
        },
      ],
    );
  }, [isGuest, rootNavigation, signOut, t]);

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

        {isAuthenticated ? (
          <MoreAccountSection isGuest={isGuest} onSignOut={handleSignOut} />
        ) : null}
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
