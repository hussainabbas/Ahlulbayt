import { Global, Module } from '@nestjs/common';

import { EntitlementsService } from './entitlements.service';
import { EntitlementGuard } from './guards/entitlement.guard';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { WebhooksController } from './webhooks.controller';

@Global()
@Module({
  controllers: [SubscriptionsController, WebhooksController],
  providers: [SubscriptionsService, EntitlementsService, EntitlementGuard],
  exports: [SubscriptionsService, EntitlementsService, EntitlementGuard],
})
export class SubscriptionsModule {}
