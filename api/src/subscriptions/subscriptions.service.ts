import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, desc, eq, or, isNull, gt } from 'drizzle-orm';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { subscriptions, subscriptionEvents, users } from '../database/schema';
import {
  computeExpiresAt,
  PlanType,
  PRODUCT_BY_ID,
  resolvePlanType,
} from './constants/products';
import { EntitlementsService } from './entitlements.service';
import { VerifyPurchaseDto } from './dto/subscriptions.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly entitlements: EntitlementsService,
    private readonly config: ConfigService,
  ) {}

  getPlans() {
    return this.entitlements.listPlans();
  }

  async getUserEntitlements(userId: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new NotFoundException('User not found');

    const active = await this.findActiveSubscription(userId);
    if (active) {
      return this.entitlements.buildEntitlements(
        'premium',
        active.planType as PlanType,
        active.expiresAt,
      );
    }

    return this.entitlements.buildEntitlements(user.tier, null, null);
  }

  async verifyPurchase(userId: string, dto: VerifyPurchaseDto) {
    const product = PRODUCT_BY_ID.get(dto.productId);
    if (!product) {
      throw new BadRequestException(`Unknown product: ${dto.productId}`);
    }

    const devMode = this.config.get<string>('MONETIZATION_DEV_MODE') === 'true';
    if (!devMode && !dto.receiptData && !dto.purchaseToken) {
      throw new BadRequestException('Receipt or purchase token required');
    }

    const planType = product.planType;
    const expiresAt = computeExpiresAt(planType);
    const now = new Date();

    const [existing] = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.originalTxId, dto.transactionId))
      .limit(1);

    let subId: string;

    if (existing) {
      const [updated] = await this.db
        .update(subscriptions)
        .set({
          status: 'active',
          expiresAt,
          updatedAt: now,
        })
        .where(eq(subscriptions.id, existing.id))
        .returning();
      subId = updated!.id;
    } else {
      const [created] = await this.db
        .insert(subscriptions)
        .values({
          userId,
          platform: dto.platform,
          productId: dto.productId,
          planType,
          status: 'active',
          originalTxId: dto.transactionId,
          purchaseToken: dto.purchaseToken,
          expiresAt,
          isTrial: product.trialDays > 0,
        })
        .returning();
      subId = created!.id;
    }

    await this.db.insert(subscriptionEvents).values({
      subscriptionId: subId,
      eventType: 'purchased',
      rawPayload: {
        platform: dto.platform,
        productId: dto.productId,
        transactionId: dto.transactionId,
        devMode,
      },
    });

    await this.db
      .update(users)
      .set({ tier: 'premium', updatedAt: now })
      .where(eq(users.id, userId));

    return this.getUserEntitlements(userId);
  }

  async restorePurchases(userId: string) {
    const active = await this.findActiveSubscription(userId);
    if (!active) {
      return this.getUserEntitlements(userId);
    }

    await this.db
      .update(users)
      .set({ tier: 'premium', updatedAt: new Date() })
      .where(eq(users.id, userId));

    return this.getUserEntitlements(userId);
  }

  async handleWebhookEvent(
    platform: 'apple' | 'google',
    eventType: string,
    payload: Record<string, unknown>,
  ) {
    const originalTxId =
      (payload.originalTransactionId as string) ??
      (payload.original_tx_id as string) ??
      (payload.transactionId as string);

    if (!originalTxId) {
      return { processed: false, reason: 'missing_transaction_id' };
    }

    const [sub] = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.originalTxId, originalTxId))
      .limit(1);

    if (!sub) {
      return { processed: false, reason: 'subscription_not_found' };
    }

    let status = sub.status;
    if (['DID_RENEW', 'renewed', 'SUBSCRIPTION_RENEWED'].includes(eventType)) {
      status = 'active';
      const planType = resolvePlanType(sub.productId);
      if (planType && planType !== 'lifetime') {
        await this.db
          .update(subscriptions)
          .set({
            status: 'active',
            expiresAt: computeExpiresAt(planType),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, sub.id));
      }
    } else if (['EXPIRED', 'expired', 'DID_FAIL_TO_RENEW'].includes(eventType)) {
      status = 'expired';
      await this.db
        .update(subscriptions)
        .set({ status: 'expired', updatedAt: new Date() })
        .where(eq(subscriptions.id, sub.id));
      await this.downgradeUserIfNeeded(sub.userId);
    } else if (['REFUND', 'refunded', 'REVOKE'].includes(eventType)) {
      status = 'cancelled';
      await this.db
        .update(subscriptions)
        .set({ status: 'cancelled', updatedAt: new Date() })
        .where(eq(subscriptions.id, sub.id));
      await this.downgradeUserIfNeeded(sub.userId);
    }

    await this.db.insert(subscriptionEvents).values({
      subscriptionId: sub.id,
      eventType,
      rawPayload: { platform, ...payload },
    });

    return { processed: true, status };
  }

  private async findActiveSubscription(userId: string) {
    const now = new Date();
    const [row] = await this.db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active'),
          or(isNull(subscriptions.expiresAt), gt(subscriptions.expiresAt, now)),
        ),
      )
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    return row ?? null;
  }

  private async downgradeUserIfNeeded(userId: string) {
    const active = await this.findActiveSubscription(userId);
    if (!active) {
      await this.db
        .update(users)
        .set({ tier: 'free', updatedAt: new Date() })
        .where(eq(users.id, userId));
    }
  }
}
