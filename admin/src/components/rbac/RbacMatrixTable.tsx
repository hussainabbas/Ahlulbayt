import type { RbacMatrix } from '@/lib/api';

interface RbacMatrixTableProps {
  matrix: RbacMatrix;
}

export function RbacMatrixTable({ matrix }: RbacMatrixTableProps) {
  const roleSlugs = matrix.roles.map((r) => r.slug).sort((a, b) => {
    const order = ['moderator', 'admin', 'super_admin'];
    return order.indexOf(a) - order.indexOf(b);
  });

  const grantSet = new Set(
    matrix.grants.map((g) => `${g.roleSlug}::${g.permissionSlug}`),
  );

  const permissions = [...matrix.permissions].sort((a, b) => a.slug.localeCompare(b.slug));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="sticky left-0 z-10 bg-card px-3 py-2.5 font-medium">Permission</th>
            {roleSlugs.map((slug) => (
              <th key={slug} className="px-3 py-2.5 text-center font-medium capitalize">
                {slug.replace('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((perm) => (
            <tr key={perm.slug} className="border-b border-border/60 hover:bg-muted/30">
              <td className="sticky left-0 z-10 bg-card px-3 py-2 font-mono text-xs">
                {perm.slug}
              </td>
              {roleSlugs.map((roleSlug) => {
                const granted = grantSet.has(`${roleSlug}::${perm.slug}`);
                return (
                  <td key={roleSlug} className="px-3 py-2 text-center">
                    <span
                      className={
                        granted
                          ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40'
                      }
                      aria-label={granted ? 'granted' : 'denied'}
                    >
                      {granted ? '✓' : '—'}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
