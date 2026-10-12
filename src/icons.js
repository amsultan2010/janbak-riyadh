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
};

// PICTURES: full-colour pictograms for the place categories and the emergency
// numbers. They sit on a light tile in lists and on a light disc on the map.
const RED = '#e03131';
const BLUE = '#1c7ed6';
const YELLOW = '#fcc419';
const ORANGE = '#f76707';
const GREEN = '#37b24d';
const DARK = '#2b3a33';
const LIGHT = '#f5f2e7';

export const PICTURES = {
  // a red cross
  'hospitals': `<path fill="${RED}" d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>`,
  // a clock with a small red cross: care that cannot wait
  'urgent-care': `<circle cx="11" cy="11" r="8.5" fill="${ORANGE}"/><circle cx="11" cy="11" r="6" fill="${LIGHT}"/><path d="M11 7.2V11l2.6 1.8" fill="none" stroke="${DARK}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path fill="${RED}" stroke="${LIGHT}" stroke-width="1" d="M16.3 13.5h3v2.3h2.3v3h-2.3v2.3h-3v-2.3H14v-3h2.3z"/>`,
  // a capsule, half blue and half yellow
  'pharmacies': `<g transform="rotate(-45 12 12)"><path fill="${BLUE}" d="M12 7.5H7.5a4.5 4.5 0 0 0 0 9H12z"/><path fill="${YELLOW}" d="M12 7.5h4.5a4.5 4.5 0 0 1 0 9H12z"/></g>`,
  // a drop of blood carrying a cross
  'blood-donation': `<path fill="${RED}" d="M12 2.5c4.4 5.4 7 9.2 7 12.4a7 7 0 0 1-14 0c0-3.2 2.6-7 7-12.4z"/><path fill="${LIGHT}" d="M11 12h2v2h2v2h-2v2h-2v-2H9v-2h2z"/>`,
  // a kidney and a drop
  'dialysis': `<path fill="#c2255c" d="M10 3.5c4.2 0 7.5 3.4 7.5 8.5s-3.3 8.5-7.5 8.5c-2.3 0-3.8-1.4-3.8-3.3 0-2 1.8-2.6 1.8-5.2S6.2 8.8 6.2 6.8c0-1.9 1.5-3.3 3.8-3.3z"/><path fill="${BLUE}" stroke="${LIGHT}" stroke-width="1" d="M19.2 12.8c1.4 1.9 2.3 3.2 2.3 4.4a2.3 2.3 0 0 1-4.6 0c0-1.2.9-2.5 2.3-4.4z"/>`,
  // a brain in two halves
  'mental-health': `<path fill="#f783ac" d="M11.5 4.2a3.9 3.9 0 0 0-6.9 2A3.9 3.9 0 0 0 3 12a3.9 3.9 0 0 0 1.9 5.5 3.9 3.9 0 0 0 6.6 2.3z"/><path fill="#d6336c" d="M12.5 4.2a3.9 3.9 0 0 1 6.9 2A3.9 3.9 0 0 1 21 12a3.9 3.9 0 0 1-1.9 5.5 3.9 3.9 0 0 1-6.6 2.3z"/>`,
  // a basket of groceries
  'supermarkets': `<circle cx="8.8" cy="8" r="3" fill="${ORANGE}"/><circle cx="14.6" cy="7.4" r="3.4" fill="${RED}"/><path fill="${GREEN}" d="M2.5 10h19l-2.2 10.5H4.7z"/><path d="M8.5 13v4.5M12 13v4.5M15.5 13v4.5" fill="none" stroke="${LIGHT}" stroke-width="1.4" stroke-linecap="round"/>`,
  // a fuel pump
  'fuel': `<path fill="${RED}" d="M5 3.5h9v17H5z"/><path fill="${LIGHT}" d="M7 6h5v4H7z"/><path fill="${DARK}" d="M3.5 20.5h12V22h-12z"/><path d="M14 11.5h2.3v5.8a1.7 1.7 0 0 0 3.4 0V8.6L17.6 6.5" fill="none" stroke="${DARK}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`,
  // a flag on a pole
  'embassies': `<path fill="${DARK}" d="M4.5 2.5h2v19h-2z"/><path fill="${BLUE}" d="M6.5 4h13l-3 4.5 3 4.5h-13z"/><circle cx="11.5" cy="8.5" r="2" fill="${LIGHT}"/>`,
  // 911: a red beacon
  'siren': `<path d="M12 2v2.4M4.9 4.9l1.7 1.7M19.1 4.9l-1.7 1.7" fill="none" stroke="#f59f00" stroke-width="1.9" stroke-linecap="round"/><path fill="${RED}" d="M7 17v-4a5 5 0 0 1 10 0v4z"/><path fill="${DARK}" d="M4.5 17h15v4h-15z"/><path d="M9.6 13a2.4 2.4 0 0 1 2.4-2.4" fill="none" stroke="${LIGHT}" stroke-width="1.3" stroke-linecap="round"/>`,
  // 997: an ambulance
  'ambulance': `<path fill="${RED}" d="M8.5 3.8h3v2.2h-3z"/><path fill="#fff" stroke="${DARK}" stroke-width="1.3" stroke-linejoin="round" d="M2 6h11.5v11H2zM13.5 9.5h4.2l4 4V17h-8.2z"/><path fill="#74c0fc" d="M15 10.9h2.1l2.2 2.3H15z"/><path fill="${RED}" d="M6.7 8.3h2.2v2h2v2.2h-2v2H6.7v-2h-2v-2.2h2z"/><circle cx="6.5" cy="17.6" r="2.2" fill="${DARK}"/><circle cx="17.5" cy="17.6" r="2.2" fill="${DARK}"/>`,
  // 937: advice with a medical cross
  'advice': `<path fill="${BLUE}" d="M3 4h18v12.5H11.5L6.5 21v-4.5H3z"/><path fill="${LIGHT}" d="M10.8 6.3h2.4v2.7h2.7v2.4h-2.7v2.7h-2.4v-2.7H8.1V9h2.7z"/>`,
};
