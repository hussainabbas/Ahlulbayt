import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminSecurityService } from './admin-security.service';

class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

@Controller('v1/admin/security')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminSecurityController {
  constructor(private readonly security: AdminSecurityService) {}

  @Get('overview')
  overview() {
    return this.security.overview();
  }

  @Get('events')
  events(@Query() query: PaginationDto) {
    return this.security.listEvents(query.limit ?? 50, query.offset ?? 0);
  }
}
