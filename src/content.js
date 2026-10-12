// Phone lines, official links and ways to help. Hand-edited from
// research/helplines-links.json: only items confirmed on an official source.

// One short note above each places list.
export const CATEGORY_NOTES = {
  'hospitals': {
    ar: 'لطلب الإسعاف اتصل بالرقم 997. يُلزم النظام المستشفيات الخاصة بعلاج الحالات الطارئة الخطرة دون مطالبة مالية قبل تقديم العلاج. بعض المستشفيات الحكومية تخدم فئات محددة في الحالات غير الطارئة.',
    en: 'For an ambulance call 997. By law, private hospitals must treat serious emergencies without asking for payment first. Some government hospitals serve specific groups for non-urgent care.',
  },
  'urgent-care': {
    ar: 'مراكز تابعة لوزارة الصحة للحالات العاجلة التي لا تستوجب الذهاب إلى المستشفى. في الحالات الخطرة توجّه إلى طوارئ أقرب مستشفى أو اتصل بالرقم 997.',
    en: 'Ministry of Health centres for urgent cases that do not need a hospital. For anything life-threatening go to a hospital emergency department or call 997.',
  },
  'pharmacies': {
    ar: 'فروع بعض السلاسل وصيدليات مستقلة. كثير من الفروع غير مدرج هنا.',
    en: 'Branches of some chains and independent pharmacies. Many branches are not listed here.',
  },
  'blood-donation': {
    ar: 'يمكنك التبرع إذا كان عمرك بين 18 و65 سنة ووزنك 50 كجم على الأقل. أحضر الهوية الوطنية أو الإقامة أو جواز السفر. يمكنك الحضور مباشرة أو الحجز عبر تطبيق صحتي.',
    en: 'You can donate if you are 18 to 65 and weigh at least 50 kg. Bring your national ID, iqama or passport. You can walk in or book in the Sehhaty app.',
  },
  'dialysis': {
    ar: 'اتصل بالمركز قبل الذهاب للتأكد من إمكانية استقبالك.',
    en: 'Call the centre before you go to check that it can take you.',
  },
  'mental-health': {
    ar: 'للاستشارة النفسية أو لحجز موعد اتصل أولاً بالرقم 937، مجاناً وعلى مدار الساعة.',
    en: 'For a psychological consultation or an appointment, call 937 first. It is free and answers day and night.',
  },
  'supermarkets': {
    ar: 'فروع السلاسل الكبرى وأسواق أخرى.',
    en: 'Branches of the main chains and other supermarkets.',
  },
  'fuel': {
    ar: 'ساعات عمل معظم محطات الوقود غير مؤكدة.',
    en: 'Opening hours for most fuel stations are not confirmed.',
  },
  'embassies': {
    ar: 'السفارات في الرياض مرتبة حسب الدولة. الساعات المذكورة للخدمات القنصلية.',
    en: 'Embassies in Riyadh, by country. Hours shown are for consular services.',
  },
};

