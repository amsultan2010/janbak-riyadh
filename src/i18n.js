// Every piece of interface text, Arabic and English side by side.
// A key missing either language stops the build (see the check at the bottom).

export const LANGS = ['ar', 'en'];
export const SITE = { ar: 'جنبك', en: 'Janbak' };

export const DAYS = {
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

const T = {
  'skip': { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
  'lang.other': { ar: 'English', en: 'العربية' },
  'close': { ar: 'إغلاق', en: 'Close' },

  'nav.label': { ar: 'أقسام الموقع', en: 'Site sections' },
  'nav.places': { ar: 'الأماكن', en: 'Places' },
  'nav.numbers': { ar: 'الأرقام', en: 'Numbers' },
  'nav.help': { ar: 'المساعدة', en: 'Help' },
  'nav.links': { ar: 'الروابط', en: 'Links' },
  'nav.about': { ar: 'عن الموقع', en: 'About' },

  'em.label': { ar: 'أرقام الطوارئ', en: 'Emergency numbers' },
  'em.911': { ar: 'الطوارئ', en: 'Emergency' },
  'em.997': { ar: 'الإسعاف', en: 'Ambulance' },
  'em.937': { ar: 'استشارة صحية', en: 'Health advice' },

  'home.title': { ar: 'جنبك | أرقام الطوارئ والأماكن الأساسية في الرياض، السعودية', en: 'Janbak | Emergency numbers and places in Riyadh, Saudi Arabia' },
  'home.h1': { ar: 'الأماكن الأساسية في الرياض', en: 'Essential places in Riyadh' },
  'home.intro': {
    ar: 'مستشفيات وصيدليات ومراكز تبرع بالدم وأسواق وغيرها، مع ساعات العمل والاتجاهات من موقعك.',
    en: 'Hospitals, pharmacies, blood donation, supermarkets and more, with opening hours and directions from where you are.',
  },
  'home.desc': {
    ar: 'جنبك دليل مجاني لمدينة الرياض في السعودية: أرقام الطوارئ والمستشفيات والصيدليات والأسواق والسفارات، مع ساعات العمل والاتجاهات.',
    en: 'Janbak is a free directory for Riyadh, Saudi Arabia: emergency numbers, hospitals, pharmacies, supermarkets and embassies, with opening hours and directions.',
  },

  // What a search result shows for each page: the title (the site name is added after it)
  // and the description. A category page builds both from `cat.title` and `cat.desc`.
  'seo.numbers.title': { ar: 'أرقام الطوارئ في الرياض، السعودية: 911 و997 و937', en: 'Saudi emergency numbers in Riyadh: 911, 997, 937' },
  'seo.numbers.h1': { ar: 'أرقام الطوارئ والأرقام المهمة', en: 'Emergency and important numbers' },
  'seo.numbers.desc': {
    ar: 'أرقام الطوارئ التي تعمل في الرياض، السعودية: 911 لأي حالة طارئة، 997 للإسعاف، 937 للاستشارة الصحية، مع خطوط الكهرباء والمياه وحماية الأسرة.',
    en: 'Emergency numbers that work in Riyadh, Saudi Arabia: 911 for any emergency, 997 for an ambulance, 937 for health advice, plus utilities and family protection lines.',
  },
  'seo.help.title': { ar: 'التطوع والتبرع والتبرع بالدم في الرياض', en: 'Volunteer, donate and give blood in Riyadh' },
  'seo.help.desc': {
    ar: 'طرق رسمية ومرخّصة للمساعدة في الرياض، السعودية: التبرع بالدم والتطوع وتعلّم الإسعافات الأولية والتبرع عبر المنصات المرخّصة.',
    en: 'Official, licensed ways to help in Riyadh, Saudi Arabia: where to give blood, volunteer, learn first aid and donate through licensed platforms.',
  },
  'seo.links.title': { ar: 'المواقع والتطبيقات الحكومية الرسمية في السعودية', en: 'Official Saudi government sites and apps' },
  'seo.links.desc': {
    ar: 'روابط رسمية لسكان الرياض، السعودية: الدفاع المدني ووزارة الصحة وصحتي وأبشر وتوكلنا والنقل العام لمدينة الرياض والمطار.',
    en: 'Official links for people in Riyadh, Saudi Arabia: Civil Defense, the Ministry of Health, Sehhaty, Absher, Tawakkalna, Riyadh public transport and the airport.',
  },
  'seo.about.title': { ar: 'عن جنبك', en: 'About Janbak' },

  'loc.title': { ar: 'موقعك', en: 'Your location' },
  'loc.none': { ar: 'حدّد موقعك لترتيب الأماكن من الأقرب إليك.', en: 'Set your location to sort places by distance.' },
  'loc.gps': { ar: 'استخدم موقعي الحالي', en: 'Use my current location' },
  'loc.district': { ar: 'أو اختر الحي', en: 'Or choose a district' },
  'loc.pick': { ar: 'اختر الحي', en: 'Choose a district' },
  'loc.current': { ar: 'موقعك الحالي', en: 'Current location' },
  'loc.set': { ar: 'حدّد موقعك', en: 'Set location' },
  'loc.mine': { ar: 'موقعي', en: 'My location' },
  'loc.remove': { ar: 'إزالة الموقع', en: 'Remove location' },
  'loc.privacy': { ar: 'يُحفظ موقعك على جهازك فقط.', en: 'Your location stays on this device.' },
  'loc.denied': { ar: 'تعذّر تحديد موقعك. اختر الحي بدلاً من ذلك.', en: 'Could not get your location. Choose a district instead.' },
  'loc.finding': { ar: 'جارٍ تحديد الموقع', en: 'Finding your location' },
  'loc.pickMap': { ar: 'حدّد على الخريطة', en: 'Pick on the map' },
  'loc.pickHint': { ar: 'اضغط على مكانك في الخريطة.', en: 'Tap where you are on the map.' },
  'loc.picked': { ar: 'موقع محدد على الخريطة', en: 'Spot picked on the map' },

  'cat.back': { ar: 'كل الأماكن', en: 'All places' },
  'cat.search': { ar: 'ابحث بالاسم أو الحي أو النوع', en: 'Search by name, district or type' },
  'cat.kinds': { ar: 'نوع المكان', en: 'Type of place' },
  'cat.all': { ar: 'الكل', en: 'All' },
  'cat.always': { ar: '24 ساعة', en: '24 hours' },
  'cat.inView': { ar: 'ضمن الخريطة', en: 'In map view' },
  'cat.loading': { ar: 'جارٍ تحميل الأماكن', en: 'Loading places' },
  'cat.loadFail': { ar: 'تعذّر تحميل قائمة الأماكن. جرّب تحديث الصفحة.', en: 'The list of places could not load. Try reloading the page.' },
  'cat.browse': { ar: 'تصفح حسب النوع', en: 'Browse by type' },
  'cat.openShort': { ar: 'مفتوح الآن', en: 'Open now' },
  'cat.noneOpen': { ar: 'لا يوجد في هذه القائمة مكان مفتوح الآن.', en: 'Nothing in this list is open right now.' },
  'cat.showAll': { ar: 'عرض الكل', en: 'Show all' },
  'cat.results': { ar: 'النتائج: {n} من {total}', en: 'Results: {n} of {total}' },
  'cat.near': { ar: 'من الأقرب إلى موقعك.', en: 'Nearest to you first.' },
  'cat.none': { ar: 'لا توجد نتائج مطابقة.', en: 'No places match.' },
  'cat.more': { ar: 'عرض المزيد', en: 'Show more' },
  'cat.map': { ar: 'عرض الخريطة', en: 'Show map' },
  'cat.hideMap': { ar: 'إخفاء الخريطة', en: 'Hide map' },
  'cat.mapLabel': { ar: 'خريطة الأماكن', en: 'Map of places' },
  'cat.mapLoading': { ar: 'جارٍ تحميل الخريطة', en: 'Loading the map' },
  'cat.tilt': { ar: 'عرض ثلاثي الأبعاد', en: '3D view' },
  'cat.area': { ar: 'الحي', en: 'District' },
  'cat.areaAll': { ar: 'كل أحياء الرياض', en: 'All of Riyadh' },
  'zone.caution': { ar: 'تنبيه', en: 'Caution' },
  'zone.text': { ar: 'تحقّق من الإعلانات الرسمية قبل التوجه إلى هذه المنطقة.', en: 'Check official announcements before going to this area.' },
  'zone.marked': { ar: 'حُدّدت بتاريخ {date}', en: 'Marked on {date}' },
  'dir.search': { ar: 'ابحث في هذه الصفحة', en: 'Search this page' },
  'dir.all': { ar: 'الكل', en: 'All' },
  'dir.filter': { ar: 'تصفية حسب القسم', en: 'Filter by section' },
  'dir.results': { ar: 'النتائج: {n} من {total}', en: 'Results: {n} of {total}' },
  'dir.none': { ar: 'لا توجد نتائج مطابقة.', en: 'Nothing matches.' },
  'jump.label': { ar: 'في هذه الصفحة', en: 'On this page' },
  'cat.mapFail': { ar: 'تعذّر تحميل الخريطة. القائمة أدناه تعمل بدونها.', en: 'The map could not load. The list below works without it.' },
  'cat.caveat': {
    ar: 'القائمة غير مكتملة، وساعات العمل قد تتغير في رمضان والأعياد. اتصل قبل الذهاب.',
    en: 'This list is not complete, and hours can change in Ramadan and on holidays. Call before you go.',
  },
  'cat.title': { ar: '{name} في الرياض', en: '{name} in Riyadh' },
  'cat.desc': {
    ar: '{name} في الرياض، السعودية: المواقع وساعات العمل وأرقام الاتصال والاتجاهات على الخريطة.',
    en: '{name} in Riyadh, Saudi Arabia: locations, opening hours, phone numbers and directions on a map.',
  },

  'place.call': { ar: 'اتصال', en: 'Call' },
  'place.directions': { ar: 'الاتجاهات', en: 'Directions' },
  'place.find': { ar: 'ابحث في خرائط Google', en: 'Find on Google Maps' },
  'place.details': { ar: 'الساعات والتفاصيل', en: 'Hours and details' },
  'place.hours': { ar: 'ساعات العمل', en: 'Opening hours' },
  'place.back': { ar: 'العودة إلى الخريطة', en: 'Back to map' },
  'place.prev': { ar: 'المكان السابق', en: 'Previous place' },
  'place.next': { ar: 'المكان التالي', en: 'Next place' },
  'place.unknown': { ar: 'ساعات العمل غير مؤكدة', en: 'Hours not confirmed' },
  'place.usual': { ar: 'هذه الساعات المعتادة للسلسلة، وقد يختلف هذا الفرع.', en: 'These are the usual hours for the chain. This branch may differ.' },
  'place.always': { ar: 'مفتوح 24 ساعة', en: 'Open 24 hours' },
  'place.erAlways': { ar: 'الطوارئ تعمل 24 ساعة', en: 'Emergency open 24 hours' },
  'place.erUnknown': { ar: 'ساعات الطوارئ غير منشورة', en: 'Emergency hours not published' },
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
  'place.onMap': { ar: 'عرض على الخريطة', en: 'Show on map' },

  'own.moh': { ar: 'وزارة الصحة', en: 'Ministry of Health' },
  'own.military': { ar: 'عسكري', en: 'Military' },
  'own.university': { ar: 'جامعي', en: 'University' },
  'own.specialist': { ar: 'تخصصي', en: 'Specialist' },
  'own.private': { ar: 'خاص', en: 'Private' },
  'flag.pediatric_er': { ar: 'طوارئ أطفال', en: "Children's emergency" },
  'flag.trauma_center': { ar: 'مركز إصابات', en: 'Trauma centre' },
  'flag.burns': { ar: 'حروق', en: 'Burns' },
  'tag.line': { ar: 'المسار {n}', en: 'Line {n}' },

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
  'links.title': { ar: 'روابط رسمية', en: 'Official links' },
  'links.intro': {
    ar: 'مواقع وتطبيقات الجهات الحكومية. تُفتح الروابط في نافذة جديدة.',
    en: 'Government sites and apps. Links open in a new tab.',
  },
  'link.open': { ar: 'فتح الموقع', en: 'Open site' },
  'link.view': { ar: 'عرض المراكز', en: 'View centres' },
  'link.arOnly': { ar: '', en: 'Arabic only' },
  'link.enOnly': { ar: 'بالإنجليزية فقط', en: '' },

  'about.title': { ar: 'عن الموقع', en: 'About' },
  'checked': { ar: 'آخر تحقق من البيانات: أكتوبر 2026', en: 'Data last checked: October 2026' },
  'footer.note': {
    ar: 'موقع مستقل وغير حكومي. في الحالات الطارئة اتصل بالرقم 911.',
    en: 'An independent site, not a government service. In an emergency call 911.',
  },
  'footer.osm': { ar: 'بيانات الخريطة: مساهمو OpenStreetMap، والخرائط من OpenMapTiles و OpenFreeMap', en: 'Map data: OpenStreetMap contributors. Map tiles: OpenMapTiles and OpenFreeMap' },
  'footer.nav': { ar: 'روابط أسفل الصفحة', en: 'Footer links' },

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
  const keys = Object.keys(T).filter((k) => /^(place|cat|loc|dir|zone)\./.test(k));
  return Object.fromEntries(keys.map((k) => [k, T[k][lang]]));
}

export const path = (lang, slug = '') => (lang === 'en' ? '/en/' : '/') + (slug ? `${slug}/` : '');
export const otherLang = (lang) => (lang === 'ar' ? 'en' : 'ar');
export const pick = (pair, lang) => pair?.[lang] ?? pair?.[otherLang(lang)] ?? null;
