// The place categories, in the order they appear on the home page.
// `short` is the label used on the filter strip. `color` fills the category's icon tile
// in lists and its pin on the map; the icon itself is always drawn dark on it.
export const GROUPS = [
  { id: 'health', ar: 'الصحة', en: 'Health' },
  { id: 'daily', ar: 'الاحتياجات اليومية', en: 'Daily needs' },
  { id: 'official', ar: 'جهات رسمية', en: 'Official' },
];

export const CATEGORIES = [
  { id: 'hospitals', color: '#74c0fc', group: 'health', ar: 'مستشفيات', en: 'Hospitals', short: { ar: 'مستشفيات', en: 'Hospitals' } },
  { id: 'urgent-care', color: '#ffa94d', group: 'health', ar: 'الرعاية العاجلة', en: 'Urgent care', short: { ar: 'رعاية عاجلة', en: 'Urgent care' } },
  { id: 'pharmacies', color: '#63e6be', group: 'health', ar: 'صيدليات', en: 'Pharmacies', short: { ar: 'صيدليات', en: 'Pharmacies' } },
  { id: 'blood-donation', color: '#ff8787', group: 'health', ar: 'التبرع بالدم', en: 'Blood donation', short: { ar: 'تبرع بالدم', en: 'Blood donation' } },
  { id: 'dialysis', color: '#b197fc', group: 'health', ar: 'غسيل الكلى', en: 'Dialysis', short: { ar: 'غسيل كلى', en: 'Dialysis' } },
  { id: 'mental-health', color: '#f783ac', group: 'health', ar: 'الصحة النفسية', en: 'Mental health', short: { ar: 'صحة نفسية', en: 'Mental health' } },
  { id: 'supermarkets', color: '#c0eb75', group: 'daily', ar: 'أسواق غذائية', en: 'Supermarkets', short: { ar: 'أسواق', en: 'Supermarkets' } },
  { id: 'fuel', color: '#dee2e6', group: 'daily', ar: 'محطات وقود', en: 'Fuel stations', short: { ar: 'وقود', en: 'Fuel' } },
  { id: 'embassies', color: '#66d9e8', group: 'official', ar: 'سفارات', en: 'Embassies', short: { ar: 'سفارات', en: 'Embassies' } },
];

// The three numbers on the emergency bar.
export const EMERGENCY = [
  { number: '911', key: 'em.911', icon: 'siren', color: '#c92a2a' },
  { number: '997', key: 'em.997', icon: 'ambulance', color: '#d9480f' },
  { number: '937', key: 'em.937', icon: 'advice', color: '#1971c2' },
];
