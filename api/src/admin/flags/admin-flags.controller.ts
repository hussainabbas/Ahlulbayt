import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminFlagsService } from './admin-flags.service';

@Controller('v1/admin/flags')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminFlagsController {
  constructor(private readonly flags: AdminFlagsService) {}

  @Get()
  list() {
    return this.flags.list();
  }

  @Get(':key')
  getByKey(@Param('key') key: string) {
    return this.flags.getByKey(key);
  }
}
