'use client';

import { Moon, Search, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface SessionUser {
  email: string | null;
  displayName: string | null;
}

export function TopBar() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('admin-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    root.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data: { authenticated?: boolean; user?: SessionUser }) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .catch(() => undefined);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('admin-theme', next ? 'dark' : 'light');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  const label = user?.displayName ?? user?.email ?? 'Admin';
  const initial = label.charAt(0).toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-sm">
      <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search users, flags, content… (⌘K)"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled
        />
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-accent',
          )}
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors hover:bg-accent"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {initial}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium leading-none">{label}</p>
            <p className="text-[10px] text-muted-foreground">Sign out</p>
          </div>
        </button>
      </div>
    </header>
  );
}
