import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import {
  trackSupportHomeCardClick,
  trackSupportHomeCardDismiss,
  trackSupportHomeCardView,
} from '../services/supportAnalytics';
import { useSupportDismissStore } from '../stores/supportDismissStore';
import type { SupportConfig } from '../types';

interface SupportHomeCardProps {
  config: SupportConfig;
  onShown?: () => void;
}

export function SupportHomeCard({ config, onShown }: SupportHomeCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const dismiss = useSupportDismissStore((s) => s.dismiss);

  useEffect(() => {
    trackSupportHomeCardView();
    onShown?.();
  }, [onShown]);

  const handleSupport = () => {
    trackSupportHomeCardClick();
    rootNavigation.navigate('Support');
  };

  const handleDismiss = () => {
    trackSupportHomeCardDismiss();
    dismiss();
  };

  const title = config.campaign?.title ?? t('support.homeCard.title');
  const body = config.campaign?.body ?? t('support.homeCard.body');

  return (
    <LinearGradient
      colors={['rgba(61, 155, 138, 0.12)', 'rgba(212, 184, 122, 0.08)', theme.colors.surfaceElevated]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        {
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text variant="headingMd">💚</Text>
        <Pressable onPress={handleDismiss} hitSlop={8} accessibilityLabel={t('support.homeCard.dismiss')}>
          <Text variant="caption" color="tertiary">
            ×
          </Text>
        </Pressable>
      </View>

      <Text variant="headingSm" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodySm" color="secondary">
        {body}
      </Text>

      <Button
        label={t('support.homeCard.cta')}
        onPress={handleSupport}
        size="md"
        style={styles.cta}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: layout.blockGap,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: 4,
  },
  cta: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});
