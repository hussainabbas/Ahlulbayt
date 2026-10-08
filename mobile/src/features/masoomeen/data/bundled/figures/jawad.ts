import type { FigureContent } from '../helpers';
import { bio, book, event, quote, timeline } from '../helpers';

export const profileJawad: FigureContent = {
  id: 'masoom_jawad',
  biography: [
    bio(
      'life',
      'The Generous Young Imam',
      'نوجوان کریم امام',
      'الإمام الجواد',
      'Ninth Imam, became Imam at age 8. Known as al-Jawad (the Generous) for his charity despite poverty. Married to Ma\'mun\'s daughter Umm al-Fadl.',
      'نواں امام، ۸ سال کی عمر میں امامت۔ جواد — سخاوت کے لیے مشہور۔ مامون کی بیٹی ام الفضل سے نکاح۔',
      'الإمام التاسع، تولى الإمامة في سن الثامنة. الجواد — الكرم. تزوج من أم الفضل.',
    ),
  ],
  timeline: [
    timeline('birth', 195, 'Birth in Medina', 'مدینہ میں ولادت', 'ولادة في المدينة', 'Born to Imam al-Rida (as).', 'امام رضاؑ کے ہاں', 'وُلد للإمام الرضا', 'wiladat', '195 AH'),
    timeline('imamate', 203, 'Imamate at age 8', '۸ سال میں امامت', 'الإمامة في سن 8', 'Youngest Imam to assume leadership.', 'سب سے کم عمر امام', 'أصغر إمام تولى القيادة', 'event', '203 AH'),
    timeline('shahadat', 220, 'Shahadat', 'شہادت', 'الشهادة', 'Martyred by poison; buried in Kadhimiya.', 'زہر سے شہادت؛ کاظمین', 'استشهد بالسم؛ الكاظمية', 'shahadat', '220 AH'),
  ],
  quotes: [
    quote(
      'q1',
      'Trust in Allah is the price of every precious thing.',
      'اللہ پر توکل ہر قیمتی چیز کی قیمت ہے۔',
      'التوكل على الله ثمن كل غال',
      'Imam al-Jawad (as)',
      'امام جوادؑ',
      'الإمام الجواد',
    ),
  ],
  events: [
    event(
      'wiladat',
      10,
      10,
      'Wiladat of Imam al-Jawad (as)',
      'ولادت امام جوادؑ',
      'مولد الإمام الجواد',
      '10th Rajab — birth in Medina.',
      '۱۰ رجب — مدینہ',
      'العاشر من رجب — المدينة',
      'jawad_birth',
    ),
    event(
      'shahadat',
      6,
      29,
      'Shahadat of Imam al-Jawad (as)',
      'شہادت امام جوادؑ',
      'شهادة الإمام الجواد',
      '29th Dhu al-Qi\'da — martyrdom.',
      '۲۹ ذوالقعدہ — شہادت',
      'التاسع والعشرون من ذي القعدة — استشهاد',
      'jawad_shahadat',
    ),
  ],
  books: [
    book(
      'letters',
      'Letters & Legal Rulings',
      'مکتوبات و فتاوى',
      'الرسائل والفتاوى',
      'Responses to legal questions despite his young age.',
      'کم عمری میں بھی فقہی جوابات',
      'أجوبة فقهية رغم صغر سنه',
    ),
  ],
};
