import { Inject, Injectable } from '@nestjs/common';

import { DRIZZLE, DrizzleDB } from '../../database/database.module';
import { permissions, roles, rolePermissions } from '../../database/schema';

import { ALL_PERMISSION_SLUGS, ROLE_PERMISSIONS } from './role-permissions.constant';

function slugToParts(slug: string) {
  const dot = slug.indexOf('.');
  if (dot === -1) return { resource: slug, action: 'access' };
  return { resource: slug.slice(0, dot), action: slug.slice(dot + 1) };
}

@Injectable()
export class AdminRbacService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async listRoles() {
    const roleRows = await this.db.select().from(roles);
    return { items: roleRows, total: roleRows.length };
  }

  async listPermissions() {
    const permRows = await this.db.select().from(permissions);
    return { items: permRows, total: permRows.length };
  }

  private buildPhase1Matrix(roleRows: Array<{ id: string; slug: string; name: string }>) {
    const permissionRows = ALL_PERMISSION_SLUGS.map((slug) => {
      const { resource, action } = slugToParts(slug);
      return {
        id: `phase1-${slug}`,
        slug,
        resource,
        action,
        description: null as string | null,
      };
    });

    const rolePermissionRows: Array<{ roleId: string; permissionId: string; roleSlug: string; permissionSlug: string }> = [];

    for (const role of roleRows) {
      const slugs = ROLE_PERMISSIONS[role.slug as keyof typeof ROLE_PERMISSIONS] ?? [];
      for (const slug of slugs) {
        rolePermissionRows.push({
          roleId: role.id,
          permissionId: `phase1-${slug}`,
          roleSlug: role.slug,
          permissionSlug: slug,
        });
      }
    }

    return { permissionRows, rolePermissionRows };
  }

  async getMatrix() {
    const [roleRows, permRows, mappings] = await Promise.all([
      this.db.select().from(roles),
      this.db.select().from(permissions),
      this.db.select().from(rolePermissions),
    ]);

    const usePhase1Fallback = permRows.length === 0 || mappings.length === 0;

    if (usePhase1Fallback) {
      const { permissionRows, rolePermissionRows } = this.buildPhase1Matrix(roleRows);

      return {
        roles: roleRows,
        permissions: permissionRows,
        grants: rolePermissionRows.map((row) => ({
          roleSlug: row.roleSlug,
          permissionSlug: row.permissionSlug,
        })),
        legacyRoleMap: {
          moderator: 'moderator',
          admin: 'admin',
          super_admin: 'super_admin',
        },
        status: 'phase1_legacy_users_role',
        source: 'computed',
        hint: 'Run: cd api && npm run db:seed:rbac to persist permissions in PostgreSQL',
      };
    }

    const roleById = new Map(roleRows.map((r) => [r.id, r.slug]));
    const permById = new Map(permRows.map((p) => [p.id, p.slug]));

    return {
      roles: roleRows,
      permissions: permRows,
      grants: mappings.map((m) => ({
        roleSlug: roleById.get(m.roleId) ?? m.roleId,
        permissionSlug: permById.get(m.permissionId) ?? m.permissionId,
      })),
      legacyRoleMap: {
        moderator: 'moderator',
        admin: 'admin',
        super_admin: 'super_admin',
      },
      status: 'db_backed',
      source: 'database',
    };
  }
}
