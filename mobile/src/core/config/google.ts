/**
 * Web OAuth client (type 3) from Firebase / Google Cloud — public, not a secret.
 * Used when GOOGLE_WEB_CLIENT_ID is not set in .env.
 * Must match GOOGLE_CLIENT_ID on the API.
 */
export const GOOGLE_WEB_CLIENT_ID_DEFAULT =
  '595645974841-9vu5g0ideh3utlislgcs3cqshis6dts0.apps.googleusercontent.com';

export function resolveGoogleWebClientId(envValue: string | undefined): string {
  return envValue?.trim() || GOOGLE_WEB_CLIENT_ID_DEFAULT;
}

export function isGoogleSignInConfigured(envValue: string | undefined): boolean {
  return resolveGoogleWebClientId(envValue).length > 0;
}
