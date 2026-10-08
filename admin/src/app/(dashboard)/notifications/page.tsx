import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function NotificationsPage() {
  let campaigns = null;
  try {
    const api = await getAuthenticatedAdminApi();
    campaigns = await api.campaigns();
  } catch {
    campaigns = null;
  }

  return (
    <>
      <PageHeader
        title="Advanced Notifications"
        description="Broadcast campaigns, segments, and delivery tracking."
        actions={
          <button
            type="button"
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            disabled
          >
            New campaign
          </button>
        }
      />
      <DataShell>
        {campaigns?.items?.length ? (
          <div className="divide-y">
            {(campaigns.items as Array<Record<string, string>>).map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.status}</p>
                </div>
                <span className="text-xs text-muted-foreground">{c.recipientCount ?? 0} recipients</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No campaigns" description="Create a draft campaign via the admin API." />
        )}
      </DataShell>
    </>
  );
}
