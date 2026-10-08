import type { DuaBundle } from '../../types';
import { DUA_CATALOG } from '../../constants/catalog';

const meta = DUA_CATALOG.find((d) => d.id === 'dua_ahad')!;

export const DUA_AHAD: DuaBundle = {
  meta,
  bundleVersion: 1,
  sections: [
    {
      id: 'opening',
      title: { en: 'Opening Covenant', ur: 'عہد کا آغاز' },
      arabic:
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n' +
        'اللّهُمَّ رَبَّ النُّورِ الْعَظِيمِ وَرَبَّ الْكُرْسِيِّ الرَّفِيعِ\n' +
        'وَرَبَّ الْبَحْرِ الْمَسْجُورِ وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْزَّبُورِ',
      translations: {
        en: 'In the name of Allah, the Most Gracious, the Most Merciful. O Allah, Lord of the great light, Lord of the elevated Throne, Lord of the swelling sea, Revealer of the Torah, Gospel, and Psalms…',
        ur: 'اللہ کے نام سے۔ اے اللہ! اے عظیم نور کے رب! عرش بلند کے رب! بند سمندر کے رب!',
      },
    },
    {
      id: 'covenant',
      title: { en: 'The Covenant', ur: 'عہد' },
      arabic:
        'اللّهُمَّ إِنِّي أُجَدِّدُ لَكَ فِي صَبَاحِ هٰذَا الْيَوْمِ\n' +
        'وَفِي كُلِّ يَوْمٍ عَهْدًا وَعَقْدًا وَبَيْعَةً لَكَ فِي عُنُقِي\n' +
        'أَلاَّ أُشْرِكَ بِكَ شَيْئًا وَلاَ أُؤْثِرَ عَلَيْكَ أَحَدًا',
      translations: {
        en: 'O Allah, on this morning and every morning I renew for You a covenant, pledge, and allegiance upon my neck — that I shall not associate anything with You nor prefer anyone over You…',
        ur: 'اے اللہ! میں آج اور ہر روز تیرے ساتھ عہد، پیمان اور بیعت تجدید کرتا ہوں…',
      },
    },
    {
      id: 'mahdi',
      title: { en: 'Allegiance to Imam al-Mahdi (AJ)', ur: 'امام مہدیؑ سے بیعت' },
      arabic:
        'اللّهُمَّ إِنِّي أُجَدِّدُ لَهُ فِي هٰذَا الْيَوْمِ وَفِي كُلِّ يَوْمٍ\n' +
        'عَهْدًا وَبَيْعَةً وَعَقْدًا فِي عُنُقِي\n' +
        'أَلاَّ أُبَدِّلَهُ وَلاَ أُغَيِّرَهُ وَلاَ أُنْكِثَهُ',
      translations: {
        en: 'O Allah, I renew for him on this day and every day a covenant, allegiance, and pledge upon my neck — that I shall not alter it, change it, or break it…',
        ur: 'اے اللہ! میں آج اور ہر روز امام مہدیؑ عجل اللہ فرجہم کے ساتھ عہد و بیعت تجدید کرتا ہوں…',
      },
    },
    {
      id: 'supplication',
      title: { en: 'Supplication', ur: 'دعا' },
      arabic:
        'اللّهُمَّ أَظْهِرْ أَمْرَهُ وَأَيِّدْهُ وَانْصُرْهُ\n' +
        'وَاجْعَلْنِي مِنْ أَنْصَارِهِ وَأَعْوَانِهِ وَالذَّابِّينَ عَنْهُ\n' +
        'وَالْمُسْتَشْهَدِينَ بَيْنَ يَدَيْهِ',
      translations: {
        en: 'O Allah, manifest his affair, support him, and grant him victory. Make me among his helpers, assistants, defenders, and martyrs before him…',
        ur: 'اے اللہ! ان کا امر ظاہر فرما، ان کی مدد فرما، مجھے ان کے مددگاروں میں شامل رکھ…',
      },
    },
    {
      id: 'closing',
      title: { en: 'Closing', ur: 'اختتام' },
      arabic:
        'وَصَلَّى اللّٰهُ عَلَىٰ مُحَمَّدٍ وَآلِهِ\n' +
        'وَعَجِّلْ فَرَجَهُمْ وَالْعَنْ أَعْدَاءَهُمْ\n' +
        'آمِينَ رَبَّ الْعَالَمِينَ',
      translations: {
        en: 'And may Allah bless Muhammad and his family. Hasten their relief and curse their enemies. Amen, Lord of the worlds.',
        ur: 'درود ہو محمدؐ و آل محمدؑ پر۔ ان کے فرج میں تعجیل فرما۔ آمین۔',
      },
    },
  ],
};
