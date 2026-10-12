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
const GROUND = '#0a4b2c';
const INK = '#f5f2e7';
const ACCENT = '#f4d058';
const DEEP = '#06281a';
const DANGER = '#e03131';

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
// language, the US road-shield layers (which only log warnings here) are dropped,
// and a satellite imagery layer is slotted in under the labels.
const drawn = new Map(); // layer id -> how the plain map draws it

async function loadStyle(satellite) {
  const style = await (await fetch(STYLE)).json();
  const field =
    lang === 'ar'
      ? ['coalesce', ['get', 'name:ar'], ['get', 'name']]
      : ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
  const layers = style.layers.filter((layer) => !layer.id.includes('shield'));
  for (const layer of layers) {
    if (layer.type === 'symbol' && JSON.stringify(layer.layout?.['text-field'] ?? '').includes('name')) layer.layout['text-field'] = field;
    drawn.set(layer.id, {
      type: layer.type,
      visibility: layer.layout?.visibility ?? 'visible',
      text: [layer.paint?.['text-color'], layer.paint?.['text-halo-color'], layer.paint?.['text-halo-width']],
    });
  }
  style.sources.imagery = { type: 'raster', tiles: [IMAGERY], tileSize: 256, maxzoom: 18 };
  style.layers = [
    ...layers.filter((layer) => layer.type !== 'symbol'),
    { id: 'imagery', type: 'raster', source: 'imagery', layout: { visibility: 'none' } },
    ...layers.filter((layer) => layer.type === 'symbol'),
  ];
  for (const layer of style.layers) {
    const look = lookFor(layer.id, satellite);
    layer.layout = { ...layer.layout, visibility: look.visibility };
    if (satellite && look.text) layer.paint = { ...layer.paint, 'text-color': look.text[0], 'text-halo-color': look.text[1], 'text-halo-width': look.text[2] };
  }
  return style;
}

// How one base layer should look in each mode: over imagery the drawn land and roads
// are hidden and the labels turn light with a dark edge.
function lookFor(id, satellite) {
  if (id === 'imagery') return { visibility: satellite ? 'visible' : 'none' };
  const plain = drawn.get(id);
  if (plain.type === 'symbol') return { visibility: plain.visibility, text: satellite ? [INK, 'rgba(6, 40, 26, 0.9)', 1.5] : plain.text };
  return { visibility: satellite && plain.type !== 'background' ? 'none' : plain.visibility };
}

function setMode(map, satellite) {
  for (const id of ['imagery', ...drawn.keys()]) {
    const look = lookFor(id, satellite);
    map.setLayoutProperty(id, 'visibility', look.visibility);
    if (look.text) {
      map.setPaintProperty(id, 'text-color', look.text[0]);
      map.setPaintProperty(id, 'text-halo-color', look.text[1]);
      map.setPaintProperty(id, 'text-halo-width', look.text[2]);
    }
  }
}

// A round light pin carrying the kind's colour pictogram, drawn at twice the size for sharp screens.
function pinImage(markup) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="38.5" fill="${INK}" stroke="${DEEP}" stroke-width="5"/><g transform="translate(18 18) scale(2)">${markup}</g></svg>`;
  const image = new Image(84, 84);
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return image.decode().then(() => image);
}

// The warning sign for a marked zone: a yellow triangle, drawn large so it stays sharp as it grows with the map.
function hazardImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24"><path fill="#fcc419" stroke="${DEEP}" stroke-width="1.5" stroke-linejoin="round" d="M12 2.8L22.3 20.6H1.7z"/><path fill="${DEEP}" d="M10.9 8.8h2.2v6.2h-2.2zM10.9 16.4h2.2v2.2h-2.2z"/></svg>`;
  const image = new Image(512, 512);
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return image.decode().then(() => image);
}

const loadZones = () => fetch('/data/zones.json').then((res) => (res.ok ? res.json() : [])).catch(() => []);

