import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function HealthPage() {
  let health = null;
  try {
    const api = await getAuthenticatedAdminApi();
    health = await api.health();
  } catch {
    health = null;
  }

  const services = health?.services ?? {
    api: { status: 'unknown' },
    postgres: { status: 'unknown' },
    redis: { status: 'stub' },
  };

  return (
    <>
      <PageHeader title="Platform Health" description="Service status and latency snapshots." />
      <div className="mb-4">
        <MetricCard
          label="Overall"
          value={health?.status ?? 'offline'}
          hint="Redis, R2, FCM stubs in phase 1"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(services).map(([name, svc]) => (
          <div key={name} className="rounded-xl border bg-card p-4 shadow-card">
            <p className="text-xs uppercase text-muted-foreground">{name}</p>
            <p className="mt-1 text-lg font-semibold capitalize">{svc.status}</p>
          </div>
        ))}
      </div>
    </>
  );
}
