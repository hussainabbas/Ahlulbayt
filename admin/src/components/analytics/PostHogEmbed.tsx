'use client';

interface PostHogEmbedProps {
  embedUrl?: string;
  projectId?: string;
  host?: string;
}

function buildProjectUrl(projectId: string, host: string) {
  const base = host.replace(/\/$/, '');
  return `${base}/project/${projectId}`;
}

export function PostHogEmbed({ embedUrl, projectId, host }: PostHogEmbedProps) {
  const resolvedEmbed = embedUrl?.trim();
  const resolvedProjectId = projectId?.trim();
  const resolvedHost = (host?.trim() || 'https://us.posthog.com').replace(/\/$/, '');

  if (resolvedEmbed) {
    return (
      <div className="overflow-hidden rounded-lg border bg-background">
        <iframe
          title="PostHog analytics"
          src={resolvedEmbed}
          className="h-[min(720px,70vh)] w-full border-0"
          allow="fullscreen"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  if (resolvedProjectId) {
    const projectUrl = buildProjectUrl(resolvedProjectId, resolvedHost);
    return (
      <div className="space-y-4 rounded-lg border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          PostHog project is configured. Create a shared insight or dashboard for{' '}
          <code className="rounded bg-muted px-1">app.screen_view</code> events, then set{' '}
          <code className="rounded bg-muted px-1">NEXT_PUBLIC_POSTHOG_EMBED_URL</code> to the
          embed URL from PostHog (Share → Embed).
        </p>
        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Open PostHog project →
        </a>
        <p className="text-xs text-muted-foreground">
          Mobile emits <code className="rounded bg-muted px-1">app.screen_view</code> with screen
          name properties — filter on that event in PostHog Trends or Funnels.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">PostHog not configured</p>
      <p>Add to <code className="rounded bg-muted px-1">admin/.env.local</code>:</p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
{`NEXT_PUBLIC_POSTHOG_PROJECT_ID=your_project_id
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
# Optional — shared insight embed URL from PostHog UI:
NEXT_PUBLIC_POSTHOG_EMBED_URL=https://us.posthog.com/embedded/...`}
      </pre>
      <p className="text-xs">
        The mobile app already sends <code className="rounded bg-muted px-1">app.screen_view</code>{' '}
        events. Build a screen funnel in PostHog, enable sharing, and paste the embed URL above.
      </p>
    </div>
  );
}
