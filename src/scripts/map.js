// The map. MapLibre is served as its own files from /vendor so it never weighs
// on the first paint; the list is usable before it arrives and without it.
import { lang, say } from './home.js';

const STYLE = 'https://tiles.openfreemap.org/styles/positron';
const IMAGERY = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const RIYADH = [46.6753, 24.7136];
const AROUND_RIYADH = [
  [45.4, 23.8],
  [48.0, 25.8],
];
const INK = '#0f2540';
const SURFACE = '#ffffff';
const ACCENT = '#ff8a3d';
const RED = '#e03131';

const AR_GESTURES = {
  'CooperativeGesturesHandler.WindowsHelpText': 'اضغط Ctrl مع التمرير لتكبير الخريطة',
  'CooperativeGesturesHandler.MacHelpText': 'اضغط ⌘ مع التمرير لتكبير الخريطة',
  'CooperativeGesturesHandler.MobileHelpText': 'استخدم إصبعين لتحريك الخريطة',
};

function loadLibrary() {
  document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: '/vendor/maplibre/maplibre-gl.css' }));
  return import(/* @vite-ignore */ `${location.origin}/vendor/maplibre/maplibre-gl.mjs`);
}

// The base style, adjusted before the map starts. The map is satellite imagery with the
// style's labels over it: the drawn land and roads are dropped, the labels follow the page
// language and turn light with a dark edge, and the US road-shield layers (which only log
// warnings here) are left out.
async function loadStyle() {
  const style = await (await fetch(STYLE)).json();
  const field =
    lang === 'ar'
      ? ['coalesce', ['get', 'name:ar'], ['get', 'name']]
      : ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
  const labels = style.layers.filter((layer) => layer.type === 'symbol' && !layer.id.includes('shield'));
  for (const layer of labels) {
    if (JSON.stringify(layer.layout?.['text-field'] ?? '').includes('name')) layer.layout['text-field'] = field;
    layer.paint = { ...layer.paint, 'text-color': SURFACE, 'text-halo-color': 'rgba(15, 37, 64, 0.9)', 'text-halo-width': 1.5 };
  }
  style.sources.imagery = { type: 'raster', tiles: [IMAGERY], tileSize: 256, maxzoom: 18 };
  style.layers = [...style.layers.filter((layer) => layer.type === 'background'), { id: 'imagery', type: 'raster', source: 'imagery' }, ...labels];
  return style;
}

// A round white pin carrying the kind's pictogram, drawn at twice the size for sharp screens.
function pinImage(markup) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38.5" fill="${SURFACE}" stroke="${INK}" stroke-width="5"/><g transform="translate(18 18) scale(2)">${markup}</g></svg>`;
  const image = new Image(84, 84);
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return image.decode().then(() => image);
}

const loadZones = () => fetch('/data/zones.json').then((res) => (res.ok ? res.json() : [])).catch(() => []);

