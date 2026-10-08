import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Calendar,
  Flag,
  FolderOpen,
  HeartHandshake,
  LayoutDashboard,
  Library,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [{ label: 'Executive Overview', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Users & Access',
    items: [
      { label: 'User Management', href: '/users', icon: Users },
      { label: 'RBAC', href: '/settings/rbac', icon: ShieldCheck },
    ],
  },
  {
    title: 'Engagement',
    items: [
      { label: 'Analytics', href: '/analytics', icon: Activity },
      { label: 'Screen Analytics', href: '/analytics/screens', icon: Activity, badge: 'P2' },
      { label: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
  {
    title: 'Islamic Content',
    items: [
      { label: 'Islamic CMS', href: '/cms', icon: BookOpen },
      { label: 'Guide Management', href: '/guides', icon: ScrollText },
      { label: 'Islamic Events', href: '/events', icon: Calendar },
      { label: 'Media Library', href: '/media', icon: Library },
    ],
  },
  {
    title: 'Platform',
    items: [
      { label: 'Feature Flags', href: '/flags', icon: Flag },
      { label: 'Community Support', href: '/support', icon: HeartHandshake },
      { label: 'AI Management', href: '/ai', icon: Bot },
      { label: 'Platform Health', href: '/health', icon: Activity },
      { label: 'API Logs', href: '/logs', icon: FolderOpen },
      { label: 'Security', href: '/security', icon: Shield },
      { label: 'Audit Logs', href: '/audit', icon: ScrollText },
    ],
  },
  {
    title: 'Settings',
    items: [{ label: 'Settings', href: '/settings', icon: Settings }],
  },
];

interface SidebarProps {
  pathname: string;
}

export function Sidebar({ pathname }: SidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
          ☪
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">AhlulBayt+</p>
          <p className="text-[10px] text-muted-foreground">Admin Console</p>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                        active
                          ? 'bg-sidebar-accent font-medium text-foreground'
                          : 'text-sidebar-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      <span className="truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase text-muted-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
