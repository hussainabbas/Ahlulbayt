import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type AdminRole = 'moderator' | 'admin' | 'super_admin';

export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);

export const ADMIN_ROLES: AdminRole[] = ['moderator', 'admin', 'super_admin'];
export const WRITE_ADMIN_ROLES: AdminRole[] = ['admin', 'super_admin'];
export const SUPER_ADMIN_ROLES: AdminRole[] = ['super_admin'];
