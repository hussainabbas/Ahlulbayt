import { Logger } from '@nestjs/common';

const PLACEHOLDER = /change-me|changeme|secret-min-32|example|^password$/i;
const MIN_SECRET_LENGTH = 32;

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Refuse to start in production with missing, short or placeholder secrets.
 * A token signed with a guessable secret lets anyone forge an admin session.
 */
export function assertProductionConfig(): void {
  if (!isProduction()) return;

  const problems: string[] = [];
  for (const name of ['JWT_ACCESS_SECRET']) {
    const value = process.env[name] ?? '';
    if (value.length < MIN_SECRET_LENGTH) {
      problems.push(`${name} must be at least ${MIN_SECRET_LENGTH} characters`);
    } else if (PLACEHOLDER.test(value)) {
      problems.push(`${name} is still a placeholder value`);
    }
  }
  if (!process.env.DATABASE_URL) problems.push('DATABASE_URL is not set');
  if (process.env.MONETIZATION_DEV_MODE === 'true') {
    problems.push('MONETIZATION_DEV_MODE must not be "true" in production');
  }

  if (problems.length) {
    throw new Error(`Unsafe production configuration:\n- ${problems.join('\n- ')}`);
  }
}

/**
 * Browser origins allowed to call the API with credentials.
 * Native mobile clients send no Origin header and are unaffected.
 */
export function corsOrigins(): string[] | boolean {
  const configured = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  if (configured.length) return configured;

  if (isProduction()) {
    new Logger('Bootstrap').warn(
      'CORS_ORIGINS is not set — cross-origin browser requests are disabled. ' +
        'Set it to the admin dashboard origin(s), comma separated.',
    );
    return false;
  }
  return true; // local development: reflect any origin
}

/**
 * Number of reverse-proxy hops to trust for the client IP. Without this, every
 * request behind Railway's proxy shares one IP and therefore one rate-limit bucket.
 */
export function trustProxySetting(): number | boolean {
  const raw = process.env.TRUST_PROXY;
  if (raw === undefined || raw === '') return isProduction() ? 1 : false;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  const hops = Number(raw);
  return Number.isInteger(hops) && hops >= 0 ? hops : 1;
}
