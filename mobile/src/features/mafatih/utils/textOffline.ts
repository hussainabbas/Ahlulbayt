import { MAFATIH_INDEX } from '../constants/index';
import type { MafatihRef } from '../types';

/** Bundled Mafatih text is available offline without a download step. */
export function isTextOffline(ref: MafatihRef): boolean {
  return MAFATIH_INDEX.some((e) => e.ref === ref && e.bundled);
}
