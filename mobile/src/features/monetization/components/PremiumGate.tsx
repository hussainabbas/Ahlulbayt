import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { useTheme } from '@/theme/ThemeContext';

import type { EntitlementKey } from '../types';
import { useEntitlements } from '../hooks/usePremium';

interface PremiumGateProps {
  entitlement: EntitlementKey;
  children: ReactNode;
  /** When true, shows children with a lock overlay instead of replacing. */
  overlay?: boolean;
}

export function PremiumGate({ entitlement, children, overlay = false }: PremiumGateProps) {
  const { hasEntitlement } = useEntitlements();
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useRootNavigation();

  if (hasEntitlement(entitlement)) {
    return <>{children}</>;
  }

  if (overlay) {
    return (
      <View style={styles.wrap}>
        <View style={styles.dimmed} pointerEvents="none">
          {children}
        </View>
        <Pressable
          style={[styles.overlay, { backgroundColor: `${theme.colors.backgroundPrimary}CC` }]}
          onPress={() => navigation.navigate('Paywall', { highlight: entitlement })}
        >
          <Text variant="headingSm" color="accent">
            {t('premium.gate.unlock')}
          </Text>
          <Text variant="bodySm" color="secondary" style={styles.overlaySub}>
            {t(`premium.features.${entitlementKeyToI18n(entitlement)}.title`)}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Card style={styles.card}>
      <Text variant="headingSm">{t('premium.gate.title')}</Text>
      <Text variant="bodySm" color="secondary" style={styles.desc}>
        {t(`premium.features.${entitlementKeyToI18n(entitlement)}.desc`)}
      </Text>
      <Pressable
        onPress={() => navigation.navigate('Paywall', { highlight: entitlement })}
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: theme.colors.accentPrimary },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text variant="headingSm" style={{ color: theme.colors.textInverse }}>
          {t('premium.gate.cta')}
        </Text>
      </Pressable>
    </Card>
  );
}

function entitlementKeyToI18n(key: EntitlementKey): string {
  const map: Record<EntitlementKey, string> = {
    ai: 'ai',
    advanced_quran: 'advancedQuran',
    cloud_sync: 'cloudSync',
    exclusive_content: 'exclusiveContent',
  };
  return map[key];
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  dimmed: { opacity: 0.35 },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  overlaySub: { marginTop: 8, textAlign: 'center' },
  card: { gap: 12, padding: 20 },
  desc: { marginTop: 4 },
  cta: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});
