import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createQueryClient } from '@/core/offline/queryClient';
import { networkManager } from '@/core/offline/network';
import { logger } from '@/core/logging/logger';
import { i18n } from '@/i18n';
import { ThemeProvider } from '@/theme/ThemeContext';
import { MuharramThemeBootstrap } from '@/features/muharram/components/MuharramThemeBootstrap';
import { useAppStore } from '@/stores/appStore';
import { OfflineBanner } from '@/components/feedback/OfflineBanner';
import { ContentSyncBootstrap } from '@/core/offline/ContentSyncBootstrap';
import { AnalyticsBootstrap } from '@/core/analytics';
import { NATIVE_AUDIO_ENABLED } from '@/features/quran/audio/config';
import { NotificationBootstrap } from '@/features/notifications/components/NotificationBootstrap';
import { PrayerTimesBootstrap } from '@/features/prayer/components/PrayerTimesBootstrap';
import { SubscriptionBootstrap } from '@/features/monetization/components/SubscriptionBootstrap';
import { QuranAudioBootstrap } from '@/features/quran/audio/components/QuranAudioBootstrap';
interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());
  const setIsOnline = useAppStore((s) => s.setIsOnline);
  const setIsHydrated = useAppStore((s) => s.setIsHydrated);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await networkManager.initialize();
        if (mounted) {
          setIsOnline(networkManager.getIsConnected());
          networkManager.subscribe(setIsOnline);
        }
      } catch (error) {
        logger.error('Bootstrap failed', error);
      } finally {
        if (mounted) {
          setIsHydrated(true);
        }
      }
    }

    void bootstrap();

    return () => {
      mounted = false;
      networkManager.destroy();
    };
  }, [setIsHydrated, setIsOnline]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <MuharramThemeBootstrap />
              <OfflineBanner />
              <PrayerTimesBootstrap />
              <ContentSyncBootstrap />
              <AnalyticsBootstrap />
              <NotificationBootstrap />
              <SubscriptionBootstrap />
              {NATIVE_AUDIO_ENABLED ? <QuranAudioBootstrap /> : null}
              {children}
            </ThemeProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
