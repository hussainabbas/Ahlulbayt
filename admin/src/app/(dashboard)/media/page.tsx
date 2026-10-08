import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function MediaPage() {
  let media = null;
  try {
    const api = await getAuthenticatedAdminApi();
    media = await api.media();
  } catch {
    media = null;
  }

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Cloudflare R2 assets with CDN URLs."
        actions={
          <button
            type="button"
            className="rounded-lg border px-3 py-1.5 text-xs"
            disabled
          >
            Upload (R2 phase 2)
          </button>
        }
      />
      <DataShell>
        {media?.items?.length ? (
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {(media.items as Array<Record<string, string>>).map((m) => (
              <div key={m.id} className="rounded-lg border p-3 text-sm">
                <p className="truncate font-medium">{m.filename}</p>
                <p className="text-xs text-muted-foreground">{m.mimeType}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No media assets" description="R2 presigned upload in phase 2." />
        )}
      </DataShell>
    </>
  );
}
