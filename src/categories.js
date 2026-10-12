// The place categories, in the order they appear on the home page.
// `short` is the label used on the filter strip. Pictograms are in src/icons.js.
export const GROUPS = [
  { id: 'health', ar: 'الصحة', en: 'Health' },
  { id: 'daily', ar: 'الاحتياجات اليومية', en: 'Daily needs' },
  { id: 'official', ar: 'جهات رسمية', en: 'Official' },
];

// A category that holds more than one kind of place lists them in `kinds`; each kind has
// its own pictogram and can be picked on the category's page.
export const CATEGORIES = [
  {
    id: 'hospitals',
    group: 'health',
    ar: 'المستشفيات والرعاية العاجلة',
    en: 'Hospitals and urgent care',
    short: { ar: 'مستشفيات ورعاية عاجلة', en: 'Hospitals, urgent care' },
    kinds: [
      { id: 'hospitals', ar: 'طوارئ مستشفى', en: 'Hospital emergency' },
      { id: 'urgent-care', ar: 'رعاية عاجلة', en: 'Urgent care' },
    ],
  },
  { id: 'pharmacies', group: 'health', ar: 'صيدليات', en: 'Pharmacies', short: { ar: 'صيدليات', en: 'Pharmacies' } },
  {
    id: 'blood-dialysis',
    group: 'health',
    ar: 'التبرع بالدم وغسيل الكلى',
    en: 'Blood donation and dialysis',
    short: { ar: 'تبرع بالدم وغسيل كلى', en: 'Blood, dialysis' },
    kinds: [
      { id: 'blood-donation', ar: 'تبرع بالدم', en: 'Blood donation' },
      { id: 'dialysis', ar: 'غسيل كلى', en: 'Dialysis' },
    ],
  },
  { id: 'mental-health', group: 'health', ar: 'الصحة النفسية', en: 'Mental health', short: { ar: 'صحة نفسية', en: 'Mental health' } },
  { id: 'supermarkets', group: 'daily', ar: 'أسواق غذائية', en: 'Supermarkets', short: { ar: 'أسواق', en: 'Supermarkets' } },
  { id: 'fuel', group: 'daily', ar: 'محطات وقود', en: 'Fuel stations', short: { ar: 'وقود', en: 'Fuel' } },
  {
    id: 'transport',
    group: 'daily',
    ar: 'النقل العام',
    en: 'Public transport',
    short: { ar: 'نقل عام', en: 'Transport' },
    kinds: [
      { id: 'metro', ar: 'محطة قطار الرياض', en: 'Metro station' },
      // a stop has no opening hours of its own, so it shows no open or closed status
      { id: 'bus', ar: 'موقف حافلات', en: 'Bus stop', untimed: true },
      { id: 'train', ar: 'محطة قطار سار', en: 'SAR train station' },
    ],
  },
  { id: 'embassies', group: 'official', ar: 'سفارات', en: 'Embassies', short: { ar: 'سفارات', en: 'Embassies' } },
];

// Every kind of place in one list, in category order. A category without `kinds` is its own kind.
export const KINDS = CATEGORIES.flatMap((c) => (c.kinds ?? [c]).map((k) => ({ id: k.id, cat: c.id, ar: k.ar, en: k.en, untimed: !!k.untimed })));

// The three numbers on the emergency bar.
export const EMERGENCY = [
  { number: '911', key: 'em.911', icon: 'siren' },
  { number: '997', key: 'em.997', icon: 'ambulance' },
  { number: '937', key: 'em.937', icon: 'advice' },
];
