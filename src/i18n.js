// Every piece of interface text, Arabic and English side by side.
// A key missing either language stops the build (see the check at the bottom).

export const LANGS = ['ar', 'en'];
export const SITE = { ar: 'دليل الرياض', en: 'Riyadh Guide' };

export const DAYS = {
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

const T = {
  'skip': { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
  'lang.other': { ar: 'English', en: 'العربية' },

  'nav.label': { ar: 'أقسام الموقع', en: 'Site sections' },
  'nav.places': { ar: 'الأماكن', en: 'Places' },
  'nav.numbers': { ar: 'أرقام مهمة', en: 'Important numbers' },
  'nav.help': { ar: 'كيف تساعد', en: 'Ways to help' },
  'nav.links': { ar: 'روابط رسمية', en: 'Official links' },
  'nav.about': { ar: 'عن الموقع', en: 'About' },

  'em.label': { ar: 'أرقام الطوارئ', en: 'Emergency numbers' },
  'em.911': { ar: 'الطوارئ', en: 'Emergency' },
  'em.997': { ar: 'الإسعاف', en: 'Ambulance' },
  'em.937': { ar: 'استشارة صحية', en: 'Health advice' },

  'home.title': { ar: 'دليل الرياض | الأماكن الأساسية وساعات العمل', en: 'Riyadh Guide | Essential places and opening hours' },
  'home.h1': { ar: 'الأماكن الأساسية في الرياض', en: 'Essential places in Riyadh' },
  'home.intro': {
    ar: 'مستشفيات وصيدليات ومراكز تبرع بالدم وأسواق وغيرها، مع ساعات العمل والاتجاهات من موقعك.',
    en: 'Hospitals, pharmacies, blood donation, supermarkets and more, with opening hours and directions from where you are.',
  },
  'home.desc': {
    ar: 'دليل ثابت لسكان الرياض: المستشفيات والصيدليات ومراكز التبرع بالدم والأسواق والسفارات، مع ساعات العمل والاتجاهات وأرقام الطوارئ.',
    en: 'A plain reference for people in Riyadh: hospitals, pharmacies, blood donation centres, supermarkets and embassies, with opening hours, directions and emergency numbers.',
  },
  'home.more': { ar: 'في الموقع أيضاً', en: 'Also on this site' },

  'loc.title': { ar: 'موقعك', en: 'Your location' },
  'loc.none': { ar: 'حدّد موقعك لترتيب الأماكن من الأقرب إليك.', en: 'Set your location to sort places by distance.' },
  'loc.gps': { ar: 'استخدم موقعي الحالي', en: 'Use my current location' },
  'loc.district': { ar: 'أو اختر الحي', en: 'Or choose a district' },
  'loc.pick': { ar: 'اختر الحي', en: 'Choose a district' },
  'loc.current': { ar: 'موقعك الحالي', en: 'Current location' },
  'loc.change': { ar: 'تغيير', en: 'Change' },
  'loc.remove': { ar: 'إزالة الموقع', en: 'Remove location' },
  'loc.privacy': { ar: 'يُحفظ موقعك على جهازك فقط.', en: 'Your location stays on this device.' },
  'loc.denied': { ar: 'تعذّر تحديد موقعك. اختر الحي بدلاً من ذلك.', en: 'Could not get your location. Choose a district instead.' },
  'loc.finding': { ar: 'جارٍ تحديد الموقع', en: 'Finding your location' },

  'cat.back': { ar: 'كل الأماكن', en: 'All places' },
  'cat.search': { ar: 'ابحث بالاسم أو الحي', en: 'Search by name or district' },
  'cat.openNow': { ar: 'مفتوح الآن فقط', en: 'Open now only' },
  'cat.results': { ar: 'النتائج: {n} من {total}', en: 'Results: {n} of {total}' },
  'cat.near': { ar: 'مرتبة من الأقرب إلى موقعك.', en: 'Sorted by distance from your location.' },
  'cat.none': { ar: 'لا توجد نتائج مطابقة.', en: 'No places match.' },
  'cat.more': { ar: 'عرض المزيد', en: 'Show more' },
  'cat.map': { ar: 'عرض الخريطة', en: 'Show map' },
  'cat.hideMap': { ar: 'إخفاء الخريطة', en: 'Hide map' },
  'cat.mapLabel': { ar: 'خريطة الأماكن', en: 'Map of places' },
  'cat.mapFail': { ar: 'تعذّر تحميل الخريطة. القائمة أدناه تعمل بدونها.', en: 'The map could not load. The list below works without it.' },
  'cat.caveat': {
    ar: 'القائمة غير مكتملة، وساعات العمل قد تتغير في رمضان والأعياد. اتصل قبل الذهاب.',
    en: 'This list is not complete, and hours can change in Ramadan and on holidays. Call before you go.',
  },
  'cat.desc': {
    ar: '{name} في الرياض: المواقع وساعات العمل وأرقام الاتصال والاتجاهات.',
    en: '{name} in Riyadh: locations, opening hours, phone numbers and directions.',
  },

  'place.call': { ar: 'اتصال', en: 'Call' },
  'place.directions': { ar: 'الاتجاهات', en: 'Directions' },
  'place.find': { ar: 'ابحث في خرائط Google', en: 'Find on Google Maps' },
  'place.details': { ar: 'الساعات والتفاصيل', en: 'Hours and details' },
  'place.unknown': { ar: 'ساعات العمل غير مؤكدة', en: 'Hours not confirmed' },
  'place.usual': { ar: 'هذه الساعات المعتادة للسلسلة، وقد يختلف هذا الفرع.', en: 'These are the usual hours for the chain. This branch may differ.' },
  'place.always': { ar: 'مفتوح 24 ساعة', en: 'Open 24 hours' },
  'place.everyDay': { ar: 'كل يوم', en: 'Every day' },
  'place.closed': { ar: 'مغلق', en: 'Closed' },
  'place.open': { ar: 'مفتوح', en: 'Open' },
  'place.closes': { ar: 'يغلق {t}', en: 'closes {t}' },
  'place.opens': { ar: 'يفتح {t}', en: 'opens {t}' },
  'place.to': { ar: 'إلى', en: 'to' },
  'place.website': { ar: 'الموقع الإلكتروني', en: 'Website' },
  'place.source': { ar: 'المصدر', en: 'Source' },
  'place.citizens': { ar: 'خط الطوارئ لمواطني الدولة', en: 'Emergency line for citizens' },
  'place.km': { ar: 'نحو {n} كم', en: 'about {n} km' },
  'place.inList': { ar: 'عرض في القائمة', en: 'Show in list' },

  'own.moh': { ar: 'وزارة الصحة', en: 'Ministry of Health' },
  'own.military': { ar: 'عسكري', en: 'Military' },
  'own.university': { ar: 'جامعي', en: 'University' },
  'own.specialist': { ar: 'تخصصي', en: 'Specialist' },
  'own.private': { ar: 'خاص', en: 'Private' },
  'flag.pediatric_er': { ar: 'طوارئ أطفال', en: "Children's emergency" },
  'flag.trauma_center': { ar: 'مركز إصابات', en: 'Trauma centre' },
  'flag.burns': { ar: 'حروق', en: 'Burns' },

  'numbers.title': { ar: 'أرقام مهمة', en: 'Important numbers' },
  'numbers.intro': {
    ar: 'أرقام رسمية تعمل في الرياض. اضغط على الرقم للاتصال.',
    en: 'Official numbers that work in Riyadh. Tap a number to call.',
  },
  'help.title': { ar: 'كيف تساعد', en: 'Ways to help' },
  'help.intro': {
    ar: 'طرق رسمية ومرخّصة للمساعدة. تبرّع عبر القنوات المرخّصة فقط.',
    en: 'Official, licensed ways to help. Give only through licensed channels.',
  },
  'help.blood': { ar: 'تبرّع بالدم', en: 'Give blood' },
  'help.bloodText': {
    ar: 'يمكنك التبرع إذا كان عمرك بين 18 و65 سنة ووزنك 50 كجم على الأقل. أحضر الهوية الوطنية أو الإقامة أو جواز السفر.',
    en: 'You can donate if you are 18 to 65 and weigh at least 50 kg. Bring your national ID, iqama or passport.',
  },
  'help.bloodLink': { ar: 'مراكز التبرع بالدم في الرياض', en: 'Blood donation centres in Riyadh' },
  'links.title': { ar: 'روابط رسمية', en: 'Official links' },
  'links.intro': {
    ar: 'مواقع وتطبيقات الجهات الحكومية. تُفتح الروابط في نافذة جديدة.',
    en: 'Government sites and apps. Links open in a new tab.',
  },
  'link.open': { ar: 'فتح الموقع', en: 'Open site' },
  'link.arOnly': { ar: '', en: 'Arabic only' },
  'link.enOnly': { ar: 'بالإنجليزية فقط', en: '' },

  'about.title': { ar: 'عن الموقع', en: 'About' },
  'checked': { ar: 'آخر تحقق من البيانات: أكتوبر 2026', en: 'Data last checked: October 2026' },
  'footer.note': {
    ar: 'موقع مستقل وغير حكومي. في الحالات الطارئة اتصل بالرقم 911.',
    en: 'An independent site, not a government service. In an emergency call 911.',
  },
  'footer.osm': { ar: 'بيانات الخريطة: مساهمو OpenStreetMap', en: 'Map data: OpenStreetMap contributors' },

  'e404.title': { ar: 'الصفحة غير موجودة', en: 'Page not found' },
  'e404.text': { ar: 'لا توجد صفحة بهذا العنوان.', en: 'There is no page at this address.' },
  'e404.home': { ar: 'العودة إلى الأماكن', en: 'Back to places' },
};

const OPTIONAL = new Set(['link.arOnly', 'link.enOnly']);
for (const [key, value] of Object.entries(T)) {
  for (const lang of LANGS) {
    if (typeof value[lang] !== 'string' || (!value[lang] && !OPTIONAL.has(key))) {
      throw new Error(`i18n: "${key}" has no ${lang} text`);
    }
  }
}

export function translator(lang) {
  return (key, vars = {}) => {
    if (!T[key]) throw new Error(`i18n: unknown key "${key}"`);
    return T[key][lang].replace(/\{(\w+)\}/g, (_, name) => vars[name]);
  };
}

// The strings the browser scripts need, for one language.
export function clientStrings(lang) {
  const keys = Object.keys(T).filter((k) => /^(place|cat|loc)\./.test(k));
  return Object.fromEntries(keys.map((k) => [k, T[k][lang]]));
}

export const path = (lang, slug = '') => (lang === 'en' ? '/en/' : '/') + (slug ? `${slug}/` : '');
export const otherLang = (lang) => (lang === 'ar' ? 'en' : 'ar');
export const pick = (pair, lang) => pair?.[lang] ?? pair?.[otherLang(lang)] ?? null;
