import { NextResponse } from 'next/server';

import { API_BASE } from '@/lib/api';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/v1/auth/guest`, {
      method: 'POST',
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return NextResponse.json(
        {
          ok: false,
          apiBase: API_BASE,
          message: 'API responded with an error. Check DATABASE_URL and migrations.',
          status: res.status,
          detail: body.slice(0, 200),
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      apiBase: API_BASE,
      message: 'API is reachable',
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        apiBase: API_BASE,
        message: `Cannot reach API at ${API_BASE}. Run: cd api && npm run start:dev`,
      },
      { status: 503 },
    );
  }
}
