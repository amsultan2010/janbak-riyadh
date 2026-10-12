# Riyadh Guide: plan and state

Static, bilingual (Arabic and English) reference for people in Riyadh: where the
essential places are, when they are open, how far they are, and which numbers to call.
Riyadh only. No news, no live status, no accounts, no backend.

## Pages

Arabic is the default at `/`, English is the same path under `/en/`.

| Page | Path | What is on it |
| --- | --- | --- |
| Places (home) | `/` | Location setter, the nine categories with counts |
| One category | `/places/<category>/` | Search, open-now filter, list sorted by distance, map |
| Numbers | `/numbers/` | Emergency, health, mental health, family, utilities, residents |
| Ways to help | `/help/` | Blood donation, volunteering, licensed donation platforms |
| Official links | `/links/` | Government sites and apps, grouped |
| About | `/about/` | What it is, data sources, limits, privacy |

Every page starts with the emergency bar: 911, 997, 937 as tap-to-call. In Riyadh 911
covers police, Civil Defense and traffic; 998 and 999 are for regions without a 911 centre.

## How the finder works

- Location: "Use my current location" (browser GPS) or pick one of 150 districts. Saved on
  the device only.
- With a location set, every list sorts nearest first and shows straight-line distance.
- Directions opens Google Maps with the route filled in
  (`/maps/dir/?api=1&origin=..&destination=..&hl=ar|en`). No API key.
- Open or closed is worked out in Riyadh time from each place's hours. Unknown hours say
  "Hours not confirmed" and never count as open.
- The map (MapLibre with OpenFreeMap tiles, no key) loads only when "Show map" is tapped.
  Its labels follow the page language. If it fails, the list still works.
- With JavaScript off, every list and phone link still works.

## Data (checked 12 October 2026)

| Category | Places | On the map | With hours | Main source |
| --- | --- | --- | --- | --- |
| Hospitals with emergency | 51 | 50 | 34 | Hospital sites, Ministry of Health |
| Urgent care | 24 | 24 | 24 | Ministry of Health on-duty list |
| Pharmacies | 205 | 205 | 68 | Chain locators, OpenStreetMap |
| Blood donation | 23 | 23 | 6 | Ministry of Health directory, hospital sites |
| Dialysis | 7 | 7 | 6 | Operators' sites |
| Mental health | 15 | 14 | 1 | Ministry of Health guide |
| Supermarkets | 392 | 392 | 248 | Chain locators, OpenStreetMap |
| Fuel stations | 722 | 722 | 5 | Chain locators, OpenStreetMap |
| Embassies | 128 | 91 | 57 | Embassy sites, OpenStreetMap |

Raw research with a source per entry is in `research/`. `npm run data` merges it into
`src/data/places.json` and fails loudly on a broken entry.

Known gaps:

- Nahdi and Al-Dawaa pharmacies are mostly missing: their branch finders are app-only or
  block automated access. Panda, Lulu and Carrefour branches come from OpenStreetMap only.
- Fuel station hours are not published by any chain.
- 17 blood donation centres have a time window from the Ministry but no days, so they
  show as not confirmed.
- 8 hospitals and 2 blood centres that research marked low confidence are left out.
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

Green ground, off-white text, one amber accent for "open" and focus. Square corners, one
line weight, no shadows, no gradients. Bilingual road-sign discipline: big type, short
lines, one column. IBM Plex Sans Arabic for both scripts, self-hosted. Motion is limited
to 150 ms state changes and is off under reduced-motion.

## Tech

- Astro, static output: 28 pages plus a 404. No server, so it scales with the CDN.
- About 4 KB of JavaScript on first load. The map library (about 430 KB compressed) is fetched only
  on demand from `/vendor/`.
- Largest page (fuel, 722 rows) is about 40 KB compressed.
- `vercel.json` sets long cache lifetimes for hashed assets.
- Tests: `npm test` covers the opening-hours logic (overnight shifts, Friday split hours,
  Riyadh clock).

## Still to decide

1. Name and address. "Riyadh Guide / دليل الرياض" is a working name; set `SITE_URL` to the
   real address before deploying (it feeds canonical links, the sitemap and share images).
2. Arabic copy review: read `src/i18n.js` and `src/content.js` once as a native speaker.
3. Whether to fill the pharmacy gap by hand from the Nahdi and Al-Dawaa apps.
