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

import { NETWORK_META } from '../constants/networkMeta';
import { trackSupportQrView, trackSupportWalletCopy } from '../services/supportAnalytics';
import type { SupportWallet } from '../types';

interface CryptoWalletCardProps {
  wallet: SupportWallet;
  preferred?: boolean;
}

export function CryptoWalletCard({ wallet, preferred }: CryptoWalletCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const [showQr, setShowQr] = useState(false);
  const meta = NETWORK_META[wallet.network];

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
    <Card
      style={[
        styles.card,
        preferred
          ? {
              borderColor: theme.colors.accentPrimary,
              borderWidth: 1.5,
            }
          : null,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.networkIcon,
            {
              backgroundColor: `${meta.accent}18`,
              borderRadius: theme.radius.full,
            },
          ]}
        >
          <Text variant="headingMd" style={{ color: meta.accent }}>
            {meta.icon}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text variant="headingSm">{wallet.label}</Text>
          <View style={styles.badges}>
            <View
              style={[
                styles.networkBadge,
                { backgroundColor: theme.colors.backgroundSecondary, borderRadius: theme.radius.sm },
              ]}
            >
              <Text variant="caption" color="secondary">
                {meta.short}
              </Text>
            </View>
            {preferred ? (
              <View
                style={[
                  styles.preferredBadge,
                  {
                    backgroundColor: theme.colors.accentPrimaryMuted,
                    borderRadius: theme.radius.sm,
                  },
                ]}
              >
                <Text variant="caption" color="accent">
                  {t('support.crypto.preferred')}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

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
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <Text variant="caption" color="tertiary" style={styles.addressLabel}>
          {t('support.crypto.address')}
        </Text>
        <Text variant="bodySm" selectable style={styles.addressValue}>
          {hasAddress ? wallet.address : t('support.crypto.configureInAdmin')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label={t('support.crypto.copy')}
          onPress={handleCopy}
          size="md"
          variant={hasAddress ? 'primary' : 'secondary'}
          style={styles.copyBtn}
        />
        {hasAddress ? (
          <Pressable
            onPress={toggleQr}
            style={[
              styles.qrBtn,
              {
                borderColor: theme.colors.borderSubtle,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <Text variant="bodySm" color="accent">
              {showQr ? t('support.crypto.hideQr') : t('support.crypto.showQr')}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {showQr && hasAddress ? (
        <View
          style={[
            styles.qrWrap,
            {
              backgroundColor: theme.colors.backgroundPrimary,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <QRCode
            value={wallet.address}
            size={168}
            backgroundColor="transparent"
            color={theme.colors.textPrimary}
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  networkIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  networkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  preferredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  instructions: {
    lineHeight: 20,
  },
  addressBox: {
    padding: 14,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  addressLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  addressValue: {
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  copyBtn: {
    flex: 1,
  },
  qrBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  qrWrap: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
