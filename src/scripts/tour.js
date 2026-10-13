// The tour: a short walk through the controls on the page. Each step rings one control and
// says what it does. A step whose control is not on this page is left out, so the same list
// serves the finder and the Numbers, Help and Links pages.
import { say } from './home.js';
import { openSheet } from './sheet.js';

// `at` is the control to ring; `sheet` is the sheet that has to be open for it to show
const STEPS = [
  { id: 'type', at: '[data-cat-open]' },
  { id: 'search', at: '[data-cat-sheet] .search', sheet: '[data-cat-sheet]' },
  { id: 'filter', at: '[data-cat-sheet] .chips', sheet: '[data-cat-sheet]' },
  { id: 'now', at: '[data-open-only]' },
  { id: 'loc', at: '[data-loc-open]' },
  { id: 'map', at: '[data-map]' },
  // the front card of the deck on a phone, the first card of the list on a wide screen
  { id: 'card', at: '[data-deck], [data-places] .place' },
  { id: 'find', at: '[data-dir-tools]' },
  { id: 'group', at: '.filters' },
  { id: 'tabs', at: '.tabs' },
  { id: 'em', at: '.em' },
  { id: 'lang', at: '.lang' },
];
const GAP = 12;
const EDGE = 4;

const tour = document.querySelector('[data-tour]');
const button = document.querySelector('[data-tour-open]');
const ring = tour.querySelector('[data-tour-ring]');
const card = tour.querySelector('[data-tour-card]');
const [back, next] = tour.querySelectorAll('[data-tour-step]');
const rtl = document.documentElement.dir === 'rtl';

const shown = (el) => el.getClientRects().length > 0;
const find = (step) => [...document.querySelectorAll(step.at)].find(shown);

let steps = [];
let at = 0;
let sheet = null; // the sheet this tour has opened

// The ring goes round the control and the card beside it: under it where there is room,
// else over it, else inside it (the map fills the screen on a phone).
function place() {
  const target = tour.open && find(steps[at]);
  if (!target) return;
  const box = target.getBoundingClientRect();
  const width = tour.clientWidth;
  const height = tour.clientHeight;
  const left = Math.max(EDGE, box.left - EDGE);
  const top = Math.max(EDGE, box.top - EDGE);
  const right = Math.min(width - EDGE, box.right + EDGE);
  const bottom = Math.min(height - EDGE, box.bottom + EDGE);
  Object.assign(ring.style, { left: `${left}px`, top: `${top}px`, width: `${right - left}px`, height: `${bottom - top}px` });

  const w = card.offsetWidth;
  const h = card.offsetHeight;
  const under = bottom + GAP;
  const over = top - GAP - h;
  const y = under + h + GAP <= height ? under : over >= GAP ? over : (top + bottom - h) / 2;
  const x = rtl ? right - w : left;
  card.style.left = `${Math.max(GAP, Math.min(x, width - GAP - w))}px`;
  card.style.top = `${Math.max(GAP, Math.min(y, height - GAP - h))}px`;
}

function show(n) {
  at = n;
  const step = steps[at];
  const wanted = step.sheet ? document.querySelector(step.sheet) : null;
  if (sheet && sheet !== wanted) sheet.close();
  if (wanted && !wanted.open) openSheet(wanted);
  sheet = wanted;
  tour.querySelector('[data-tour-count]').textContent = `${at + 1} / ${steps.length}`;
  tour.querySelector('[data-tour-title]').textContent = say(`tour.${step.id}.title`);
  tour.querySelector('[data-tour-text]').textContent = say(`tour.${step.id}.text`);
  back.disabled = at === 0;
  next.textContent = say(at === steps.length - 1 ? 'tour.done' : 'tour.next');
  find(step)?.scrollIntoView({ block: 'nearest' });
  place();
}

function start() {
  document.querySelector('.sheet[open]')?.close();
  steps = STEPS.filter((step) => (step.sheet ? document.querySelector(step.sheet) : find(step)));
  tour.showModal();
  show(0);
}

button.addEventListener('click', start);
back.addEventListener('click', () => show(at - 1));
next.addEventListener('click', () => (at === steps.length - 1 ? tour.close() : show(at + 1)));
tour.addEventListener('close', () => {
  sheet?.close();
  sheet = null;
});
addEventListener('resize', place);
addEventListener('scroll', place, { passive: true });
// the page can still settle under a tour that opened by itself: a font arriving moves the controls
new ResizeObserver(place).observe(document.body);
button.hidden = false;

// The tour opens by itself on arriving at the site, not on moving between its pages.
// It waits for the page's other scripts to show their controls, and a link to one place
// opens on that place instead.
if (!document.referrer.startsWith(location.origin)) {
  const ready = document.querySelector('[data-explorer]') ? 'finderready' : 'DOMContentLoaded';
  document.addEventListener(ready, () => document.querySelector('.sheet[open]') || start(), { once: true });
}
