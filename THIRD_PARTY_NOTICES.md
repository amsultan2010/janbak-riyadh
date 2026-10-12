# Third-party notices

Janbak's own code is under the [MIT licence](LICENSE) and its dataset under the
[Open Database License 1.0](LICENSE-DATA.md). The things below belong to other people and
keep their own terms. None of them are stored in this repository except where noted; the
software is installed from npm and the map services are called by the visitor's browser.

## Software and fonts shipped with the built site

| What | Licence | Copyright |
| --- | --- | --- |
| [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) | BSD-3-Clause | © 2023 MapLibre contributors; contains code from mapbox-gl-js v1.13 and earlier, © 2020 Mapbox |
| [Markazi Text](https://github.com/BornaIz/markazitext) | SIL Open Font License 1.1 | © 2017 The Markazi Text Project Authors |
| [IBM Plex Sans Arabic](https://github.com/IBM/plex) | SIL Open Font License 1.1 | © 2019 IBM Corp. |

The full licence texts are in `node_modules/maplibre-gl/LICENSE.txt`,
`node_modules/@fontsource/markazi-text/LICENSE` and
`node_modules/@fontsource/ibm-plex-sans-arabic/LICENSE` after `npm install`. The fonts are
packaged by [Fontsource](https://fontsource.org).

## Build tools

[Astro](https://astro.build) (MIT) builds the site. Its full dependency tree and the
licence of each package are in `package-lock.json`.

## Data in `research/`

- **OpenStreetMap.** Places, coordinates, district boundaries and transport stops in
  `osm-places.json`, `district-areas.json`, `districts.json`, `transport-stops.json` and
  parts of the other files come from [OpenStreetMap](https://www.openstreetmap.org/copyright),
  © OpenStreetMap contributors, under the Open Database License 1.0. Entries keep their
  `osm` id.
- **Wikidata.** Some Arabic names are Wikidata labels, released under CC0.
- **Official sources.** Phone numbers, hours, addresses and links were read from the
  public websites of ministries, agencies, hospitals, shop chains and embassies. Each entry
  lists its `sources`. Those sites and their names and trademarks belong to their owners;
  Janbak is not affiliated with or endorsed by any of them.

## Map services used at run time

These are called from the visitor's browser and are credited on the map and on the About page.

- **[OpenFreeMap](https://openfreemap.org)** serves the vector tiles and the place-name
  style, built with [OpenMapTiles](https://openmaptiles.org) from OpenStreetMap data.
- **Esri World Imagery** serves the satellite imagery. Sources: Esri, Maxar, Earthstar
  Geographics. It is not open data and is subject to
  [Esri's terms of use](https://www.esri.com/en-us/legal/terms/full-master-agreement). If
  you run your own copy of the site at any scale, register your own key or swap the
  imagery source in `src/scripts/map.js`.
- **Google Maps** opens when a visitor taps Directions. Nothing from it is stored here.
