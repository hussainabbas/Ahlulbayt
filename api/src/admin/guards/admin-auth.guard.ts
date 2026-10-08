import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** JWT auth guard scoped to admin routes — pair with RolesGuard or PermissionsGuard */
@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {}
