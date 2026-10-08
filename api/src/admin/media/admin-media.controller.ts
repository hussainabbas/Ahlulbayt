import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminMediaService } from './admin-media.service';

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

@Controller('v1/admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminMediaController {
  constructor(private readonly media: AdminMediaService) {}

  @Get()
  list(@Query() query: PaginationDto) {
    return this.media.list(query.limit ?? 50, query.offset ?? 0);
  }
}