export const LINES = [
  {
    id: 'emergency',
    title: { ar: 'الطوارئ', en: 'Emergency' },
    note: {
      ar: 'الأرقام 998 و999 و996 مخصصة للمناطق التي لا يخدمها مركز 911. في الرياض اتصل بالرقم 911.',
      en: 'The numbers 998, 999 and 996 are for regions without a 911 centre. In Riyadh, call 911.',
    },
    items: [
      {
        number: '911',
        name: { ar: 'رقم الطوارئ الموحد', en: 'Unified emergency number' },
        text: {
          ar: 'لأي حالة طارئة في الرياض: الشرطة والدفاع المدني والمرور وأمن الطرق. على مدار الساعة.',
          en: 'Any emergency in Riyadh: police, fire and rescue, traffic, road security. Day and night.',
        },
      },
      {
        number: '997',
        name: { ar: 'الإسعاف: هيئة الهلال الأحمر السعودي', en: 'Ambulance: Saudi Red Crescent' },
        text: { ar: 'لطلب سيارة إسعاف أو الإبلاغ عن حالة طبية طارئة.', en: 'To call an ambulance or report a medical emergency.' },
      },
      {
        number: '995',
        name: { ar: 'مكافحة المخدرات', en: 'Narcotics control' },
        text: { ar: 'بلاغات تهريب المخدرات أو ترويجها، وتُعالج بسرية تامة.', en: 'Reports about drug dealing or smuggling, handled in confidence.' },
      },
    ],
  },
  {
    id: 'health',
    title: { ar: 'الصحة', en: 'Health' },
    items: [
      {
        number: '937',
        name: { ar: 'وزارة الصحة', en: 'Ministry of Health' },
        text: {
          ar: 'استشارات طبية مجانية من أطباء على مدار الساعة، وإرشادات لحالات التسمم.',
          en: 'Free medical advice from doctors, day and night. Also gives guidance for suspected poisoning.',
        },
      },
      {
        number: '19971',
        name: { ar: 'هيئة الهلال الأحمر: خدمات المستفيدين', en: 'Red Crescent: general enquiries' },
        text: { ar: 'للاستفسارات غير الطارئة. لطلب الإسعاف اتصل بالرقم 997.', en: 'For non-urgent questions. For an ambulance call 997.' },
      },
    ],
  },
  {
    id: 'mental-health',
    title: { ar: 'الصحة النفسية', en: 'Mental health' },
    items: [
      {
        number: '937',
        name: { ar: 'الاستشارات النفسية عبر 937', en: 'Psychological consultations on 937' },
        text: {
          ar: 'اطلب استشارة نفسية أو موعداً في العيادات الحكومية. مجاناً وعلى مدار الساعة.',
          en: 'Ask for a psychological consultation or an appointment at a government clinic. Free, day and night.',
        },
      },
    ],
  },
  {
    id: 'family',
    title: { ar: 'حماية الأسرة', en: 'Family protection' },
    items: [
      {
        number: '1919',
        name: { ar: 'مركز بلاغات العنف الأسري', en: 'Domestic violence reporting centre' },
        text: {
          ar: 'للإبلاغ عن العنف أو الإيذاء داخل الأسرة، لك أو لغيرك. مجاناً وعلى مدار الساعة.',
          en: 'Report violence or abuse within a family, for yourself or someone else. Free, day and night.',
        },
      },
      {
        number: '19922',
        name: { ar: 'هيئة حقوق الإنسان', en: 'Human Rights Commission' },
        text: { ar: 'استقبال شكاوى حقوق الإنسان.', en: 'Receives human rights complaints.' },
      },
    ],
  },
  {
    id: 'utilities',
    title: { ar: 'الكهرباء والمياه والبلدية', en: 'Electricity, water and municipality' },
    items: [
      {
        number: '933',
        name: { ar: 'الكهرباء', en: 'Electricity' },
        text: { ar: 'انقطاع التيار والمخاطر الكهربائية.', en: 'Power cuts and electrical hazards.' },
      },
      {
        number: '931',
        name: { ar: 'مركز بلاغات المياه', en: 'Water reports' },
        text: { ar: 'التسربات وانقطاع المياه وطفح الصرف الصحي. على مدار الساعة.', en: 'Leaks, water cuts and sewage overflow. Day and night.' },
      },
      {
        number: '8004411110',
        name: { ar: 'شركة المياه الوطنية', en: 'National Water Company' },
        text: { ar: 'مركز الاتصال الموحد لخدمة العملاء. على مدار الساعة.', en: 'Customer contact centre. Day and night.' },
      },
      {
        number: '940',
        name: { ar: 'بلاغات البلدية', en: 'Municipality reports' },
        text: { ar: 'أضرار الطرق والنفايات وتجمع المياه في الشوارع.', en: 'Road damage, waste and flooded streets.' },
      },
      {
        number: '19966',
        name: { ar: 'هيئة الاتصالات والفضاء والتقنية', en: 'Telecom regulator' },
        text: {
          ar: 'لمشكلات الاتصالات والإنترنت التي لم يحلّها مزوّد الخدمة.',
          en: 'For mobile or internet problems your provider has not solved.',
        },
      },
    ],
  },
  {
    id: 'residents',
    title: { ar: 'المقيمون والعمل', en: 'Residents and work' },
    items: [
      {
        number: '19911',
        name: { ar: 'وزارة الموارد البشرية والتنمية الاجتماعية', en: 'Ministry of Human Resources' },
        text: {
          ar: 'استفسارات وشكاوى العمل: الأجور والعقود والخلافات مع صاحب العمل.',
          en: 'Labour questions and complaints: wages, contracts, disputes with an employer.',
        },
      },
      {
        number: '992',
        name: { ar: 'الجوازات', en: 'Passports (Jawazat)' },
        text: { ar: 'الإقامة وتأشيرات الخروج والعودة.', en: 'Residency permits, exit and re-entry visas.' },
      },
      {
        number: '920002866',
        name: { ar: 'مساند', en: 'Musaned' },
        text: { ar: 'العمالة المنزلية وأصحاب العمل: العقود والشكاوى.', en: 'Domestic workers and their employers: contracts and complaints.' },
      },
      {
        number: '920020405',
        name: { ar: 'أبشر', en: 'Absher' },
        text: { ar: 'الدعم الفني لمنصة أبشر.', en: 'Support for the Absher platform.' },
      },
    ],
  },
];

