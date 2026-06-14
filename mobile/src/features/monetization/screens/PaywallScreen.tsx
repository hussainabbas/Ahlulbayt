import { useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { ErrorState } from '@/components/feedback/ErrorState';
import { PlanCardSkeleton } from '@/components/feedback/skeletonPresets';
import { Screen } from '@/components/ui/Screen';
import { Spinner } from '@/components/ui/Spinner';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { PREMIUM_FEATURES, PRODUCT_PLANS } from '../constants/catalog';
import { PlanCard } from '../components/PlanCard';
import { usePaywall, usePremium } from '../hooks/usePremium';

export function PaywallScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Paywall'>>();
  const { isPremium } = usePremium();
  const { plans, isPurchasing, isLoading, errorKey, purchasePlan, restore, clearError, loadPlans } =
    usePaywall();

  const defaultPlan =
    plans.find((p) => p.popular)?.id ?? PRODUCT_PLANS[1]?.id ?? PRODUCT_PLANS[0]!.id;
  const [selectedId, setSelectedId] = useState(defaultPlan);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('premium.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    if (plans.length > 0 && !plans.some((p) => p.id === selectedId)) {
      setSelectedId(defaultPlan);
    }
  }, [defaultPlan, plans, selectedId]);

  useEffect(() => {
    if (isPremium) navigation.goBack();
  }, [isPremium, navigation]);

  const highlight = route.params?.highlight;
  const plansLoading = isLoading && plans.length === 0;

  return (
    <Screen scroll={false}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="displayMd" style={styles.title}>
          {t('premium.headline')}
        </Text>
        <Text variant="bodyMd" color="secondary" style={styles.subtitle}>
          {t('premium.subtitle')}
        </Text>

        <View style={styles.features}>
          {PREMIUM_FEATURES.map((f) => {
            const highlighted = highlight === f.key;
            return (
              <View
                key={f.key}
                style={[
                  styles.featureRow,
                  highlighted && {
                    backgroundColor: theme.colors.accentPrimaryMuted,
                    borderRadius: 10,
                    padding: 10,
                    marginHorizontal: -10,
                  },
                ]}
              >
                <Text variant="headingMd" style={styles.featureIcon}>
                  {f.icon}
                </Text>
                <View style={styles.featureText}>
                  <Text variant="headingSm">{t(f.titleKey)}</Text>
                  <Text variant="bodySm" color="secondary">
                    {t(f.descKey)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text variant="overline" color="secondary" style={styles.sectionLabel}>
          {t('premium.choosePlan')}
        </Text>

        {plansLoading ? (
          <>
            <PlanCardSkeleton />
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </>
        ) : errorKey && plans.length === 0 ? (
          <ErrorState
            title={t(errorKey)}
            onRetry={() => void loadPlans()}
            style={styles.plansError}
          />
        ) : (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              onSelect={() => setSelectedId(plan.id)}
            />
          ))
        )}

        {errorKey && plans.length > 0 ? (
          <Pressable onPress={clearError}>
            <Text variant="bodySm" color="error" style={styles.error}>
              {t(errorKey)}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          disabled={isPurchasing || plansLoading || plans.length === 0}
          onPress={() => void purchasePlan(selectedId)}
          style={({ pressed }) => [
            styles.primaryBtn,
            { backgroundColor: theme.colors.accentPrimary },
            pressed && { opacity: 0.85 },
            (isPurchasing || plansLoading) && { opacity: 0.6 },
          ]}
        >
          {isPurchasing ? (
            <Spinner size="small" color={theme.colors.textInverse} />
          ) : (
            <Text variant="headingSm" style={{ color: theme.colors.textInverse }}>
              {t('premium.subscribe')}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => void restore()} style={styles.restoreBtn}>
          <Text variant="bodySm" color="accent">
            {t('premium.restore')}
          </Text>
        </Pressable>

        <Text variant="caption" color="tertiary" style={styles.legal}>
          {t('premium.legal')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 24 },
  features: { gap: 16, marginBottom: 28 },
  featureRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  featureIcon: { width: 28, textAlign: 'center' },
  featureText: { flex: 1, gap: 4 },
  sectionLabel: { marginBottom: 12 },
  plansError: { paddingVertical: 16 },
  error: { marginBottom: 12, textAlign: 'center' },
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  restoreBtn: { alignItems: 'center', paddingVertical: 16 },
  legal: { textAlign: 'center', lineHeight: 18, marginTop: 8 },
});
