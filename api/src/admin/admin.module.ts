import { Module } from '@nestjs/common';

import { AnalyticsModule } from '../analytics/analytics.module';
import { ContentModule } from '../content/content.module';
import { SupportModule } from '../support/support.module';
import { AdminAiController } from './ai/admin-ai.controller';
import { AdminAiService } from './ai/admin-ai.service';
import { AdminAnalyticsController } from './analytics/admin-analytics.controller';
import { AdminAnalyticsService } from './analytics/admin-analytics.service';
import { AdminAuditController } from './audit/admin-audit.controller';
import { AdminAuditService } from './audit/admin-audit.service';
import { AdminContentController } from './content/admin-content.controller';
import { AdminContentService } from './content/admin-content.service';
import { AdminEventsController } from './events/admin-events.controller';
import { AdminEventsService } from './events/admin-events.service';
import { AdminFlagsController } from './flags/admin-flags.controller';
import { AdminFlagsService } from './flags/admin-flags.service';
import { AdminGuidesController } from './guides/admin-guides.controller';
import { AdminGuidesService } from './guides/admin-guides.service';
import { AdminHealthController } from './health/admin-health.controller';
import { AdminHealthService } from './health/admin-health.service';
import { AdminLogsController } from './logs/admin-logs.controller';
import { AdminLogsService } from './logs/admin-logs.service';
import { AdminMediaController } from './media/admin-media.controller';
import { AdminMediaService } from './media/admin-media.service';
import { AdminNotificationsController } from './notifications/admin-notifications.controller';
import { AdminNotificationsService } from './notifications/admin-notifications.service';
import { AdminOverviewController } from './overview/admin-overview.controller';
import { AdminOverviewService } from './overview/admin-overview.service';
import { AdminRbacController } from './rbac/admin-rbac.controller';
import { AdminRbacService } from './rbac/admin-rbac.service';
import { AdminSecurityController } from './security/admin-security.controller';
import { AdminSecurityService } from './security/admin-security.service';
import { AdminSupportController } from './support/admin-support.controller';
import { AdminSupportService } from './support/admin-support.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { AdminUsersController } from './users/admin-users.controller';
import { AdminUsersService } from './users/admin-users.service';

@Module({
  imports: [ContentModule, AnalyticsModule, SupportModule],
  controllers: [
    AdminOverviewController,
    AdminUsersController,
    AdminAnalyticsController,
    AdminNotificationsController,
    AdminContentController,
    AdminGuidesController,
    AdminEventsController,
    AdminFlagsController,
    AdminHealthController,
    AdminLogsController,
    AdminSecurityController,
    AdminAiController,
    AdminMediaController,
    AdminRbacController,
    AdminAuditController,
    AdminSupportController,
  ],
  providers: [
    AdminOverviewService,
    AdminUsersService,
    AdminAnalyticsService,
    AdminNotificationsService,
    AdminContentService,
    AdminGuidesService,
    AdminEventsService,
    AdminFlagsService,
    AdminHealthService,
    AdminLogsService,
    AdminSecurityService,
    AdminAiService,
    AdminMediaService,
    AdminRbacService,
    AdminAuditService,
    AdminSupportService,
    AdminAuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [AdminAuditService, RolesGuard, PermissionsGuard, AdminAuthGuard],
})
export class AdminModule {}
