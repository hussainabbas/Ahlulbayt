import { DataShell, PageHeader } from '@/components/ui/page-header';
import { getServerAdminToken } from '@/lib/server-api';

import { SupportAdminPanel } from './SupportAdminPanel';

export default async function SupportPage() {
  const token = await getServerAdminToken();

  return (
    <>
      <PageHeader
        title="Community Support"
        description="Manage crypto wallet addresses, campaigns, and home card settings. No payment processing — addresses only."
      />
      <DataShell>
        <SupportAdminPanel token={token} />
      </DataShell>
    </>
  );
}
