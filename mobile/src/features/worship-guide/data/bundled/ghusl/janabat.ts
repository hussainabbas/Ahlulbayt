import { getCatalogMeta } from '../../../constants/catalog';
import type { WorshipGuideBundle } from '../../../types';
import { E } from '../../shared/englishText';
import { assembleGhuslBundle } from '../../shared/ghuslDetailedContent';
import { L, step } from '../../shared/taharahHelpers';

const title = { en: 'Janabat', ur: 'جنابت', ar: 'الجنابة' };

const JANABAT_FIQH = [
  step({
    id: 'janabat_intro',
    kind: 'intro',
    title: E('The Major Ablution (Ghusl Janabat)', 'غسل جنابت (غسل اکبر)', 'الغسل من الجنابة'),
    body: E(
      '“Janabat” is ritual impurity caused by discharge of semen or sexual intercourse. The person is called “junub”. The Qur\'an says: “O you who believe! Do not go near prayers when you are junub until you have washed yourselves…” (4:43) and “…if you are junub, then purify yourselves.” (5:6)',
      '«جنابت» منی کے اخراج یا جماع سے حاصل ہونے والی نجاستِ اکبر ہے۔ اس شخص کو «جنبی» کہتے ہیں۔ قرآن: «اے ایمان والو! جنبی ہو کر نماز کے قریب نہ جاؤ جب تک غسل نہ کر لو…» (۴:۴۳) اور «…اگر جنبی ہو تو پاک ہو جاؤ» (۵:۶)۔',
      '«الجنابة» نجاسة أكبر بإنزال المني أو الجماع. يُسمى صاحبها «جنباً». يقول القرآن: «يا أيها الذين آمنوا لا تقربوا الصلاة وأنتم جنب حتى تغتسلوا…» (٤:٤٣) و«…إن كنتم جنباً فاطهروا» (٥:٦).',
    ),
    isRequired: false,
    citations: [
      { source: 'Qur\'an 4:43', verified: true },
      { source: 'Qur\'an 5:6', verified: true },
      { source: 'ShiaSalaah.org', verified: true },
      { source: 'Islamic Laws — Ghusl Janabat', verified: true, note: 'al-islam.org' },
    ],
  }),
  step({
    id: 'janabat_causes',
    kind: 'fiqh_note',
    title: E('Causes of Ghusl Janabat', 'غسل جنابت کی وجوہات', 'أسباب غسل الجنابة'),
    body: E(
      '1) Discharge of semen (awake, wet-dream, intentional or not). If unsure, look for: emission with passion, spurting, feeling relaxed after — if all three, treat as semen.\n\n2) Sexual intercourse — penetration of the glans into vagina or anus makes ghusl wajib on both parties, even without full penetration or semen discharge.',
      '۱) منی کا اخراج (بیدار، خواب میں، جان بوجھ کر یا بغیر)۔ شک ہو تو: شہوت کے ساتھ اخراج، اچھل کر نکلنا، بعد میں سکون — تینوں ہوں تو منی سمجھیں۔\n\n۲) جماع — عضوِ تناسل کی پیشاب کی سوراخ یا مقعد میں داخل ہونے سے دونوں پر غسل واجب، چاہے مکمل داخلہ نہ ہو یا منی نہ نکلے۔',
      '١) إنزال المني (يقظة، احتلام، عمداً أو لا). عند الشك: خروج مع شهوة، واندفاع، واسترخاء بعده — إن اجتمعت الثلاث فهو مني.\n\n٢) الجماع — دخول حشفة الذكر في الفرج أو الدبر يوجب الغسل على الطرفين ولو لم يتم الدخول أو لم ينزل المني.',
    ),
    scholarBody: E(
      'For women: if secretion comes with sexual passion and relaxation after, ghusl is precautionary wajib; otherwise it is not najis and ghusl is not wajib.',
      'خواتین: اگر رطوبت شہوت اور بعد میں سکون کے ساتھ آئے تو احتیاطاً غسل واجب؛ ورنہ نجس نہیں اور غسل واجب نہیں۔',
      'للمرأة: إن خرج الإفراز مع شهوة واسترخاء بعده فالغسل واجب احتياطاً؛ وإلا فليس بنجس ولا يجب الغسل.',
    ),
    citations: [{ source: 'Islamic Laws — al-islam.org', verified: true }],
  }),
  step({
    id: 'janabat_forbidden',
    kind: 'fiqh_note',
    title: E('Things forbidden for a junub', 'جنبی پر ممنوعات', 'ما يحرم على الجنب'),
    body: E(
      'Before ghusl: (1) Touching Qur\'an writing, names of Allah, Prophet, Imams, Fatimah (sa). (2) Reciting verses with wajib sajdah (32:15, 41:15, 53:62, 96:19). (3) Entering or staying in a mosque (passing through is allowed except Haram, Masjid al-Nabi, Imams\' shrines). (4) Leaving or taking something in/out of a mosque.',
      'غسل سے پہلے: (۱) قرآن کی تحریر، اللہ، نبی، ائمہ، فاطمہ (س) کے نام چھونا۔ (۲) واجب سجدہ والی آیات (۳۲:۱۵، ۴۱:۱۵، ۵۳:۶۲، ۹۶:۱۹) پڑھنا۔ (۳) مسجد میں داخل ہونا یا ٹھہرنا (حرم، مسجد نبوی، ائمہ کے مزاروں کے سوا گزرنا جائز)۔ (۴) مسجد میں کچھ رکھنا یا نکالنا۔',
      'قبل الغسل: (١) مس كتابة القرآن وأسماء الله والنبي والأئمة وفاطمة (ع). (٢) تلاوة آيات السجدة الواجبة (٣٢:١٥، ٤١:١٥، ٥٣:٦٢، ٩٦:١٩). (٣) الدخول أو المكث في المسجد (المرور جائز إلا الحرم والمسجد النبوي ومشاهد الأئمة). (٤) إدخال أو إخراج شيء من المسجد.',
    ),
    citations: [{ source: 'Qur\'an 4:43', verified: true }],
  }),
  step({
    id: 'janabat_makruh',
    kind: 'fiqh_note',
    title: E('Things makruh for the junub', 'جنبی پر مکروہات', 'ما يكره للجنب'),
    body: E(
      'Eating/drinking (except after wudu or rinsing mouth/nose); reciting more than seven Qur\'an verses; touching Qur\'an cover; sleeping without wudu.',
      'کھانا/پینا مکروہ (سوائے وضو یا منہ/ناک دھونے کے بعد کے)؛ سات سے زیادہ قرآنی آیات پڑھنا؛ قرآن کا غلاف چھونا؛ بغیر وضو سونا۔',
      'الأكل والشرب (إلا بعد الوضوء أو المضمضة والاستنشاق)؛ تلاوة أكثر من سبع آيات؛ مس غلاف المصحف؛ النوم بلا وضوء.',
    ),
    isRequired: false,
  }),
  step({
    id: 'janabat_validity',
    kind: 'fiqh_note',
    title: E('Acts requiring ghusl janabat', 'جنابت میں واجب غسل والے اعمال', 'ما يشترط فيه غسل الجنابة'),
    body: E(
      'Salat (except salat al-mayyit), wajib tawaf, fasting — knowingly remaining junub until dawn in Ramadan invalidates the fast.',
      'نماز (نماز میت کے سوا)، واجب طواف، روزہ — رمضان میں جان بوجھ کر فجر تک جنبی رہنے سے روزہ باطل۔',
      'الصلاة (ما عدا صلاة الميت)، والطواف الواجب، والصوم — البقاء جنباً عمداً إلى الفجر في رمضان يبطل الصوم.',
    ),
    citations: [{ source: 'Qur\'an 5:6', verified: true }],
  }),
];

export const GHUSL_JANABAT: WorshipGuideBundle = {
  meta: getCatalogMeta('ghusl_janabat'),
  bundleVersion: 2,
  ...assembleGhuslBundle(
    'janabat',
    title,
    JANABAT_FIQH,
    L(
      'Janabah ghusl complete. You may now perform salah and other acts requiring taharah.',
      'غسل جنابت مکمل۔ اب نماز اور طہارت والے اعمال کر سکتے ہیں۔',
      'اكتمل غسل الجنابة. يجوز لك الآن أداء الصلاة وما يشترط فيه الطهارة.',
    ),
  ),
};
