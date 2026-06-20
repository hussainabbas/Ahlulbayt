import { NextResponse } from 'next/server';

import { API_BASE } from '@/lib/api';
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from '@/lib/auth';

interface LoginBody {
  email?: string;
  password?: string;
}

interface AuthLoginResponse {
  tokens?: { accessToken: string; refreshToken: string; expiresIn: number };
  user?: { email: string | null; displayName: string | null };
  message?: string | string[];
  statusCode?: number;
}

function extractMessage(data: AuthLoginResponse, fallback: string): string {
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (Array.isArray(data.message) && data.message.length) return data.message.join(', ');
  return fallback;
}

function devApiHint(): { apiBase?: string } {
  return process.env.NODE_ENV === 'development' ? { apiBase: API_BASE } : {};
}

async function readApiJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return { message: text } as T;
  }
}

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  let loginRes: Response;
  try {
    loginRes = await fetch(`${API_BASE}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      {
        message: `Cannot reach the API at ${API_BASE}. Start it with: cd api && npm run start:dev`,
        code: 'API_UNREACHABLE',
        ...devApiHint(),
      },
      { status: 503 },
    );
  }

  const data = await readApiJson<AuthLoginResponse>(loginRes);

  if (!loginRes.ok || !data.tokens?.accessToken) {
    const fallback =
      loginRes.status >= 500
        ? 'API error — is PostgreSQL running and migrations applied?'
        : 'Invalid email or password';
    const devHint =
      process.env.NODE_ENV === 'development' && loginRes.status === 401
        ? ` (API: ${API_BASE} — use local credentials only against localhost, or production password against Railway)`
        : '';
    return NextResponse.json(
      {
        message: extractMessage(data, fallback) + devHint,
        code: loginRes.status >= 500 ? 'API_ERROR' : 'AUTH_FAILED',
        apiStatus: loginRes.status,
        ...devApiHint(),
      },
      { status: loginRes.status >= 400 ? loginRes.status : 401 },
    );
  }

  const { accessToken, refreshToken, expiresIn } = data.tokens;

  let adminProbe: Response;
  try {
    adminProbe = await fetch(`${API_BASE}/v1/admin/health`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      {
        message: `Signed in, but could not verify admin access — API unreachable at ${API_BASE}.`,
        code: 'API_UNREACHABLE',
      },
      { status: 503 },
    );
  }

  if (!adminProbe.ok) {
    return NextResponse.json(
      {
        message:
          'Signed in, but this account is not an admin. Run: cd api && npm run db:seed:admin',
        code: 'NOT_ADMIN',
      },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    user: data.user,
    expiresIn,
  });

  response.cookies.set(ADMIN_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: expiresIn || 900,
  });

  if (refreshToken) {
    response.cookies.set(ADMIN_REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
