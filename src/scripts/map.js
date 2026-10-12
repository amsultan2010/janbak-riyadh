// The map is loaded only when someone asks for it. MapLibre is served as its own
// files from /vendor so it never weighs on the first page load.
import { lang, say } from './home.js';

const STYLE = 'https://tiles.openfreemap.org/styles/positron';
const RIYADH = [46.6753, 24.7136];
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

// Place names on the base map follow the page language.
function localiseLabels(map) {
  const field =
    lang === 'ar'
      ? ['coalesce', ['get', 'name:ar'], ['get', 'name']]
      : ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
  for (const layer of map.getStyle().layers) {
    if (layer.type === 'symbol' && JSON.stringify(layer.layout?.['text-field'] ?? '').includes('name')) {
      map.setLayoutProperty(layer.id, 'text-field', field);
    }
  }
}

export async function createMap(container, onSelect) {
  const gl = await loadLibrary();
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = new gl.Map({
    container,
    style: STYLE,
    center: RIYADH,
    zoom: 10,
    cooperativeGestures: true,
    locale: lang === 'ar' ? AR_GESTURES : {},
    attributionControl: { compact: true },
  });
  map.addControl(new gl.NavigationControl({ showCompass: false }), lang === 'ar' ? 'top-left' : 'top-right');
  await new Promise((resolve, reject) => {
    map.once('load', resolve);
    map.once('error', (e) => reject(e.error));
  });
  localiseLabels(map);

  map.addSource('places', { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, cluster: true, clusterRadius: 44, clusterMaxZoom: 13 });
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
  map.addLayer({
    id: 'points',
    type: 'circle',
    source: 'places',
    filter: ['!', ['has', 'point_count']],
    paint: { 'circle-color': GROUND, 'circle-radius': 8, 'circle-stroke-width': 2.5, 'circle-stroke-color': INK },
  });

  map.on('click', 'clusters', async (e) => {
    const feature = e.features[0];
    const zoom = await map.getSource('places').getClusterExpansionZoom(feature.properties.cluster_id);
    map.easeTo({ center: feature.geometry.coordinates, zoom, animate: !still });
  });

  map.on('click', 'points', (e) => {
    const { id, name } = e.features[0].properties;
    const body = document.createElement('div');
    const title = Object.assign(document.createElement('strong'), { textContent: name });
    const link = Object.assign(document.createElement('a'), { href: `#${id}`, textContent: say('place.inList') });
    link.addEventListener('click', () => onSelect(id));
    body.append(title, link);
    new gl.Popup({ offset: 12, maxWidth: '260px' }).setLngLat(e.features[0].geometry.coordinates).setDOMContent(body).addTo(map);
  });

  let homeMarker = null;
  let fitted = '';

  return {
    resize: () => map.resize(),
    setPoints(rows, home) {
      map.getSource('places').setData({
        type: 'FeatureCollection',
        features: rows.map((r) => ({ type: 'Feature', properties: { id: r.id, name: r.name }, geometry: { type: 'Point', coordinates: [r.lng, r.lat] } })),
      });
      homeMarker?.remove();
      homeMarker = home ? new gl.Marker({ color: ACCENT }).setLngLat([home.lng, home.lat]).addTo(map) : null;

      // near home: frame the closest few; otherwise frame everything that matched
      const frame = home ? rows.slice(0, 8) : rows;
      const key = frame.map((r) => r.id).join() + (home ? `${home.lat},${home.lng}` : '');
      if (!frame.length || key === fitted) return;
      fitted = key;
      const bounds = new gl.LngLatBounds();
      for (const r of frame) bounds.extend([r.lng, r.lat]);
      if (home) bounds.extend([home.lng, home.lat]);
      map.fitBounds(bounds, { padding: 48, maxZoom: 14, animate: !still });
    },
  };
}
