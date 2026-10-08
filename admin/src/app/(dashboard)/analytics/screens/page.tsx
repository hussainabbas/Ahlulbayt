import { PostHogEmbed } from '@/components/analytics/PostHogEmbed';
import { DataShell, PageHeader } from '@/components/ui/page-header';

export default function ScreenAnalyticsPage() {
  const embedUrl = process.env.NEXT_PUBLIC_POSTHOG_EMBED_URL;
  const projectId = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const configured = Boolean(embedUrl?.trim() || projectId?.trim());

  return (
    <>
      <PageHeader
        title="Screen Analytics"
        description="PostHog funnels and heatmaps from mobile app.screen_view events."
        actions={
          <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            {configured ? 'PostHog linked' : 'Configure PostHog'}
          </span>
        }
      />
      <DataShell>
        <div className="p-4">
          <PostHogEmbed embedUrl={embedUrl} projectId={projectId} host={host} />
        </div>
      </DataShell>
    </>
  );
}
