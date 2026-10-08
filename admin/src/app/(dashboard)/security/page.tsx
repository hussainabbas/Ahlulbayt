import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function SecurityPage() {
  let events = null;
  try {
    const api = await getAuthenticatedAdminApi();
    events = await api.securityEvents();
  } catch {
    events = null;
  }

  return (
    <>
      <PageHeader title="Security" description="Auth failures, incidents, and WAF events." />
      <DataShell>
        {events?.items?.length ? (
          <div className="divide-y text-sm">
            {(events.items as Array<Record<string, string>>).map((e) => (
              <div key={String(e.id)} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">{e.eventType}</p>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{e.severity}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No security events" description="security_events table ready for ingest." />
        )}
      </DataShell>
    </>
  );
}
