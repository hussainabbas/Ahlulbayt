import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AuthTokenPayload } from '../auth/token.service';
import { AnalyticsIngestService } from './analytics-ingest.service';
import { AnalyticsQueryService } from './analytics-query.service';
import {
  IngestEventsDto,
  RecordPrayerCompletionDto,
  RecordReadingSessionDto,
} from './dto/analytics.dto';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(
    private readonly ingest: AnalyticsIngestService,
    private readonly query: AnalyticsQueryService,
  ) {}

  @Post('events')
  @UseGuards(OptionalJwtAuthGuard)
  async ingestEvents(
    @Req() req: { user?: AuthTokenPayload | null },
    @Body() dto: IngestEventsDto,
  ) {
    return this.ingest.ingest(req.user?.sub ?? null, dto);
  }

  @Post('prayer')
  @UseGuards(JwtAuthGuard)
  async recordPrayer(@CurrentUser() user: AuthTokenPayload, @Body() dto: RecordPrayerCompletionDto) {
    return this.ingest.recordPrayer(user.sub, dto);
  }

  @Post('reading')
  @UseGuards(JwtAuthGuard)
  async recordReading(@CurrentUser() user: AuthTokenPayload, @Body() dto: RecordReadingSessionDto) {
    return this.ingest.recordReading(user.sub, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async myInsights(@CurrentUser() user: AuthTokenPayload, @Query('days') days?: string) {
    const d = days ? Math.min(90, Math.max(7, parseInt(days, 10))) : 30;
    return this.query.userInsights(user.sub, d);
  }
}
