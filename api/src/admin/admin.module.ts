import { Module } from '@nestjs/common';

import { AnalyticsModule } from '../analytics/analytics.module';
import { ContentModule } from '../content/content.module';
import { AdminAiController } from './ai/admin-ai.controller';
import { AdminAiService } from './ai/admin-ai.service';
import { AdminAnalyticsController } from './analytics/admin-analytics.controller';
import { AdminAnalyticsService } from './analytics/admin-analytics.service';
import { AdminAuditController } from './audit/admin-audit.controller';
import { AdminAuditService } from './audit/admin-audit.service';
import { AdminContentController } from './content/admin-content.controller';
import { AdminContentService } from './content/admin-content.service';
import { RolesGuard } from './guards/roles.guard';
import { AdminNotificationsController } from './notifications/admin-notifications.controller';
import { AdminNotificationsService } from './notifications/admin-notifications.service';
import { AdminUsersController } from './users/admin-users.controller';
import { AdminUsersService } from './users/admin-users.service';

@Module({
  imports: [ContentModule, AnalyticsModule],
  controllers: [
    AdminUsersController,
    AdminAnalyticsController,
    AdminNotificationsController,
    AdminContentController,
    AdminAiController,
    AdminAuditController,
  ],
  providers: [
    AdminUsersService,
    AdminAnalyticsService,
    AdminNotificationsService,
    AdminContentService,
    AdminAiService,
    AdminAuditService,
    RolesGuard,
  ],
  exports: [AdminAuditService, RolesGuard],
})
export class AdminModule {}
