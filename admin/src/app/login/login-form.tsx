'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const LOCAL_DEFAULT_EMAIL = 'admin@ahlulbayt.com';
const LOCAL_DEFAULT_PASSWORD = 'Ahlulbayt@512';

function isLocalApi(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(url.replace(/\/+$/, ''));
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';
  const localApi = useMemo(() => isLocalApi(API_BASE), []);

  const [email, setEmail] = useState(
    process.env.NODE_ENV === 'development' && localApi ? LOCAL_DEFAULT_EMAIL : '',
  );
  const [password, setPassword] = useState(
    process.env.NODE_ENV === 'development' && localApi ? LOCAL_DEFAULT_PASSWORD : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as { message?: string };

      if (!res.ok) {
        const payload = data as { message?: string; apiBase?: string; code?: string };
        let message = payload.message ?? 'Login failed';
        if (payload.code === 'API_UNREACHABLE' && payload.apiBase) {
          message = `${message} (configured API: ${payload.apiBase})`;
        }
        setError(message);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError('Could not reach the admin API. Is the NestJS server running on port 3000?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            AhlulBayt+
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use an account with <code className="rounded bg-muted px-1">users.role</code> set to{' '}
            <code className="rounded bg-muted px-1">admin</code> or{' '}
            <code className="rounded bg-muted px-1">super_admin</code>.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            API: <code className="rounded bg-muted px-1">{API_BASE}</code>
          </p>
          {!localApi ? (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
              Production API — use your Railway admin password, not the local default{' '}
              <code className="rounded bg-muted px-1">{LOCAL_DEFAULT_PASSWORD}</code>.
            </p>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