export const LINKS = [
  {
    id: 'safety',
    title: { ar: 'السلامة والبيانات الرسمية', en: 'Safety and official statements' },
    items: [
      {
        name: { ar: 'المديرية العامة للدفاع المدني', en: 'Civil Defense' },
        text: { ar: 'البيانات وإرشادات السلامة والخدمات الإلكترونية.', en: 'Statements, safety guidance and online services.' },
        url: { ar: 'https://998.gov.sa/ar/', en: 'https://998.gov.sa/en/' },
      },
      {
        name: { ar: 'المنصة الوطنية للإنذار المبكر', en: 'National Early Warning Platform' },
        text: { ar: 'كيف تعمل رسائل التحذير على الهاتف وما معناها.', en: 'How emergency alerts reach your phone and what they mean.' },
        url: { ar: 'https://998.gov.sa/ar/Page/Automatic-Early-Warning', en: 'https://998.gov.sa/en/Page/Automatic-Early-Warning' },
      },
      {
        name: { ar: 'وكالة الأنباء السعودية (واس)', en: 'Saudi Press Agency (SPA)' },
        text: { ar: 'البيانات الرسمية. تحقق منها قبل تصديق أي شائعة.', en: 'Official statements. Check here before believing a rumour.' },
        url: { ar: 'https://www.spa.gov.sa/', en: 'https://www.spa.gov.sa/en' },
      },
      {
        name: { ar: 'وزارة الداخلية', en: 'Ministry of Interior' },
        text: { ar: 'البيانات الأمنية وخدمات الوزارة.', en: 'Security statements and ministry services.' },
        url: { ar: 'https://www.moi.gov.sa/', en: 'https://moi.gov.sa/Pages/home?lang=en' },
      },
    ],
  },
  {
    id: 'health',
    title: { ar: 'الصحة', en: 'Health' },
    items: [
      {
        name: { ar: 'وزارة الصحة', en: 'Ministry of Health' },
        text: { ar: 'الخدمات الصحية ومواقع المستشفيات والمراكز.', en: 'Health services and locations of hospitals and centres.' },
        url: { ar: 'https://www.moh.gov.sa/Pages/Default.aspx', en: 'https://www.moh.gov.sa/en/Pages/Default.aspx' },
      },
      {
        name: { ar: 'منصة صحتي', en: 'Sehhaty' },
        text: {
          ar: 'تطبيق وزارة الصحة: استشارات فورية وحجز المواعيد والسجل الصحي.',
          en: 'The Ministry of Health app: instant consultations, appointments and health records.',
        },
        url: { ar: 'https://sehhaty.sa/', en: 'https://www.moh.gov.sa/en/eServices/Sehhaty/Pages/default.aspx' },
      },
      {
        name: { ar: 'هيئة الهلال الأحمر السعودي', en: 'Saudi Red Crescent' },
        text: { ar: 'خدمة الإسعاف وتدريب الإسعافات الأولية والتطوع.', en: 'Ambulance service, first-aid training and volunteering.' },
        url: { ar: 'https://www.srca.gov.sa/', en: 'https://www.srca.gov.sa/en/' },
      },
      {
        name: { ar: 'المركز الوطني لتعزيز الصحة النفسية', en: 'National Center for Mental Health Promotion' },
        text: { ar: 'مواد توعوية وإرشادية. ليس خطاً هاتفياً.', en: 'Guidance material. It is not a helpline.' },
        url: { ar: 'https://ncmh.org.sa/', en: null },
      },
    ],
  },
  {
    id: 'services',
    title: { ar: 'الخدمات الحكومية', en: 'Government services' },
    items: [
      {
        name: { ar: 'أبشر', en: 'Absher' },
        text: { ar: 'خدمات وزارة الداخلية: الإقامة والتأشيرات والمرور والمواعيد.', en: 'Ministry of Interior services: residency, visas, traffic, appointments.' },
        url: { ar: 'https://www.absher.sa/', en: 'https://www.absher.sa/' },
      },
      {
        name: { ar: 'توكلنا', en: 'Tawakkalna' },
        text: { ar: 'تطبيق الخدمات الوطني والوثائق الرقمية.', en: 'The national services app, with your digital documents.' },
        url: { ar: 'https://ta.sdaia.gov.sa/', en: null },
      },
      {
        name: { ar: 'المنصة الوطنية GOV.SA', en: 'GOV.SA national platform' },
        text: { ar: 'دليل الخدمات الحكومية في مكان واحد.', en: 'One directory for all government services.' },
        url: { ar: 'https://my.gov.sa/ar', en: 'https://my.gov.sa/en' },
      },
      {
        name: { ar: 'وزارة التعليم', en: 'Ministry of Education' },
        text: { ar: 'إعلانات المدارس والتعليم.', en: 'School and education announcements.' },
        url: { ar: 'https://www.moe.gov.sa/ar/pages/default.aspx', en: 'https://www.moe.gov.sa/en/pages/default.aspx' },
      },
    ],
  },
  {
    id: 'city',
    title: { ar: 'المدينة والتنقل', en: 'City and travel' },
    items: [
      {
        name: { ar: 'أمانة منطقة الرياض', en: 'Riyadh Municipality' },
        text: { ar: 'خدمات المدينة.', en: 'City services.' },
        url: { ar: 'https://alriyadh.gov.sa/ar', en: 'https://alriyadh.gov.sa/en' },
      },
      {
        name: { ar: 'النقل العام لمدينة الرياض', en: 'Riyadh Public Transport' },
        text: { ar: 'مسارات المترو والحافلات والتذاكر. خدمة العملاء: 19933.', en: 'Metro and bus routes and tickets. Customer service: 19933.' },
        url: { ar: 'https://www.rpt.sa/ar/home', en: 'https://www.rpt.sa/en/home' },
      },
      {
        name: { ar: 'مطار الملك خالد الدولي', en: 'King Khalid International Airport' },
        text: { ar: 'حالة الرحلات ومعلومات المسافرين.', en: 'Flight status and passenger information.' },
        url: { ar: null, en: 'https://www.kkia.sa/en' },
      },
      {
        name: { ar: 'الهيئة العامة للطيران المدني', en: 'General Authority of Civil Aviation' },
        text: { ar: 'حقوق المسافرين وإشعارات الطيران.', en: 'Passenger rights and aviation notices.' },
        url: { ar: 'https://gaca.gov.sa/ar/', en: 'https://gaca.gov.sa/en/' },
      },
      {
        name: { ar: 'المركز الوطني للأرصاد', en: 'National Center for Meteorology' },
        text: { ar: 'توقعات الطقس والتنبيهات الرسمية.', en: 'Official weather forecasts and warnings.' },
        url: { ar: 'https://www.ncm.gov.sa/ar', en: 'https://www.ncm.gov.sa/en' },
      },
    ],
  },
];

