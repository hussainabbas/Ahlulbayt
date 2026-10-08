import type { FigureContent } from '../helpers';
import { bio, book, event, quote, timeline } from '../helpers';

export const profileKazim: FigureContent = {
  id: 'masoom_kazim',
  biography: [
    bio(
      'life',
      'The Patient Imam',
      'صبر والے امام',
      'الإمام الصابر',
      'Seventh Imam, known as al-Kazim (the Restrainer of Anger) for his patience under Harun al-Rashid\'s persecution. Spent years imprisoned in Baghdad.',
      'ساتویں امام، غصے کو روکنے والے — کاظم۔ ہارون الرشید کے ظلم میں صبر، بغداد میں سالوں قید۔',
      'الإمام السابع، الكاظم. صبر تحت ظلم هارون وسجن في بغداد.',
    ),
  ],
  timeline: [
    timeline('birth', 128, 'Birth in Medina', 'مدینہ میں ولادت', 'ولادة في المدينة', 'Born to Imam al-Sadiq (as).', 'امام صادقؑ کے ہاں', 'وُلد للإمام الصادق', 'wiladat', '128 AH'),
    timeline('imamate', 148, 'Imamate begins', 'امامت', 'الإمامة', 'Seventh Imam.', 'ساتویں امام', 'الإمام السابع', 'event', '148 AH'),
    timeline('prison', 179, 'Imprisonment', 'قید', 'السجن', 'Imprisoned by Harun al-Rashid.', 'ہارون کی قید', 'سجن هارون', 'event', '179 AH'),
    timeline('shahadat', 183, 'Shahadat in Baghdad', 'بغداد میں شہادت', 'الشهادة في بغداد', 'Martyred in prison; buried in Kadhimiya.', 'قید میں شہادت؛ کاظمین', 'استشهد في السجن؛ الكاظمية', 'shahadat', '183 AH'),
  ],
  quotes: [
    quote(
      'q1',
      'The sign of a believer is that he is pleased with what Allah has decreed.',
      'مومن کی علامت یہ ہے کہ وہ اللہ کے فیصلے پر راضی ہو۔',
      'علامة المؤمن الرضا بما قضى الله',
      'Imam al-Kazim (as)',
      'امام کاظمؑ',
      'الإمام الكاظم',
    ),
  ],
  events: [
    event(
      'wiladat',
      7,
      7,
      'Wiladat of Imam al-Kazim (as)',
      'ولادت امام کاظمؑ',
      'مولد الإمام الكاظم',
      '7th Safar — birth in Medina.',
      '۷ صفر — مدینہ',
      'السابع من صفر — المدينة',
      'kazim_birth',
    ),
    event(
      'shahadat',
      7,
      25,
      'Shahadat of Imam al-Kazim (as)',
      'شہادت امام کاظمؑ',
      'شهادة الإمام الكاظم',
      '25th Rajab — martyrdom in prison.',
      '۲۵ رجب — قید میں شہادت',
      'الخامس والعشرون من رجب — استشهاد في السجن',
      'kazim_shahadat',
    ),
  ],
  books: [
    book(
      'duas',
      'Supplications & Counsel',
      'دعائیں و نصائح',
      'الأدعية والمواعظ',
      'Prayers and guidance on patience and trust in Allah.',
      'صبر و توکل پر دعائیں و رہنمائی',
      'أدعية ومواعظ عن الصبر والتوكل',
    ),
  ],
};
