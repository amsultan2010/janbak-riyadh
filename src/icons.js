// Two kinds of icon, both on a 24 unit grid.
// ICONS: line icons for the interface, drawn at the site's one stroke weight.
export const ICONS = {
  'numbers': 'M6 3h4l1.5 5-2.5 1.5a11 11 0 0 0 5.5 5.5L16 12.5l5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z',
  'help': 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z M12 9v5 M9.5 11.5h5',
  'links': 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  'open': 'M8 5h11v11 M19 5L6 18',
  'pin': 'M12 21s-6-6.5-6-11a6 6 0 0 1 12 0c0 4.5-6 11-6 11z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  'chevron': 'M9 5l7 7-7 7',
  'back': 'M15 5l-7 7 7 7',
  'down': 'M6 9l6 6 6-6',
  'info': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5.5 M12 7.6v.2',
};

// PICTURES: flat pictograms for the place categories, their kinds and the emergency numbers.
// One set of rules for all of them: plain filled shapes, no outlines, one neutral
// and at most one colour each, 2 unit lines, and nothing behind them.
// They are drawn for the light surfaces: the ink blue and one colour deep enough to read on white.
const INK = '#0f2540';
const RED = '#cc2823';
const ORANGE = '#d9641a';
const AMBER = '#b98300';
const GREEN = '#1e8a4c';
const BLUE = '#1762b6';
const LILAC = '#7b55c7';
const ROSE = '#c9366f';
// The emergency three use the same ink with the red and the blue.
const GROUND = INK;
const BAR_RED = RED;
const BAR_BLUE = BLUE;

