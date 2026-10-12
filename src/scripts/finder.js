import { decodeWeek, openState, formatTime } from '../lib/hours.js';
import { getHome, lang, say, strings } from './home.js';

const PAGE = 40;
const list = document.querySelector('[data-places]');

if (list) {
  const tools = document.querySelector('[data-tools]');
  const search = tools.querySelector('[data-search]');
  const openOnly = tools.querySelector('[data-open-only]');
  const results = document.querySelector('[data-results]');
  const none = document.querySelector('[data-none]');
  const more = document.querySelector('[data-more]');
  const mapToggle = tools.querySelector('[data-map-toggle]');
  const mapBox = tools.querySelector('[data-map]');
  const mapError = tools.querySelector('[data-map-error]');
  const sep = lang === 'ar' ? '، ' : ', ';

  const rows = [...list.children].map((el, order) => ({
    el,
    order,
    id: el.id,
    name: el.querySelector('h2').textContent,
    lat: el.dataset.lat ? +el.dataset.lat : null,
    lng: el.dataset.lng ? +el.dataset.lng : null,
    week: el.dataset.h ? decodeWeek(el.dataset.h) : null,
    q: el.dataset.q,
    status: el.querySelector('[data-status]'),
    dist: el.querySelector('[data-dist]'),
    dir: el.querySelector('[data-dir]'),
    open: false,
    km: null,
  }));

  let home = getHome();
  let limit = PAGE;
  let map = null;
  let shown = [];

  function statusText(state) {
    if (state.always) return say('place.always');
    if (state.open) return say('place.open') + sep + say('place.closes', { t: formatTime(state.until, lang) });
    if (state.at === undefined) return say('place.closed');
    const when = (state.today ? '' : strings.days[state.day] + ' ') + formatTime(state.at, lang);
    return say('place.closed') + sep + say('place.opens', { t: when });
  }

  function refreshStatus() {
    for (const row of rows) {
      if (!row.week) continue;
      const state = openState(row.week);
      row.open = state.open;
      row.status.textContent = statusText(state);
      row.status.className = `status ${state.open ? 'is-open' : 'is-closed'}`;
    }
  }

  function refreshDistance() {
    const rad = Math.PI / 180;
    for (const row of rows) {
      row.km = null;
      if (home && row.lat !== null) {
        const x = (row.lng - home.lng) * rad * Math.cos(((row.lat + home.lat) / 2) * rad);
        const y = (row.lat - home.lat) * rad;
        row.km = Math.sqrt(x * x + y * y) * 6371;
      }
      row.dist.hidden = row.km === null;
      if (row.km !== null) row.dist.textContent = say('place.km', { n: row.km < 10 ? Math.max(0.1, row.km).toFixed(1) : Math.round(row.km) });
      if (row.dir) {
        const url = new URL(row.dir.href);
        if (home) url.searchParams.set('origin', `${home.lat},${home.lng}`);
        else url.searchParams.delete('origin');
        row.dir.href = url.href;
      }
    }
  }

  function apply() {
    const q = search.value.trim().toLowerCase();
    const matches = rows.filter((r) => (!openOnly?.checked || r.open) && (!q || r.q.includes(q)));
    matches.sort((a, b) => (home ? (a.km ?? 1e9) - (b.km ?? 1e9) : 0) || a.order - b.order);
    shown = matches.slice(0, limit);
    const visible = new Set(shown);
    for (const row of rows) row.el.hidden = !visible.has(row);
    list.append(...shown.map((r) => r.el));
    results.textContent = say('cat.results', { n: matches.length, total: rows.length });
    if (home) results.append(Object.assign(document.createElement('span'), { textContent: ' ' + say('cat.near') }));
    none.hidden = matches.length > 0;
    more.hidden = matches.length <= limit;
    map?.setPoints(matches.filter((r) => r.lat !== null), home);
  }

  const reset = () => {
    limit = PAGE;
    apply();
  };
  search.addEventListener('input', reset);
  openOnly?.addEventListener('change', reset);
  more.addEventListener('click', () => {
    limit += PAGE;
    apply();
  });
  document.addEventListener('homechange', (e) => {
    home = e.detail;
    refreshDistance();
    reset();
  });

  mapToggle.addEventListener('click', async () => {
    const open = mapBox.hidden;
    mapBox.hidden = !open;
    mapToggle.setAttribute('aria-expanded', String(open));
    mapToggle.textContent = say(open ? 'cat.hideMap' : 'cat.map');
    if (!open || map) return map?.resize();
    try {
      const { createMap } = await import('./map.js');
      map = await createMap(mapBox, (id) => {
        const row = rows.find((r) => r.id === id);
        if (row.el.hidden) {
          limit = rows.length;
          apply();
        }
        location.hash = id;
      });
      apply();
    } catch {
      mapBox.hidden = true;
      mapError.hidden = false;
      mapToggle.hidden = true;
    }
  });

  // a link to one place (#id) must show that place even if it is past the first page
  if (location.hash && rows.findIndex((r) => r.id === location.hash.slice(1)) >= PAGE) limit = rows.length;

  tools.hidden = false;
  refreshStatus();
  refreshDistance();
  apply();
  setInterval(() => {
    refreshStatus();
    if (openOnly?.checked) apply();
  }, 60000);
}
