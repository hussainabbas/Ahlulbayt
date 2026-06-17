import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { API_BASE } from '@/lib/api';
import { ADMIN_ACCESS_COOKIE } from '@/lib/auth';

export async function GET() {
  const jar = await cookies();
  const token = jar.get(ADMIN_ACCESS_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const meRes = await fetch(`${API_BASE}/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!meRes.ok) {
    return NextResponse.json({ authenticated: false });
  }

  const user = await meRes.json();
  return NextResponse.json({ authenticated: true, user });
}
