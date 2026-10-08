import { ChartPlaceholder } from '@/components/ui/chart-placeholder';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';
import { formatNumber } from '@/lib/utils';

export default async function AnalyticsPage() {
  let overview = null;
  try {
    const api = await getAuthenticatedAdminApi();
    overview = await api.analyticsOverview();
  } catch {
    overview = null;
  }

  return (
    <>
      <PageHeader title="Analytics" description="DAU, retention, prayer, and reading habits." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={overview ? formatNumber(overview.kpis.totalUsers) : '—'} />
        <MetricCard label="Devices" value={overview ? formatNumber(overview.kpis.registeredDevices) : '—'} />
        <MetricCard label="Sync events (30d)" value={overview ? formatNumber(overview.kpis.syncEvents30d) : '—'} />
        <MetricCard label="AI chats (30d)" value={overview ? formatNumber(overview.kpis.aiConversations30d) : '—'} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartPlaceholder title="Retention" />
        <ChartPlaceholder title="Prayer completion" />
      </div>
    </>
  );
}
