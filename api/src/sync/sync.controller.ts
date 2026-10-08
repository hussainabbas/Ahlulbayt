import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../auth/token.service';
import { RequireEntitlement } from '../subscriptions/decorators/require-entitlement.decorator';
import { EntitlementGuard } from '../subscriptions/guards/entitlement.guard';
import { SyncPullQueryDto, SyncPushDto } from './dto/sync.dto';
import { SyncService } from './sync.service';

@Controller('v1/sync')
@UseGuards(JwtAuthGuard, EntitlementGuard)
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  @Post('push')
  @RequireEntitlement('cloud_sync')
  push(@CurrentUser() user: AuthTokenPayload, @Body() dto: SyncPushDto) {
    return this.sync.push(user.sub, dto.changes);
  }

  @Get('pull')
  @RequireEntitlement('cloud_sync')
  pull(@CurrentUser() user: AuthTokenPayload, @Query() query: SyncPullQueryDto) {
    return this.sync.pull(user.sub, query.cursor ?? 0, query.limit ?? 50);
  }
}
