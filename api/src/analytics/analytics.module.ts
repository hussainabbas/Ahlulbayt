import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsIngestService } from './analytics-ingest.service';
import { AnalyticsQueryService } from './analytics-query.service';
import { AnalyticsRollupService } from './analytics-rollup.service';

@Module({
  imports: [AuthModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsIngestService, AnalyticsQueryService, AnalyticsRollupService, OptionalJwtAuthGuard],
  exports: [AnalyticsIngestService, AnalyticsQueryService, AnalyticsRollupService],
})
export class AnalyticsModule {}
