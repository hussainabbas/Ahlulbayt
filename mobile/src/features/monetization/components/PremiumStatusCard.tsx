import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { useTheme } from '@/theme/ThemeContext';

import { usePremium } from '../hooks/usePremium';

export function PremiumStatusCard() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useRootNavigation();
  const { isPremium, plan, expiresAt } = usePremium();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="overline" color="secondary">
          {t('premium.status.label')}
        </Text>
        {isPremium ? (
          <View style={[styles.badge, { backgroundColor: theme.colors.accentGold }]}>
            <Text variant="caption" style={{ color: theme.colors.backgroundPrimary }}>
              {t('premium.status.active')}
            </Text>
          </View>
        ) : null}
      </View>

      {isPremium ? (
        <>
          <Text variant="headingSm">
            {plan ? t(`premium.plans.${plan}`) : t('premium.status.premium')}
          </Text>
          {expiresAt ? (
            <Text variant="bodySm" color="secondary">
              {t('premium.status.renews', { date: new Date(expiresAt).toLocaleDateString() })}
            </Text>
          ) : (
            <Text variant="bodySm" color="secondary">
              {t('premium.status.lifetime')}
            </Text>
          )}
        </>
      ) : (
        <>
          <Text variant="headingSm">{t('premium.status.free')}</Text>
          <Text variant="bodySm" color="secondary" style={styles.freeDesc}>
            {t('premium.status.freeDesc')}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Paywall')}
            style={({ pressed }) => [
              styles.cta,
              { backgroundColor: theme.colors.accentPrimary },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text variant="headingSm" style={{ color: theme.colors.textInverse }}>
              {t('premium.status.upgrade')}
            </Text>
          </Pressable>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8, marginBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  freeDesc: { marginTop: 4, marginBottom: 8 },
  cta: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
});
