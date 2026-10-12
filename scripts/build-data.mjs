// Merges research/*.json into src/data/places.json, the one file the site reads.
// Fails the build on a broken entry instead of shipping it.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { parseHours, encodeWeek } from '../src/lib/hours.js';
import { CATEGORIES } from '../src/categories.js';
import { districtName } from '../src/lib/districts.js';

const read = (name) => {
  const path = new URL(`../research/${name}.json`, import.meta.url);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
};

const warnings = [];
const warn = (msg) => warnings.push(msg);

// research/verify/*.json holds the second pass: corrections and fills checked against
// official sources. Each item names a file and an entry id and the fields to set.
const fixes = new Map();
const added = { 'blood-donation': [], branches: [] };
const verifyDir = new URL('../research/verify/', import.meta.url);
for (const name of existsSync(verifyDir) ? readdirSync(verifyDir).filter((n) => n.endsWith('.json')) : []) {
  const pass = JSON.parse(readFileSync(new URL(name, verifyDir), 'utf8'));
  for (const item of pass.items ?? []) {
    if (item.status === 'unverified') continue;
    const key = `${item.file}:${item.id}`;
    const before = fixes.get(key) ?? { set: {}, sources: [] };
    fixes.set(key, {
      set: { ...before.set, ...(item.set ?? {}), ...(item.status === 'remove' ? { remove: true } : {}) },
      sources: [...before.sources, ...(item.sources ?? [])],
    });
  }
  if (pass.new) added['blood-donation'].push(...pass.new);
  if (pass.branches) added.branches.push(...pass.branches);
}
const used = new Set();
function verified(file, list) {
  return list
    .map((r) => {
      const fix = fixes.get(`${file}:${r.id}`);
      if (!fix) return r;
      used.add(`${file}:${r.id}`);
      return { ...r, ...fix.set, sources: [...fix.sources, ...(r.sources ?? [])] };
    })
    .filter((r) => !r.remove);
}

const inRiyadh = (lat, lng) => lat >= 24.3 && lat <= 25.2 && lng >= 46.3 && lng <= 47.1;
const hasArabic = (s) => /[؀-ۿ]/.test(s ?? '');
const rad = (d) => (d * Math.PI) / 180;
function metres(a, b) {
  const x = rad(b.lng - a.lng) * Math.cos(rad((a.lat + b.lat) / 2));
  const y = rad(b.lat - a.lat);
  return Math.sqrt(x * x + y * y) * 6371000;
}

// Districts: drawn boundaries where OpenStreetMap has them, a centre point otherwise.
// Every mapped place is assigned to one, which gives the district filter on the site.
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const areas = [];
for (const d of read('district-areas')?.districts ?? []) {
  const name = districtName(d);
  if (!name.ar) continue;
  areas.push({ ...name, en: name.en ?? name.ar, lat: d.lat, lng: d.lng, bbox: d.bbox, rings: d.rings });
}
for (const d of read('districts')?.districts ?? []) {
  const name = districtName(d);
  if (!name.ar || !name.en || areas.some((a) => a.ar === name.ar)) continue;
  areas.push({ ...name, lat: d.lat, lng: d.lng, bbox: [d.lng - 0.012, d.lat - 0.011, d.lng + 0.012, d.lat + 0.011], rings: null });
}
areas.forEach((a) => {
  let id = slug(a.en) || 'area';
  while (areas.some((b) => b !== a && b.id === id)) id += '-2';
  a.id = id;
});

