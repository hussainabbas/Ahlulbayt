import { useEffect, useLayoutEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { BankDetailsCard } from '../components/BankDetailsCard';
import { CryptoWalletCard } from '../components/CryptoWalletCard';
import { SupportSectionHeader } from '../components/SupportSectionHeader';
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
        {option ? (
          <Card variant="inset" style={styles.hero}>
            <Text variant="headingLg" style={styles.heroIcon}>
              {option.icon}
            </Text>
            <Text variant="headingSm">{t(option.titleKey)}</Text>
            <Text variant="bodySm" color="secondary" style={styles.heroBody}>
              {t(option.descriptionKey)}
            </Text>
          </Card>
        ) : null}

        <View
          style={[
            styles.notice,
            {
              backgroundColor: theme.colors.accentPrimaryMuted,
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <Text variant="caption" color="secondary" style={styles.noticeText}>
            {t('support.crypto.instructionsNote')}
          </Text>
        </View>

        <View style={styles.section}>
          <SupportSectionHeader
            icon="💎"
            title={t('support.crypto.sectionTitle')}
            subtitle={t('support.crypto.sectionSubtitle')}
          />
          <View style={styles.walletList}>
            {sortedWallets.map((wallet) => (
              <CryptoWalletCard
                key={wallet.id}
                wallet={wallet}
                preferred={wallet.network === config.preferredNetwork}
              />
            ))}
          </View>
        </View>

        {config.bankDetails ? (
          <View style={styles.section}>
            <SupportSectionHeader
              icon="🏦"
              title={t('support.bank.sectionTitle')}
              subtitle={t('support.bank.sectionSubtitle')}
            />
            <BankDetailsCard details={config.bankDetails} />
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: layout.blockGap,
    gap: layout.sectionGap,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  heroIcon: {
    fontSize: 36,
    lineHeight: 42,
  },
  heroBody: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  notice: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  noticeText: {
    lineHeight: 18,
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  walletList: {
    gap: 12,
  },
});
