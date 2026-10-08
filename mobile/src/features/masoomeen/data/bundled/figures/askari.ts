import type { FigureContent } from '../helpers';
import { bio, book, event, quote, timeline } from '../helpers';

export const profileAskari: FigureContent = {
  id: 'masoom_askari',
  biography: [
    bio(
      'life',
      'Father of the Mahdi (aj)',
      'امام مہدیؑ کے والد',
      'والد الإمام المهدي',
      'Eleventh Imam, lived under strict house arrest in Samarra. Known as al-Askari for residing in the military city. Father of Imam al-Mahdi (aj), whom he introduced to close companions before his martyrdom.',
      'گیارہویں امام، سامرّا میں سخت نظر بندی۔ عسکری — عسکری شہر میں رہائش۔ امام مہدیؑ کے والد، شہادت سے پہلے مہدیؑ کو نمائندوں سے متعارف کرایا۔',
      'الإمام الحادي عشر، تحت الإقامة الجبرية في سامراء. العسكري. والد الإمام المهدي.',
    ),
  ],
  timeline: [
    timeline('birth', 232, 'Birth in Medina', 'مدینہ میں ولادت', 'ولادة في المدينة', 'Born to Imam al-Hadi (as).', 'امام ہادیؑ کے ہاں', 'وُلد للإمام الهادي', 'wiladat', '232 AH'),
    timeline('imamate', 254, 'Imamate begins', 'امامت', 'الإمامة', 'Eleventh Imam.', 'گیارہویں امام', 'الإمام الحادي عشر', 'event', '254 AH'),
    timeline('mahdi', 255, 'Birth of Imam al-Mahdi (aj)', 'امام مہدیؑ کی ولادت', 'ولادة الإمام المهدي', 'Father of the Twelfth Imam.', 'بارہویں امام کے والد', 'والد الإمام الثاني عشر', 'wiladat', '255 AH'),
    timeline('shahadat', 260, 'Shahadat', 'شہادت', 'الشهادة', 'Martyred by poison in Samarra.', 'سامرّا میں زہر', 'استشهد بالسم', 'shahadat', '260 AH'),
  ],
  quotes: [
    quote(
      'q1',
      'The earth shall never be devoid of a proof of Allah for His creation.',
      'زمین اللہ کے حجت سے خالی نہیں رہے گی۔',
      'لا تخلو الأرض من حجة لله على خلقه',
      'Imam al-Askari (as)',
      'امام عسکریؑ',
      'الإمام العسكري',
    ),
  ],
  events: [
    event(
      'wiladat',
      4,
      8,
      'Wiladat of Imam al-Askari (as)',
      'ولادت امام عسکریؑ',
      'مولد الإمام العسكري',
      '8th Rabi al-Thani — birth in Medina.',
      '۸ ربیع الثانی — مدینہ',
      'الثامن من ربيع الثاني — المدينة',
      'askari_birth',
    ),
    event(
      'shahadat',
      8,
      8,
      'Shahadat of Imam al-Askari (as)',
      'شہادت امام عسکریؑ',
      'شهادة الإمام العسكري',
      '8th Rabi al-Awwal — martyrdom in Samarra.',
      '۸ ربیع الاول — سامرّا',
      'الثامن من ربيع الأول — سامراء',
      'askari_shahadat',
    ),
  ],
  books: [
    book(
      'tafsir',
      'Tafsir al-Askari',
      'تفسیر عسکری',
      'تفسير العسكري',
      'Quranic commentary transmitted from the Imam.',
      'امام سے منقول تفسیر',
      'تفسير منقول عن الإمام',
    ),
  ],
};
