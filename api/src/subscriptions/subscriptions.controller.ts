import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../auth/token.service';
import { VerifyPurchaseDto } from './dto/subscriptions.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('v1/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptions: SubscriptionsService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptions.getPlans();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthTokenPayload) {
    return this.subscriptions.getUserEntitlements(user.sub);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  verify(@CurrentUser() user: AuthTokenPayload, @Body() dto: VerifyPurchaseDto) {
    return this.subscriptions.verifyPurchase(user.sub, dto);
  }

  @Post('restore')
  @UseGuards(JwtAuthGuard)
  restore(@CurrentUser() user: AuthTokenPayload) {
    return this.subscriptions.restorePurchases(user.sub);
  }
}
