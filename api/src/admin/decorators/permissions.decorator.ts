import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/** Require one or more permission slugs (e.g. `users.read`, `cms.publish`) */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const PERMISSION_SLUGS = {
  USERS_READ: 'users.read',
  USERS_WRITE: 'users.write',
  USERS_DELETE: 'users.delete',
  ANALYTICS_READ: 'analytics.read',
  ANALYTICS_EXPORT: 'analytics.export',
  NOTIFICATIONS_READ: 'notifications.read',
  NOTIFICATIONS_WRITE: 'notifications.write',
  CMS_READ: 'cms.read',
  CMS_WRITE: 'cms.write',
  CMS_PUBLISH: 'cms.publish',
  GUIDES_READ: 'guides.read',
  GUIDES_WRITE: 'guides.write',
  EVENTS_READ: 'events.read',
  EVENTS_WRITE: 'events.write',
  FLAGS_READ: 'flags.read',
  FLAGS_WRITE: 'flags.write',
  HEALTH_READ: 'health.read',
  LOGS_READ: 'logs.read',
  SECURITY_READ: 'security.read',
  SECURITY_WRITE: 'security.write',
  AI_READ: 'ai.read',
  AI_WRITE: 'ai.write',
  MEDIA_READ: 'media.read',
  MEDIA_WRITE: 'media.write',
  RBAC_READ: 'rbac.read',
  RBAC_WRITE: 'rbac.write',
  AUDIT_READ: 'audit.read',
  SUPPORT_READ: 'support.read',
  SUPPORT_WRITE: 'support.write',
} as const;
