import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../../auth/token.service';
import { Roles, SUPER_ADMIN_ROLES, WRITE_ADMIN_ROLES } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AdminUsersService } from './admin-users.service';
import { AdminUpdateUserDto, AdminUsersQueryDto } from './dto/admin-users.dto';

@Controller('v1/admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(private readonly users: AdminUsersService) {}

  @Get()
  list(@Query() query: AdminUsersQueryDto) {
    return this.users.list(query);
  }

  @Get('stats')
  stats() {
    return this.users.stats();
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.getById(id);
  }

  @Patch(':id')
  @Roles(...WRITE_ADMIN_ROLES)
  update(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
    @Req() req: Request,
  ) {
    return this.users.update(actor.sub, id, dto, req.ip);
  }

  @Delete(':id')
  @Roles(...SUPER_ADMIN_ROLES)
  remove(
    @CurrentUser() actor: AuthTokenPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.users.softDelete(actor.sub, id, req.ip);
  }
}
