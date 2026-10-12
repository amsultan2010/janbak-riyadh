// Merges research/*.json into src/data/places.json, the one file the site reads.
// Fails the build on a broken entry instead of shipping it.
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { parseHours, encodeWeek } from '../src/lib/hours.js';
import { CATEGORIES } from '../src/categories.js';

const read = (name) => {
  const path = new URL(`../research/${name}.json`, import.meta.url);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
};

const warnings = [];
const warn = (msg) => warnings.push(msg);

const inRiyadh = (lat, lng) => lat >= 24.3 && lat <= 25.2 && lng >= 46.3 && lng <= 47.1;
const hasArabic = (s) => /[؀-ۿ]/.test(s ?? '');
const rad = (d) => (d * Math.PI) / 180;
function metres(a, b) {
  const x = rad(b.lng - a.lng) * Math.cos(rad((a.lat + b.lat) / 2));
  const y = rad(b.lat - a.lat);
  return Math.sqrt(x * x + y * y) * 6371000;
}

const districts = read('districts')?.districts ?? [];
function nearestDistrict(p) {
  let best = null;
  for (const d of districts) {
    const m = metres(p, d);
    if (m < 5000 && (!best || m < best.m)) best = { m, d };
  }
  return best ? { ar: best.d.name_ar, en: best.d.name_en } : { ar: null, en: null };
}

