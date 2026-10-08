import type { EntitlementKey, PlanType, ProductPlan } from '../types';

export const PRODUCT_IDS = {
  monthly: 'com.ahlulbayt.premium.monthly',
  yearly: 'com.ahlulbayt.premium.yearly',
  lifetime: 'com.ahlulbayt.premium.lifetime',
} as const;

export const PRODUCT_PLANS: ProductPlan[] = [
  {
    id: PRODUCT_IDS.monthly,
    planType: 'monthly',
    titleKey: 'premium.plans.monthly',
    priceHint: { usd: 4.99, currency: 'USD' },
    billingPeriod: 'month',
    trialDays: 7,
    popular: false,
    savingsPercent: null,
  },
  {
    id: PRODUCT_IDS.yearly,
    planType: 'yearly',
    titleKey: 'premium.plans.yearly',
    priceHint: { usd: 39.99, currency: 'USD' },
    billingPeriod: 'year',
    trialDays: 7,
    popular: true,
    savingsPercent: 33,
  },
  {
    id: PRODUCT_IDS.lifetime,
    planType: 'lifetime',
    titleKey: 'premium.plans.lifetime',
    priceHint: { usd: 99.99, currency: 'USD' },
    billingPeriod: 'once',
    trialDays: 0,
    popular: false,
    savingsPercent: null,
  },
];

export const PREMIUM_FEATURES: Array<{
  key: EntitlementKey;
  titleKey: string;
  descKey: string;
  icon: string;
}> = [
  {
    key: 'ai',
    titleKey: 'premium.features.ai.title',
    descKey: 'premium.features.ai.desc',
    icon: '✦',
  },
  {
    key: 'advanced_quran',
    titleKey: 'premium.features.advancedQuran.title',
    descKey: 'premium.features.advancedQuran.desc',
    icon: '☪',
  },
  {
    key: 'cloud_sync',
    titleKey: 'premium.features.cloudSync.title',
    descKey: 'premium.features.cloudSync.desc',
    icon: '☁',
  },
  {
    key: 'exclusive_content',
    titleKey: 'premium.features.exclusiveContent.title',
    descKey: 'premium.features.exclusiveContent.desc',
    icon: '★',
  },
];

export function planByType(planType: PlanType): ProductPlan | undefined {
  return PRODUCT_PLANS.find((p) => p.planType === planType);
}
