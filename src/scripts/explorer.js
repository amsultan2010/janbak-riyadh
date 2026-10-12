// The finder: one list and one map over every place, narrowed by search,
// category and opening hours, and sorted by distance once a location is set.
import { decodeWeek, openState, formatTime } from '../lib/hours.js';
import { hoursLines } from '../lib/hours-text.js';
import { getHome, setHome, lang, say, strings, fold } from './home.js';

const PAGE = 30;
const sep = lang === 'ar' ? '، ' : ', ';
const words = { days: strings.days, to: say('place.to'), everyDay: say('place.everyDay'), always: say('place.always'), closed: say('place.closed') };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icon = (d, color) =>
  `<svg class="icon${color ? ' tile' : ''}"${color ? ` style="--c:${color}"` : ''} viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"></path></svg>`;
const tel = (n) => 'tel:' + n.replace(/\s*(?:ext\.?|x)\s*\d.*$/i, '').replace(/[^\d+]/g, '');

async function start(root) {
  const config = JSON.parse(document.getElementById('explorer-config').textContent);
  const cats = config.cats;
  const preset = root.dataset.cat ?? null;
  const $ = (name) => root.querySelector(`[data-${name}]`);
  const controls = $('controls');
  const search = $('search');
  const openOnly = $('open-only');
  const alwaysOnly = $('always-only');
  const inView = $('in-view');
  const areaSelect = $('area');
  const note = $('cat-note');
  const mapCol = $('map-col');
  const mapBox = $('map');
  const results = $('results');
  const list = $('places');
  const none = $('none');
  const more = $('more');
  const allButton = $('cat-all');
  const catButtons = [...root.querySelectorAll('[data-cat-btn]')];
  const langLink = document.querySelector('a.lang');
  const hasFallback = list.children.length > 0;

  if (!hasFallback) results.textContent = say('cat.loading');
  let data;
  try {
    const res = await fetch(`/data/${lang}.json`);
    if (!res.ok) throw new Error(res.status);
    data = await res.json();
  } catch {
    // a category page keeps its server-rendered list; the home page has the browse links
    if (!hasFallback) results.textContent = say('cat.loadFail');
    return;
  }

  let rows = data.map(([id, c, name, addr, district, lat, lng, phone, hours, usual, phone2, website, source, tags, alt, note, area], order) => ({
    id,
    order,
    cat: cats[c],
    name,
    addr: addr || null,
    district: district || null,
    lat: lat || null,
    lng: lng || null,
    phone: phone || null,
    hours: hours || null,
    week: hours ? decodeWeek(hours) : null,
    always: hours === '*',
    usual,
    phone2: phone2 || null,
    website: website || null,
    source: source || null,
    tags,
    note: note || null,
    area: area || null,
    er: cats[c].id === 'hospitals',
    q: fold([name, addr, district, tags.join(' '), alt, cats[c].name, cats[c].alt].filter(Boolean).join(' ')),
    open: false,
    state: null,
    km: null,
  }));
  if (preset) rows = rows.filter((r) => r.cat.id === preset);
  const byId = new Map(rows.map((r) => [r.id, r]));

  // filters start from the address bar, so a filtered view can be shared as a link
  const params = new URLSearchParams(location.search);
  const selected = new Set(preset ? [] : (params.get('type') ?? '').split(',').filter((id) => cats.some((c) => c.id === id)));
  search.value = params.get('q') ?? '';
  openOnly.checked = params.has('open');
  alwaysOnly.checked = params.has('24h');
  if ([...areaSelect.options].some((o) => o.value === params.get('area'))) areaSelect.value = params.get('area');

  let home = getHome();
  let limit = PAGE;
  let map = null;

  function statusOf(r) {
    if (!r.week) return ['is-unknown', say(r.er ? 'place.erUnknown' : 'place.unknown')];
    const s = r.state;
    if (s.always) return ['is-open', say(r.er ? 'place.erAlways' : 'place.always')];
    if (s.open) return ['is-open', say('place.open') + sep + say('place.closes', { t: formatTime(s.until, lang) })];
    if (s.at === undefined) return ['is-closed', say('place.closed')];
    const when = (s.today ? '' : strings.days[s.day] + ' ') + formatTime(s.at, lang);
    return ['is-closed', say('place.closed') + sep + say('place.opens', { t: when })];
  }

  function refreshStatus() {
    for (const r of rows) {
      if (!r.week) continue;
      r.state = openState(r.week);
      r.open = r.state.open;
    }
  }

  function refreshDistance() {
    const rad = Math.PI / 180;
    for (const r of rows) {
      r.km = null;
      if (!home || r.lat === null) continue;
      const x = (r.lng - home.lng) * rad * Math.cos(((r.lat + home.lat) / 2) * rad);
      const y = (r.lat - home.lat) * rad;
      r.km = Math.sqrt(x * x + y * y) * 6371;
    }
  }

  function mapsUrl(r) {
    if (r.lat === null) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${lang === 'ar' ? 'الرياض' : 'Riyadh'}`)}&hl=${lang}`;
    }
    const origin = home ? `&origin=${home.lat}%2C${home.lng}` : '';
    return `https://www.google.com/maps/dir/?api=1&destination=${r.lat}%2C${r.lng}${origin}&hl=${lang}`;
  }

  function rowHtml(r, showKind) {
    const [cls, status] = statusOf(r);
    const km = r.km === null ? null : say('place.km', { n: r.km < 10 ? Math.max(0.1, r.km).toFixed(1) : Math.round(r.km) });
    const meta = [r.district, ...r.tags, km].filter(Boolean).map((m) => `<span><bdi>${esc(m)}</bdi></span>`).join('');
    const lines = r.week && !r.always ? hoursLines(r.hours, lang, words) : [];
    const facts =
      lines.map((l) => `<dt>${esc(l.days)}</dt><dd>${esc(l.times)}</dd>`).join('') +
      (r.usual ? `<dd class="full small">${esc(say('place.usual'))}</dd>` : '') +
      (r.phone2 ? `<dt>${esc(say('place.citizens'))}</dt><dd><a href="${tel(r.phone2)}"><bdi dir="ltr">${esc(r.phone2)}</bdi></a></dd>` : '') +
      (r.website ? `<dd class="full"><a href="${esc(r.website)}" target="_blank" rel="noopener">${esc(say('place.website'))}</a></dd>` : '') +
      (r.source ? `<dd class="full"><a href="${esc(r.source)}" target="_blank" rel="noopener">${esc(say('place.source'))}</a></dd>` : '');
    return `<li class="place" id="${r.id}">
      <div class="place-head">
        <div>
          ${showKind ? `<p class="kind">${esc(r.cat.name)}</p>` : ''}
          <h2><bdi>${esc(r.name)}</bdi></h2>
          ${r.addr ? `<p><bdi>${esc(r.addr)}</bdi></p>` : ''}
          <p class="meta">${meta}</p>
          <p class="status ${cls}">${esc(status)}</p>
        </div>
        <span class="place-icon" style="--c:${r.cat.color}">${icon(r.cat.icon)}</span>
      </div>
      ${r.note ? `<p class="place-note">${esc(r.note)}</p>` : ''}
      <div class="actions">
        ${r.phone ? `<a class="btn btn-fill" href="${tel(r.phone)}">${esc(say('place.call'))} <bdi dir="ltr">${esc(r.phone)}</bdi></a>` : ''}
        <a class="btn" href="${mapsUrl(r)}" target="_blank" rel="noopener">${esc(say(r.lat === null ? 'place.find' : 'place.directions'))}</a>
        ${r.lat === null ? '' : `<button type="button" class="btn btn-icon" data-show="${r.id}" aria-label="${esc(say('place.onMap'))}" title="${esc(say('place.onMap'))}">${icon(config.pin)}</button>`}
      </div>
      ${facts ? `<details><summary>${esc(say('place.details'))}</summary><dl class="facts">${facts}</dl></details>` : ''}
    </li>`;
  }

  function popupFor(id) {
    const r = byId.get(id);
    const [cls, status] = statusOf(r);
    const box = document.createElement('div');
    box.className = 'pop';
    box.innerHTML = `<p class="kind">${icon(r.cat.icon, r.cat.color)}${esc(r.cat.name)}</p><strong><bdi>${esc(r.name)}</bdi></strong>
      <p class="status ${cls}">${esc(status)}</p>
      <p class="pop-actions">${r.phone ? `<a href="${tel(r.phone)}">${esc(say('place.call'))}</a>` : ''}<a href="${mapsUrl(r)}" target="_blank" rel="noopener">${esc(say('place.directions'))}</a></p>`;
    return box;
  }

  function matches() {
    const tokens = fold(search.value).split(/\s+/).filter(Boolean);
    const box = inView.checked && map ? map.bounds() : null;
    const found = rows.filter(
      (r) =>
        (!selected.size || selected.has(r.cat.id)) &&
        (!openOnly.checked || r.open) &&
        (!alwaysOnly.checked || r.always) &&
        (!areaSelect.value || r.area === areaSelect.value) &&
        (!box || (r.lat !== null && box.contains([r.lng, r.lat]))) &&
        tokens.every((t) => r.q.includes(t)),
    );
    return found.sort((a, b) => (home ? (a.km ?? 1e9) - (b.km ?? 1e9) : 0) || a.order - b.order);
  }

  function syncUrl() {
    const next = new URLSearchParams();
    if (search.value.trim()) next.set('q', search.value.trim());
    if (selected.size) next.set('type', [...selected].join(','));
    if (openOnly.checked) next.set('open', '1');
    if (alwaysOnly.checked) next.set('24h', '1');
    if (areaSelect.value) next.set('area', areaSelect.value);
    const query = next.toString();
    history.replaceState(null, '', location.pathname + (query ? `?${query}` : '') + location.hash);
    if (langLink) langLink.href = langLink.pathname + (query ? `?${query}` : '');
  }

  function apply({ fit = true } = {}) {
    const found = matches();
    const single = preset ?? (selected.size === 1 ? [...selected][0] : null);
    list.innerHTML = found.slice(0, limit).map((r) => rowHtml(r, !single)).join('');
    results.textContent = say('cat.results', { n: found.length, total: rows.length });
    if (home) results.append(Object.assign(document.createElement('span'), { textContent: ' ' + say('cat.near') }));
    none.hidden = found.length > 0;
    more.hidden = found.length <= limit;
    allButton?.setAttribute('aria-pressed', String(selected.size === 0));
    for (const b of catButtons) b.setAttribute('aria-pressed', String(selected.has(b.dataset.catBtn)));
    if (!preset) {
      note.hidden = !single;
      if (single) note.textContent = cats.find((c) => c.id === single).note;
    }
    syncUrl();
    map?.setPoints(found.filter((r) => r.lat !== null), home, fit && !inView.checked && !areaSelect.value);
  }

  const reset = () => {
    limit = PAGE;
    apply();
  };
  let typing;
  search.addEventListener('input', () => {
    clearTimeout(typing);
    typing = setTimeout(reset, 140);
  });
  for (const box of [openOnly, alwaysOnly, inView]) box.addEventListener('change', reset);
  // choosing a district narrows the list to it and moves the map there
  const showArea = () => {
    const bbox = areaSelect.selectedOptions[0]?.dataset.bbox?.split(',').map(Number);
    if (bbox && map) map.lookAt([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
  };
  areaSelect.addEventListener('change', () => {
    reset();
    showArea();
  });
  allButton?.addEventListener('click', () => {
    selected.clear();
    reset();
  });
  for (const b of catButtons) {
    b.addEventListener('click', () => {
      const id = b.dataset.catBtn;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      reset();
    });
  }
  more.addEventListener('click', () => {
    limit += PAGE;
    apply({ fit: false });
  });
  list.addEventListener('click', (e) => {
    const button = e.target.closest('[data-show]');
    if (!button || !map) return;
    map.select(byId.get(button.dataset.show));
    mapBox.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  document.addEventListener('homechange', (e) => {
    home = e.detail;
    refreshDistance();
    reset();
  });
  document.addEventListener('pickstart', () => {
    if (!map) return;
    mapBox.scrollIntoView({ block: 'nearest' });
    map.pick((at) => setHome({ lat: +at.lat.toFixed(5), lng: +at.lng.toFixed(5), picked: true }));
  });

  controls.hidden = false;
  $('refine').hidden = false;
  mapCol.hidden = false;
  refreshStatus();
  refreshDistance();
  apply();
  setInterval(() => {
    refreshStatus();
    apply({ fit: false });
  }, 60000);

  try {
    const { createMap } = await import('./map.js');
    // satellite imagery by default; the choice is remembered on this device
    const modeButton = $('map-mode');
    const credit = $('map-credit');
    let satellite = true;
    try {
      satellite = localStorage.getItem('mapMode') !== 'plain';
    } catch {
      // storage unavailable: keep the default
    }
    const showMode = () => {
      modeButton.textContent = say(satellite ? 'cat.modePlain' : 'cat.modeSat');
      credit.textContent = satellite ? 'Esri, Maxar, Earthstar Geographics · © OpenStreetMap' : '© OpenStreetMap · OpenMapTiles · OpenFreeMap';
    };
    map = await createMap(mapBox, { cats, popup: popupFor, onMove: () => inView.checked && apply({ fit: false }), satellite });
    showMode();
    modeButton.hidden = false;
    modeButton.addEventListener('click', () => {
      satellite = !satellite;
      map.setSatellite(satellite);
      showMode();
      try {
        localStorage.setItem('mapMode', satellite ? 'satellite' : 'plain');
      } catch {
        // not saved, still switched
      }
    });
    root.classList.add('has-map');
    $('in-view-label').hidden = false;
    document.dispatchEvent(new CustomEvent('mapready'));
    apply();
    showArea();
  } catch {
    mapBox.hidden = true;
    $('map-error').hidden = false;
  }
}

const root = document.querySelector('[data-explorer]');
if (root) start(root);
