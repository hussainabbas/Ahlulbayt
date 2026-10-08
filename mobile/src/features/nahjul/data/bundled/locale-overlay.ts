import type { NahjulId, NahjulSection, NahjulTranslationLayer } from '../../types';

export type NahjulLocaleOverlayEntry = {
  meta: {
    titles?: Partial<{ en: string; ur: string; ar: string }>;
    subtitles?: Partial<{ en: string; ur: string }>;
    description?: Partial<{ en: string; ur: string }>;
    excerpt?: Partial<{ en: string; ur: string }>;
    themes?: string[];
  };
  /** Full section list — used for sayings and stub entries */
  sections?: NahjulSection[];
  /** When true, overlay sections replace imported sections (preserving imported en when missing) */
  replaceSections?: boolean;
  /** Ur/Ar text for the first body section when imported has different section ids */
  firstBodyTranslation?: Partial<Record<NahjulTranslationLayer, string>>;
};

export const NAHJUL_LOCALE_OVERLAY: Partial<Record<NahjulId, NahjulLocaleOverlayEntry>> = {
  "nb_sermon_001": {
    "meta": {
      "titles": {
        "en": "About the Creation of the World",
        "ur": "تخلیقِ کائنات",
        "ar": "في خلق العالم"
      },
      "subtitles": {
        "en": "On Allah's wisdom in creation",
        "ur": "اللہ کی حکمتِ تخلیق"
      },
      "description": {
        "en": "About the Creation of the World",
        "ur": "تخلیقِ کائنات"
      },
      "excerpt": {
        "en": "Praise be to Allah who spread out the earth and set up mountains...",
        "ur": "حمد ہے اللہ کی جس نے زمین بچھائی..."
      },
      "themes": [
        "creation",
        "wisdom"
      ]
    },
    "sections": [
      {
        "id": "praise",
        "kind": "body",
        "title": {
          "en": "Praise of Allah",
          "ur": "حمدِ باری"
        },
        "arabic": "الْحَمْدُ لِلّٰهِ الَّذِي بَسَطَ الْأَرْضَ وَنَصَبَ الْجِبَالَ\nوَجَعَلَ الظُّلُمَاتِ وَالْأَنْوَارَ",
        "translations": {
          "en": "Praise be to Allah who spread out the earth and set up mountains, and made darkness and light.",
          "ur": "حمد ہے اللہ کی جس نے زمین بچھائی، پہاڑ کھڑے کیے، اندھیرے اور روشنی پیدا کی۔"
        }
      },
      {
        "id": "creation",
        "kind": "body",
        "title": {
          "en": "On Creation",
          "ur": "تخلیق پر"
        },
        "arabic": "ثُمَّ أَنْشَأَ السَّمَاءَ وَالْأَرْضَ بِحُكْمَةٍ\nلِيَعْلَمَ عِبَادُهُ قُدْرَتَهُ وَحِكْمَتَهُ",
        "translations": {
          "en": "Then He created the heavens and the earth with wisdom, so His servants may know His power and wisdom.",
          "ur": "پھر آسمان و زمین کو حکمت سے پیدا کیا تاکہ بندے اس کی قدرت و حکمت جانیں۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "حمد ہے اللہ کی جس نے زمین بچھائی، پہاڑ کھڑے کیے، اندھیرے اور روشنی پیدا کی۔\n\nپھر آسمان و زمین کو حکمت سے پیدا کیا تاکہ بندے اس کی قدرت و حکمت جانیں۔"
    }
  },
  "nb_sermon_002": {
    "meta": {
      "titles": {
        "en": "About the Pious (Muttaqeen)",
        "ur": "متقین",
        "ar": "في المتقين"
      },
      "subtitles": {
        "en": "Qualities of the God-fearing",
        "ur": "پرہیزگاروں کی صفات"
      },
      "description": {
        "en": "About the Pious (Muttaqeen)",
        "ur": "متقین"
      },
      "excerpt": {
        "en": "They are the trustees of Allah on His earth and callers to His religion...",
        "ur": "وہ اللہ کے نائب ہیں زمین پر..."
      },
      "themes": [
        "piety",
        "character"
      ]
    },
    "sections": [
      {
        "id": "muttaqeen",
        "kind": "body",
        "title": {
          "en": "The Pious",
          "ur": "متقین"
        },
        "arabic": "هُمْ أُمَنَاءُ اللّٰهِ فِي أَرْضِهِ\nوَدُعَاةٌ إِلَىٰ دِينِهِ",
        "translations": {
          "en": "They are the trustees of Allah on His earth and callers to His religion.",
          "ur": "وہ اللہ کے نائب ہیں زمین پر اور اس کے دین کی طرف بلاتے ہیں۔"
        }
      },
      {
        "id": "qualities",
        "kind": "body",
        "title": {
          "en": "Their Qualities",
          "ur": "ان کی صفات"
        },
        "arabic": "قَدْ أَسْكَنُواٰ أَجْسَادَهُمْ فِي الدُّنْيَا\nوَأَحْيَوْاٰ أَرْوَاحَهُمْ بِالْآخِرَةِ",
        "translations": {
          "en": "They have settled their bodies in this world while their souls live for the hereafter.",
          "ur": "انہوں نے دنیا میں جسم ٹھہرائے اور آخرت کے لیے روحیں زندہ رکھی ہیں۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "وہ اللہ کے نائب ہیں زمین پر اور اس کے دین کی طرف بلاتے ہیں۔\n\nانہوں نے دنیا میں جسم ٹھہرائے اور آخرت کے لیے روحیں زندہ رکھی ہیں۔"
    }
  },
  "nb_sermon_003": {
    "meta": {
      "titles": {
        "en": "Al-Shiqshiqiyyah",
        "ur": "الشقشیقیہ",
        "ar": "الشقشقية"
      },
      "subtitles": {
        "en": "The famous sermon on caliphate",
        "ur": "خلافت پر مشہور خطبہ"
      },
      "description": {
        "en": "Al-Shiqshiqiyyah",
        "ur": "الشقشیقیہ"
      },
      "excerpt": {
        "en": "By Allah, the son of Abu Quhafah (Abu Bakr) dressed himself with it...",
        "ur": "قسم ہے اللہ کی، ابنِ ابی قحافہ نے..."
      },
      "themes": [
        "history",
        "caliphate"
      ]
    },
    "sections": [
      {
        "id": "shiqshiqiyyah",
        "kind": "body",
        "title": {
          "en": "Al-Shiqshiqiyyah",
          "ur": "الشقشیقیہ"
        },
        "arabic": "وَاللّٰهِ لَقَدْ تَلَقَّيْتُهَا لَقْلَقَةً\nوَرَدَّدْتُهَا حَوْلَ فِرَاشِي",
        "translations": {
          "en": "By Allah, I was made to accept it reluctantly, and I rolled with it around my bed.",
          "ur": "قسم ہے اللہ کی، مجھے یہ رٹ لگائی گئی اور میں بستر پر اس کے ساتھ لڑتا رہا۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "قسم ہے اللہ کی، مجھے یہ رٹ لگائی گئی اور میں بستر پر اس کے ساتھ لڑتا رہا۔"
    }
  },
  "nb_sermon_004": {
    "meta": {
      "titles": {
        "en": "About Amir al-Mu'minin",
        "ur": "امیرالمومنین کے بارے میں",
        "ar": "في أمير المؤمنين"
      },
      "subtitles": {
        "en": "On his own station",
        "ur": "اپنے مقام پر"
      },
      "description": {
        "en": "About Amir al-Mu'minin",
        "ur": "امیرالمومنین کے بارے میں"
      },
      "excerpt": {
        "en": "I am the brother of the Messenger of Allah and his successor...",
        "ur": "میں رسول اللہؐ کا بھائی اور وصی ہوں..."
      },
      "themes": [
        "wilayah",
        "leadership"
      ]
    }
  },
  "nb_sermon_005": {
    "meta": {
      "titles": {
        "en": "About the Murder of Uthman",
        "ur": "عثمانؓ کے قتل پر",
        "ar": "في قتل عثمان"
      },
      "subtitles": {
        "en": "On the tragedy of Uthman",
        "ur": "عثمانؓ کی شہادت"
      },
      "description": {
        "en": "About the Murder of Uthman",
        "ur": "عثمانؓ کے قتل پر"
      },
      "excerpt": {
        "en": "Then matters turned as they did, and the people divided...",
        "ur": "پھر معاملات بدل گئے..."
      },
      "themes": [
        "history",
        "justice"
      ]
    }
  },
  "nb_sermon_006": {
    "meta": {
      "titles": {
        "en": "To the People of Basrah",
        "ur": "اہلِ بصرہ کے نام",
        "ar": "إلى أهل البصرة"
      },
      "subtitles": {
        "en": "After the Battle of the Camel",
        "ur": "جمل کے بعد"
      },
      "description": {
        "en": "To the People of Basrah",
        "ur": "اہلِ بصرہ کے نام"
      },
      "excerpt": {
        "en": "O people of Basrah, you were the first to revolt...",
        "ur": "اے اہلِ بصرہ، تم نے سب سے پہلے بغاوت کی..."
      },
      "themes": [
        "history",
        "advice"
      ]
    }
  },
  "nb_sermon_007": {
    "meta": {
      "titles": {
        "en": "On Patience",
        "ur": "صبر پر",
        "ar": "في الصبر"
      },
      "subtitles": {
        "en": "The virtue of steadfastness",
        "ur": "صبر کی فضیلت"
      },
      "description": {
        "en": "On Patience",
        "ur": "صبر پر"
      },
      "excerpt": {
        "en": "Patience is of two kinds: patience over what you dislike...",
        "ur": "صبر دو قسم کا ہے..."
      },
      "themes": [
        "patience",
        "ethics"
      ]
    }
  },
  "nb_sermon_008": {
    "meta": {
      "titles": {
        "en": "On Knowledge and Ignorance",
        "ur": "علم و جہالت",
        "ar": "في العلم والجهل"
      },
      "subtitles": {
        "en": "The light of knowledge",
        "ur": "علم کی روشنی"
      },
      "description": {
        "en": "On Knowledge and Ignorance",
        "ur": "علم و جہالت"
      },
      "excerpt": {
        "en": "Knowledge is a venerable estate, good as a friend...",
        "ur": "علم معزز مال ہے، اچھا دوست..."
      },
      "themes": [
        "knowledge",
        "wisdom"
      ]
    }
  },
  "nb_sermon_009": {
    "meta": {
      "titles": {
        "en": "On Death",
        "ur": "موت پر",
        "ar": "في الموت"
      },
      "subtitles": {
        "en": "Remembering the hereafter",
        "ur": "آخرت کی یاد"
      },
      "description": {
        "en": "On Death",
        "ur": "موت پر"
      },
      "excerpt": {
        "en": "Every soul shall taste death. How strange that one hopes for the eternal...",
        "ur": "ہر نفس موت کا مذاق چکھے گی..."
      },
      "themes": [
        "death",
        "hereafter"
      ]
    }
  },
  "nb_sermon_010": {
    "meta": {
      "titles": {
        "en": "On Poverty and Wealth",
        "ur": "فقر و دولت",
        "ar": "في الفقر والغنى"
      },
      "subtitles": {
        "en": "True richness and poverty",
        "ur": "حقیقی غنی و فقیر"
      },
      "description": {
        "en": "On Poverty and Wealth",
        "ur": "فقر و دولت"
      },
      "excerpt": {
        "en": "Poverty is in the heart, not in the pocket...",
        "ur": "فقر دل میں ہے، جیب میں نہیں..."
      },
      "themes": [
        "wealth",
        "contentment"
      ]
    }
  },
  "nb_sermon_024": {
    "meta": {
      "titles": {
        "en": "On the Quran",
        "ur": "قرآن پر",
        "ar": "في القرآن"
      },
      "subtitles": {
        "en": "The Book of Allah",
        "ur": "کتابِ اللہ"
      },
      "description": {
        "en": "On the Quran",
        "ur": "قرآن پر"
      },
      "excerpt": {
        "en": "The Quran is the covenant of Allah, His rope stretched between heaven and earth...",
        "ur": "قرآن اللہ کا عہد ہے، اس کی رسی..."
      },
      "themes": [
        "quran",
        "guidance"
      ]
    },
    "sections": [
      {
        "id": "quran",
        "kind": "body",
        "title": {
          "en": "The Quran",
          "ur": "قرآن"
        },
        "arabic": "الْقُرْآنُ عَهْدُ اللّٰهِ إِلَىٰ خَلْقِهِ\nوَحَبْلُهُ الْمَمْدُودُ بَيْنَ السَّمَاءِ وَالْأَرْضِ",
        "translations": {
          "en": "The Quran is the covenant of Allah to His creation and His rope stretched between heaven and earth.",
          "ur": "قرآن اللہ کا عہد ہے اپنی مخلوق سے اور اس کی رسی ہے آسمان و زمین کے درمیان۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "قرآن اللہ کا عہد ہے اپنی مخلوق سے اور اس کی رسی ہے آسمان و زمین کے درمیان۔"
    }
  },
  "nb_sermon_109": {
    "meta": {
      "titles": {
        "en": "On Asceticism (Zuhd)",
        "ur": "زہد پر",
        "ar": "في الزهد"
      },
      "subtitles": {
        "en": "Detachment from the world",
        "ur": "دنیا سے بے رغبتی"
      },
      "description": {
        "en": "On Asceticism (Zuhd)",
        "ur": "زہد پر"
      },
      "excerpt": {
        "en": "This world is a place of transit, not a place of rest...",
        "ur": "یہ دنیا راہگزر ہے، ٹھہرنے کی جگہ نہیں..."
      },
      "themes": [
        "zuhd",
        "hereafter"
      ]
    },
    "sections": [
      {
        "id": "zuhd",
        "kind": "body",
        "title": {
          "en": "Asceticism",
          "ur": "زہد"
        },
        "arabic": "إِنَّ الدُّنْيَا دَارُ عُبُورٍ\nوَلَيْسَتْ دَارُ إِقَامَةٍ",
        "translations": {
          "en": "This world is a place of transit, not a place of rest.",
          "ur": "یہ دنیا راہگزر ہے، ٹھہرنے کی جگہ نہیں۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "یہ دنیا راہگزر ہے، ٹھہرنے کی جگہ نہیں۔"
    }
  },
  "nb_sermon_110": {
    "meta": {
      "titles": {
        "en": "On Prayer",
        "ur": "نماز پر",
        "ar": "في الصلاة"
      },
      "subtitles": {
        "en": "The pillar of religion",
        "ur": "دین کا ستون"
      },
      "description": {
        "en": "On Prayer",
        "ur": "نماز پر"
      },
      "excerpt": {
        "en": "Prayer is the pillar of your religion and the key to your success...",
        "ur": "نماز تمہارے دین کا ستون ہے..."
      },
      "themes": [
        "prayer",
        "worship"
      ]
    }
  },
  "nb_sermon_156": {
    "meta": {
      "titles": {
        "en": "On Justice",
        "ur": "عدل پر",
        "ar": "في العدل"
      },
      "subtitles": {
        "en": "Justice as the foundation",
        "ur": "عدل کی بنیاد"
      },
      "description": {
        "en": "On Justice",
        "ur": "عدل پر"
      },
      "excerpt": {
        "en": "Justice is the foundation of governance and the balance of creation...",
        "ur": "عدل حکومت کی بنیاد ہے..."
      },
      "themes": [
        "justice",
        "governance"
      ]
    }
  },
  "nb_sermon_176": {
    "meta": {
      "titles": {
        "en": "On Hypocrisy",
        "ur": "نفاق پر",
        "ar": "في النفاق"
      },
      "subtitles": {
        "en": "Warning against hypocrites",
        "ur": "منافقوں سے تنبیہ"
      },
      "description": {
        "en": "On Hypocrisy",
        "ur": "نفاق پر"
      },
      "excerpt": {
        "en": "The hypocrite is like a mirage — near it appears water, but there is none...",
        "ur": "منافق سراب کی مانند ہے..."
      },
      "themes": [
        "hypocrisy",
        "character"
      ]
    }
  },
  "nb_letter_001": {
    "meta": {
      "titles": {
        "en": "Letter to Muawiyah",
        "ur": "معاویہ کو خط",
        "ar": "إلى معاوية"
      },
      "subtitles": {
        "en": "On governance and justice",
        "ur": "حکمرانی و عدل"
      },
      "description": {
        "en": "Letter to Muawiyah",
        "ur": "معاویہ کو خط"
      },
      "excerpt": {
        "en": "From the servant of Allah, Ali ibn Abi Talib, to Muawiyah ibn Abi Sufyan...",
        "ur": "اللہ کے بندے علیؑ سے معاویہ کو..."
      },
      "themes": [
        "governance",
        "justice"
      ]
    },
    "sections": [
      {
        "id": "opening",
        "kind": "body",
        "title": {
          "en": "Opening",
          "ur": "آغاز"
        },
        "arabic": "مِنْ عَبْدِ اللّٰهِ عَلِيٍّ بْنِ أَبِي طَالِبٍ\nإِلَىٰ مُعَاوِيَةَ بْنِ أَبِي سُفْيَانَ",
        "translations": {
          "en": "From the servant of Allah, Ali ibn Abi Talib, to Muawiyah ibn Abi Sufyan.",
          "ur": "اللہ کے بندے علیؑ ابنِ ابی طالبؑ سے معاویہ بن ابی سفیان کو۔"
        }
      },
      {
        "id": "counsel",
        "kind": "body",
        "title": {
          "en": "Counsel",
          "ur": "نصیحت"
        },
        "arabic": "أَمَّا بَعْدُ فَإِنَّ الْحَقَّ لَا يُعْرَفُ بِالرِّجَالِ\nاعْرِفِ الْحَقَّ تَعْرِفْ أَهْلَهُ",
        "translations": {
          "en": "Know that truth is not known through men — know the truth and you will know its people.",
          "ur": "سنو! حق لوگوں سے نہیں پہچانا جاتا — حق کو پہچانو تو اہلِ حق پہچان لو گے۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "اللہ کے بندے علیؑ ابنِ ابی طالبؑ سے معاویہ بن ابی سفیان کو۔\n\nسنو! حق لوگوں سے نہیں پہچانا جاتا — حق کو پہچانو تو اہلِ حق پہچان لو گے۔"
    }
  },
  "nb_letter_002": {
    "meta": {
      "titles": {
        "en": "Letter to Uthman",
        "ur": "عثمانؓ کو خط",
        "ar": "إلى عثمان"
      },
      "subtitles": {
        "en": "Counsel before his martyrdom",
        "ur": "شہادت سے پہلے نصیحت"
      },
      "description": {
        "en": "Letter to Uthman",
        "ur": "عثمانؓ کو خط"
      },
      "excerpt": {
        "en": "You have placed yourself in a position where the righteous are troubled...",
        "ur": "تم نے ایسا مقام اختیار کیا..."
      },
      "themes": [
        "counsel",
        "history"
      ]
    }
  },
  "nb_letter_031": {
    "meta": {
      "titles": {
        "en": "Letter to Malik al-Ashtar",
        "ur": "مالک اشتر کو خط",
        "ar": "إلى مالك الأشتر"
      },
      "subtitles": {
        "en": "The famous letter on governance",
        "ur": "حکمرانی کا مشہور خط"
      },
      "description": {
        "en": "Letter to Malik al-Ashtar",
        "ur": "مالک اشتر کو خط"
      },
      "excerpt": {
        "en": "Develop in your heart the feeling of love for your people...",
        "ur": "اپنے دل میں اپنی قوم سے محبت پیدا کرو..."
      },
      "themes": [
        "governance",
        "justice",
        "leadership"
      ]
    },
    "sections": [
      {
        "id": "governance",
        "kind": "body",
        "title": {
          "en": "On Governance",
          "ur": "حکمرانی"
        },
        "arabic": "أَوْصِيكَ يَا مَالِكُ أَنْ تَخُصَّ نَفْسَكَ\nبِخَاصَّةِ الْخِلْقَةِ الْبَشَرِيَّةِ",
        "translations": {
          "en": "I advise you, O Malik, to develop in yourself the human qualities of compassion.",
          "ur": "اے مالک! میں تجھے نصیحت کرتا ہوں کہ اپنے اندر انسانی رحمدلی پیدا کرو۔"
        }
      },
      {
        "id": "justice",
        "kind": "body",
        "title": {
          "en": "Justice",
          "ur": "عدل"
        },
        "arabic": "اجْعَلْ لِلنَّاسِ عِنْدَكَ مَنْزِلَةً\nوَاجْعَلْ لِلْخَيْرِ عِنْدَكَ مَنْزِلَةً",
        "translations": {
          "en": "Give people their due station with you, and give goodness its due station.",
          "ur": "لوگوں کو ان کا حق مقام دو اور بھلائی کو اس کا مقام دو۔"
        }
      },
      {
        "id": "people",
        "kind": "body",
        "title": {
          "en": "Love for People",
          "ur": "محبتِ خلق"
        },
        "arabic": "أَحْبِبْ لِلنَّاسِ مَا تُحِبُّ لِنَفْسِكَ\nوَاكْرَهْ لَهُمْ مَا تَكْرَهُ لَهَا",
        "translations": {
          "en": "Love for people what you love for yourself, and dislike for them what you dislike for yourself.",
          "ur": "لوگوں کے لیے وہی پسند کرو جو اپنے لیے، اور وہی ناپسند جو اپنے لیے۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "اے مالک! میں تجھے نصیحت کرتا ہوں کہ اپنے اندر انسانی رحمدلی پیدا کرو۔\n\nلوگوں کو ان کا حق مقام دو اور بھلائی کو اس کا مقام دو۔\n\nلوگوں کے لیے وہی پسند کرو جو اپنے لیے، اور وہی ناپسند جو اپنے لیے۔"
    }
  },
  "nb_letter_047": {
    "meta": {
      "titles": {
        "en": "Letter to Hasan (AS)",
        "ur": "حسنؑ کو خط",
        "ar": "إلى الحسن"
      },
      "subtitles": {
        "en": "Fatherly counsel",
        "ur": "والدانہ نصیحت"
      },
      "description": {
        "en": "Letter to Hasan (AS)",
        "ur": "حسنؑ کو خط"
      },
      "excerpt": {
        "en": "My son, the world is a place of transit — take from it for your hereafter...",
        "ur": "بیٹا، دنیا راہگزر ہے..."
      },
      "themes": [
        "family",
        "advice"
      ]
    },
    "sections": [
      {
        "id": "counsel",
        "kind": "body",
        "title": {
          "en": "To Hasan (AS)",
          "ur": "حسنؑ کو"
        },
        "arabic": "يَا بُنَيَّ إِنَّ الدُّنْيَا دَارُ عُبُورٍ\nفَخُذْ مِنْهَا لِآخِرَتِكَ",
        "translations": {
          "en": "My son, the world is a place of transit — take from it for your hereafter.",
          "ur": "بیٹا، دنیا راہگزر ہے — اپنی آخرت کے لیے اس سے لے لو۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "بیٹا، دنیا راہگزر ہے — اپنی آخرت کے لیے اس سے لے لو۔"
    }
  },
  "nb_letter_053": {
    "meta": {
      "titles": {
        "en": "Letter to Umayr ibn al-Humam",
        "ur": "عمیر بن حمام کو خط",
        "ar": "إلى عمير بن الحمام"
      },
      "subtitles": {
        "en": "On the night before Ashura",
        "ur": "عاشورا سے پہلے کی رات"
      },
      "description": {
        "en": "Letter to Umayr ibn al-Humam",
        "ur": "عمیر بن حمام کو خط"
      },
      "excerpt": {
        "en": "O Umayr, death is a bridge that takes the friend to the Friend...",
        "ur": "اے عمیر، موت پل ہے جو دوست کو دوست تک لے جاتی ہے..."
      },
      "themes": [
        "martyrdom",
        "karbala"
      ]
    },
    "sections": [
      {
        "id": "ashura",
        "kind": "body",
        "title": {
          "en": "Before Ashura",
          "ur": "عاشورا سے پہلے"
        },
        "arabic": "يَا عُمَيْرُ إِنَّ الْمَوْتَ جِسْرٌ\nيُوصِلُ الْحَبِيبَ إِلَىٰ الْحَبِيبِ",
        "translations": {
          "en": "O Umayr, death is a bridge that takes the friend to the Friend.",
          "ur": "اے عمیر! موت پل ہے جو دوست کو دوست (اللہ) تک لے جاتی ہے۔"
        }
      }
    ],
    "replaceSections": false,
    "firstBodyTranslation": {
      "ur": "اے عمیر! موت پل ہے جو دوست کو دوست (اللہ) تک لے جاتی ہے۔"
    }
  },
  "nb_letter_045": {
    "meta": {
      "titles": {
        "en": "Letter to Amr ibn al-As",
        "ur": "عمرو بن عاص کو خط",
        "ar": "إلى عمرو بن العاص"
      },
      "subtitles": {
        "en": "Before the Battle of Siffin",
        "ur": "صفین سے پہلے"
      },
      "description": {
        "en": "Letter to Amr ibn al-As",
        "ur": "عمرو بن عاص کو خط"
      },
      "excerpt": {
        "en": "You have brought armies against me seeking the world...",
        "ur": "تم دنیا کے لیے مجھ پر لشکر لائے..."
      },
      "themes": [
        "history",
        "war"
      ]
    }
  },
  "nb_letter_078": {
    "meta": {
      "titles": {
        "en": "Letter to Kumayl ibn Ziyad",
        "ur": "کمیلؑ کو خط",
        "ar": "إلى كميل بن زياد"
      },
      "subtitles": {
        "en": "On knowledge and the heart",
        "ur": "علم و دل"
      },
      "description": {
        "en": "Letter to Kumayl ibn Ziyad",
        "ur": "کمیلؑ کو خط"
      },
      "excerpt": {
        "en": "Hearts are containers — the best of them is the most receptive...",
        "ur": "دل برتن ہیں — بہترین سب سے زیادہ قبول کرنے والا..."
      },
      "themes": [
        "knowledge",
        "heart"
      ]
    }
  },
  "nb_letter_080": {
    "meta": {
      "titles": {
        "en": "Letter to Husayn (AS)",
        "ur": "حسینؑ کو خط",
        "ar": "إلى الحسين"
      },
      "subtitles": {
        "en": "Counsel to the Master of Martyrs",
        "ur": "سید الشہداء کو نصیحت"
      },
      "description": {
        "en": "Letter to Husayn (AS)",
        "ur": "حسینؑ کو خط"
      },
      "excerpt": {
        "en": "My son, be patient in the face of truth even if it is bitter...",
        "ur": "بیٹا، حق کے سامنے صبر کرو..."
      },
      "themes": [
        "family",
        "patience"
      ]
    }
  },
  "nb_saying_001": {
    "meta": {
      "titles": {
        "en": "Knowledge Over Worship",
        "ur": "علمِ ایک گھڑی",
        "ar": "العلم ساعة"
      },
      "subtitles": {
        "en": "An hour's contemplation",
        "ur": "ایک گھڑی غور"
      },
      "description": {
        "en": "Knowledge Over Worship",
        "ur": "علمِ ایک گھڑی"
      },
      "excerpt": {
        "en": "An hour's contemplation is better than a year's worship.",
        "ur": "ایک گھڑی غور و فکر سال بھر عبادت سے بہتر ہے۔"
      },
      "themes": [
        "knowledge",
        "worship"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "العلم ساعة",
        "translations": {
          "en": "An hour's contemplation is better than a year's worship.",
          "ur": "ایک گھڑی غور و فکر سال بھر عبادت سے بہتر ہے۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_002": {
    "meta": {
      "titles": {
        "en": "Brother in Religion",
        "ur": "دینی بھائی",
        "ar": "الأخ في الدين"
      },
      "subtitles": {
        "en": "The faithful brother",
        "ur": "مومن بھائی"
      },
      "description": {
        "en": "Brother in Religion",
        "ur": "دینی بھائی"
      },
      "excerpt": {
        "en": "Your brother in religion is like your own soul.",
        "ur": "تمہارا دینی بھائی تمہاری اپنی روح کی مانند ہے۔"
      },
      "themes": [
        "brotherhood",
        "faith"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "الأخ في الدين",
        "translations": {
          "en": "Your brother in religion is like your own soul.",
          "ur": "تمہارا دینی بھائی تمہاری اپنی روح کی مانند ہے۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_003": {
    "meta": {
      "titles": {
        "en": "Two Friends",
        "ur": "دو دوست",
        "ar": "صديقان"
      },
      "subtitles": {
        "en": "Time and the Quran",
        "ur": "وقت اور قرآن"
      },
      "description": {
        "en": "Two Friends",
        "ur": "دو دوست"
      },
      "excerpt": {
        "en": "Be friends with two: time and the Quran.",
        "ur": "دو سے دوستی کرو: وقت اور قرآن۔"
      },
      "themes": [
        "time",
        "quran"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "صديقان",
        "translations": {
          "en": "Be friends with two: time and the Quran.",
          "ur": "دو سے دوستی کرو: وقت اور قرآن۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_004": {
    "meta": {
      "titles": {
        "en": "Poverty and Riches",
        "ur": "فقر و غنا",
        "ar": "الفقر والغنى"
      },
      "subtitles": {
        "en": "True wealth",
        "ur": "حقیقی دولت"
      },
      "description": {
        "en": "Poverty and Riches",
        "ur": "فقر و غنا"
      },
      "excerpt": {
        "en": "Poverty is in the heart, not in the pocket.",
        "ur": "فقر دل میں ہے، جیب میں نہیں۔"
      },
      "themes": [
        "wealth",
        "heart"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "الفقر والغنى",
        "translations": {
          "en": "Poverty is in the heart, not in the pocket.",
          "ur": "فقر دل میں ہے، جیب میں نہیں۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_005": {
    "meta": {
      "titles": {
        "en": "Silence is Wisdom",
        "ur": "خاموشی حکمت",
        "ar": "السكوت حكمة"
      },
      "subtitles": {
        "en": "The wisdom of silence",
        "ur": "خاموشی کی حکمت"
      },
      "description": {
        "en": "Silence is Wisdom",
        "ur": "خاموشی حکمت"
      },
      "excerpt": {
        "en": "Silence is wisdom, and few practice it.",
        "ur": "خاموشی حکمت ہے، اور کم لوگ اسے اپناتے ہیں۔"
      },
      "themes": [
        "silence",
        "wisdom"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "السكوت حكمة",
        "translations": {
          "en": "Silence is wisdom, and few practice it.",
          "ur": "خاموشی حکمت ہے، اور کم لوگ اسے اپناتے ہیں۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_006": {
    "meta": {
      "titles": {
        "en": "World as Transit",
        "ur": "دنیا راہگزر",
        "ar": "الدنيا دار عبور"
      },
      "subtitles": {
        "en": "Do not settle here",
        "ur": "یہاں نہ ٹھہریں"
      },
      "description": {
        "en": "World as Transit",
        "ur": "دنیا راہگزر"
      },
      "excerpt": {
        "en": "This world is a place of transit, not a place of rest.",
        "ur": "یہ دنیا راہگزر ہے، ٹھہرنے کی جگہ نہیں۔"
      },
      "themes": [
        "zuhd",
        "world"
      ]
    }
  },
  "nb_saying_007": {
    "meta": {
      "titles": {
        "en": "Remember Death",
        "ur": "موت یاد رکھو",
        "ar": "اذكر الموت"
      },
      "subtitles": {
        "en": "The destroyer of pleasures",
        "ur": "لذتوں کا تباہ کن"
      },
      "description": {
        "en": "Remember Death",
        "ur": "موت یاد رکھو"
      },
      "excerpt": {
        "en": "Remember death often — it destroys pleasures.",
        "ur": "موت کو کثرت سے یاد کرو — یہ لذتوں کو تباہ کر دیتی ہے۔"
      },
      "themes": [
        "death",
        "remembrance"
      ]
    }
  },
  "nb_saying_008": {
    "meta": {
      "titles": {
        "en": "Patience is Key",
        "ur": "صبر کنجی",
        "ar": "الصبر مفتاح"
      },
      "subtitles": {
        "en": "To every relief",
        "ur": "ہر راحت کی"
      },
      "description": {
        "en": "Patience is Key",
        "ur": "صبر کنجی"
      },
      "excerpt": {
        "en": "Patience is the key to every relief.",
        "ur": "صبر ہر راحت کی کنجی ہے۔"
      },
      "themes": [
        "patience"
      ]
    }
  },
  "nb_saying_009": {
    "meta": {
      "titles": {
        "en": "Justice Foundation",
        "ur": "عدل بنیاد",
        "ar": "العدل أساس"
      },
      "subtitles": {
        "en": "Of all virtues",
        "ur": "تمام فضائل کی"
      },
      "description": {
        "en": "Justice Foundation",
        "ur": "عدل بنیاد"
      },
      "excerpt": {
        "en": "Justice is the foundation of all virtues.",
        "ur": "عدل تمام فضائل کی بنیاد ہے۔"
      },
      "themes": [
        "justice"
      ]
    }
  },
  "nb_saying_010": {
    "meta": {
      "titles": {
        "en": "Hearts as Containers",
        "ur": "دل برتن",
        "ar": "القلوب أوعية"
      },
      "subtitles": {
        "en": "Best heart receives most",
        "ur": "بہترین دل سب سے زیادہ قبول"
      },
      "description": {
        "en": "Hearts as Containers",
        "ur": "دل برتن"
      },
      "excerpt": {
        "en": "Hearts are containers — the best receives the most.",
        "ur": "دل برتن ہیں — بہترین سب سے زیادہ قبول کرتا ہے۔"
      },
      "themes": [
        "heart",
        "knowledge"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "القلوب أوعية",
        "translations": {
          "en": "Hearts are containers — the best receives the most.",
          "ur": "دل برتن ہیں — بہترین سب سے زیادہ قبول کرتا ہے۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_011": {
    "meta": {
      "titles": {
        "en": "Value of Time",
        "ur": "وقت کی قدر",
        "ar": "قيمة الوقت"
      },
      "subtitles": {
        "en": "Do not waste it",
        "ur": "ضائع نہ کرو"
      },
      "description": {
        "en": "Value of Time",
        "ur": "وقت کی قدر"
      },
      "excerpt": {
        "en": "Do not waste your time — it is your capital.",
        "ur": "اپنا وقت ضائع نہ کرو — یہ تمہاری سرمایہ ہے۔"
      },
      "themes": [
        "time"
      ]
    }
  },
  "nb_saying_012": {
    "meta": {
      "titles": {
        "en": "Tongue as Sword",
        "ur": "زبان تلوار",
        "ar": "اللسان سيف"
      },
      "subtitles": {
        "en": "Guard your speech",
        "ur": "اپنی گفتگو کی حفاظت"
      },
      "description": {
        "en": "Tongue as Sword",
        "ur": "زبان تلوار"
      },
      "excerpt": {
        "en": "The tongue is a sword — guard it well.",
        "ur": "زبان تلوار ہے — اس کی اچھی حفاظت کرو۔"
      },
      "themes": [
        "speech",
        "character"
      ]
    }
  },
  "nb_saying_013": {
    "meta": {
      "titles": {
        "en": "Greed Brings Disgrace",
        "ur": "طمع ذلت",
        "ar": "الطمع ذل"
      },
      "subtitles": {
        "en": "Contentment brings honor",
        "ur": "قناعت عزت"
      },
      "description": {
        "en": "Greed Brings Disgrace",
        "ur": "طمع ذلت"
      },
      "excerpt": {
        "en": "Greed brings disgrace; contentment brings honor.",
        "ur": "طمع ذلت لاتی ہے؛ قناعت عزت۔"
      },
      "themes": [
        "greed",
        "contentment"
      ]
    }
  },
  "nb_saying_014": {
    "meta": {
      "titles": {
        "en": "Seek Knowledge",
        "ur": "علم طلب کرو",
        "ar": "اطلب العلم"
      },
      "subtitles": {
        "en": "Even if far away",
        "ur": "چاہے دور ہو"
      },
      "description": {
        "en": "Seek Knowledge",
        "ur": "علم طلب کرو"
      },
      "excerpt": {
        "en": "Seek knowledge even if it is in China.",
        "ur": "علم طلب کرو چاہے وہ چین میں ہو۔"
      },
      "themes": [
        "knowledge"
      ]
    }
  },
  "nb_saying_015": {
    "meta": {
      "titles": {
        "en": "People as Mirror",
        "ur": "لوگ آئینہ",
        "ar": "الناس مرآة"
      },
      "subtitles": {
        "en": "See yourself in others",
        "ur": "دوسروں میں خود دیکho"
      },
      "description": {
        "en": "People as Mirror",
        "ur": "لوگ آئینہ"
      },
      "excerpt": {
        "en": "People are a mirror for you — see your faults in them.",
        "ur": "لوگ تمہارے لیے آئینہ ہیں — اپنی خامیاں ان میں دیکھو۔"
      },
      "themes": [
        "self-knowledge",
        "character"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "الناس مرآة",
        "translations": {
          "en": "People are a mirror for you — see your faults in them.",
          "ur": "لوگ تمہارے لیے آئینہ ہیں — اپنی خامیاں ان میں دیکھو۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_016": {
    "meta": {
      "titles": {
        "en": "Hope and Fear",
        "ur": "امید و خوف",
        "ar": "الرجاء والخوف"
      },
      "subtitles": {
        "en": "Wings of the believer",
        "ur": "مومن کے پر"
      },
      "description": {
        "en": "Hope and Fear",
        "ur": "امید و خوف"
      },
      "excerpt": {
        "en": "Hope and fear are the two wings of the believer.",
        "ur": "امید اور خوف مومن کے دو پر ہیں۔"
      },
      "themes": [
        "hope",
        "fear",
        "faith"
      ]
    }
  },
  "nb_saying_017": {
    "meta": {
      "titles": {
        "en": "World as Prison",
        "ur": "دنیا قید خانہ",
        "ar": "الدنيا سجن"
      },
      "subtitles": {
        "en": "For the believer",
        "ur": "مومن کے لیے"
      },
      "description": {
        "en": "World as Prison",
        "ur": "دنیا قید خانہ"
      },
      "excerpt": {
        "en": "The world is a prison for the believer and paradise for the disbeliever.",
        "ur": "دنیا مومن کے لیے قید خانہ اور کافر کے لیے جنت ہے۔"
      },
      "themes": [
        "world",
        "faith"
      ]
    }
  },
  "nb_saying_018": {
    "meta": {
      "titles": {
        "en": "Charity as Shade",
        "ur": "صدقہ سایہ",
        "ar": "الصدقة ظل"
      },
      "subtitles": {
        "en": "On the Day of Judgment",
        "ur": "قیامت کے دن"
      },
      "description": {
        "en": "Charity as Shade",
        "ur": "صدقہ سایہ"
      },
      "excerpt": {
        "en": "Charity is a shade on the Day of Judgment.",
        "ur": "صدقہ قیامت کے دن سایہ ہے۔"
      },
      "themes": [
        "charity",
        "hereafter"
      ]
    }
  },
  "nb_saying_019": {
    "meta": {
      "titles": {
        "en": "Forgive to Win",
        "ur": "معاف کرو جیتو",
        "ar": "اعفو تفوز"
      },
      "subtitles": {
        "en": "Allah loves the forgiving",
        "ur": "اللہ معاف کرنے والوں سے محبت"
      },
      "description": {
        "en": "Forgive to Win",
        "ur": "معاف کرو جیتو"
      },
      "excerpt": {
        "en": "Forgive and you shall be forgiven; pardon and you shall be honored.",
        "ur": "معاف کرو تو معاف ہو گے؛ درگزر کرو تو عزت پاؤ گے۔"
      },
      "themes": [
        "forgiveness",
        "character"
      ]
    }
  },
  "nb_saying_020": {
    "meta": {
      "titles": {
        "en": "Trust in Allah",
        "ur": "اللہ پر بھروسہ",
        "ar": "توكل على الله"
      },
      "subtitles": {
        "en": "Reliance on the Provider",
        "ur": "رزق دینے والے پر"
      },
      "description": {
        "en": "Trust in Allah",
        "ur": "اللہ پر بھروسہ"
      },
      "excerpt": {
        "en": "Whoever relies on Allah, He suffices him.",
        "ur": "جو اللہ پر بھروسہ کرے، اللہ اسے کافی ہے۔"
      },
      "themes": [
        "tawakkul",
        "faith"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "توكل على الله",
        "translations": {
          "en": "Whoever relies on Allah, He suffices him.",
          "ur": "جو اللہ پر بھروسہ کرے، اللہ اسے کافی ہے۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_021": {
    "meta": {
      "titles": {
        "en": "Anger as Fire",
        "ur": "غصہ آگ",
        "ar": "الغضب نار"
      },
      "subtitles": {
        "en": "Extinguish it with patience",
        "ur": "صبر سے بujhائo"
      },
      "description": {
        "en": "Anger as Fire",
        "ur": "غصہ آگ"
      },
      "excerpt": {
        "en": "Anger is a fire — extinguish it with patience.",
        "ur": "غصہ آگ ہے — صبر سے بujhائo۔"
      },
      "themes": [
        "anger",
        "patience"
      ]
    }
  },
  "nb_saying_022": {
    "meta": {
      "titles": {
        "en": "Humility is Crown",
        "ur": "عاجزی تاج",
        "ar": "التواضع تاج"
      },
      "subtitles": {
        "en": "The crown of the noble",
        "ur": "شرافت کا تاج"
      },
      "description": {
        "en": "Humility is Crown",
        "ur": "عاجزی تاج"
      },
      "excerpt": {
        "en": "Humility is the crown of the noble.",
        "ur": "عاجزی شرافت کا تاج ہے۔"
      },
      "themes": [
        "humility",
        "character"
      ]
    }
  },
  "nb_saying_023": {
    "meta": {
      "titles": {
        "en": "Truth Sets Free",
        "ur": "حق آزاد",
        "ar": "الحق يحرر"
      },
      "subtitles": {
        "en": "Speak truth always",
        "ur": "ہمیشہ سچ بولو"
      },
      "description": {
        "en": "Truth Sets Free",
        "ur": "حق آزاد"
      },
      "excerpt": {
        "en": "Truthfulness leads to righteousness, and righteousness leads to Paradise.",
        "ur": "سچائی نیکی کی طرف لے جاتی ہے، نیکی جنت کی طرف۔"
      },
      "themes": [
        "truth",
        "righteousness"
      ]
    }
  },
  "nb_saying_024": {
    "meta": {
      "titles": {
        "en": "Health is Wealth",
        "ur": "صحت دولت",
        "ar": "الصحة ثروة"
      },
      "subtitles": {
        "en": "Before sickness comes",
        "ur": "بیماری سے پہلے"
      },
      "description": {
        "en": "Health is Wealth",
        "ur": "صحت دولت"
      },
      "excerpt": {
        "en": "Health is a crown on the heads of the healthy that only the sick see.",
        "ur": "صحت صحت مندوں کے سر پر تاج ہے جو صرف بیمار دیکhte ہیں۔"
      },
      "themes": [
        "health",
        "gratitude"
      ]
    }
  },
  "nb_saying_025": {
    "meta": {
      "titles": {
        "en": "Night Prayer",
        "ur": "تہجد",
        "ar": "قيام الليل"
      },
      "subtitles": {
        "en": "Honor of the pious",
        "ur": "نیکوں کی عزت"
      },
      "description": {
        "en": "Night Prayer",
        "ur": "تہجد"
      },
      "excerpt": {
        "en": "The honor of the believer is in the night prayer.",
        "ur": "مومن کی عزت تہجد میں ہے۔"
      },
      "themes": [
        "prayer",
        "worship"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "قيام الليل",
        "translations": {
          "en": "The honor of the believer is in the night prayer.",
          "ur": "مومن کی عزت تہجد میں ہے۔"
        }
      }
    ],
    "replaceSections": true
  },
  "nb_saying_026": {
    "meta": {
      "titles": {
        "en": "Bad Companion",
        "ur": "برا ساتھی",
        "ar": "الرفيق السوء"
      },
      "subtitles": {
        "en": "Like a blacksmith's bellows",
        "ur": "لوہار کی دم کی مانند"
      },
      "description": {
        "en": "Bad Companion",
        "ur": "برا ساتھی"
      },
      "excerpt": {
        "en": "A bad companion is like a blacksmith's bellows — if it does not burn you, its smoke will.",
        "ur": "برا ساتھی لوہار کی دم کی مانند — نہ جلائے تو دھواں دے گا۔"
      },
      "themes": [
        "companionship",
        "character"
      ]
    }
  },
  "nb_saying_027": {
    "meta": {
      "titles": {
        "en": "Good Word",
        "ur": "اچھی بات",
        "ar": "الكلمة الطيبة"
      },
      "subtitles": {
        "en": "Charity in itself",
        "ur": "صدقہ ہے"
      },
      "description": {
        "en": "Good Word",
        "ur": "اچھی بات"
      },
      "excerpt": {
        "en": "A good word is charity.",
        "ur": "اچھی بات صدقہ ہے۔"
      },
      "themes": [
        "speech",
        "charity"
      ]
    }
  },
  "nb_saying_028": {
    "meta": {
      "titles": {
        "en": "Envy Consumes",
        "ur": "حسد کھاتا",
        "ar": "الحسد يأكل"
      },
      "subtitles": {
        "en": "Good deeds like fire on wood",
        "ur": "آگ لکڑی پر"
      },
      "description": {
        "en": "Envy Consumes",
        "ur": "حسد کھاتا"
      },
      "excerpt": {
        "en": "Envy consumes good deeds as fire consumes wood.",
        "ur": "حسد نیک اعمال کو آگ لکڑی کو کھاتی ہے۔"
      },
      "themes": [
        "envy",
        "character"
      ]
    }
  },
  "nb_saying_029": {
    "meta": {
      "titles": {
        "en": "Consult Men",
        "ur": "مشورہ کرو",
        "ar": "شاور الرجال"
      },
      "subtitles": {
        "en": "See different perspectives",
        "ur": "مختلف زاویے"
      },
      "description": {
        "en": "Consult Men",
        "ur": "مشورہ کرو"
      },
      "excerpt": {
        "en": "Consult men and see through their eyes.",
        "ur": "لوگوں سے مشورہ کرو اور ان کی آنکھوں سے دیکho۔"
      },
      "themes": [
        "consultation",
        "wisdom"
      ]
    }
  },
  "nb_saying_030": {
    "meta": {
      "titles": {
        "en": "Death as Gift",
        "ur": "موت تحفہ",
        "ar": "الموت هدية"
      },
      "subtitles": {
        "en": "For the believer",
        "ur": "مومن کے لیے"
      },
      "description": {
        "en": "Death as Gift",
        "ur": "موت تحفہ"
      },
      "excerpt": {
        "en": "Death is a gift for the believer.",
        "ur": "موت مومن کے لیے تحفہ ہے۔"
      },
      "themes": [
        "death",
        "faith"
      ]
    },
    "sections": [
      {
        "id": "quote",
        "kind": "body",
        "title": {
          "en": "Quote",
          "ur": "قول"
        },
        "arabic": "الموت هدية",
        "translations": {
          "en": "Death is a gift for the believer.",
          "ur": "موت مومن کے لیے تحفہ ہے۔"
        }
      }
    ],
    "replaceSections": true
  }
};
