import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../auth/token.service';
import { RequireEntitlement } from '../subscriptions/decorators/require-entitlement.decorator';
import { EntitlementGuard } from '../subscriptions/guards/entitlement.guard';
import { AiService } from './ai.service';
import { AiChatDto } from './dto/ai.dto';

@Controller('v1/ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard, EntitlementGuard)
  @RequireEntitlement('ai')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  chat(@CurrentUser() user: AuthTokenPayload, @Body() dto: AiChatDto) {
    return this.ai.chat(user.sub, dto);
  }

  @Post('chat/guest')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  chatGuest(@Body() dto: AiChatDto) {
    return this.ai.chat(null, dto);
  }
}