// Sites that research found had been taken over; never link them.
const BLOCKED_SITES = ['pakembassyksa.com', 'kenyaembassyriyadh.com'];
const safeUrl = (url) => (url && /^https?:\/\//.test(url) && !BLOCKED_SITES.some((b) => url.includes(b)) ? url : null);
const pickSource = (sources = []) =>
  safeUrl(sources.find((s) => !/openstreetmap|wikipedia|goo\.gl|google\.[a-z.]+\/maps/.test(s)) ?? null);

const places = [];
const ids = new Set();

function add(cat, r, extra = {}) {
  let id = `${cat}-${String(r.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  while (ids.has(id)) id += '-2';
  ids.add(id);

  let lat = r.lat ?? null;
  let lng = r.lng ?? null;
  if (lat !== null && !inRiyadh(lat, lng)) {
    warn(`${id}: coordinates outside Riyadh dropped`);
    lat = lng = null;
  }

  const week = parseHours(r.hours);
  if (r.hours && !week) warn(`${id}: hours not understood: ${r.hours}`);

  const district =
    r.district_ar && r.district_en
      ? { ar: r.district_ar, en: r.district_en }
      : lat !== null
        ? nearestDistrict({ lat, lng })
        : { ar: r.district_ar ?? null, en: r.district_en ?? null };

  const name = { ar: r.name_ar ?? null, en: r.name_en ?? null };
  if (!name.ar && !name.en) throw new Error(`${id}: no name`);

  places.push({
    id,
    cat,
    name,
    district,
    lat: lat === null ? null : +lat.toFixed(5),
    lng: lng === null ? null : +lng.toFixed(5),
    phone: r.phone ?? null,
    hours: week ? encodeWeek(week) : null,
    website: safeUrl(r.website),
    source: pickSource(r.sources),
    ...extra,
  });
}

const nearSame = (cat, p, limit) => places.some((q) => q.cat === cat && q.lat !== null && metres(p, q) < limit);

// Hospitals with an emergency department
// (entries research marked low confidence are left out: a wrong hospital is worse than a missing one)
const sure = (r) => r.confidence !== 'low';
for (const r of (read('hospitals')?.places ?? []).filter(sure)) {
  add('hospitals', { ...r, hours: r.hours ?? (r.er_24h ? '24/7' : null), phone: r.er_phone ?? r.phone }, {
    own: r.ownership ?? null,
    flags: r.flags ?? [],
  });
}

// Blood donation
for (const r of (read('blood-donation')?.places ?? []).filter(sure)) {
  add('blood-donation', r, { booking: r.booking ?? null, bookingUrl: safeUrl(r.booking_url) });
}

// Urgent care, dialysis, mental health
const MEDICAL = { urgent_care: 'urgent-care', dialysis: 'dialysis', mental_health: 'mental-health' };
for (const r of read('other-medical')?.places ?? []) add(MEDICAL[r.category], r);

// Embassies
for (const r of read('embassies')?.places ?? []) {
  add('embassies', { ...r, name_ar: r.name_ar ?? `سفارة ${r.country_ar}` }, {
    country: { ar: r.country_ar, en: r.country_en },
    phone2: r.emergency_phone && r.emergency_phone !== r.phone ? r.emergency_phone : null,
  });
}

// Chain branches from the chains' own store locators
const retail = read('retail-chains') ?? { chains: [], branches: [] };
const chainById = Object.fromEntries(retail.chains.map((c) => [c.id, c]));
const RETAIL = { supermarket: 'supermarkets', pharmacy: 'pharmacies', fuel: 'fuel' };
for (const b of retail.branches) {
  const cat = RETAIL[b.type];
  const chain = chainById[b.chain_id];
  if (b.lat == null || !inRiyadh(b.lat, b.lng)) continue;
  if (nearSame(cat, b, 60)) continue;
  add(cat, { ...b, name_ar: b.name_ar ?? chain?.name_ar, name_en: b.name_en ?? chain?.name_en });
}

// OpenStreetMap fills the gaps the locators left
const OSM = { supermarket: 'supermarkets', pharmacy: 'pharmacies', fuel: 'fuel' };
const GENERIC = { fuel: { ar: 'محطة وقود', en: 'Fuel station' } };
for (const o of read('osm-places')?.places ?? []) {
  const cat = OSM[o.kind];
  if (!cat || nearSame(cat, o, cat === 'fuel' ? 120 : 100)) continue;
  const text = [o.name, o.name_ar, o.name_en, o.brand].filter(Boolean).join(' ').toLowerCase();
  const chain = retail.chains.find((c) => c.type === o.kind && c.osm_match?.some((m) => text.includes(m.toLowerCase())));
  const name_ar = o.name_ar ?? (hasArabic(o.name) ? o.name : null) ?? chain?.name_ar ?? GENERIC[cat]?.ar ?? null;
  const name_en = o.name_en ?? (o.name && !hasArabic(o.name) ? o.name : null) ?? chain?.name_en ?? GENERIC[cat]?.en ?? null;
  if (!name_ar && !name_en) continue;
  const usual = !o.hours && chain?.confidence === 'high' ? chain.typical_hours : null;
  add(cat, { id: o.osm, name_ar, name_en, lat: o.lat, lng: o.lng, phone: o.phone, hours: o.hours ?? usual, website: o.website }, usual ? { usual: true } : {});
}

for (const c of CATEGORIES) {
  if (!places.some((p) => p.cat === c.id)) warn(`category ${c.id} has no places`);
}

places.sort((a, b) => a.cat.localeCompare(b.cat) || (a.name.en ?? a.name.ar).localeCompare(b.name.en ?? b.name.ar));
writeFileSync(new URL('../src/data/places.json', import.meta.url), JSON.stringify(places));

for (const c of CATEGORIES) {
  const list = places.filter((p) => p.cat === c.id);
  console.log(
    `${c.id.padEnd(15)} ${String(list.length).padStart(4)} places, ${String(list.filter((p) => p.lat !== null).length).padStart(4)} mapped, ${String(list.filter((p) => p.hours).length).padStart(4)} with hours`,
  );
}
if (warnings.length) console.warn(`\n${warnings.length} warnings:\n` + warnings.map((w) => `  ${w}`).join('\n'));

// The map library is served as plain files so the browser can find its worker next to it.
const vendor = new URL('../public/vendor/maplibre/', import.meta.url);
mkdirSync(vendor, { recursive: true });
for (const file of ['maplibre-gl.mjs', 'maplibre-gl-shared.mjs', 'maplibre-gl-worker.mjs', 'maplibre-gl.css']) {
  copyFileSync(new URL(`../node_modules/maplibre-gl/dist/${file}`, import.meta.url), new URL(file, vendor));
}
