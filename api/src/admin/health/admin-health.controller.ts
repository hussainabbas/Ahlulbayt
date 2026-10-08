import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminHealthService } from './admin-health.service';

@Controller('v1/admin/health')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminHealthController {
  constructor(private readonly health: AdminHealthService) {}

  @Get()
  platform() {
    return this.health.getPlatformHealth();
  }
}