export const HELP = [
  {
    name: { ar: 'المنصة الوطنية للعمل التطوعي', en: 'National Volunteer Platform' },
    text: { ar: 'ابحث عن فرص تطوعية وسجّل فيها ووثّق ساعاتك.', en: 'Find volunteering opportunities, sign up and log your hours.' },
    url: { ar: 'https://nvg.gov.sa/', en: 'https://nvg.gov.sa/en' },
  },
  {
    name: { ar: 'التطوع في هيئة الهلال الأحمر', en: 'Red Crescent volunteering' },
    text: { ar: 'سجّل متطوعاً في هيئة الهلال الأحمر السعودي.', en: 'Register as a Saudi Red Crescent volunteer.' },
    url: { ar: 'https://srcavolunteer.srca.org.sa/#!/ar/home', en: 'https://srcavolunteer.srca.org.sa/#!/en/home' },
  },
  {
    name: { ar: 'برنامج المستجيب الأول', en: 'First Responder Program' },
    text: {
      ar: 'متطوعون مدرَّبون يُبلَّغون بالحالات الطبية الطارئة القريبة منهم ليساعدوا قبل وصول الإسعاف.',
      en: 'Trained volunteers are alerted to medical emergencies near them, to help before the ambulance arrives.',
    },
    url: { ar: 'https://www.srca.gov.sa/programs/first-responder-program/', en: 'https://www.srca.gov.sa/en/programs/first-responder-program/' },
  },
  {
    name: { ar: 'برنامج سفير الحياة للإسعافات الأولية', en: 'Life Ambassador first-aid training' },
    text: { ar: 'دورات إسعافات أولية للجمهور من الهلال الأحمر.', en: 'Red Crescent first-aid courses for the public.' },
    url: {
      ar: 'https://www.srca.gov.sa/programs/life-ambassador-for-first-aid-program/',
      en: 'https://www.srca.gov.sa/en/programs/life-ambassador-for-first-aid-program/',
    },
  },
  {
    name: { ar: 'منصة إحسان', en: 'Ehsan' },
    text: { ar: 'المنصة الوطنية للعمل الخيري: تبرّع لحالات موثوقة.', en: 'The national charity platform: donate to vetted causes.' },
    url: { ar: 'https://ehsan.sa/', en: null },
  },
  {
    name: { ar: 'منصة ساهم: مركز الملك سلمان للإغاثة', en: 'Sahem: KSrelief' },
    text: { ar: 'تبرّع لحملات الإغاثة خارج المملكة.', en: 'Donate to relief campaigns abroad.' },
    url: { ar: 'https://sahem.ksrelief.org/ar', en: 'https://sahem.ksrelief.org/en' },
  },
  {
    name: { ar: 'التبرع بالأعضاء عبر توكلنا', en: 'Organ donor registration' },
    text: { ar: 'سجّل متبرعاً بالأعضاء بعد الوفاة من تطبيق توكلنا.', en: 'Register as an organ donor after death, in the Tawakkalna app.' },
    url: { ar: 'https://my.gov.sa/ar/services/21530', en: 'https://my.gov.sa/en/services/21530' },
  },
  {
    name: { ar: 'خدمة تبرّع بأمان', en: 'Donate Safely check' },
    text: {
      ar: 'تحقق من ترخيص الجهة أو الحملة قبل أن تتبرع.',
      en: 'Check that a charity or campaign holds a valid licence before you give.',
    },
    url: { ar: 'https://dongovernance.ncnp.gov.sa/aman', en: 'https://dongovernance.ncnp.gov.sa/aman' },
  },
];

