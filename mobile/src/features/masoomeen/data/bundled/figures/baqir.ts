import type { FigureContent } from '../helpers';
import { bio, book, event, quote, timeline } from '../helpers';

export const profileBaqir: FigureContent = {
  id: 'masoom_baqir',
  biography: [
    bio(
      'life',
      'Splitter of Knowledge',
      'علوم کا باقر',
      'باقر العلوم',
      'Fifth Imam, grandson of Imam Hasan (as) and Imam Husayn (as). Opened the door of Islamic sciences in Medina, teaching thousands of students including Jabir ibn Abdullah.',
      'پنجویں امام، امام حسنؑ و حسینؑ کے پوتے۔ مدینہ میں علوم اسلامی کا دروازہ کھولا، جابر بن عبداللہ سمیت ہزاروں طلبہ کو پڑھایا۔',
      'الإمام الخامس، حفيد الحسن والحسين. فتح باب العلوم في المدينة وعلّم آلاف الطلاب.',
    ),
    bio(
      'legacy',
      'Scientific & Legal Legacy',
      'علمی و فقہی ورثہ',
      'التراث العلمي',
      'Laid foundations for Ja\'fari jurisprudence, Quranic exegesis, and hadith sciences. Known as Baqir al-Ulum for splitting open knowledge.',
      'فقہ جعفری، تفسیر و حدیث کی بنیاد۔ علوم کو پھاڑنے والے — باقر العلوم۔',
      'أسس الفقه الجعفري والتفسير وعلم الحديث.',
    ),
  ],
  timeline: [
    timeline('birth', 57, 'Birth in Medina', 'مدینہ میں ولادت', 'ولادة في المدينة', 'Born to Imam Zain ul-Abideen (as).', 'امام زین العابدینؑ کے ہاں', 'وُلد للإمام زين العابدين', 'wiladat', '57 AH'),
    timeline('imamate', 95, 'Imamate begins', 'امامت', 'الإمامة', 'Fifth Imam.', 'پنجویں امام', 'الإمام الخامس', 'event', '95 AH'),
    timeline('shahadat', 114, 'Shahadat', 'شہادت', 'الشهادة', 'Martyred by poison on order of Hisham.', 'ہشام کے حکم سے زہر', 'استشهد بالسم بأمر هشام', 'shahadat', '114 AH'),
  ],
  quotes: [
    quote(
      'q1',
      'Knowledge is better than wealth; knowledge guards you while you guard wealth.',
      'علم مال سے بہتر ہے؛ علم تمہاری حفاظت کرتا ہے، مال تم اس کی حفاظت کرتے ہو۔',
      'العلم خير من المال؛ العلم يحرسك وأنت تحرس المال',
      'Imam al-Baqir (as)',
      'امام باقرؑ',
      'الإمام الباقر',
    ),
  ],
  events: [
    event(
      'wiladat',
      1,
      3,
      'Wiladat of Imam al-Baqir (as)',
      'ولادت امام باقرؑ',
      'مولد الإمام الباقر',
      '3rd Safar — birth in Medina.',
      '۳ صفر — مدینہ',
      'الثالث من صفر — المدينة',
      'baqir_birth',
    ),
    event(
      'shahadat',
      7,
      7,
      'Shahadat of Imam al-Baqir (as)',
      'شہادت امام باقرؑ',
      'شهادة الإمام الباقر',
      '7th Dhu al-Hijja — martyrdom.',
      '۷ ذوالحجہ — شہادت',
      'السابع من ذي الحجة — استشهاد',
      'baqir_shahadat',
    ),
  ],
  books: [
    book(
      'tafsir',
      'Tafsir al-Baqir',
      'تفسیر باقر',
      'تفسير الباقر',
      'Quranic exegesis transmitted from the Imam.',
      'امام سے منقول قرآنی تفسیر',
      'تفسير منقول عن الإمام',
    ),
    book(
      'hadith',
      'Hadith Collections',
      'احادیث',
      'الأحاديث',
      'Thousands of narrations on fiqh, ethics, and theology.',
      'فقہ، اخلاق و عقیدہ پر ہزاروں روایات',
      'آلاف الأحاديث في الفقه والأخلاق',
    ),
  ],
};
