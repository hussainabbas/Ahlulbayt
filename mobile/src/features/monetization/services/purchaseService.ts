import { Platform } from 'react-native';

import { logger } from '@/core/logging/logger';

import type { PurchaseResult } from '../types';

export interface PurchaseAdapter {
  init(): Promise<void>;
  purchase(productId: string): Promise<PurchaseResult>;
  restore(): Promise<PurchaseResult[]>;
}

/**
 * Dev/mock adapter — swap for react-native-iap or RevenueCat in production.
 * Simulates store purchase flow and returns verifiable transaction IDs.
 */
class MockPurchaseAdapter implements PurchaseAdapter {
  private ready = false;

  async init(): Promise<void> {
    this.ready = true;
    logger.info('Mock purchase adapter initialized');
  }

  async purchase(productId: string): Promise<PurchaseResult> {
    if (!this.ready) await this.init();
    await delay(800);
    return {
      success: true,
      productId,
      transactionId: `mock-${Platform.OS}-${Date.now()}-${productId.split('.').pop()}`,
    };
  }

  async restore(): Promise<PurchaseResult[]> {
    return [];
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let adapter: PurchaseAdapter = new MockPurchaseAdapter();

export const purchaseService = {
  setAdapter(next: PurchaseAdapter): void {
    adapter = next;
  },

  async init(): Promise<void> {
    await adapter.init();
  },

  async purchase(productId: string): Promise<PurchaseResult> {
    return adapter.purchase(productId);
  },

  async restore(): Promise<PurchaseResult[]> {
    return adapter.restore();
  },

  platform(): 'apple' | 'google' {
    return Platform.OS === 'ios' ? 'apple' : 'google';
  },
};
