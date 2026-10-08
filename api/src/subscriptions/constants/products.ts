export type PlanType = 'monthly' | 'yearly' | 'lifetime';
export type EntitlementKey = 'ai' | 'advanced_quran' | 'cloud_sync' | 'exclusive_content';

export interface ProductDefinition {
  id: string;
  planType: PlanType;
  titleKey: string;
  priceHint: { usd: number; currency: string };
  billingPeriod: 'month' | 'year' | 'once';
  trialDays: number;
  popular?: boolean;
  savingsPercent?: number;
}

export const PREMIUM_ENTITLEMENTS: EntitlementKey[] = [
  'ai',
  'advanced_quran',
  'cloud_sync',
  'exclusive_content',
];

export const PRODUCTS: ProductDefinition[] = [
  {
    id: 'com.ahlulbayt.premium.monthly',
    planType: 'monthly',
    titleKey: 'premium.plans.monthly',
    priceHint: { usd: 4.99, currency: 'USD' },
    billingPeriod: 'month',
    trialDays: 7,
  },
  {
    id: 'com.ahlulbayt.premium.yearly',
    planType: 'yearly',
    titleKey: 'premium.plans.yearly',
    priceHint: { usd: 39.99, currency: 'USD' },
    billingPeriod: 'year',
    trialDays: 7,
    popular: true,
    savingsPercent: 33,
  },
  {
    id: 'com.ahlulbayt.premium.lifetime',
    planType: 'lifetime',
    titleKey: 'premium.plans.lifetime',
    priceHint: { usd: 99.99, currency: 'USD' },
    billingPeriod: 'once',
    trialDays: 0,
  },
];

export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function resolvePlanType(productId: string): PlanType | null {
  return PRODUCT_BY_ID.get(productId)?.planType ?? null;
}

export function computeExpiresAt(planType: PlanType, from = new Date()): Date | null {
  if (planType === 'lifetime') return null;
  const d = new Date(from);
  if (planType === 'monthly') d.setMonth(d.getMonth() + 1);
  if (planType === 'yearly') d.setFullYear(d.getFullYear() + 1);
  return d;
}
