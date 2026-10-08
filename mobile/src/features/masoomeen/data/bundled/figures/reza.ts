import type { FigureContent } from '../helpers';
import { bio, book, event, quote, timeline } from '../helpers';

export const profileReza: FigureContent = {
  id: 'masoom_reza',
  biography: [
    bio(
      'life',
      'Imam of the East',
      'مشرق کے امام',
      'إمام المشرق',
      'Eighth Imam, invited to Khorasan by Ma\'mun as heir apparent. Known as al-Rida (the Pleasing One) — accepted by Allah and the Prophet (s). His shrine in Mashhad is a major pilgrimage site.',
      'آٹھویں امام، مامون نے خراسان بلایا۔ رضا — اللہ و نبیؐ کی رضا۔ مشہد میں مزار اہم زیارت گاہ۔',
      'الإمام الثامن، دعاه المأمون إلى خراسان. الرضا — رضا الله والنبي. مرقده في مشهد.',
    ),
    bio(
      'debates',
      'Scholarly Debates',
      'علمی مباحثے',
      'المباحثات العلمية',
      'Held debates with scholars of Judaism, Christianity, Zoroastrianism, and various Islamic sects in Ma\'mun\'s court, affirming the truth of Islam and Wilayah.',
      'مامون کے دربار میں یہود، نصاریٰ، مجوس و مسلم فرقوں سے مباحثے، اسلام و ولایت کی تصدیق۔',
      'حاور علماء اليهود والنصارى والمجوس في بلاط المأمون.',
    ),
  ],
  timeline: [
    timeline('birth', 148, 'Birth in Medina', 'مدینہ میں ولادت', 'ولادة في المدينة', 'Born to Imam al-Kazim (as).', 'امام کاظمؑ کے ہاں', 'وُلد للإمام الكاظم', 'wiladat', '148 AH'),
    timeline('imamate', 183, 'Imamate begins', 'امامت', 'الإمامة', 'Eighth Imam.', 'آٹھویں امام', 'الإمام الثامن', 'event', '183 AH'),
    timeline('khorasan', 200, 'Journey to Khorasan', 'خراسان کا سفر', 'رحلة خراسان', 'Called to Marv by Ma\'mun.', 'مامون نے بلایا', 'دعاه المأمون', 'event', '200 AH'),
    timeline('shahadat', 203, 'Shahadat in Tus', 'طوس میں شہادت', 'الشهادة في طوس', 'Martyred by poison; buried in Mashhad.', 'زہر سے شہادت؛ مشہد', 'استشهد بالسم؛ مشهد', 'shahadat', '203 AH'),
  ],
  quotes: [
    quote(
      'q1',
      'The friend of every person is his intellect; his enemy is his ignorance.',
      'ہر شخص کا دوست اس کا عقل ہے اور دشمن جہالت۔',
      'صديق كل امرئ عقله وعدوه جهله',
      'Imam al-Rida (as)',
      'امام رضاؑ',
      'الإمام الرضا',
    ),
  ],
  events: [
    event(
      'wiladat',
      11,
      11,
      'Wiladat of Imam al-Rida (as)',
      'ولادت امام رضاؑ',
      'مولد الإمام الرضا',
      '11th Dhu al-Qi\'da — birth in Medina.',
      '۱۱ ذوالقعدہ — مدینہ',
      'الحادي عشر من ذي القعدة — المدينة',
      'reza_birth',
    ),
    event(
      'shahadat',
      8,
      29,
      'Shahadat of Imam al-Rida (as)',
      'شہادت امام رضاؑ',
      'شهادة الإمام الرضا',
      '29th Safar — martyrdom in Tus.',
      '۲۹ صفر — طوس میں شہادت',
      'التاسع والعشرون من صفر — استشهاد في طوس',
      'reza_shahadat',
    ),
  ],
  books: [
    book(
      'sahifa',
      'Sahifa al-Rida',
      'صحیفہ رضا',
      'الصحيفة الرضا',
      'Treatise on divine unity and refutation of false beliefs.',
      'توحید و باطل عقائد کی رد',
      'التوحيد ورد الباطل',
    ),
    book(
      'debates',
      'Debate Transcripts',
      'مباحثات',
      'المباحثات',
      'Records of theological debates at Ma\'mun\'s court.',
      'مامون کے دربار کی علمی مباحثات',
      'مباحثات بلاط المأمون',
    ),
  ],
};
