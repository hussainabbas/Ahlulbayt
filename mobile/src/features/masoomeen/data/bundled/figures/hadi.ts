import type { FigureContent } from '../helpers';
import { bio, book, event, quote, timeline } from '../helpers';

export const profileHadi: FigureContent = {
  id: 'masoom_hadi',
  biography: [
    bio(
      'life',
      'The Guiding Imam',
      'ہادی امام',
      'الإمام الهادي',
      'Tenth Imam, summoned to Samarra by Abbasid rulers. Known as al-Hadi (the Guide) for guiding believers through letters and representatives during intense surveillance.',
      'دسویں امام، عباسیوں نے سامرّا بلایا۔ ہادی — خطوط و نائبین کے ذریعے رہنمائی۔',
      'الإمام العاشر، نُقل إلى سامراء. الهادي — الإرشاد بالرسائل والنواب.',
    ),
  ],
  timeline: [
    timeline('birth', 212, 'Birth in Medina', 'مدینہ میں ولادت', 'ولادة في المدينة', 'Born to Imam al-Jawad (as).', 'امام جوادؑ کے ہاں', 'وُلد للإمام الجواد', 'wiladat', '212 AH'),
    timeline('imamate', 220, 'Imamate begins', 'امامت', 'الإمامة', 'Tenth Imam.', 'دسویں امام', 'الإمام العاشر', 'event', '220 AH'),
    timeline('samarra', 233, 'Residence in Samarra', 'سامرّا', 'سامراء', 'Confined to Samarra under Abbasid watch.', 'عباسی نگرانی میں سامرّا', 'حُبس في سامراء', 'event', '233 AH'),
    timeline('shahadat', 254, 'Shahadat', 'شہادت', 'الشهادة', 'Martyred by poison in Samarra.', 'سامرّا میں زہر', 'استشهد بالسم في سامراء', 'shahadat', '254 AH'),
  ],
  quotes: [
    quote(
      'q1',
      'The world is a bridge — cross it and do not build upon it.',
      'دنیا پل ہے — پار کرو، اس پر عمارت نہ بناؤ۔',
      'الدنيا جسر فاعبروها ولا تبنوا عليها',
      'Imam al-Hadi (as)',
      'امام ہادیؑ',
      'الإمام الهادي',
    ),
  ],
  events: [
    event(
      'wiladat',
      3,
      15,
      'Wiladat of Imam al-Hadi (as)',
      'ولادت امام ہادیؑ',
      'مولد الإمام الهادي',
      '15th Rajab — birth in Medina.',
      '۱۵ رجب — مدینہ',
      'الخامس عشر من رجب — المدينة',
      'hadi_birth',
    ),
    event(
      'shahadat',
      3,
      3,
      'Shahadat of Imam al-Hadi (as)',
      'شہادت امام ہادیؑ',
      'شهادة الإمام الهادي',
      '3rd Rajab — martyrdom in Samarra.',
      '۳ رجب — سامرّا میں شہادت',
      'الثالث من رجب — استشهاد في سامراء',
      'hadi_shahadat',
    ),
  ],
  books: [
    book(
      'letters',
      'Guidance Letters (Tawqi\'at)',
      'توقیعات',
      'التوقيعات',
      'Letters to Shia communities on faith and perseverance.',
      'ایمان و ثبات پر خطوط',
      'رسائل للجماعات الشيعية عن الإيمان',
    ),
  ],
};
