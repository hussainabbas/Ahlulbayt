import Link from 'next/link';

import { DataShell, PageHeader } from '@/components/ui/page-header';

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Console preferences and access control." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/settings/rbac" className="block">
          <DataShell className="p-4 transition-colors hover:border-primary/40">
            <p className="font-medium">RBAC</p>
            <p className="mt-1 text-sm text-muted-foreground">Roles, permissions, and matrix</p>
          </DataShell>
        </Link>
        <DataShell className="p-4 opacity-60">
          <p className="font-medium">Appearance</p>
          <p className="mt-1 text-sm text-muted-foreground">Use top bar theme toggle</p>
        </DataShell>
      </div>
    </>
  );
}
