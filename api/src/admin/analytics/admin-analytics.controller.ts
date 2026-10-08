import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminAnalyticsService } from './admin-analytics.service';

class TrendQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(7)
  @Max(90)
  days?: number;
}

@Controller('v1/admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminAnalyticsController {
  constructor(private readonly analytics: AdminAnalyticsService) {}

  @Get('overview')
  overview() {
    return this.analytics.overview();
  }

  @Get('features')
  features() {
    return this.analytics.featureUsage();
  }

  @Get('signups')
  signups(@Query() query: TrendQueryDto) {
    return this.analytics.signupTrend(query.days ?? 30);
  }

  @Get('retention')
  retention(@Query() query: TrendQueryDto) {
    return this.analytics.retention(query.days ?? 30);
  }

  @Get('engagement')
  engagement(@Query() query: TrendQueryDto) {
    return this.analytics.engagement(query.days ?? 30);
  }

  @Get('prayer')
  prayer(@Query() query: TrendQueryDto) {
    return this.analytics.prayerCompletion(query.days ?? 30);
  }

  @Get('reading')
  reading(@Query() query: TrendQueryDto) {
    return this.analytics.readingHabits(query.days ?? 30);
  }
}
