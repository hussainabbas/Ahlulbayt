import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles, SUPER_ADMIN_ROLES } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AdminAuditService } from '../audit/admin-audit.service';

class AuditQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

@Controller('v1/admin/audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...SUPER_ADMIN_ROLES)
export class AdminAuditController {
  constructor(private readonly audit: AdminAuditService) {}

  @Get()
  list(@Query() query: AuditQueryDto) {
    return this.audit.list(query.limit ?? 50, query.offset ?? 0);
  }
}
