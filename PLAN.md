# Janbak (جنبك): plan and state

Static, bilingual (Arabic and English) reference for people in Riyadh: where the
essential places are, when they are open, how far they are, and which numbers to call.
Riyadh only. No news, no live status, no accounts, no backend.

## Pages

Arabic is the default at `/`, English is the same path under `/en/`.

| Page | Path | What is on it |
| --- | --- | --- |
| Places (home) | `/` | The explorer, opening on hospitals; all 2,003 places are one tap away in the type picker |
| One category | `/places/<category>/` | The same explorer preset to one category, with a plain list as fallback |
| Numbers | `/numbers/` | Emergency, health, mental health, family, utilities, residents; search and section filter |
| Ways to help | `/help/` | Blood donation, volunteering, licensed donation platforms |
| Official links | `/links/` | Government sites and apps, grouped |
| About | `/about/` | What it is, data sources, limits, privacy |

Every page starts with the name row (site name, location, language), the four sections as one
tab bar, and three emergency tickets: 911, 997, 937 as tap-to-call. The tickets stay on screen
and tighten as the page scrolls. In Riyadh 911
covers police, Civil Defense and traffic; 998 and 999 are for regions without a 911 centre.

## How the explorer works

- On a phone the map fills the screen under the header. A type picker and an Open now switch
  sit over its top; a deck of cards, one place per card, sits over its bottom and is swiped
  sideways or stepped with its arrows. The full list follows below the map. On a wide screen
  the list sits beside a full-height map. Pins carry the category icon and cluster when dense.
- Search covers name, district, address and type in both languages, and ignores Arabic
  spelling variants (hamza, ta marbuta, diacritics).
- One type of place is on show at a time, or all of them. The type sheet holds the search,
  the eight categories with their kinds, a district (193 Riyadh districts, 148 with drawn
  boundaries from OpenStreetMap), open 24 hours, and "only inside the map view". A search
  looks through every category. Choosing a district also moves the map to it. The current
  view lives in the address bar, so it can be shared as a link.
- Location: browser GPS, one of 150 districts, or a tap on the map. Saved on the device only.
  With a location set, results sort nearest first and show straight-line distance.
- Each card has Call, Directions (Google Maps with the route filled in, no API key) and
  Hours and details, which opens the place's own page as a sheet: hours table, website, source.
  Tapping a pin brings its card to the front; in the list a button moves the map to the place.
- Sheets (type, location, one place) open under the emergency tickets and are not modal, so
  the numbers and the tabs keep working while one is open.
- Marked zones (`research/zones.json`): a red shape over an area with a warning sign that grows
  with the map and a dated note on tap. King Khalid International Airport is marked as a danger
  zone as of 12 October 2026. This is a manual, dated claim: remove the entry when it stops being true.
- Open or closed is worked out in Riyadh time. Unknown hours never count as open.
- MapLibre, no key. Satellite imagery (Esri World Imagery) by default with a switch to a
  plain street map (OpenFreeMap). Labels follow the page language. If the map
  fails, the list still works; with JavaScript off, category pages still show full lists.

## Data (checked 12 October 2026, two passes)

| Category | Places | On the map | With hours | Main source |
| --- | --- | --- | --- | --- |
| Hospitals and urgent care: hospital emergency | 54 | 53 | 33 | Hospital sites, Ministry of Health records |
| Hospitals and urgent care: urgent care | 24 | 24 | 24 | Ministry of Health on-duty list |
| Pharmacies | 205 | 205 | 72 | Chain locators, OpenStreetMap |
| Blood donation and dialysis: blood donation | 23 | 23 | 7 | Ministry of Health directory, hospital sites |
| Blood donation and dialysis: dialysis | 7 | 7 | 6 | Operators' sites |
| Mental health | 15 | 15 | 7 | Ministry of Health guide, clinic listings |
| Supermarkets | 392 | 392 | 248 | Chain locators, OpenStreetMap |
| Fuel stations | 722 | 722 | 5 | Chain locators, OpenStreetMap |
| Public transport: metro stations | 83 | 83 | 83 | OpenStreetMap; hours from rpt.sa |
| Public transport: bus stops | 348 | 348 | 0 | OpenStreetMap |
| Public transport: SAR train stations | 2 | 2 | 0 | OpenStreetMap; names and phone from sar.com.sa |
| Embassies | 128 | 91 | 57 | Embassy sites, OpenStreetMap |

A category can hold more than one kind of place (`kinds` in `src/categories.js`). Each kind
keeps its own pictogram and label on every card and pin, and the type sheet lists a category's
kinds under it. The old single pages (`/places/urgent-care/` and so on) redirect in `vercel.json`.
An open place gets an orange square in front of its status; a closed or unconfirmed one a grey square.

