import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminGuidesService } from './admin-guides.service';

@Controller('v1/admin/guides')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminGuidesController {
  constructor(private readonly guides: AdminGuidesService) {}

  @Get()
  list() {
    return this.guides.list();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.guides.getById(id);
  }
}
