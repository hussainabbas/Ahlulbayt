import { ChartPlaceholder } from '@/components/ui/chart-placeholder';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';
import { formatNumber } from '@/lib/utils';

async function loadOverview() {
  try {
    const api = await getAuthenticatedAdminApi();
    return await api.overview();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const data = await loadOverview();
  const kpis = data?.kpis;

  return (
    <>
      <PageHeader
        title="Executive Overview"
        description="Platform health, growth, and engagement at a glance."
        actions={
          <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            {data?.generatedAt
              ? `Updated ${new Date(data.generatedAt).toLocaleTimeString()}`
              : 'No data — check API connection or admin role'}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total users"
          value={kpis ? formatNumber(kpis.totalUsers) : '—'}
          hint={kpis ? `+${formatNumber(kpis.newUsers30d)} last 30d` : 'Connect API'}
          trend="up"
        />
        <MetricCard
          label="Signups (24h)"
          value={kpis ? formatNumber(kpis.signups24h) : '—'}
        />
        <MetricCard
          label="Premium subs"
          value={kpis ? formatNumber(kpis.premiumSubscriptions) : '—'}
        />
        <MetricCard
          label="AI conversations (30d)"
          value={kpis ? formatNumber(kpis.aiConversations30d) : '—'}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartPlaceholder title="Signups — 30 days" data={data?.charts?.signups30d} />
        <ChartPlaceholder title="Engagement — 30 days" data={data?.charts?.engagement30d} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Active flags"
          value={data?.platform?.activeFeatureFlags ?? '—'}
        />
        <MetricCard
          label="Draft campaigns"
          value={data?.platform?.draftNotificationCampaigns ?? '—'}
        />
        <MetricCard
          label="Published events"
          value={data?.platform?.publishedIslamicEvents ?? '—'}
        />
        <MetricCard
          label="Security events (30d)"
          value={data?.platform?.securityEvents30d ?? '—'}
        />
        <MetricCard
          label="Registered devices"
          value={kpis ? formatNumber(kpis.registeredDevices) : '—'}
        />
      </div>
    </>
  );
}
