import { spacing } from './tokens';

/** Canonical layout rhythm — use everywhere instead of magic numbers. */
export const layout = {
  screenPaddingX: spacing[5],
  screenPaddingY: spacing[4],
  sectionGap: spacing[6],
  blockGap: spacing[3],
  listGap: spacing[2],
  listRowMinHeight: 56,
  listRowPaddingX: spacing[5],
  listRowPaddingY: spacing[4],
} as const;
