import { env } from '@/core/config/env';

import type { ContentDomain } from './types';

/** API origin without `/v1` — static bundles live at `/bundles/...`. */
export function getContentOrigin(): string {
  const base = env.apiBaseUrl.replace(/\/+$/, '');
  return base.replace(/\/v1$/i, '');
}

/** Turn manifest-relative paths into absolute download URLs for RNFS. */
export function resolveBundleUrl(url: string | undefined | null): string | null {
  if (url == null) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  if (trimmed.startsWith('/')) {
    return `${getContentOrigin()}${trimmed}`;
  }

  return `${getContentOrigin()}/${trimmed.replace(/^\/+/, '')}`;
}
