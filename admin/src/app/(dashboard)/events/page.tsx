import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function EventsPage() {
  let events = null;
  try {
    const api = await getAuthenticatedAdminApi();
    events = await api.events();
  } catch {
    events = null;
  }

  return (
    <>
      <PageHeader title="Islamic Events Engine" description="Hijri and Gregorian calendar curation." />
      <DataShell>
        {events?.items?.length ? (
          <div className="divide-y">
            {(events.items as Array<Record<string, string>>).map((e) => (
              <div key={e.id} className="px-4 py-3 text-sm">
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">
                  {e.eventType} · {e.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No events" description="Seed islamic_events via migration or admin API." />
        )}
      </DataShell>
    </>
  );
}
