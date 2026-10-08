import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../decorators/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminOverviewService } from './admin-overview.service';

@Controller('v1/admin/overview')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AdminOverviewController {
  constructor(private readonly overview: AdminOverviewService) {}

  @Get()
  @RequirePermission('analytics.read')
  getOverview() {
    return this.overview.getExecutiveOverview();
  }
}
