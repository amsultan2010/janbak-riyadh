---
name: Janbak
description: a calm bilingual Riyadh reference on an ice ground
colors:
  ground: "#e9eef4"
  surface: "#ffffff"
  ink: "#0f2540"
  soft: "#47597a"
  rule: "#b9c5d6"
  sunk: "#d9e2ec"
  accent: "#ff8a3d"
  accent-deep: "#f47a26"
  urgent: "#cc2823"
typography:
  display:
    fontFamily: "Markazi Text, IBM Plex Sans Arabic, serif"
rounded:
  card: "14px"
  control: "10px"
spacing:
  pad: "1rem"
  wide: "46rem"
  bar: "3.5rem"
  head: "7.25rem"
  line: "1.5px"
---

# Design System: Janbak

Source of truth for the look. Tokens are at the top of `src/styles/global.css`.

## Colors

Ice ground `#e9eef4`, deep blue ink `#0f2540` (secondary `#47597a`), white cards `#ffffff`, rules `#b9c5d6`, sunk wells `#d9e2ec`. One orange accent, `#ff8a3d` (`#f47a26` deep). `#cc2823` is only the ring around emergency care, taken from the pictograms. Any other colour lives only in the pictograms in `src/icons.js` (categories and emergency numbers).

## Typography

Headings in Markazi Text, with IBM Plex Sans Arabic as the fallback. Arabic is the default language at `/`, English at `/en/`; both must read well, right to left and left to right.

## Shape and depth

Two radii: cards `14px`, controls `10px` (50% only for round marks). One line weight, `--line` 1.5px. No shadows and no gradients.

## Layout

Reading width 46rem. The bar that stays on screen is 3.5rem; everything above the content is 7.25rem. On a phone the explorer is a map with a deck of cards; on a wide screen a list sits beside the map.

## Motion

No decorative animation. Motion only where it explains a change (sheets opening, the tour).
