import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthTokenPayload } from '../../auth/token.service';
import { ADMIN_ROLES, ROLES_KEY, type AdminRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const roles = requiredRoles ?? ADMIN_ROLES;
    const request = context.switchToHttp().getRequest<{ user?: AuthTokenPayload }>();
    const user = request.user;

    if (!user?.role || !roles.includes(user.role as AdminRole)) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
