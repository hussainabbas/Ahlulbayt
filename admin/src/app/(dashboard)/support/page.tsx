import { DataShell, PageHeader } from '@/components/ui/page-header';
import { getServerAdminToken } from '@/lib/server-api';

import { SupportAdminPanel } from './SupportAdminPanel';

export default async function SupportPage() {
  const token = await getServerAdminToken();

  return (
    <>
      <PageHeader
        title="Community Support"
        description="Manage crypto wallets, bank/IBAN details, campaigns, and home card. Display-only — no payment processing."
      />
      <DataShell>
        <SupportAdminPanel token={token} />
      </DataShell>
    </>
  );
}
