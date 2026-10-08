/** Step-by-Step Worship Guide — Fiqh Jafariya taharah + unified learning types. */

export type WorshipGuideId =
  | 'wudu_standard'
  | 'tayammum_standard'
  | 'adhan_guide'
  | 'iqama_guide'
  | 'ghusl_janabat'
  | 'ghusl_mayyit'
  | 'ghusl_haiz'
  | 'ghusl_nifas'
  | 'ghusl_jumuah'
  | 'ghusl_istihada'
  | 'ghusl_mustahab';

export type WorshipGuideDomain = 'taharah';

export type WorshipGuideCategory = 'wudu' | 'ghusl' | 'invalidators' | 'adhan';

export type GuideLearningMode = 'beginner' | 'standard' | 'scholar';

export type WorshipObligation = 'wajib' | 'wajib_kifai' | 'mustahab' | 'conditional';

export type GhuslMethod = 'tartibi' | 'irtimasi';

export type LocalizedText = { en: string; ur: string; ar: string };

import type { IslamicCitation } from '@/core/citations';
import type { FiqhReference as CoreFiqhReference, MarjaId } from '@/core/references';

export type FiqhReference = CoreFiqhReference;
export type { MarjaId };

export type WorshipStepKind =
  | 'intro'
  | 'niyyah'
  | 'wash'
  | 'masah'
  | 'order_rule'
  | 'method'
  | 'checklist'
  | 'fiqh_note'
  | 'invalidator'
  | 'completion';

export type WorshipVisualHint =
  | 'niyyah'
  | 'wash_face'
  | 'wash_arm_right'
  | 'wash_arm_left'
  | 'masah_head'
  | 'masah_feet'
  | 'ghusl_head'
  | 'ghusl_body'
  | 'ghusl_feet';

export interface WorshipAudioCue {
  id: string;
  label: LocalizedText;
  assetKey?: string;
  remoteUrl?: string;
  durationSec?: number;
}

export interface WorshipInvalidator {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
}

export interface GhuslMethodVariant {
  method: GhuslMethod;
  title: LocalizedText;
  summary: LocalizedText;
}

export interface WorshipGuideStep {
  id: string;
  kind: WorshipStepKind;
  title: LocalizedText;
  body: LocalizedText;
  arabicText?: string;
  transliteration?: LocalizedText;
  /** English/Urdu/Ar — meaning of arabic recitation */
  translation?: LocalizedText;
  isRequired: boolean;
  fiqhRefs?: FiqhReference[];
  citations?: IslamicCitation[];
  commonErrors?: LocalizedText[];
  visualHint?: WorshipVisualHint;
  checklist?: LocalizedText[];
  scholarBody?: LocalizedText;
  confirmPrompt?: LocalizedText;
  audioAssetKey?: string;
  audioUrl?: string;
  /** Worship simulator asset key */
  animationAssetKey?: string;
}

export interface WorshipGuideMeta {
  id: WorshipGuideId;
  slug: string;
  domain: WorshipGuideDomain;
  category: WorshipGuideCategory;
  obligation: WorshipObligation;
  titles: LocalizedText;
  subtitles: LocalizedText;
  purpose: LocalizedText;
  description: LocalizedText;
  estimatedMinutes: number;
  stepCount: number;
  hasAudio: boolean;
  hasGuidedMode: boolean;
  prerequisites?: WorshipGuideId[];
  tags: string[];
  featured?: boolean;
}

export interface WorshipGuideBundle {
  meta: WorshipGuideMeta;
  bundleVersion: number;
  methodVariants?: GhuslMethodVariant[];
  invalidators?: WorshipInvalidator[];
  waterRequirements?: LocalizedText;
  orderRules?: LocalizedText[];
  audioCues?: WorshipAudioCue[];
  steps: Record<GuideLearningMode, WorshipGuideStep[]>;
}

export interface WorshipGuideProgress {
  guideId: WorshipGuideId;
  completedStepIds: string[];
  checkedItems: Record<string, string[]>;
  completedAt?: string;
  lastStepId?: string;
  mode: GuideLearningMode;
  guidedModeEnabled: boolean;
}

export interface WorshipGuideLastSession {
  guideId: WorshipGuideId;
  stepIndex: number;
  stepId: string;
  mode: GuideLearningMode;
  updatedAt: string;
}

import type { GuideContentLocale } from '@/components/guided/types';

export interface WorshipGuideReaderPrefs {
  defaultMode: GuideLearningMode;
  guidedModeDefault: boolean;
  showArabic: boolean;
  showTransliteration: boolean;
  hapticsEnabled: boolean;
  autoPreloadAudio: boolean;
  contentLocale: GuideContentLocale;
  fontScale: number;
}

export interface WorshipGuideBookmark {
  id: string;
  guideId: WorshipGuideId;
  stepId?: string;
  label?: string;
  createdAt: string;
}

/** Maps prayer-academy entry to worship hub */
export type SalahGuideRoute = { type: 'prayer_academy'; prayerId: string };
