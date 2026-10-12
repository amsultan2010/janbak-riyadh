// The place categories, in the order they appear on the home page.
// `short` is the label used on the filter strip.
export const GROUPS = [
  { id: 'health', ar: 'الصحة', en: 'Health' },
  { id: 'daily', ar: 'الاحتياجات اليومية', en: 'Daily needs' },
  { id: 'official', ar: 'جهات رسمية', en: 'Official' },
];

export const CATEGORIES = [
  { id: 'hospitals', group: 'health', ar: 'مستشفيات', en: 'Hospitals', short: { ar: 'مستشفيات', en: 'Hospitals' } },
  { id: 'urgent-care', group: 'health', ar: 'الرعاية العاجلة', en: 'Urgent care', short: { ar: 'رعاية عاجلة', en: 'Urgent care' } },
  { id: 'pharmacies', group: 'health', ar: 'صيدليات', en: 'Pharmacies', short: { ar: 'صيدليات', en: 'Pharmacies' } },
  { id: 'blood-donation', group: 'health', ar: 'التبرع بالدم', en: 'Blood donation', short: { ar: 'تبرع بالدم', en: 'Blood donation' } },
  { id: 'dialysis', group: 'health', ar: 'غسيل الكلى', en: 'Dialysis', short: { ar: 'غسيل كلى', en: 'Dialysis' } },
  { id: 'mental-health', group: 'health', ar: 'الصحة النفسية', en: 'Mental health', short: { ar: 'صحة نفسية', en: 'Mental health' } },
  { id: 'supermarkets', group: 'daily', ar: 'أسواق غذائية', en: 'Supermarkets', short: { ar: 'أسواق', en: 'Supermarkets' } },
  { id: 'fuel', group: 'daily', ar: 'محطات وقود', en: 'Fuel stations', short: { ar: 'وقود', en: 'Fuel' } },
  { id: 'embassies', group: 'official', ar: 'سفارات', en: 'Embassies', short: { ar: 'سفارات', en: 'Embassies' } },
];
