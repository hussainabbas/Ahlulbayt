import { getDailyLifeMeta } from '../../constants/catalog';
import type { DailyLifeDuaBundle, DailyLifeDuaId, DailyLifeDuaMeta } from '../../types';
import { BUNDLED_SITUATION_CONTENT } from './situations';

const MAFATIH = {
  en: 'Mafatih al-Jinan',
  ur: 'مفاتیح الجنان',
  ar: 'مفاتيح الجنان',
};

function enrichMeta(base: DailyLifeDuaMeta): DailyLifeDuaMeta {
  const content = BUNDLED_SITUATION_CONTENT[base.situationKey];
  return {
    ...base,
    contentStatus: 'bundled',
    attribution: {
      sourceBook: MAFATIH,
      narrator: content.narrator ?? base.attribution.narrator,
      sourceRef: base.mafatihRef,
      citations: content.citations,
    },
  };
}

function buildBundle(id: DailyLifeDuaId): DailyLifeDuaBundle | null {
  const baseMeta = getDailyLifeMeta(id);
  const content = baseMeta ? BUNDLED_SITUATION_CONTENT[baseMeta.situationKey] : undefined;
  if (!baseMeta || !content) return null;

  return {
    meta: enrichMeta(baseMeta),
    sections: content.sections,
    bundleVersion: 1,
  };
}

export const BUNDLED_DAILY_LIFE_DUAS: Partial<Record<DailyLifeDuaId, DailyLifeDuaBundle>> =
  Object.fromEntries(
    (Object.keys(BUNDLED_SITUATION_CONTENT) as Array<keyof typeof BUNDLED_SITUATION_CONTENT>).map(
      (situation) => {
        const id = `dl_${situation}` as DailyLifeDuaId;
        return [id, buildBundle(id)!];
      },
    ),
  ) as Partial<Record<DailyLifeDuaId, DailyLifeDuaBundle>>;

export function getBundledDailyLifeDua(id: DailyLifeDuaId): DailyLifeDuaBundle | null {
  return BUNDLED_DAILY_LIFE_DUAS[id] ?? buildBundle(id);
}

export function getEnrichedMeta(id: DailyLifeDuaId): DailyLifeDuaMeta | undefined {
  const bundled = getBundledDailyLifeDua(id);
  if (bundled) return bundled.meta;
  return getDailyLifeMeta(id);
}