`research/*.json` is the first pass, with a source per entry. `research/verify/*.json` is the
second pass: each entry re-checked against the facility's own site or the Ministry, with
corrections and fills. `npm run data` merges both into `src/data/places.json` and warns on
anything that does not match.

What the second pass found:

- Hospitals: all 59 re-checked. No phone number was wrong. 33 have an official statement
  that the emergency department runs 24 hours; the rest say "Emergency hours not published",
  including the large Ministry hospitals, whose sites do not state it per hospital.
  Five that could not be shown to be operating with an emergency department are left out.
- Urgent care: all 24 match the Ministry's Arabic list. Three centres differ between the
  Arabic and English lists on Friday and Saturday opening.
- Mental health: 6 clinics gained hours and 3 had outdated phone numbers replaced, from map
  listings (no clinic publishes them on its own site). Eradah Complex moved in February 2026.
- Blood donation: only the Central Blood Bank gained hours. 16 centres still have a time
  window from the Ministry with no days, so they show as not confirmed.
- Phone lines: every number re-confirmed on an official page. Three descriptions were
  corrected (937 is not stated to be free, 19922 and 19911 are not round the clock) and the
  child helpline 116111 was added.
- Pharmacy and supermarket chains: Nahdi, Al-Dawaa, Panda, Lulu and Carrefour still block
  automated access, so their branch hours remain unconfirmed.
- Embassies: Pakistan, Palestine, Nigeria, Ethiopia, Afghanistan, Kuwait, Russia and the
  Philippines could not be confirmed from an official page (sites down or blocking access).

Other known gaps:

- Metro: 83 of the operator's 85 stations are in OpenStreetMap, and the names are OpenStreetMap's,
  not checked against the operator's list (rpt.sa blocks automated access). Every station
  carries the network's published hours and the customer care number 19933.
- Bus stops: 348 named stops out of roughly 3,000. Unnamed stops in OpenStreetMap are left out.
  A stop shows no open or closed status; the bus service window is in the category note.
- SAR publishes no coordinates, so its two Riyadh stations are matched to OpenStreetMap by position.

- Fuel station hours are not published by any chain.
- 37 embassies have no map pin (they get a Google Maps search link instead).
- Districts come from OpenStreetMap: 150 of roughly 190. Al Malqa and As Sahafah are missing.
- Left out for thin data: police and Civil Defense stations, ATMs, bakeries.
- Wateen (blood donation app) could not be confirmed on any official page, so it is not
  mentioned. The Ministry points donors to Sehhaty.

## Two languages

- Two real URLs per page with `hreflang`, correct `lang` and `dir`, and a language switch
  that stays on the same page.
- All interface text is in `src/i18n.js` and `src/content.js`, both languages side by
  side. A missing translation stops the build.
- Layout uses logical CSS, so right-to-left is not a patched copy.
- Western digits in both languages. Phone numbers always read left to right.
- Place names use the official name in each language. Where only one exists, it is shown
  in both rather than inventing a translation.

## Design

Each category and each emergency number has a full-colour pictogram (red cross, blue and
yellow capsule, blood drop and so on, in `src/icons.js`), shown as they are on white cards and
on a white disc on the map. Everything else keeps to the palette below.

Ice ground, deep blue ink, white cards, one orange accent for the main action, "open" and
the place on show. Two radii (cards, controls), one 2px line, no shadows, no gradients.
Markazi Text for the site name, numerals and place names; IBM Plex Sans Arabic for everything
else; both cover both scripts and are self-hosted. Motion is limited to 150 ms state changes
and the tightening emergency tickets, and is off under reduced-motion.

## Tech

- Astro, static output: 26 pages plus a 404. No server, so it scales with the CDN.
- About 6 KB of script on first load, then one 75 KB data file per language and the map
  library (about 430 KB compressed, cached) in the background.
- Largest page (fuel, 722 rows) is about 40 KB compressed.
- `vercel.json` sets long cache lifetimes for hashed assets.
- Tests: `npm test` covers the opening-hours logic (overnight shifts, Friday split hours,
  Riyadh clock).

## Still to decide

1. Address. The site is named Janbak (جنبك, "beside you"). Set `SITE_URL` to the real address
   before deploying (it feeds canonical links, the sitemap and share images); until then it
   falls back to a placeholder.
2. Arabic copy review: read `src/i18n.js` and `src/content.js` once as a native speaker.
3. Whether to fill the pharmacy gap by hand from the Nahdi and Al-Dawaa apps.
4. Satellite imagery comes from Esri's public tile service, which needs no key but is meant for
   light use. Before a large launch, register a free Esri or MapTiler key or default to the plain map.
