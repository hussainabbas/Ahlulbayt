import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../../auth/token.service';
import { Roles, WRITE_ADMIN_ROLES } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AdminNotificationsService } from './admin-notifications.service';
import { CreateCampaignDto, PreviewSegmentDto } from './dto/admin-notifications.dto';

@Controller('v1/admin/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminNotificationsController {
  constructor(private readonly notifications: AdminNotificationsService) {}

  @Get('campaigns')
  listCampaigns() {
    return this.notifications.listCampaigns();
  }

  @Post('campaigns')
  @Roles(...WRITE_ADMIN_ROLES)
  createCampaign(@CurrentUser() actor: AuthTokenPayload, @Body() dto: CreateCampaignDto) {
    return this.notifications.createCampaign(actor.sub, dto);
  }

  @Post('preview')
  preview(@Body() dto: PreviewSegmentDto) {
    return this.notifications.previewSegment(dto);
  }

  @Post('campaigns/:id/send')
  @Roles(...WRITE_ADMIN_ROLES)
  send(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.notifications.sendCampaign(actor.sub, id, req.ip);
  }
}
