import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../../auth/token.service';
import { Roles, SUPER_ADMIN_ROLES } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AdminAiService } from './admin-ai.service';
import { UpdateAiConfigDto, UpdateGuardrailsDto } from './dto/admin-ai.dto';

@Controller('v1/admin/ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminAiController {
  constructor(private readonly ai: AdminAiService) {}

  @Get('config')
  getConfig() {
    return this.ai.getConfig();
  }

  @Patch('config/:key')
  @Roles(...SUPER_ADMIN_ROLES)
  updateConfig(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('key') key: string,
    @Body() dto: UpdateAiConfigDto,
    @Req() req: Request,
  ) {
    return this.ai.updateConfig(actor.sub, key, dto, req.ip);
  }

  @Get('guardrails')
  getGuardrails() {
    return this.ai.getGuardrails();
  }

  @Put('guardrails')
  @Roles(...SUPER_ADMIN_ROLES)
  updateGuardrails(
    @CurrentUser() actor: AuthTokenPayload,
    @Body() dto: UpdateGuardrailsDto,
    @Req() req: Request,
  ) {
    return this.ai.updateGuardrails(actor.sub, dto, req.ip);
  }

  @Get('conversations')
  listConversations() {
    return this.ai.listConversations();
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id', ParseUUIDPipe) id: string) {
    return this.ai.getConversationMessages(id);
  }
}