export const PICTURES = {
  // a red cross
  'hospitals': `<path fill="${RED}" d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>`,
  // a stopwatch carrying a red cross: care that cannot wait
  'urgent-care': `<path fill="${INK}" d="M9.5 1.5h5v2H13V5h-2V3.5H9.5z"/><circle cx="12" cy="13.5" r="7.5" fill="none" stroke="${INK}" stroke-width="2"/><path fill="${RED}" d="M10.5 9h3v3h3v3h-3v3h-3v-3h-3v-3h3z"/>`,
  // a capsule, half green
  'pharmacies': `<g transform="rotate(-45 12 12)"><path fill="${GREEN}" d="M12 7H7a5 5 0 0 0 0 10h5z"/><path fill="${INK}" d="M12 7h5a5 5 0 0 1 0 10h-5z"/></g>`,
  // a drop of blood with a cross cut out of it
  'blood-donation': `<path fill="${RED}" fill-rule="evenodd" d="M12 2.5l5.46 8.48a6.5 6.5 0 1 1-10.92 0zM10.75 11.25h2.5v2.25h2.25V16h-2.25v2.25h-2.5V16H8.5v-2.5h2.25z"/>`,
  // the merged category: a drop of blood beside a kidney
  'blood-dialysis': `<path fill="${RED}" d="M7.3 3l4.16 6.22a5 5 0 1 1-8.32 0z"/><path fill="${INK}" d="M16.9 9.5c3 0 5.3 2.4 5.3 6s-2.3 6-5.3 6c-1.6 0-2.7-1-2.7-2.3 0-1.4 1.3-1.8 1.3-3.7s-1.3-2.3-1.3-3.7c0-1.3 1.1-2.3 2.7-2.3z"/>`,
  // a kidney and a drop
  'dialysis': `<path fill="${ROSE}" d="M10.5 3.5c-4.2 0-7.5 3.4-7.5 8.5s3.3 8.5 7.5 8.5c2.3 0 3.8-1.4 3.8-3.3 0-2-1.8-2.6-1.8-5.2s1.8-3.2 1.8-5.2c0-1.9-1.5-3.3-3.8-3.3z"/><path fill="${INK}" d="M18.5 8.5l2.65 3.9a3.2 3.2 0 1 1-5.3 0z"/>`,
  // a brain in two halves
  'mental-health': `<path fill="${LILAC}" d="M11.25 4.2a3.9 3.9 0 0 0-6.9 2A3.9 3.9 0 0 0 2.75 12a3.9 3.9 0 0 0 1.9 5.5 3.9 3.9 0 0 0 6.6 2.3zM12.75 4.2a3.9 3.9 0 0 1 6.9 2 3.9 3.9 0 0 1 1.6 5.8 3.9 3.9 0 0 1-1.9 5.5 3.9 3.9 0 0 1-6.6 2.3z"/>`,
  // a shopping basket
  'supermarkets': `<path d="M6.5 9.5L12 3.5l5.5 6" fill="none" stroke="${INK}" stroke-width="2"/><path fill="${INK}" d="M2 9h20v2.5H2z"/><path fill="${ORANGE}" fill-rule="evenodd" d="M3.5 11.5h17L18.8 21H5.2zM8 14h1.5v4.5H8zM11.25 14h1.5v4.5h-1.5zM14.5 14H16v4.5h-1.5z"/>`,
  // a fuel pump
  'fuel': `<path fill="${AMBER}" fill-rule="evenodd" d="M4.5 3h9v16h-9zM6.5 5.5h5V10h-5z"/><path fill="${INK}" d="M3 19h12v2.5H3z"/><path d="M13.5 12.5H17v5.25a1.75 1.75 0 0 0 3.5 0V8.5L18 6" fill="none" stroke="${INK}" stroke-width="2"/>`,
  // a metro train seen from the front, on its rails
  'metro': `<path d="M8.5 18.5L6 22M15.5 18.5L18 22" fill="none" stroke="${INK}" stroke-width="2"/><path fill="${BLUE}" fill-rule="evenodd" d="M6 7a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v11.5H6zM8.5 6.5h7v5h-7zM8.5 14h2v2h-2zM13.5 14h2v2h-2z"/>`,
  // a bus seen from the front
  'bus': `<path fill="${INK}" d="M6 18.5h3v3H6zM15 18.5h3v3h-3z"/><path fill="${GREEN}" fill-rule="evenodd" d="M4.5 3h15v15.5h-15zM6.5 5.5h11v6h-11zM6.5 14H9v2H6.5zM15 14h2.5v2H15z"/>`,
  // an intercity locomotive: a split windscreen and a stripe
  'train': `<path d="M8 18.5L5.5 22M16 18.5l2.5 3.5" fill="none" stroke="${INK}" stroke-width="2"/><path fill="${RED}" fill-rule="evenodd" d="M5 5.5l2-3h10l2 3v13H5zM7 6.5h4.2V11H7zM12.8 6.5H17V11h-4.2zM5 13.5h14V15H5z"/>`,
  // a flag on a pole
  'embassies': `<path fill="${INK}" d="M4 2.5h2V20h2v1.5H2V20h2z"/><path fill="${BLUE}" d="M6 4h14.5l-3 4.5 3 4.5H6z"/>`,
  // 911: a red beacon
  'siren': `<path d="M12 1v3.5M4 3.5L6.5 6M20 3.5L17.5 6" fill="none" stroke="${GROUND}" stroke-width="2"/><path fill="${BAR_RED}" d="M7 17v-5a5 5 0 0 1 10 0v5z"/><path fill="${GROUND}" d="M4.5 17h15v4.5h-15z"/>`,
  // 997: an ambulance
  'ambulance': `<path fill="${GROUND}" d="M5.5 4h4v2.5h-4z"/><path fill="${BAR_RED}" fill-rule="evenodd" d="M1.5 6.5H14V10h4l4.5 4v4.5h-2a3 3 0 0 0-6 0H9a3 3 0 0 0-6 0H1.5zM6.75 8h2v2h2v2h-2v2h-2v-2h-2v-2h2zM15.5 11.5h2l2.8 2.5h-4.8z"/><circle cx="6" cy="18.5" r="2" fill="${GROUND}"/><circle cx="17.5" cy="18.5" r="2" fill="${GROUND}"/>`,
  // 937: advice with a medical cross
  'advice': `<path fill="${BAR_BLUE}" fill-rule="evenodd" d="M3 3.5h18V16h-9l-5 4.5V16H3zM10.75 5.5h2.5v3h3V11h-3v3h-2.5v-3h-3V8.5h3z"/>`,
};

// the public transport category wears the metro train
PICTURES['transport'] = PICTURES['metro'];
