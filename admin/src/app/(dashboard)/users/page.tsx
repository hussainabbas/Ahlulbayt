import { DataShell, EmptyState, PageHeader } from '@/components/ui/page-header';
import { getAuthenticatedAdminApi } from '@/lib/server-api';

export default async function UsersPage() {
  let users: { items: unknown[]; total: number } | null = null;
  try {
    const api = await getAuthenticatedAdminApi();
    users = await api.users({ limit: 25 });
  } catch {
    users = null;
  }

  return (
    <>
      <PageHeader
        title="User Management"
        description="Search, tier management, and support actions."
      />
      <DataShell>
        {users?.items?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Tier</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {(users.items as Array<Record<string, string>>).map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{u.email ?? u.displayName ?? u.id}</td>
                    <td className="px-4 py-3">{u.tier}</td>
                    <td className="px-4 py-3">{u.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No users loaded"
            description="Start the API with an admin JWT, or seed users in PostgreSQL."
          />
        )}
      </DataShell>
    </>
  );
}
