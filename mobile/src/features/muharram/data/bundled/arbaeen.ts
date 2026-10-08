import type { ArbaeenStage } from '../../types';
import { cite } from './citations';

export const ARBAEEN_STAGES: ArbaeenStage[] = [
  {
    id: 'arbaeen_departure',
    order: 1,
    hijriMonth: 2,
    hijriDay: 1,
    title: { en: 'Journey from Karbala begins', ur: 'کربلا سے سفر کا آغاز' },
    narrative: {
      en: 'After Ashura, the captives are marched from Karbala toward Kufa and Damascus under harsh conditions.',
      ur: 'عاشورا کے بعد اسیر اہل بیت کو کربلا سے کوفہ و شام کی طرف لے جایا جاتا ہے۔',
    },
    significance: {
      en: 'The walk of captives extends the tragedy beyond the battlefield.',
      ur: 'قیدیوں کا سفر مصیبت کو میدان جنگ سے آگے بڑھاتا ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '120-128', scholar: 'Allama Majlisi' }),
      cite('Tarikh al-Tabari', { volume: 4, page: '365-370', scholar: 'al-Tabari' }),
    ],
  },
  {
    id: 'arbaeen_kufa',
    order: 2,
    hijriMonth: 2,
    hijriDay: 5,
    title: { en: 'Sermons in Kufa', ur: 'کوفہ میں خطبات' },
    narrative: {
      en: 'Sayyida Zainab (sa) and Imam Zain ul-Abideen (as) address the people of Kufa, exposing their betrayal.',
      ur: 'سیدہ زینبؑ اور امام زین العابدینؑ کوفہ والوں سے خطاب کرتے ہیں۔',
    },
    significance: {
      en: 'The pulpit of Zainab (sa) becomes the second battlefield of Karbala — through words.',
      ur: 'زینبؑ کا منبر کربلا کا دوسرا میدان — کلام کے ذریعے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '130-138', scholar: 'Allama Majlisi' }),
    ],
  },
  {
    id: 'arbaeen_shaam',
    order: 3,
    hijriMonth: 2,
    hijriDay: 10,
    title: { en: 'Captivity in Damascus', ur: 'شام میں اسیری' },
    narrative: {
      en: 'The captives are brought before Yazid. Zainab (sa) delivers her historic sermon in his court.',
      ur: 'اسیر یزید کے سامنے لائے جاتے ہیں۔ زینبؑ دربار میں تاریخی خطبہ دیتی ہیں۔',
    },
    significance: {
      en: 'Truth spoken before tyranny shakes the foundations of false power.',
      ur: 'ظلم کے سامنے حق کا کلام جھوٹی طاقت کی بنیادیں ہلا دیتا ہے۔',
    },
    citations: [
      cite('Bihar al-Anwar', { volume: 45, page: '140-155', scholar: 'Allama Majlisi' }),
      cite('Maqtal al-Husayn', { page: '300-310', scholar: 'al-Khwarazmi', unverified: true }),
    ],
  },
  {
    id: 'arbaeen_return',
    order: 4,
    hijriMonth: 2,
    hijriDay: 15,
    title: { en: 'Return toward Medina', ur: 'مدینہ کی طرف واپسی' },
    narrative: {
      en: 'The survivors of Karbala eventually return toward Medina, carrying the message of Ashura.',
      ur: 'کربلا کے بچے ہوئے اہل بیت آخرکار مدینہ کی طرف لوٹتے ہیں۔',
    },
    significance: {
      en: 'The mission of Karbala continues through memory and mourning.',
      ur: 'کربلا کا مشن یاد و عزاداری کے ذریعے جاری رہتا ہے۔',
    },
    citations: [
      cite('Kitab al-Irshad', { volume: 2, page: '125-130', scholar: 'Shaykh al-Mufid' }),
    ],
  },
  {
    id: 'arbaeen_jabir',
    order: 5,
    hijriMonth: 2,
    hijriDay: 20,
    title: { en: 'Arbaeen — Jabir visits Karbala', ur: 'اربعین — جابر کی زیارت' },
    narrative: {
      en: 'On 20 Safar, Jabir ibn Abdullah al-Ansari visits the grave of Imam Husayn (as), marking the first Arbaeen pilgrimage.',
      ur: '۲۰ صفر کو جابر بن عبداللہ انصاری امام حسینؑ کے مزار پر حاضر ہوتے ہیں — پہلی اربعین۔',
    },
    significance: {
      en: 'Arbaeen transforms grief into the world\'s largest peaceful gathering for justice and love of Ahlul Bayt.',
      ur: 'اربعین غم کو انصاف و محبتِ اہل بیت کی عالمی مجمع میں بدل دیتی ہے۔',
    },
    citations: [
      cite('Kamil al-Ziyarat', { chapter: 'Ziyarat Arbaeen', scholar: 'Ibn Qulawayh' }),
      cite("Ma'alim al-Ziyarat", { page: '220', scholar: 'Ibn Mashhadi' }),
      cite('Mafatih al-Jinan', { chapter: 'Ziyarat Arbaeen', scholar: 'Shaykh Abbas Qummi' }),
    ],
    ziyaratId: 'ziyarat_arbaeen',
  },
];
