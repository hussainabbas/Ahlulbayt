import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { ProductPlan } from '../types';

interface PlanCardProps {
  plan: ProductPlan;
  selected: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const priceLabel =
    plan.billingPeriod === 'once'
      ? t('premium.priceOnce', { price: plan.priceHint.usd })
      : plan.billingPeriod === 'year'
        ? t('premium.priceYear', { price: plan.priceHint.usd })
        : t('premium.priceMonth', { price: plan.priceHint.usd });

  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: selected ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          backgroundColor: selected
            ? theme.colors.accentPrimaryMuted
            : theme.colors.backgroundSecondary,
        },
        pressed && { opacity: 0.9 },
      ]}
    >
      {plan.popular ? (
        <View style={[styles.badge, { backgroundColor: theme.colors.accentGold }]}>
          <Text variant="caption" style={{ color: theme.colors.backgroundPrimary }}>
            {t('premium.popular')}
          </Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <View style={styles.left}>
          <Text variant="headingSm">{t(plan.titleKey)}</Text>
          {plan.trialDays > 0 ? (
            <Text variant="caption" color="accent">
              {t('premium.trialDays', { days: plan.trialDays })}
            </Text>
          ) : null}
          {plan.savingsPercent ? (
            <Text variant="caption" color="secondary">
              {t('premium.savePercent', { percent: plan.savingsPercent })}
            </Text>
          ) : null}
        </View>
        <Text variant="headingMd" color="accent">
          {priceLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flex: 1, gap: 4, paddingRight: 12 },
});
