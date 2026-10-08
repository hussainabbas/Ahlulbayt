export type PlanType = 'monthly' | 'yearly' | 'lifetime';

export type EntitlementKey =
  | 'ai'
  | 'advanced_quran'
  | 'cloud_sync'
  | 'exclusive_content';

export interface EntitlementMap {
  ai: boolean;
  advanced_quran: boolean;
  cloud_sync: boolean;
  exclusive_content: boolean;
}

export interface ProductPlan {
  id: string;
  planType: PlanType;
  titleKey: string;
  priceHint: { usd: number; currency: string };
  billingPeriod: 'month' | 'year' | 'once';
  trialDays: number;
  popular: boolean;
  savingsPercent: number | null;
}

export interface SubscriptionState {
  isPremium: boolean;
  tier: string;
  plan: PlanType | null;
  expiresAt: string | null;
  entitlements: EntitlementMap;
  lastSyncedAt: string | null;
}

export interface PurchaseResult {
  success: boolean;
  productId: string;
  transactionId: string;
  errorKey?: string;
}

export interface VerifyPurchasePayload {
  platform: 'apple' | 'google';
  productId: string;
  transactionId: string;
  purchaseToken?: string;
  receiptData?: string;
}

export const FREE_ENTITLEMENTS: EntitlementMap = {
  ai: false,
  advanced_quran: false,
  cloud_sync: false,
  exclusive_content: false,
};

export const DEFAULT_SUBSCRIPTION_STATE: SubscriptionState = {
  isPremium: false,
  tier: 'free',
  plan: null,
  expiresAt: null,
  entitlements: FREE_ENTITLEMENTS,
  lastSyncedAt: null,
};
