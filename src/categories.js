// The place categories, in the order they appear on the home page.
export const GROUPS = [
  { id: 'health', ar: 'الصحة', en: 'Health' },
  { id: 'daily', ar: 'الاحتياجات اليومية', en: 'Daily needs' },
  { id: 'official', ar: 'جهات رسمية', en: 'Official' },
];

export const CATEGORIES = [
  { id: 'hospitals', group: 'health', ar: 'مستشفيات فيها طوارئ', en: 'Hospitals with emergency' },
  { id: 'urgent-care', group: 'health', ar: 'الرعاية العاجلة', en: 'Urgent care' },
  { id: 'pharmacies', group: 'health', ar: 'صيدليات', en: 'Pharmacies' },
  { id: 'blood-donation', group: 'health', ar: 'التبرع بالدم', en: 'Blood donation' },
  { id: 'dialysis', group: 'health', ar: 'غسيل الكلى', en: 'Dialysis' },
  { id: 'mental-health', group: 'health', ar: 'الصحة النفسية', en: 'Mental health' },
  { id: 'supermarkets', group: 'daily', ar: 'أسواق غذائية', en: 'Supermarkets' },
  { id: 'fuel', group: 'daily', ar: 'محطات وقود', en: 'Fuel stations' },
  { id: 'embassies', group: 'official', ar: 'سفارات', en: 'Embassies' },
];
