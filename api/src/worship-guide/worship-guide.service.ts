import { Injectable } from '@nestjs/common';

const CATALOG = [
  { id: 'wudu_standard', category: 'wudu', obligation: 'conditional', stepCount: 7, bundleVersion: 1 },
  { id: 'ghusl_janabat', category: 'ghusl', obligation: 'wajib', stepCount: 5, bundleVersion: 1 },
  { id: 'ghusl_mayyit', category: 'ghusl', obligation: 'wajib_kifai', stepCount: 6, bundleVersion: 1 },
  { id: 'ghusl_haiz', category: 'ghusl', obligation: 'wajib', stepCount: 5, bundleVersion: 1 },
  { id: 'ghusl_nifas', category: 'ghusl', obligation: 'wajib', stepCount: 5, bundleVersion: 1 },
  { id: 'ghusl_jumuah', category: 'ghusl', obligation: 'mustahab', stepCount: 5, bundleVersion: 1 },
  { id: 'ghusl_istihada', category: 'ghusl', obligation: 'conditional', stepCount: 6, bundleVersion: 1 },
  { id: 'ghusl_mustahab', category: 'ghusl', obligation: 'mustahab', stepCount: 4, bundleVersion: 1 },
];

@Injectable()
export class WorshipGuideService {
  listCatalog() {
    return {
      domain: 'taharah',
      school: 'fiqh_jafariya',
      guides: CATALOG,
      salahModule: { route: 'prayer-academy', prayerCount: 15 },
    };
  }

  getManifest() {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      bundles: CATALOG.map((g) => ({
        id: g.id,
        hash: `bundled-v${g.bundleVersion}`,
        sizeKb: 12,
      })),
    };
  }

  getBundle(guideId: string) {
    const meta = CATALOG.find((g) => g.id === guideId);
    if (!meta) return { error: 'guide_not_found', guideId };
    return {
      ...meta,
      status: 'bundled_in_app',
      message: 'Full bundle JSON served from mobile TypeScript bundles in v1',
    };
  }

  getProgress(_userId: string) {
    return { progress: [] as WorshipGuideProgressDto[] };
  }

  saveProgress(_userId: string, dto: WorshipGuideProgressDto) {
    return { ok: true, persisted: false, ...dto };
  }

  getAudioUrl(assetKey: string) {
    return {
      assetKey,
      url: `https://cdn.ahlulbayt.app/worship-audio/${assetKey}.mp3`,
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
      status: 'placeholder',
    };
  }
}

type WorshipGuideProgressDto = {
  guideId: string;
  completedStepIds: string[];
  lastStepId?: string;
  mode?: string;
  guidedModeEnabled?: boolean;
};
