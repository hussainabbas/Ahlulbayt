import type { FigureContent } from '../helpers';
import { bio, book, event, quote, timeline } from '../helpers';

export const profileHasan: FigureContent = {
  id: 'masoom_hasan',
  biography: [
    bio(
      'life',
      'Life & Character',
      'زندگی و کردار',
      'الحياة والخلق',
      'Eldest grandson of the Prophet (s), known for generosity, forbearance, and peacemaking. Second Imam after his father Ali (as).',
      'نبیؐ کے بڑے پوتے، سخاوت، بردباری و صلح کے لیے مشہور۔ امام علیؑ کے بعد دوسرے امام۔',
      'أكبر أحفاد النبي، عُرف بالكرم والحلم والصلح. الإمام الثاني بعد علي.',
    ),
    bio(
      'imamate',
      'Imamate & Peace Treaty',
      'امامت و صلح',
      'الإمامة والصلح',
      'After the martyrdom of Imam Ali (as), led the community. Signed a peace treaty with Muawiya to prevent further bloodshed, preserving the Imamate for Imam Husayn (as).',
      'امام علیؑ کی شہادت کے بعد قیادت۔ مزید خونریزی روکنے کے لیے معاویہ سے صلح، امام حسینؑ کے لیے امامت محفوظ۔',
      'قاد المجتمع بعد استشهاد علي. عقد صلحاً مع معاوية لحفظ الإمامة للحسين.',
    ),
  ],
  timeline: [
    timeline('birth', 3, 'Birth in Medina', 'مدینہ میں ولادت', 'ولادة في المدينة', 'Born to Imam Ali (as) and Sayyida Fatima (sa).', 'امام علیؑ و سیدہ فاطمہؑ کے ہاں', 'وُلد للإمام علي والسيدة فاطمة', 'wiladat', '3 AH'),
    timeline('imamate', 40, 'Imamate begins', 'امامت کا آغاز', 'بداية الإمامة', 'Second Imam after Imam Ali (as).', 'دوسرے امام', 'الإمام الثاني', 'event', '40 AH'),
    timeline('treaty', 41, 'Peace Treaty', 'صلح', 'الصلح', 'Treaty with Muawiya to protect the Ummah.', 'امت کی حفاظت کے لیے صلح', 'صلح لحماية الأمة', 'event', '41 AH'),
    timeline('shahadat', 50, 'Shahadat', 'شہادت', 'الشهادة', 'Martyred by poison in Medina.', 'مدینہ میں زہر سے شہادت', 'استشهد بالسم في المدينة', 'shahadat', '50 AH'),
  ],
  quotes: [
    quote(
      'q1',
      'Hasan and Husayn are the leaders of the youth of Paradise.',
      'حسنؑ و حسینؑ جنت کے نوجوانوں کے سردار ہیں۔',
      'الحسن والحسين سيدا شباب أهل الجنة',
      'Prophet (s)',
      'نبیؐ',
      'النبي',
    ),
    quote(
      'q2',
      'I am surprised at one who knows the world is transient yet loves it.',
      'حیران ہوں اس سے جو دنیا کی فانی بود جانتے ہوئے اس سے محبت کرے۔',
      'عجبت ممن يعلم أن الدنيا زائلة ويحبها',
      'Imam Hasan (as)',
      'امام حسنؑ',
      'الإمام الحسن',
    ),
  ],
  events: [
    event(
      'wiladat',
      3,
      15,
      'Wiladat of Imam Hasan (as)',
      'ولادت امام حسنؑ',
      'مولد الإمام الحسن',
      '15th Ramadan — birth in Medina.',
      '۱۵ رمضان — مدینہ میں ولادت',
      'الخامس عشر من رمضان — ولادة في المدينة',
      'hasan_birth',
    ),
    event(
      'shahadat',
      7,
      28,
      'Shahadat of Imam Hasan (as)',
      'شہادت امام حسنؑ',
      'شهادة الإمام الحسن',
      '28th Safar — martyrdom.',
      '۲۸ صفر — شہادت',
      'الثامن والعشرون من صفر — استشهاد',
      'hasan_shahadat',
    ),
  ],
  books: [
    book(
      'sermons',
      'Sermons & Counsel',
      'خطبات و نصائح',
      'الخطب والمواعظ',
      'Preserved sermons on patience, governance, and faith.',
      'صبر، حکومت و ایمان پر محفوظ خطبات',
      'خطب محفوظة عن الصبر والحكم والإيمان',
    ),
  ],
};
