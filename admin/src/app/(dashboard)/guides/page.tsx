import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';

export default function GuidesPage() {
  return (
    <>
      <PageHeader title="Guide Management" description="Worship guide steps and simulator flows." />
      <DataShell>
        <EmptyState title="Guide catalog stub" description="Backed by cms_content (guide_step) in phase 2." />
      </DataShell>
    </>
  );
}
