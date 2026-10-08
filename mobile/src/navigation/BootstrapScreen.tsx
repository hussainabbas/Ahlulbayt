import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';

import { BootstrapSkeleton } from '@/components/feedback/skeletonPresets';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { RootStackParamList } from './types';
import { useBootstrapReady } from './useBootstrapReady';

type Props = NativeStackScreenProps<RootStackParamList, 'Bootstrap'>;

export function BootstrapScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const ready = useBootstrapReady();
  const isComplete = useOnboardingStore((s) => s.isComplete);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!ready) return;

    const route = !isComplete ? 'Onboarding' : !isAuthenticated ? 'Auth' : 'Main';
    navigation.reset({ index: 0, routes: [{ name: route }] });
    void RNBootSplash.hide({ fade: true }).catch(() => undefined);
  }, [isAuthenticated, isComplete, navigation, ready]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <BootstrapSkeleton />
      <View style={styles.footer}>
        <Spinner size="small" label={t('common.loadingContent')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
