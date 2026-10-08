import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import type { RbacMatrix } from '@/lib/api';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

import { RbacMatrixTable } from '@/components/rbac/RbacMatrixTable';

async function loadMatrix(): Promise<RbacMatrix | null> {
  try {
    const api = await getAuthenticatedAdminApi();
    return await api.rbacMatrix();
  } catch {
    return null;
  }
}

export default async function RbacPage() {
  const matrix = await loadMatrix();

  return (
    <>
      <PageHeader
        title="RBAC"
        description="Role-based access control matrix for admin operators."
        actions={
          matrix ? (
            <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
              {matrix.source === 'database' ? 'DB-backed' : 'Phase 1 (computed)'}
            </span>
          ) : null
        }
      />
      <DataShell>
        {matrix?.roles?.length && matrix.permissions?.length ? (
          <div className="space-y-4 p-4">
            {matrix.hint ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                {matrix.hint}
              </p>
            ) : null}
            <RbacMatrixTable matrix={matrix} />
          </div>
        ) : (
          <EmptyState
            title="Could not load permission matrix"
            description="Sign in as super_admin and ensure the API is running on port 3000."
          />
        )}
      </DataShell>
    </>
  );
}
