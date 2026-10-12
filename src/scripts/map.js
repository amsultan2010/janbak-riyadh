// The map. MapLibre is served as its own files from /vendor so it never weighs
// on the first paint; the list is usable before it arrives and without it.
import { lang } from './home.js';

const STYLE = 'https://tiles.openfreemap.org/styles/positron';
const RIYADH = [46.6753, 24.7136];
const AROUND_RIYADH = [
  [45.4, 23.8],
  [48.0, 25.8],
];
const GROUND = '#0a4b2c';
const INK = '#f5f2e7';
const ACCENT = '#f4d058';

const AR_GESTURES = {
  'CooperativeGesturesHandler.WindowsHelpText': 'اضغط Ctrl مع التمرير لتكبير الخريطة',
  'CooperativeGesturesHandler.MacHelpText': 'اضغط ⌘ مع التمرير لتكبير الخريطة',
  'CooperativeGesturesHandler.MobileHelpText': 'استخدم إصبعين لتحريك الخريطة',
};

function loadLibrary() {
  document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: '/vendor/maplibre/maplibre-gl.css' }));
  return import(/* @vite-ignore */ `${location.origin}/vendor/maplibre/maplibre-gl.mjs`);
}

// The base style, adjusted before the map starts: place names follow the page
// language, and the US road-shield layers (which only log warnings here) are dropped.
async function loadStyle() {
  const style = await (await fetch(STYLE)).json();
  const field =
    lang === 'ar'
      ? ['coalesce', ['get', 'name:ar'], ['get', 'name']]
      : ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
  style.layers = style.layers.filter((layer) => !layer.id.includes('shield'));
  for (const layer of style.layers) {
    if (layer.type === 'symbol' && JSON.stringify(layer.layout?.['text-field'] ?? '').includes('name')) layer.layout['text-field'] = field;
  }
  return style;
}

// A round pin carrying the category's line icon, drawn at twice the size for sharp screens.
function pinImage(path) {
  const size = 68;
  const canvas = Object.assign(document.createElement('canvas'), { width: size, height: size });
  const g = canvas.getContext('2d');
  g.fillStyle = GROUND;
  g.strokeStyle = INK;
  g.lineWidth = 4;
  g.beginPath();
  g.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.translate(16, 16);
  g.scale(1.5, 1.5);
  g.lineWidth = 1.7;
  g.lineCap = 'square';
  g.stroke(new Path2D(path));
  return g.getImageData(0, 0, size, size);
}

export async function createMap(container, { cats, popup, onMove }) {
  const [gl, style] = await Promise.all([loadLibrary(), loadStyle()]);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = new gl.Map({
    container,
    style,
    center: RIYADH,
    zoom: 10,
    minZoom: 8,
    maxBounds: AROUND_RIYADH,
    // on a touch screen one finger scrolls the page and two move the map
    cooperativeGestures: matchMedia('(pointer: coarse)').matches,
    locale: lang === 'ar' ? AR_GESTURES : {},
    attributionControl: false,
  });
  map.addControl(new gl.NavigationControl({ showCompass: false }), lang === 'ar' ? 'top-left' : 'top-right');
  await new Promise((resolve, reject) => {
    map.once('load', resolve);
    map.once('error', (e) => reject(e.error));
  });
  container.classList.add('is-ready');
  for (const cat of cats) map.addImage(`pin-${cat.id}`, pinImage(cat.icon), { pixelRatio: 2 });

  const empty = { type: 'FeatureCollection', features: [] };
  map.addSource('places', { type: 'geojson', data: empty, cluster: true, clusterRadius: 46, clusterMaxZoom: 13 });
  map.addSource('chosen', { type: 'geojson', data: empty });
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'places',
    filter: ['has', 'point_count'],
    paint: { 'circle-color': GROUND, 'circle-radius': ['step', ['get', 'point_count'], 15, 20, 19, 100, 24], 'circle-stroke-width': 2, 'circle-stroke-color': INK },
  });
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'places',
    filter: ['has', 'point_count'],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 13 },
    paint: { 'text-color': INK },
  });
  map.addLayer({ id: 'chosen', type: 'circle', source: 'chosen', paint: { 'circle-color': ACCENT, 'circle-radius': 24 } });
  map.addLayer({
    id: 'points',
    type: 'symbol',
    source: 'places',
    filter: ['!', ['has', 'point_count']],
    layout: { 'icon-image': ['concat', 'pin-', ['get', 'cat']], 'icon-allow-overlap': true },
  });

  let open = null;
  let picking = null;

  function show(id, at, move) {
    open?.remove();
    map.getSource('chosen').setData({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: at } });
    open = new gl.Popup({ offset: 20, maxWidth: '280px' }).setLngLat(at).setDOMContent(popup(id)).addTo(map);
    open.on('close', () => map.getSource('chosen').setData(empty));
    if (move) map.easeTo({ center: at, zoom: Math.max(map.getZoom(), 15), animate: !still });
  }

  map.on('click', (e) => {
    if (picking) {
      const done = picking;
      picking = null;
      container.classList.remove('picking');
      done(e.lngLat);
      return;
    }
    const [feature] = map.queryRenderedFeatures(e.point, { layers: ['points', 'clusters'] });
    if (!feature) return;
    if (feature.properties.cluster_id === undefined) return show(feature.properties.id, feature.geometry.coordinates, false);
    map
      .getSource('places')
      .getClusterExpansionZoom(feature.properties.cluster_id)
      .then((zoom) => map.easeTo({ center: feature.geometry.coordinates, zoom, animate: !still }));
  });
  for (const layer of ['points', 'clusters']) {
    map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
  }
  map.on('moveend', onMove);

  let homeMarker = null;
  let fitted = '';

  return {
    bounds: () => map.getBounds(),
    select: (row) => show(row.id, [row.lng, row.lat], true),
    pick(done) {
      picking = done;
      container.classList.add('picking');
    },
    setPoints(rows, home, fit) {
      map.getSource('places').setData({
        type: 'FeatureCollection',
        features: rows.map((r) => ({ type: 'Feature', properties: { id: r.id, cat: r.cat.id }, geometry: { type: 'Point', coordinates: [r.lng, r.lat] } })),
      });
      homeMarker?.remove();
      homeMarker = home
        ? new gl.Marker({ element: Object.assign(document.createElement('div'), { className: 'home-pin' }) }).setLngLat([home.lng, home.lat]).addTo(map)
        : null;
      if (!fit) return;

      // with a location set, frame the nearest few; otherwise frame everything that matched
      const frame = home ? rows.slice(0, 8) : rows;
      const key = frame.map((r) => r.id).join() + (home ? `${home.lat},${home.lng}` : '');
      if (!frame.length || key === fitted) return;
      fitted = key;
      const bounds = new gl.LngLatBounds();
      for (const r of frame) bounds.extend([r.lng, r.lat]);
      if (home) bounds.extend([home.lng, home.lat]);
      map.fitBounds(bounds, { padding: 56, maxZoom: 15, animate: !still });
    },
  };
}
