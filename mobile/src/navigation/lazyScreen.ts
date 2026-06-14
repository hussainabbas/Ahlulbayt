import type { ComponentType } from 'react';

/** Defer screen module evaluation until first navigation (reduces cold start & tab cost). */
export function lazyScreen<P extends object>(
  factory: () => ComponentType<P>,
): () => ComponentType<P> {
  let cached: ComponentType<P> | undefined;
  return () => {
    if (!cached) {
      cached = factory();
    }
    return cached;
  };
}
