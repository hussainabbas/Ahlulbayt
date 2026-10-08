import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function ApiLogsPage() {
  let logs = null;
  try {
    const api = await getAuthenticatedAdminApi();
    logs = await api.requestLogs();
  } catch {
    logs = null;
  }

  return (
    <>
      <PageHeader
        title="API Logs"
        description="Recent HTTP requests recorded in api_request_logs."
      />
      <DataShell>
        {logs?.items?.length ? (
          <div className="divide-y text-sm">
            {(logs.items as Array<Record<string, string | number>>).map((row) => (
              <div key={String(row.id)} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs">
                    <span className="font-semibold">{row.method}</span> {row.path}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {row.durationMs}ms · {row.createdAt}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    Number(row.statusCode) >= 500
                      ? 'bg-destructive/15 text-destructive'
                      : Number(row.statusCode) >= 400
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {row.statusCode}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No request logs yet"
            description="Logs appear after request logging middleware is enabled. Table is ready."
          />
        )}
      </DataShell>
    </>
  );
}
