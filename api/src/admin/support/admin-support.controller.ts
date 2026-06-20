import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../../auth/token.service';
import { RequirePermission } from '../decorators/permissions.decorator';
import { Roles, WRITE_ADMIN_ROLES } from '../decorators/roles.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RolesGuard } from '../guards/roles.guard';
import {
  CreateSupportCampaignDto,
  CreateSupportWalletDto,
  UpdateSupportCampaignDto,
  UpdateSupportConfigDto,
  UpdateSupportWalletDto,
} from '../../support/dto/support.dto';
import { AdminSupportService } from './admin-support.service';

@Controller('v1/admin/support')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AdminSupportController {
  constructor(private readonly support: AdminSupportService) {}

  @Get('config')
  @RequirePermission('support.read')
  getConfig() {
    return this.support.getAdminConfig();
  }

  @Patch('config')
  @Roles(...WRITE_ADMIN_ROLES)
  @RequirePermission('support.write')
  updateConfig(
    @CurrentUser() actor: AuthTokenPayload,
    @Body() dto: UpdateSupportConfigDto,
    @Req() req: Request,
  ) {
    return this.support.updateConfig(actor.sub, dto, req.ip);
  }

  @Get('wallets')
  @RequirePermission('support.read')
  listWallets() {
    return this.support.listWallets();
  }

  @Post('wallets')
  @Roles(...WRITE_ADMIN_ROLES)
  @RequirePermission('support.write')
  createWallet(
    @CurrentUser() actor: AuthTokenPayload,
    @Body() dto: CreateSupportWalletDto,
    @Req() req: Request,
  ) {
    return this.support.createWallet(actor.sub, dto, req.ip);
  }

  @Patch('wallets/:id')
  @Roles(...WRITE_ADMIN_ROLES)
  @RequirePermission('support.write')
  updateWallet(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupportWalletDto,
    @Req() req: Request,
  ) {
    return this.support.updateWallet(actor.sub, id, dto, req.ip);
  }

  @Delete('wallets/:id')
  @Roles(...WRITE_ADMIN_ROLES)
  @RequirePermission('support.write')
  deleteWallet(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.support.deleteWallet(actor.sub, id, req.ip);
  }

  @Get('campaigns')
  @RequirePermission('support.read')
  listCampaigns() {
    return this.support.listCampaigns();
  }

  @Post('campaigns')
  @Roles(...WRITE_ADMIN_ROLES)
  @RequirePermission('support.write')
  createCampaign(
    @CurrentUser() actor: AuthTokenPayload,
    @Body() dto: CreateSupportCampaignDto,
    @Req() req: Request,
  ) {
    return this.support.createCampaign(actor.sub, dto, req.ip);
  }

  @Patch('campaigns/:id')
  @Roles(...WRITE_ADMIN_ROLES)
  @RequirePermission('support.write')
  updateCampaign(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupportCampaignDto,
    @Req() req: Request,
  ) {
    return this.support.updateCampaign(actor.sub, id, dto, req.ip);
  }

  @Delete('campaigns/:id')
  @Roles(...WRITE_ADMIN_ROLES)
  @RequirePermission('support.write')
  deleteCampaign(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.support.deleteCampaign(actor.sub, id, req.ip);
  }
}
