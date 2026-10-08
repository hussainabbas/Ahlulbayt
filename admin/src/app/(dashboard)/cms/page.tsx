import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';

const CMS_TYPES = ['quran_meta', 'hadith', 'dua', 'ziyarat', 'event', 'amaal', 'guide_step'];

export default function CmsPage() {
  return (
    <>
      <PageHeader
        title="Islamic CMS"
        description="Polymorphic worship content with universal citations."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CMS_TYPES.map((type) => (
          <div
            key={type}
            className="rounded-xl border bg-card p-4 shadow-card transition-colors hover:border-primary/40"
          >
            <p className="font-mono text-xs text-primary">{type}</p>
            <p className="mt-1 text-sm text-muted-foreground">0 published</p>
          </div>
        ))}
      </div>
      <DataShell className="mt-4">
        <EmptyState
          title="CMS editor shell"
          description="Phase 2: polymorphic CRUD on cms_content + content_citations editor."
        />
      </DataShell>
    </>
  );
}
