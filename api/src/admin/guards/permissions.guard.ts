import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthTokenPayload } from '../../auth/token.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ADMIN_ROLES, type AdminRole } from '../decorators/roles.decorator';
import { ROLE_PERMISSIONS } from '../rbac/role-permissions.constant';

/** Phase 1: maps legacy users.role to permission sets. Phase 2: DB-backed role_permissions */

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[] | undefined>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<{ user?: AuthTokenPayload }>();
    const role = request.user?.role as AdminRole | undefined;

    if (!role || !ADMIN_ROLES.includes(role)) {
      throw new ForbiddenException('Admin access required');
    }

    const granted = new Set(ROLE_PERMISSIONS[role] ?? []);
    const missing = required.filter((p) => !granted.has(p));

    if (missing.length) {
      throw new ForbiddenException(`Missing permissions: ${missing.join(', ')}`);
    }

    return true;
  }
}
