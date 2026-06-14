import type { MasoomeenProfile } from '../../types';
import { MASOOMEEN_BY_ID } from '../../constants/catalog';
import { profileAli } from './figures/ali';
import { profileAskari } from './figures/askari';
import { profileBaqir } from './figures/baqir';
import { profileFatima } from './figures/fatima';
import { profileHadi } from './figures/hadi';
import { profileHasan } from './figures/hasan';
import { profileHusayn } from './figures/husayn';
import { profileJawad } from './figures/jawad';
import { profileKazim } from './figures/kazim';
import { profileMahdi } from './figures/mahdi';
import { profileProphet } from './figures/prophet';
import { profileReza } from './figures/reza';
import { profileSadiq } from './figures/sadiq';
import { profileZainulabideen } from './figures/zainulabideen';

const FIGURES = [
  profileProphet,
  profileFatima,
  profileAli,
  profileHasan,
  profileHusayn,
  profileZainulabideen,
  profileBaqir,
  profileSadiq,
  profileKazim,
  profileReza,
  profileJawad,
  profileHadi,
  profileAskari,
  profileMahdi,
];

export const BUNDLED_PROFILES: MasoomeenProfile[] = FIGURES.map((figure) => ({
  meta: MASOOMEEN_BY_ID[figure.id],
  biography: figure.biography,
  timeline: figure.timeline,
  quotes: figure.quotes,
  events: figure.events,
  books: figure.books,
}));

export const BUNDLED_BY_ID = Object.fromEntries(
  BUNDLED_PROFILES.map((p) => [p.meta.id, p]),
) as Record<MasoomeenProfile['meta']['id'], MasoomeenProfile>;
