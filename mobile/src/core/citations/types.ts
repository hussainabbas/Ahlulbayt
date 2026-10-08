/** Simplified scholarly citation model — bridges features to `core/references`. */

export interface IslamicCitation {
  id?: string;
  /** Book or work title */
  source: string;
  volume?: string | number;
  page?: string | number;
  hadithNumber?: string;
  narrator?: string;
  scholar?: string;
  /** `false` surfaces the Unverified badge */
  verified: boolean;
  note?: string;
}

export interface CitableContent {
  citations: IslamicCitation[];
}
