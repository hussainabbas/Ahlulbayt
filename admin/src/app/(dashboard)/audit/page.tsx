import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function AuditPage() {
  let rows: unknown[] = [];
  try {
    const api = await getAuthenticatedAdminApi();
    rows = await api.audit();
  } catch {
    rows = [];
  }

  return (
    <>
      <PageHeader title="Audit Logs" description="Immutable trail of admin actions." />
      <DataShell>
        {rows.length ? (
          <div className="divide-y font-mono text-xs">
            {(rows as Array<Record<string, string>>).map((r) => (
              <div key={String(r.id)} className="px-4 py-2">
                <span className="text-primary">{r.action}</span>
                <span className="text-muted-foreground"> · {r.actorId} · {r.createdAt}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No audit entries" description="Mutating admin actions are logged to admin_audit_log." />
        )}
      </DataShell>
    </>
  );
}
