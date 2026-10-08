import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthTokenPayload } from '../../auth/token.service';
import type { EntitlementKey } from '../constants/products';
import { ENTITLEMENT_KEY } from '../decorators/require-entitlement.decorator';
import { EntitlementsService } from '../entitlements.service';
import { SubscriptionsService } from '../subscriptions.service';

@Injectable()
export class EntitlementGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptions: SubscriptionsService,
    private readonly entitlements: EntitlementsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const key = this.reflector.getAllAndOverride<EntitlementKey | undefined>(
      ENTITLEMENT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!key) return true;

    const request = context.switchToHttp().getRequest<{ user?: AuthTokenPayload }>();
    const user = request.user;
    if (!user?.sub) {
      throw new ForbiddenException('Authentication required');
    }

    const state = await this.subscriptions.getUserEntitlements(user.sub);
    if (!this.entitlements.hasEntitlement(state.entitlements, key)) {
      throw new ForbiddenException({
        code: 'PREMIUM_REQUIRED',
        entitlement: key,
        message: `Premium entitlement required: ${key}`,
      });
    }

    return true;
  }
}
