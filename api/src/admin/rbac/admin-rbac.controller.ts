import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles, SUPER_ADMIN_ROLES } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AdminRbacService } from './admin-rbac.service';

@Controller('v1/admin/rbac')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminRbacController {
  constructor(private readonly rbac: AdminRbacService) {}

  @Get('roles')
  listRoles() {
    return this.rbac.listRoles();
  }

  @Get('permissions')
  listPermissions() {
    return this.rbac.listPermissions();
  }

  @Get('matrix')
  @Roles(...SUPER_ADMIN_ROLES)
  matrix() {
    return this.rbac.getMatrix();
  }
}
