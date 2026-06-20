import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { trackSupportQrView, trackSupportWalletCopy } from '../services/supportAnalytics';
import type { SupportWallet } from '../types';

interface CryptoWalletCardProps {
  wallet: SupportWallet;
}

export function CryptoWalletCard({ wallet }: CryptoWalletCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const [showQr, setShowQr] = useState(false);

  const handleCopy = useCallback(() => {
    if (!wallet.address || wallet.address === 'Configure in admin') {
      Alert.alert(t('support.crypto.noAddressTitle'), t('support.crypto.noAddressBody'));
      return;
    }
    Clipboard.setString(wallet.address);
    trackSupportWalletCopy(wallet.network);
    Alert.alert(t('support.crypto.copiedTitle'), t('support.crypto.copiedBody'));
  }, [t, wallet.address, wallet.network]);

  const toggleQr = useCallback(() => {
    setShowQr((prev) => {
      if (!prev) trackSupportQrView(wallet.network);
      return !prev;
    });
  }, [wallet.network]);

  const hasAddress = Boolean(wallet.address && wallet.address !== 'Configure in admin');

  return (
    <Card style={styles.card}>
      <Text variant="headingSm">{wallet.label}</Text>
      {wallet.instructions ? (
        <Text variant="bodySm" color="secondary" style={styles.instructions}>
          {wallet.instructions}
        </Text>
      ) : null}

      <View
        style={[
          styles.addressBox,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <Text variant="caption" color="tertiary" style={styles.addressLabel}>
          {t('support.crypto.address')}
        </Text>
        <Text variant="bodySm" selectable numberOfLines={3}>
          {hasAddress ? wallet.address : t('support.crypto.configureInAdmin')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label={t('support.crypto.copy')} onPress={handleCopy} size="md" variant="secondary" />
        {hasAddress ? (
          <Pressable onPress={toggleQr} style={styles.qrToggle}>
            <Text variant="bodySm" color="accent">
              {showQr ? t('support.crypto.hideQr') : t('support.crypto.showQr')}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {showQr && hasAddress ? (
        <View style={styles.qrWrap}>
          <QRCode value={wallet.address} size={160} backgroundColor="transparent" color={theme.colors.textPrimary} />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: layout.blockGap,
  },
  instructions: {
    lineHeight: 20,
  },
  addressBox: {
    padding: 12,
    gap: 4,
  },
  addressLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qrToggle: {
    paddingVertical: 8,
  },
  qrWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