export async function createMap(container, { kinds, popup, onMove, satellite }) {
  const [gl, style, zones] = await Promise.all([loadLibrary(), loadStyle(satellite), loadZones()]);
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

  // Marked zones: a red shape over the area, under the place pins, with a warning sign that grows with the map.
  if (zones.length) {
    map.addImage('hazard', await hazardImage(), { pixelRatio: 2 });
    map.addSource('zones', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: zones.flatMap((z) => [
          { type: 'Feature', properties: { id: z.id }, geometry: { type: 'Polygon', coordinates: [z.ring] } },
          { type: 'Feature', properties: { id: z.id, sign: true }, geometry: { type: 'Point', coordinates: z.centre } },
        ]),
      },
    });
    map.addLayer({ id: 'zone-fill', type: 'fill', source: 'zones', filter: ['!', ['has', 'sign']], paint: { 'fill-color': DANGER, 'fill-opacity': 0.38 } });
    map.addLayer({ id: 'zone-edge', type: 'line', source: 'zones', filter: ['!', ['has', 'sign']], paint: { 'line-color': DANGER, 'line-width': 3 } });
    map.addLayer({
      id: 'zone-sign',
      type: 'symbol',
      source: 'zones',
      filter: ['has', 'sign'],
      layout: {
        'icon-image': 'hazard',
        'icon-size': ['interpolate', ['exponential', 1.6], ['zoom'], 8, 0.07, 10, 0.2, 12, 0.5, 14, 1.1, 16, 2],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    });
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
    paint: { 'circle-color': GROUND, 'circle-radius': ['step', ['get', 'point_count'], 16, 20, 20, 100, 25], 'circle-stroke-width': 2, 'circle-stroke-color': INK },
  });
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'places',
    filter: ['all', ['has', 'point_count'], ['!', oneKind]],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 13, 'text-allow-overlap': true },
    paint: { 'text-color': INK },
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
    paint: { 'circle-color': INK, 'circle-radius': 11, 'circle-stroke-width': 2, 'circle-stroke-color': GROUND, 'circle-translate': [17, -17] },
  });
  map.addLayer({
    id: 'kind-count',
    type: 'symbol',
    source: 'places',
    filter: ['all', ['has', 'point_count'], oneKind],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 11, 'text-offset': [1.55, -1.55], 'text-allow-overlap': true },
    paint: { 'text-color': GROUND },
  });
  map.addLayer({ id: 'chosen', type: 'circle', source: 'chosen', paint: { 'circle-color': ACCENT, 'circle-radius': 29 } });
  map.addLayer({
    id: 'points',
    type: 'symbol',
    source: 'places',
    filter: ['!', ['has', 'point_count']],
    layout: { 'icon-image': ['concat', 'pin-', ['get', 'kind']], 'icon-allow-overlap': true },
  });

  let open = null;
  let picking = null;

  function show(id, at, move) {
    open?.remove();
    map.getSource('chosen').setData({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: at } });
    open = new gl.Popup({ offset: 24, maxWidth: '280px' }).setLngLat(at).setDOMContent(popup(id)).addTo(map);
    open.on('close', () => map.getSource('chosen').setData(empty));
    if (move) map.easeTo({ center: at, zoom: Math.max(map.getZoom(), 15), animate: !still });
  }

  // a tap on a marked zone (and not on a place) says what the zone is
  function showZone(e) {
    if (!zones.length) return;
    const [hit] = map.queryRenderedFeatures(e.point, { layers: ['zone-fill', 'zone-sign'] });
    const zone = hit && zones.find((z) => z.id === hit.properties.id);
    if (!zone) return;
    const box = Object.assign(document.createElement('div'), { className: 'pop' });
    const date = new Date(`${zone.marked}T12:00:00`).toLocaleDateString(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    box.append(
      Object.assign(document.createElement('p'), { className: 'zone-tag', textContent: say('zone.danger') }),
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
    if (feature.properties.cluster_id === undefined) return show(feature.properties.id, feature.geometry.coordinates, false);
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

  let homeMarker = null;
  let fitted = '';

  return {
    bounds: () => map.getBounds(),
    setSatellite: (on) => setMode(map, on),
    lookAt: (bbox) => map.fitBounds(bbox, { padding: 40, maxZoom: 15, animate: !still }),
    select: (row) => show(row.id, [row.lng, row.lat], true),
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
      map.fitBounds(bounds, { padding: 56, maxZoom: 15, animate: !still });
    },
  };
}
