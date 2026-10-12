# Janbak (جنبك)

Static, bilingual (Arabic default at `/`, English at `/en/`) reference site for Riyadh:
essential places with hours and directions, phone lines, official links. See `PLAN.md`.

## Rules for this project

- Riyadh only. No news, live status, alerts or crowd-sourced content.
- Nothing ships in one language. Interface text goes in `src/i18n.js`, page content in
  `src/content.js`, always with both `ar` and `en`.
- Phone numbers and official links must come from an official source recorded in
  `research/`. Never add one from memory.
- Green ground, off-white ink, amber accent, square corners, no shadows or gradients, no
  decorative animation. Colour lives only in the pictograms in `src/icons.js` (categories and emergency numbers). Tokens are at the top of `src/styles/global.css`.
- No em or en dashes and no emoji in copy or comments.

## Commands

- `npm run dev`: build data, then dev server on port 4321
- `npm run build`: build data, then static site into `dist/`
- `npm run data`: merge `research/*.json` into `src/data/places.json` (generated, not committed)
- `npm test`: opening-hours tests
- `node scripts/make-images.mjs`: regenerate favicon and share images

## Layout

- `research/`: raw researched data with sources. Edit here to fix a place.
- `scripts/build-data.mjs`: validation and merge; also copies MapLibre into `public/vendor/`.
- `src/pages/[...lang]/`: one file per page, rendered once per language.
- `src/lib/hours.js`: opening-hours parsing and open-now logic, shared by build and browser.
- `src/components/Explorer.astro` with `src/scripts/explorer.js` and `map.js`: the map-first
  finder used on the home page and on every category page.
- `src/pages/data/[lang].json.js`: the compact per-language data file the explorer fetches.
- `src/components/Directory.astro` with `src/scripts/directory.js`: the searchable lists on
  the Numbers, Help and Links pages.
- `research/district-areas.json`: district boundaries; the data build places each place in one.
