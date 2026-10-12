// The finder. On a phone: a map with a deck of cards over it, one place per card, and the
// full list below. On a wide screen: the list beside the map. One type of place at a time,
// narrowed by search, kind, opening hours and district. A list is by name until a location
// is set, then nearest first.
import { decodeWeek, openState, formatTime } from '../lib/hours.js';
import { hoursLines } from '../lib/hours-text.js';
import { getHome, setHome, lang, say, strings, fold } from './home.js';
import { openSheet } from './sheet.js';

const PAGE = 30;
const DECK = 12;
const sep = lang === 'ar' ? '، ' : ', ';
const rtl = document.documentElement.dir === 'rtl';
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = matchMedia('(min-width: 62rem)');
const words = { days: strings.days, to: say('place.to'), everyDay: say('place.everyDay'), always: say('place.always'), closed: say('place.closed') };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icon = (d, flip) => `<svg class="icon${flip ? ' flip' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"></path></svg>`;
const pic = (markup) => `<svg class="pic" viewBox="0 0 24 24" aria-hidden="true">${markup}</svg>`;
const tel = (n) => 'tel:' + n.replace(/\s*(?:ext\.?|x)\s*\d.*$/i, '').replace(/[^\d+]/g, '');

async function start(root) {
  const config = JSON.parse(document.getElementById('explorer-config').textContent);
  const { cats, kinds, icons, site } = config;
  const preset = root.dataset.cat ?? null;
  const $ = (name) => root.querySelector(`[data-${name}]`);
  const stage = $('stage');
  const title = $('title');
  const deck = $('deck');
  const sheet = $('cat-sheet');
  const detail = $('detail');
  const search = $('search');
  const openButton = $('open-only');
  const alwaysOnly = $('always-only');
  const inView = $('in-view');
  const areaSelect = $('area');
  const note = $('cat-note');
  const mapBox = $('map');
  const results = $('results');
  const list = $('places');
  const none = $('none');
  const more = $('more');
  const catButtons = [...root.querySelectorAll('[data-cat-btn]')];
  const kindButtons = [...root.querySelectorAll('[data-kind-btn]')];
  const kindGroups = [...root.querySelectorAll('[data-kinds]')];
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

  const rows = data.map(([id, k, name, addr, district, lat, lng, phone, hours, usual, phone2, website, source, tags, alt, note, area], order) => ({
    id,
    order,
    cat: cats[kinds[k].cat],
    kind: kinds[k],
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
    er: kinds[k].id === 'hospitals',
    q: fold([name, addr, district, tags.join(' '), alt, kinds[k].name, kinds[k].alt, cats[kinds[k].cat].name, cats[kinds[k].cat].alt].filter(Boolean).join(' ')),
    open: false,
    state: null,
    km: null,
  }));
  const byId = new Map(rows.map((r) => [r.id, r]));
  // a list of several kinds runs by name; a list of one kind keeps the order it came in,
  // which is by name too, except embassies by country
  const byName = new Intl.Collator(lang);
  [...rows].sort((a, b) => byName.compare(a.name, b.name) || a.order - b.order).forEach((r, i) => (r.abc = i));
  const catOf = (id) => cats.find((c) => c.id === id);
  const sizes = new Map(cats.map((c) => [c.id, rows.filter((r) => r.cat === c).length]));

  // What is on show. `type` is one category, or '' for every place. It starts from the page
  // (a category page, or the first category on the home page) and from the address bar,
  // so a filtered view can be shared as a link.
  const params = new URLSearchParams(location.search);
  const asked = (params.get('type') ?? '').split(',').filter(Boolean);
  const want = byId.get(decodeURIComponent(location.hash.slice(1)));
  let type = preset ?? site.first;
  const kindsOn = new Set();
  if (preset) for (const k of kinds) if (asked.includes(k.id) && cats[k.cat].id === preset) kindsOn.add(k.id);
  if (!preset) type = asked.includes('all') || params.has('q') ? '' : (asked.find(catOf) ?? want?.cat.id ?? type);
  search.value = params.get('q') ?? '';
  let openOnly = params.has('open');
  alwaysOnly.checked = params.has('24h');
  if ([...areaSelect.options].some((o) => o.value === params.get('area'))) areaSelect.value = params.get('area');

  let home = getHome();
  let limit = PAGE;
  let map = null;
  let found = [];
  let current = want?.id ?? null; // the place on the front card
  let shown = 0; // cards drawn in the deck so far

  function statusOf(r) {
    if (!r.week) return r.kind.untimed ? ['', ''] : ['is-unknown', say(r.er ? 'place.erUnknown' : 'place.unknown')];
    const s = r.state;
    if (s.always) return ['is-open is-always', say(r.er ? 'place.erAlways' : 'place.always')];
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

  const spans = (parts) => parts.filter(Boolean).map((m) => `<span><bdi>${esc(m)}</bdi></span>`).join('');
  const kmOf = (r) => (r.km === null ? null : say('place.km', { n: r.km < 10 ? Math.max(0.1, r.km).toFixed(1) : Math.round(r.km) }));
  const callHtml = (r) => (r.phone ? `<a class="btn btn-fill" href="${tel(r.phone)}"><span>${esc(say('place.call'))}</span> <bdi dir="ltr">${esc(r.phone)}</bdi></a>` : '');
  const goHtml = (r) => `<a class="btn" href="${mapsUrl(r)}" target="_blank" rel="noopener">${esc(say(r.lat === null ? 'place.find' : 'place.directions'))}</a>`;
  const showHtml = (r) =>
    r.lat === null ? '' : `<button type="button" class="btn btn-icon" data-show="${r.id}" aria-label="${esc(say('place.onMap'))}" title="${esc(say('place.onMap'))}">${icon(icons.pin)}</button>`;

  // One place as a card. In the deck (`at` is its position there) it is kept short: the steps
  // sit in its first line and the details are behind one small button.
  function cardHtml(r, at = null) {
    const [cls, status] = statusOf(r);
    const inDeck = at !== null;
    const top = inDeck
      ? `<span class="kind">${esc(r.kind.name)} · <bdi dir="ltr">${at + 1} / ${found.length}</bdi></span>
        <button type="button" class="step" data-step="-1" aria-label="${esc(say('place.prev'))}"${at === 0 ? ' disabled' : ''}>${icon(icons.back, true)}</button>
        <button type="button" class="step" data-step="1" aria-label="${esc(say('place.next'))}"${at === found.length - 1 ? ' disabled' : ''}>${icon(icons.chevron, true)}</button>`
      : `<span class="kind">${esc(r.kind.name)}</span>`;
    const details = esc(say('place.details'));
    return `<div class="card-top">${top}</div>
      <h2><bdi>${esc(r.name)}</bdi></h2>
      ${!inDeck && r.addr ? `<p class="meta"><bdi>${esc(r.addr)}</bdi></p>` : ''}
      <p class="meta">${spans([r.district, ...r.tags, kmOf(r)])}</p>
      <p class="status ${cls}">${esc(status)}</p>
      ${!inDeck && r.note ? `<p class="place-note">${esc(r.note)}</p>` : ''}
      <div class="actions">${callHtml(r)}${goHtml(r)}${
        inDeck ? `<button type="button" class="btn btn-icon" data-details="${r.id}" aria-label="${details}" title="${details}">${icon(icons.info)}</button>` : showHtml(r)
      }</div>
      ${inDeck ? '' : `<button type="button" class="text-btn" data-details="${r.id}">${details}</button>`}`;
  }

  // The page of one place: everything a card leaves out.
  function detailHtml(r) {
    const [cls, status] = statusOf(r);
    const lines = r.week ? hoursLines(r.hours, lang, words) : [];
    const hours = lines.map((l) => `<div><span>${esc(l.days)}</span><span>${esc(l.times)}</span></div>`).join('') || (status ? `<p>${esc(status)}</p>` : '');
    const out = (url, key) => `<a class="ctl" href="${esc(url)}" target="_blank" rel="noopener">${esc(say(key))}${icon(icons.open, true)}</a>`;
    return `<div class="sheet-body">
      <button type="button" class="ctl" data-close>${icon(icons.back, true)}${esc(say('place.back'))}</button>
      <p class="kind">${esc(r.kind.name)}</p>
      <h2 id="detail-name"><bdi>${esc(r.name)}</bdi></h2>
      ${r.addr ? `<p class="meta"><bdi>${esc(r.addr)}</bdi></p>` : ''}
      <p class="meta">${spans([r.district, ...r.tags, kmOf(r)])}</p>
      <p class="status ${cls}">${esc(status)}</p>
      <div class="actions">${callHtml(r)}${goHtml(r)}${showHtml(r)}</div>
      ${hours || r.usual || r.note ? `<div class="card hours"><h3>${esc(say('place.hours'))}</h3>${hours}${r.usual ? `<p class="small">${esc(say('place.usual'))}</p>` : ''}${r.note ? `<p>${esc(r.note)}</p>` : ''}</div>` : ''}
      <div class="links">
        ${r.phone2 ? `<a class="ctl" href="${tel(r.phone2)}">${esc(say('place.citizens'))} <bdi dir="ltr">${esc(r.phone2)}</bdi></a>` : ''}
        ${r.website ? out(r.website, 'place.website') : ''}
        ${r.source ? out(r.source, 'place.source') : ''}
      </div>
      <p class="small caveat">${esc(say('cat.caveat'))}</p>
    </div>`;
  }

  function matches() {
    const tokens = fold(search.value).split(/\s+/).filter(Boolean);
    const box = inView.checked && map ? map.bounds() : null;
    const hits = rows.filter(
      (r) =>
        (!type || r.cat.id === type) &&
        (!kindsOn.size || kindsOn.has(r.kind.id)) &&
        (!openOnly || r.open) &&
        (!alwaysOnly.checked || r.always) &&
        (!areaSelect.value || r.area === areaSelect.value) &&
        (!box || (r.lat !== null && box.contains([r.lng, r.lat]))) &&
        tokens.every((t) => r.q.includes(t)),
    );
    const key = hits.every((r) => r.kind === hits[0].kind) ? 'order' : 'abc';
    return hits.sort((a, b) => (home ? (a.km ?? 1e9) - (b.km ?? 1e9) : 0) || a[key] - b[key]);
  }

  function tail() {
    const next = new URLSearchParams();
    if (!type) next.set('type', 'all');
    else if (kindsOn.size) next.set('type', [...kindsOn].join(','));
    if (search.value.trim()) next.set('q', search.value.trim());
    if (openOnly) next.set('open', '1');
    if (alwaysOnly.checked) next.set('24h', '1');
    if (areaSelect.value) next.set('area', areaSelect.value);
    const query = next.toString();
    return (type ? `places/${type}/` : '') + (query ? `?${query}` : '');
  }

  // the language switch carries the view over to the other language
  const syncLang = () => langLink && (langLink.href = site.other + tail());

  // once something is changed, the address, the title and the heading follow the type on show
  function syncUrl() {
    const cat = catOf(type);
    history.replaceState(null, '', site.path + tail());
    document.title = cat ? `${cat.name} | ${site.name}` : site.title;
    title.textContent = cat ? cat.name : site.h1;
    syncLang();
  }

  function drawControls() {
    const cat = catOf(type);
    $('cat-pic').innerHTML = cat ? pic(cat.pic) : icon(icons.pin);
    $('cat-name').textContent = cat ? cat.short : say('cat.back');
    $('cat-count').textContent = cat ? sizes.get(cat.id) : rows.length;
    openButton.setAttribute('aria-pressed', String(openOnly));
    for (const b of catButtons) b.setAttribute('aria-pressed', String(b.dataset.catBtn === type));
    for (const g of kindGroups) g.hidden = g.dataset.kinds !== type;
    for (const b of kindButtons) b.setAttribute('aria-pressed', String(kindsOn.has(b.dataset.kindBtn)));
    note.textContent = cat ? cat.note : site.intro;
    results.textContent = say('cat.results', { n: found.length, total: cat ? sizes.get(cat.id) : rows.length });
    if (home) results.append(Object.assign(document.createElement('span'), { textContent: ' ' + say('cat.near') }));
  }

  function drawList() {
    list.innerHTML = found.slice(0, limit).map((r) => `<li class="place card${r.id === current ? ' is-current' : ''}" id="${r.id}">${cardHtml(r)}</li>`).join('');
    none.hidden = found.length > 0;
    more.hidden = found.length <= limit;
  }

  const deckCard = (r, at) => `<article class="place card">${cardHtml(r, at)}</article>`;

  // the deck draws a dozen cards and adds more as the front card nears the end
  function growDeck(upTo) {
    const next = Math.min(found.length, Math.max(upTo, shown + DECK));
    if (upTo <= shown || next <= shown) return;
    deck.insertAdjacentHTML('beforeend', found.slice(shown, next).map((r, i) => deckCard(r, shown + i)).join(''));
    shown = next;
  }

  function deckTo(at, smooth) {
    growDeck(at + 4);
    const card = deck.children[at];
    if (!card) return;
    const a = card.getBoundingClientRect();
    const b = deck.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(deck).paddingInlineStart) || 0;
    deck.scrollBy({ left: rtl ? a.right - b.right + pad : a.left - b.left - pad, behavior: smooth && !still ? 'smooth' : 'auto' });
  }

  function drawDeck() {
    const at = Math.max(0, found.findIndex((r) => r.id === current));
    shown = Math.min(found.length, Math.max(DECK, at + 4));
    deck.innerHTML = found.length
      ? found.slice(0, shown).map(deckCard).join('')
      : `<div class="card empty"><p>${esc(say(openOnly ? 'cat.noneOpen' : 'cat.none'))}</p>${openOnly ? `<button type="button" class="btn btn-fill" data-show-all>${esc(say('cat.showAll'))}</button>` : ''}</div>`;
    deck.scrollLeft = 0;
    deckTo(at, false);
  }

  // `how` says whether the map should move to the place: not at all, only if it is out of view, or right up to it
  function setCurrent(id, how) {
    current = id;
    for (const li of list.children) li.classList.toggle('is-current', li.id === id);
    const r = byId.get(id);
    map?.choose(r && r.lat !== null ? r : null, how);
  }

  function apply({ fit = true, keep = false } = {}) {
    found = matches();
    if (!keep || !found.some((r) => r.id === current)) current = found[0]?.id ?? null;
    drawControls();
    drawList();
    drawDeck();
    map?.setPoints(found.filter((r) => r.lat !== null), home, fit && !inView.checked && !areaSelect.value);
    setCurrent(current, false);
  }

  const change = () => {
    limit = PAGE;
    apply();
    syncUrl();
  };

  function openDetail(r) {
    detail.innerHTML = detailHtml(r);
    openSheet(detail);
  }

  function showOnMap(r) {
    if (detail.open) detail.close();
    const at = found.indexOf(r);
    if (at >= 0) deckTo(at, false);
    setCurrent(r.id, 'near');
    if (!wide.matches) stage.scrollIntoView({ block: 'start', behavior: still ? 'auto' : 'smooth' });
  }

  // a tap on a pin brings its card to the front
  function pickPin(id) {
    const at = found.findIndex((r) => r.id === id);
    if (at < 0) return;
    if (at >= limit) {
      limit = at + 1;
      drawList();
    }
    deckTo(at, false);
    setCurrent(id, false);
    if (wide.matches) document.getElementById(id)?.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
  }

  let frame = 0;
  deck.addEventListener(
    'scroll',
    () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const first = deck.firstElementChild;
        if (!found.length || !first) return;
        const step = first.offsetWidth + (parseFloat(getComputedStyle(deck).columnGap) || 0);
        const at = Math.min(found.length - 1, Math.round(Math.abs(deck.scrollLeft) / step));
        growDeck(at + 4);
        if (found[at].id !== current) setCurrent(found[at].id, 'view');
      });
    },
    { passive: true },
  );

  let typing;
  search.addEventListener('input', () => {
    // a search looks through every type of place
    if (search.value.trim() && type) {
      type = '';
      kindsOn.clear();
    }
    clearTimeout(typing);
    typing = setTimeout(change, 140);
  });
  search.addEventListener('keydown', (e) => e.key === 'Enter' && sheet.close());
  for (const box of [alwaysOnly, inView]) box.addEventListener('change', change);
  // choosing a district narrows the list to it and moves the map there
  const showArea = () => {
    const bbox = areaSelect.selectedOptions[0]?.dataset.bbox?.split(',').map(Number);
    if (bbox && map) map.lookAt([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
  };
  areaSelect.addEventListener('change', () => {
    change();
    showArea();
  });
  openButton.addEventListener('click', () => {
    openOnly = !openOnly;
    change();
  });
  $('cat-open').addEventListener('click', () => openSheet(sheet));
  for (const b of catButtons) {
    b.addEventListener('click', () => {
      type = b.dataset.catBtn;
      kindsOn.clear();
      change();
      sheet.close();
    });
  }
  for (const b of kindButtons) {
    b.addEventListener('click', () => {
      const id = b.dataset.kindBtn;
      if (kindsOn.has(id)) kindsOn.delete(id);
      else kindsOn.add(id);
      change();
    });
  }
  more.addEventListener('click', () => {
    limit += PAGE;
    apply({ fit: false, keep: true });
  });
  root.addEventListener('click', (e) => {
    const hit = (name) => e.target.closest(`[data-${name}]`);
    const step = hit('step');
    const details = hit('details');
    const show = hit('show');
    if (step) {
      const at = found.findIndex((r) => r.id === current) + Number(step.dataset.step);
      if (found[at]) deckTo(at, true);
    } else if (details) openDetail(byId.get(details.dataset.details));
    else if (show) showOnMap(byId.get(show.dataset.show));
    else if (hit('show-all')) {
      openOnly = false;
      change();
    }
  });
  document.addEventListener('homechange', (e) => {
    home = e.detail;
    refreshDistance();
    limit = PAGE;
    apply();
  });
  document.addEventListener('pickstart', () => {
    if (!map) return;
    stage.scrollIntoView({ block: 'start' });
    map.pick((at) => setHome({ lat: +at.lat.toFixed(5), lng: +at.lng.toFixed(5), picked: true }));
  });

  stage.hidden = false;
  refreshStatus();
  refreshDistance();
  apply({ keep: true });
  if (location.search) syncLang();
  if (want && found.includes(want)) openDetail(want);
  setInterval(() => {
    refreshStatus();
    apply({ fit: false, keep: true });
  }, 60000);

  try {
    const { createMap } = await import('./map.js');
    const tilt = $('tilt');
    // the room the map keeps clear: on a phone its top is under the controls and its bottom under the deck
    const pad = () => (wide.matches ? { top: 56, bottom: 56, left: 56, right: 56 } : { top: 118, bottom: deck.offsetHeight + 48, left: 40, right: 40 });
    map = await createMap(mapBox, {
      kinds,
      onPick: pickPin,
      onMove: () => inView.checked && apply({ fit: false, keep: true }),
      onTilt: (on) => tilt.setAttribute('aria-pressed', String(on)),
      pad,
    });
    // tilting takes two fingers or a held key; the button does it for those who do not know
    tilt.hidden = false;
    tilt.addEventListener('click', () => map.tilt(tilt.getAttribute('aria-pressed') !== 'true'));
    $('in-view-label').hidden = false;
    document.dispatchEvent(new CustomEvent('mapready'));
    apply({ keep: true });
    showArea();
  } catch {
    mapBox.hidden = true;
    $('map-error').hidden = false;
    root.classList.add('no-map');
  }
}

const root = document.querySelector('[data-explorer]');
if (root) start(root);
