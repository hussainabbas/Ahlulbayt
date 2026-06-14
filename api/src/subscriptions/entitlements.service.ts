import { Injectable } from '@nestjs/common';

import {
  EntitlementKey,
  PREMIUM_ENTITLEMENTS,
  PlanType,
  PRODUCTS,
} from './constants/products';

export interface EntitlementMap {
  ai: boolean;
  advanced_quran: boolean;
  cloud_sync: boolean;
  exclusive_content: boolean;
}

export interface UserEntitlements {
  isPremium: boolean;
  tier: string;
  plan: PlanType | null;
  expiresAt: string | null;
  entitlements: EntitlementMap;
}

const FREE_ENTITLEMENTS: EntitlementMap = {
  ai: false,
  advanced_quran: false,
  cloud_sync: false,
  exclusive_content: false,
};

const PREMIUM_MAP: EntitlementMap = {
  ai: true,
  advanced_quran: true,
  cloud_sync: true,
  exclusive_content: true,
};

@Injectable()
export class EntitlementsService {
  listPlans() {
    return {
      products: PRODUCTS.map((p) => ({
        id: p.id,
        planType: p.planType,
        titleKey: p.titleKey,
        priceHint: p.priceHint,
        billingPeriod: p.billingPeriod,
        trialDays: p.trialDays,
        popular: p.popular ?? false,
        savingsPercent: p.savingsPercent ?? null,
      })),
      entitlements: PREMIUM_ENTITLEMENTS.map((key) => ({
        key,
        includedInPremium: true,
      })),
    };
  }

  buildEntitlements(
    tier: string,
    plan: PlanType | null,
    expiresAt: Date | null,
  ): UserEntitlements {
    const isLifetime = plan === 'lifetime';
    const isActive =
      tier === 'premium' &&
      (isLifetime || expiresAt === null || expiresAt > new Date());

    return {
      isPremium: isActive,
      tier: isActive ? 'premium' : tier,
      plan: isActive ? plan : null,
      expiresAt: isActive && expiresAt ? expiresAt.toISOString() : null,
      entitlements: isActive ? { ...PREMIUM_MAP } : { ...FREE_ENTITLEMENTS },
    };
  }

  hasEntitlement(entitlements: EntitlementMap, key: EntitlementKey): boolean {
    return entitlements[key] === true;
  }
}
