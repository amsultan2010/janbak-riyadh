// District names come from OpenStreetMap, whose English spellings are a strict
// transliteration. These are the spellings Riyadh actually uses on signs and maps.
const COMMON = {
  'Al Ulayya': 'Al Olaya',
  'Al Malazz': 'Al Malaz',
  'As Sulaymaniyah': 'As Sulimaniyah',
  'An Nakhil': 'An Nakheel',
  'Al Yasamin': 'Al Yasmin',
  'Al Muruj': 'Al Murooj',
  'Al Aqiq': 'Al Aqeeq',
  'Al Ghadir': 'Al Ghadeer',
  'As Suwaydi': 'As Suwaidi',
  'As Suwaydi al Gharbi': 'As Suwaidi Al Gharbi',
  'An Nasim': 'An Naseem',
  'An Nasim al Gharbi': 'An Naseem Al Gharbi',
  'An Nasim ash Sharqi': 'An Naseem Ash Sharqi',
  'Al Aarid': 'Al Arid',
  'Al Malga': 'Al Malqa',
  'Al Nargis': 'An Narjis',
  'As Sulaymaniyah': 'As Sulimaniyah',
  'Al Ghadir': 'Al Ghadeer',
};

const hasArabic = (s) => /[؀-ۿ]/.test(s ?? '');

// { name_ar, name_en } as stored in research/districts.json -> { ar, en }, either may be null
export function districtName(d) {
  const ar = hasArabic(d.name_ar) ? d.name_ar.replace(/^حي\s+/, '') : null;
  const raw =
    (d.name_en ?? (hasArabic(d.name_ar) ? null : d.name_ar))
      ?.replace(/[`']/g, '')
      .replace(/^District of\s+/i, '')
      .replace(/\s+Distri[ck]t\b.*$/i, '')
      .replace(/^(A[a-z])-/, '$1 ')
      .trim() ?? null;
  return { ar, en: raw ? (COMMON[raw] ?? raw) : null };
}
