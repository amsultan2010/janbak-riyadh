# Contributing to Janbak

Thanks for helping. Janbak is a small project with one maintainer, so the rules are short.
Contributions in Arabic or English are both welcome.

## The most useful thing: fix the data

A wrong phone number, changed hours, a place that moved or closed, a missing branch. You
can do this two ways:

- [Open a data correction](https://github.com/amsultan2010/janbak-riyadh/issues/new/choose)
  with a link to the official page that shows the right value. No code needed.
- Or edit the entry in `research/` yourself and open a pull request.

## What the project will and will not take

- Riyadh only.
- No news, live status, alerts or crowd-sourced content. Janbak is a reference, not a feed.
- Phone numbers and official links must come from an official source (the agency, the
  hospital, the chain, the embassy, the ministry), recorded next to the entry in
  `research/`. "I called and it worked" or a number from memory is not enough.
- Nothing ships in one language. Interface text goes in `src/i18n.js`, page content in
  `src/content.js`, always with both `ar` and `en`. If you only write one of the two, say
  so in the pull request and the other will be added before merging.
- Where a place has an official name in only one language, show that name in both rather
  than inventing a translation.
- No em or en dashes and no emoji in copy or comments.

If you want to add a category, a page or a feature, open an issue first. It saves you
writing something that does not fit.

## Set up

You need Node 22.12 or newer.

```bash
git clone https://github.com/amsultan2010/janbak-riyadh.git
cd janbak-riyadh
npm install
npm run dev
```

The site is then at `http://localhost:4321`.

## Editing data

- `research/*.json` holds the entries, one file per category, each with its `sources`.
- `research/verify/*.json` holds corrections on top: an item names a `file`, an entry `id`,
  the fields to `set` and the `sources` that back them.
- Run `npm run data`. It validates and merges everything into `src/data/places.json`
  (generated, not committed) and prints a warning for anything that does not match.
- Hours use the OpenStreetMap opening-hours format, for example
  `Sa-Th 08:00-23:00; Fr 16:00-23:00`. Unknown hours stay `null`; they never count as open.
- Data taken from OpenStreetMap keeps its `osm` id so it can be traced back.

## Design

Ice ground, deep blue ink, white cards, one orange accent. Two radii, one 2px line, no
shadows or gradients, no decorative animation. The tokens are at the top of
`src/styles/global.css`. Other colour lives only in the pictograms in `src/icons.js`.

## Before you open a pull request

```bash
npm test
npm run build
```

Both must pass; CI runs the same two commands.

- One change per pull request, in small commits.
- Commit messages are lowercase and imperative, like the history: `add the new metro station`.
- Say what changed and link the source for any data change.
- Check the page in both languages, on a phone width and a wide screen, if you touched
  anything visible.

## Licence of contributions

By contributing you agree that your code and copy are released under the [MIT licence](LICENSE)
and your changes to `research/` under the [Open Database License 1.0](LICENSE-DATA.md).

## Conduct and security

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
Report security problems as described in [SECURITY.md](SECURITY.md), not in a public issue.
