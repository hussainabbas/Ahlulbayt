import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';

export default function AiPage() {
  return (
    <>
      <PageHeader title="AI Management" description="Config, guardrails, conversations, and RAG corpus." />
      <DataShell>
        <EmptyState
          title="AI admin shell"
          description="Use GET/PATCH /v1/admin/ai/config and guardrails endpoints. RAG upload in phase 2."
        />
      </DataShell>
    </>
  );
}