export async function createMap(container, { kinds, onPick, onMove, onTilt, pad }) {
  const [gl, style, zones] = await Promise.all([loadLibrary(), loadStyle(), loadZones()]);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = new gl.Map({
    container,
    style,
    center: RIYADH,
    zoom: 10,
    minZoom: 8,
    maxZoom: 18,
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
  const pins = await Promise.all(kinds.map((kind) => pinImage(kind.pic)));
  kinds.forEach((kind, i) => map.addImage(`pin-${kind.id}`, pins[i], { pixelRatio: 2 }));

  // Marked zones: a red shape over the area, under the place pins.
  if (zones.length) {
    map.addSource('zones', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: zones.map((z) => ({ type: 'Feature', properties: { id: z.id }, geometry: { type: 'Polygon', coordinates: [z.ring] } })),
      },
    });
    map.addLayer({ id: 'zone-fill', type: 'fill', source: 'zones', paint: { 'fill-color': RED, 'fill-opacity': 0.38 } });
    map.addLayer({ id: 'zone-edge', type: 'line', source: 'zones', paint: { 'line-color': RED, 'line-width': 3 } });
  }

  const empty = { type: 'FeatureCollection', features: [] };
  // Each cluster counts its places per kind, so a cluster of one kind can wear that kind's icon.
  const counts = Object.fromEntries(kinds.map((c, i) => [`n${i}`, ['+', ['case', ['==', ['get', 'kind'], c.id], 1, 0]]]));
  const oneKind = ['any', ...kinds.map((c, i) => ['==', ['get', `n${i}`], ['get', 'point_count']])];
  const kindPin = ['case', ...kinds.flatMap((c, i) => [['==', ['get', `n${i}`], ['get', 'point_count']], `pin-${c.id}`]), ''];
  map.addSource('places', { type: 'geojson', data: empty, cluster: true, clusterRadius: 42, clusterMaxZoom: 12, clusterProperties: counts });
  map.addSource('chosen', { type: 'geojson', data: empty });
  // mixed clusters: a plain disc with the count
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'places',
    filter: ['all', ['has', 'point_count'], ['!', oneKind]],
    paint: { 'circle-color': INK, 'circle-radius': ['step', ['get', 'point_count'], 16, 20, 20, 100, 25], 'circle-stroke-width': 2, 'circle-stroke-color': SURFACE },
  });
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'places',
    filter: ['all', ['has', 'point_count'], ['!', oneKind]],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 13, 'text-allow-overlap': true },
    paint: { 'text-color': SURFACE },
  });
  // clusters of one kind: that kind's pin with the count on a small badge
  map.addLayer({
    id: 'kind-clusters',
    type: 'symbol',
    source: 'places',
    filter: ['all', ['has', 'point_count'], oneKind],
    layout: { 'icon-image': kindPin, 'icon-allow-overlap': true },
  });
  map.addLayer({
    id: 'kind-badge',
    type: 'circle',
    source: 'places',
    filter: ['all', ['has', 'point_count'], oneKind],
    paint: { 'circle-color': SURFACE, 'circle-radius': 11, 'circle-stroke-width': 2, 'circle-stroke-color': INK, 'circle-translate': [17, -17] },
  });
  map.addLayer({
    id: 'kind-count',
    type: 'symbol',
    source: 'places',
    filter: ['all', ['has', 'point_count'], oneKind],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 11, 'text-offset': [1.55, -1.55], 'text-allow-overlap': true },
    paint: { 'text-color': INK },
  });
  map.addLayer({ id: 'chosen', type: 'circle', source: 'chosen', paint: { 'circle-color': ACCENT, 'circle-radius': 27, 'circle-stroke-width': 2, 'circle-stroke-color': INK } });
  map.addLayer({
    id: 'points',
    type: 'symbol',
    source: 'places',
    filter: ['!', ['has', 'point_count']],
    layout: { 'icon-image': ['concat', 'pin-', ['get', 'kind']], 'icon-allow-overlap': true },
  });
  // the place on the front card keeps its own pin on top, even where its neighbours are clustered
  map.addLayer({
    id: 'chosen-pin',
    type: 'symbol',
    source: 'chosen',
    layout: { 'icon-image': ['concat', 'pin-', ['get', 'kind']], 'icon-allow-overlap': true, 'icon-ignore-placement': true },
  });

  let open = null;
  let picking = null;

  // Rings the place on the front card. `how` moves the map to it: 'near' goes right up to it,
  // 'view' only brings it back when it has slipped under the controls or off the edge.
  function choose(row, how) {
    map.getSource('chosen').setData(row ? { type: 'Feature', properties: { kind: row.kind.id }, geometry: { type: 'Point', coordinates: [row.lng, row.lat] } } : empty);
    if (!row || !how) return;
    const at = [row.lng, row.lat];
    const room = pad();
    if (how === 'near') return map.easeTo({ center: at, zoom: Math.max(map.getZoom(), 15), padding: room, animate: !still });
    const spot = map.project(at);
    const out = spot.x < room.left || spot.x > container.clientWidth - room.right || spot.y < room.top || spot.y > container.clientHeight - room.bottom;
    if (out) map.easeTo({ center: at, padding: room, animate: !still });
  }

  // a tap on a marked zone (and not on a place) says what the zone is
  function showZone(e) {
    if (!zones.length) return;
    const [hit] = map.queryRenderedFeatures(e.point, { layers: ['zone-fill'] });
    const zone = hit && zones.find((z) => z.id === hit.properties.id);
    if (!zone) return;
    const box = Object.assign(document.createElement('div'), { className: 'pop' });
    const date = new Date(`${zone.marked}T12:00:00`).toLocaleDateString(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    box.append(
      Object.assign(document.createElement('p'), { className: 'zone-tag', textContent: say('zone.caution') }),
      Object.assign(document.createElement('strong'), { textContent: zone[`name_${lang}`] }),
      Object.assign(document.createElement('p'), { textContent: say('zone.text') }),
      Object.assign(document.createElement('p'), { className: 'small', textContent: say('zone.marked', { date }) }),
    );
    open?.remove();
    open = new gl.Popup({ offset: 12, maxWidth: '280px' }).setLngLat(e.lngLat).setDOMContent(box).addTo(map);
  }

  map.on('click', (e) => {
    if (picking) {
      const done = picking;
      picking = null;
      container.classList.remove('picking');
      done(e.lngLat);
      return;
    }
    const [feature] = map.queryRenderedFeatures(e.point, { layers: ['points', 'clusters', 'kind-clusters'] });
    if (!feature) return showZone(e);
    if (feature.properties.cluster_id === undefined) return onPick(feature.properties.id);
    map
      .getSource('places')
      .getClusterExpansionZoom(feature.properties.cluster_id)
      .then((zoom) => map.easeTo({ center: feature.geometry.coordinates, zoom, animate: !still }));
  });
  for (const layer of ['points', 'clusters', 'kind-clusters']) {
    map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
  }
  map.on('moveend', onMove);
  map.on('pitchend', () => onTilt(map.getPitch() > 1));

  let homeMarker = null;
  let fitted = '';

  return {
    bounds: () => map.getBounds(),
    tilt: (on) => map.easeTo({ pitch: on ? 55 : 0, animate: !still }),
    lookAt: (bbox) => map.fitBounds(bbox, { padding: pad(), maxZoom: 15, animate: !still }),
    choose,
    pick(done) {
      picking = done;
      container.classList.add('picking');
    },
    setPoints(rows, home, fit) {
      map.getSource('places').setData({
        type: 'FeatureCollection',
        features: rows.map((r) => ({ type: 'Feature', properties: { id: r.id, kind: r.kind.id }, geometry: { type: 'Point', coordinates: [r.lng, r.lat] } })),
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
      map.fitBounds(bounds, { padding: pad(), maxZoom: 15, animate: !still });
    },
  };
}