function inside(p, ring) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > p.lat !== yj > p.lat && p.lng < ((xj - xi) * (p.lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function areaOf(p) {
  const drawn = areas.find((a) => a.rings && p.lng >= a.bbox[0] && p.lng <= a.bbox[2] && p.lat >= a.bbox[1] && p.lat <= a.bbox[3] && a.rings.some((r) => inside(p, r)));
  if (drawn) return drawn;
  let best = null;
  for (const a of areas) {
    if (a.rings) continue;
    const m = metres(p, a);
    if (m < 2500 && (!best || m < best.m)) best = { m, a };
  }
  return best?.a ?? null;
}

// Sites that research found had been taken over; never link them.
const BLOCKED_SITES = ['pakembassyksa.com', 'kenyaembassyriyadh.com'];
const safeUrl = (url) => (url && /^https?:\/\//.test(url) && !BLOCKED_SITES.some((b) => url.includes(b)) ? url : null);
const pickSource = (sources = []) =>
  safeUrl(sources.find((s) => !/openstreetmap|wikipedia|goo\.gl|google\.[a-z.]+\/maps/.test(s)) ?? null);

// one kind of dash in names and addresses, whatever the source used
const tidy = (s) => s?.replace(/\s*[\u2013\u2014]\s*/g, ' - ').trim() ?? null;

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

  const area = lat !== null ? areaOf({ lat, lng }) : null;
  const district = area ? { ar: area.ar, en: area.en } : { ar: r.district_ar ?? null, en: r.district_en ?? null };

  const name = { ar: tidy(r.name_ar), en: tidy(r.name_en) };
  if (!name.ar && !name.en) throw new Error(`${id}: no name`);

  places.push({
    id,
    cat,
    name,
    district,
    area: area?.id ?? null,
    lat: lat === null ? null : +lat.toFixed(5),
    lng: lng === null ? null : +lng.toFixed(5),
    // toll-free and unified numbers are dialled without the country code
    phone: r.phone?.replace(/^\+966[\s-]*(?=800|9200)/, '') ?? null,
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
for (const r of verified('hospitals', read('hospitals')?.places ?? []).filter(sure)) {
  add('hospitals', { ...r, hours: r.hours ?? (r.er_24h ? '24/7' : null), phone: r.er_phone ?? r.phone }, {
    own: r.ownership ?? null,
    flags: r.flags ?? [],
    ...(r.note_ar && r.note_en ? { note: { ar: r.note_ar, en: r.note_en } } : {}),
  });
}

// Blood donation
for (const r of verified('blood-donation', [...(read('blood-donation')?.places ?? []), ...added['blood-donation']]).filter(sure)) {
  add('blood-donation', r, { booking: r.booking ?? null, bookingUrl: safeUrl(r.booking_url) });
}

// Urgent care, dialysis, mental health
const MEDICAL = { urgent_care: 'urgent-care', dialysis: 'dialysis', mental_health: 'mental-health' };
for (const r of verified('other-medical', read('other-medical')?.places ?? [])) add(MEDICAL[r.category], r);

// Embassies
for (const r of verified('embassies', read('embassies')?.places ?? [])) {
  add('embassies', { ...r, name_ar: r.name_ar ?? `سفارة ${r.country_ar}` }, {
    country: { ar: r.country_ar, en: r.country_en },
    phone2: r.emergency_phone && r.emergency_phone !== r.phone ? r.emergency_phone : null,
  });
}

// Chain branches from the chains' own store locators
const retail = read('retail-chains') ?? { chains: [], branches: [] };
retail.chains = verified('retail-chains', retail.chains);
retail.branches = [...retail.branches, ...added.branches.map((b, i) => ({ id: `${b.chain_id}-v${i}`, ...b }))];
const chainById = Object.fromEntries(retail.chains.map((c) => [c.id, c]));
// a chain's usual hours stand in for a branch only when the chain itself published them
const usualHours = (chain) => (chain?.confidence === 'high' ? (chain.typical_hours ?? null) : null);
const RETAIL = { supermarket: 'supermarkets', pharmacy: 'pharmacies', fuel: 'fuel' };
for (const b of retail.branches) {
  const cat = RETAIL[b.type];
  const chain = chainById[b.chain_id];
  if (b.lat == null || !inRiyadh(b.lat, b.lng)) continue;
  if (nearSame(cat, b, 60)) continue;
  const split = (s) => {
    const at = s?.indexOf(' - ') ?? -1;
    return at > 0 ? [s.slice(0, at), s.slice(at + 3)] : [s ?? null, null];
  };
  const [name_ar, addr_ar] = split(tidy(b.name_ar ?? chain?.name_ar));
  const [name_en, addr_en] = split(tidy(b.name_en ?? chain?.name_en));
  const usual = !b.hours ? usualHours(chain) : null;
  add(cat, { ...b, name_ar, name_en, hours: b.hours ?? usual }, {
    ...(addr_ar || addr_en ? { addr: { ar: addr_ar, en: addr_en } } : {}),
    ...(usual ? { usual: true } : {}),
  });
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
  const usual = !o.hours ? usualHours(chain) : null;
  add(cat, { id: o.osm, name_ar, name_en, lat: o.lat, lng: o.lng, phone: o.phone, hours: o.hours ?? usual, website: o.website }, usual ? { usual: true } : {});
}

for (const c of CATEGORIES) {
  if (!places.some((p) => p.cat === c.id)) warn(`category ${c.id} has no places`);
}
for (const key of fixes.keys()) {
  if (!used.has(key)) warn(`verify: no entry matches ${key}`);
}

places.sort((a, b) => a.cat.localeCompare(b.cat) || (a.name.en ?? a.name.ar).localeCompare(b.name.en ?? b.name.ar));
writeFileSync(new URL('../src/data/places.json', import.meta.url), JSON.stringify(places));
// only districts that hold at least one place are offered as a filter
const counts = new Map();
for (const p of places) if (p.area) counts.set(p.area, (counts.get(p.area) ?? 0) + 1);
writeFileSync(
  new URL('../src/data/areas.json', import.meta.url),
  JSON.stringify(areas.map(({ id, ar, en, lat, lng, bbox }) => ({ id, ar, en, lat, lng, bbox, n: counts.get(id) ?? 0 }))),
);
console.log(`${areas.length} districts (${areas.filter((a) => a.rings).length} with boundaries), ${places.filter((p) => p.area).length} of ${places.length} places placed in one`);

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
// The source map comment is dropped because the maps are not shipped.
for (const file of ['maplibre-gl.mjs', 'maplibre-gl-shared.mjs', 'maplibre-gl-worker.mjs', 'maplibre-gl.css']) {
  const code = readFileSync(new URL(`../node_modules/maplibre-gl/dist/${file}`, import.meta.url), 'utf8');
  writeFileSync(new URL(file, vendor), code.replace(/\n\/\/# sourceMappingURL=.*\s*$/, '\n'));
}