export const ABOUT = {
  ar: [
    ['ما هذا الموقع', 'دليل ثابت لسكان الرياض يجمع الأماكن الأساسية وساعات عملها وأرقام الاتصال في مكان واحد. لا ينشر أخباراً ولا تحديثات مباشرة.'],
    ['من أين البيانات', 'من المواقع الرسمية للجهات والمستشفيات والسلاسل التجارية والسفارات، ومن وزارة الصحة، ومن خرائط OpenStreetMap. لكل مكان رابط مصدره إن وُجد.'],
    ['حدود الموقع', 'القوائم غير مكتملة، وقد تتغير الساعات والأرقام بعد تاريخ التحقق، خصوصاً في رمضان والأعياد. اتصل بالمكان قبل الذهاب.'],
    ['موقعك', 'إذا حدّدت موقعك فإنه يُحفظ على جهازك فقط ولا يُرسل إلينا. عند الضغط على «الاتجاهات» تُفتح خرائط Google ويُرسل إليها الموقع لحساب المسار.'],
    ['في الحالات الطارئة', 'لا تعتمد على هذا الموقع. اتصل بالرقم 911، أو بالرقم 997 لطلب الإسعاف.'],
  ],
  en: [
    ['What this is', 'A plain reference for people in Riyadh: essential places, their opening hours and phone numbers in one place. It does not publish news or live updates.'],
    ['Where the data comes from', 'The official sites of agencies, hospitals, shop chains and embassies, the Ministry of Health, and OpenStreetMap. Each place links to its source where there is one.'],
    ['Limits', 'The lists are not complete, and hours and numbers can change after the check date, most of all in Ramadan and on holidays. Call the place before you go.'],
    ['Your location', 'If you set a location it is saved on your device only and is not sent to us. When you tap Directions, Google Maps opens and receives the location to work out the route.'],
    ['In an emergency', 'Do not rely on this site. Call 911, or 997 for an ambulance.'],
  ],
};
