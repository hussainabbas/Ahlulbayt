import type { DuaBundle, DuaId } from '../../types';

import { DUA_AHAD } from './ahad';
import { DUA_KUMAIL } from './kumail';
import { DUA_MASHLOOL } from './mashlool';
import { DUA_NUDBA } from './nudba';
import { DUA_SABAH } from './sabah';
import { DUA_TAWASSUL } from './tawassul';

export const BUNDLED_DUAS: Record<DuaId, DuaBundle> = {
  dua_kumail: DUA_KUMAIL,
  dua_tawassul: DUA_TAWASSUL,
  dua_ahad: DUA_AHAD,
  dua_nudba: DUA_NUDBA,
  dua_sabah: DUA_SABAH,
  dua_mashlool: DUA_MASHLOOL,
};

export {
  DUA_KUMAIL,
  DUA_TAWASSUL,
  DUA_AHAD,
  DUA_NUDBA,
  DUA_SABAH,
  DUA_MASHLOOL,
};
