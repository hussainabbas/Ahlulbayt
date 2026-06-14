import { apiGet, apiPost } from '@/core/api/client';

import type {
  ProductPlan,
  SubscriptionState,
  VerifyPurchasePayload,
} from '../types';

interface PlansResponse {
  products: ProductPlan[];
}

export async function fetchSubscriptionState(): Promise<SubscriptionState | null> {
  try {
    const data = await apiGet<Omit<SubscriptionState, 'lastSyncedAt'>>('/subscriptions/me');
    return { ...data, lastSyncedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}

export async function fetchPlans(): Promise<ProductPlan[]> {
  try {
    const data = await apiGet<PlansResponse>('/subscriptions/plans');
    return data.products;
  } catch {
    return [];
  }
}

export async function verifyPurchase(
  payload: VerifyPurchasePayload,
): Promise<SubscriptionState | null> {
  try {
    const data = await apiPost<Omit<SubscriptionState, 'lastSyncedAt'>, VerifyPurchasePayload>(
      '/subscriptions/verify',
      payload,
    );
    return { ...data, lastSyncedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}

export async function restorePurchases(): Promise<SubscriptionState | null> {
  try {
    const data = await apiPost<Omit<SubscriptionState, 'lastSyncedAt'>>('/subscriptions/restore');
    return { ...data, lastSyncedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}
