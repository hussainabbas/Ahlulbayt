import { useEffect, useLayoutEffect, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { CryptoWalletCard } from '../components/CryptoWalletCard';
import { useSupportConfig } from '../hooks/useSupportConfig';
import { trackSupportCryptoView } from '../services/supportAnalytics';

export function SupportCryptoScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SupportCrypto'>>();
  const { config } = useSupportConfig();

  const option = useMemo(
    () => config.options.find((o) => o.id === route.params.optionId),
    [config.options, route.params.optionId],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: option ? t(option.titleKey) : t('support.crypto.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, option, t, theme]);

  useEffect(() => {
    trackSupportCryptoView(route.params.optionId);
  }, [route.params.optionId]);

  const sortedWallets = useMemo(() => {
    if (!config.preferredNetwork) return config.wallets;
    const preferred = config.wallets.filter((w) => w.network === config.preferredNetwork);
    const rest = config.wallets.filter((w) => w.network !== config.preferredNetwork);
    return [...preferred, ...rest];
  }, [config.preferredNetwork, config.wallets]);

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: layout.screenPaddingX,
            paddingBottom: insets.bottom + layout.blockGap,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="bodySm" color="secondary">
          {option ? t(option.descriptionKey) : t('support.crypto.subtitle')}
        </Text>

        <Text variant="caption" color="tertiary" style={styles.note}>
          {t('support.crypto.instructionsNote')}
        </Text>

        {sortedWallets.map((wallet) => (
          <CryptoWalletCard key={wallet.id} wallet={wallet} />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: layout.blockGap,
    gap: layout.sectionGap,
  },
  note: {
    lineHeight: 18,
  },
});
