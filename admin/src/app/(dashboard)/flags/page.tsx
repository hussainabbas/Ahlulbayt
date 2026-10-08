import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function FlagsPage() {
  let flags = null;
  try {
    const api = await getAuthenticatedAdminApi();
    flags = await api.flags();
  } catch {
    flags = null;
  }

  return (
    <>
      <PageHeader title="Feature Flags" description="Rollouts and overrides for mobile remote config." />
      <DataShell>
        {flags?.items?.length ? (
          <div className="divide-y">
            {(flags.items as Array<Record<string, string | boolean>>).map((f) => (
              <div key={String(f.id)} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-mono text-xs">{f.key}</p>
                  <p className="text-muted-foreground">{f.name}</p>
                </div>
                <span
                  className={
                    f.enabled
                      ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400'
                      : 'rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'
                  }
                >
                  {f.enabled ? 'on' : 'off'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No flags" description="Insert rows into feature_flags table." />
        )}
      </DataShell>
    </>
  );
}
