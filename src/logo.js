// The logo, as SVG markup shared by the header and by scripts/make-images.mjs.
// The mark is a j whose dot is a diamond, the way a reed pen dots an Arabic letter.
// The wordmark is Latin drawn the way Arabic is written: one pen weight, the letters joined
// along the baseline, a head stroke on the tall stems and a closing flick. The j stands
// apart, like the Arabic letters that never join the one after them.
const INK = '#0f2540';
const ICE = '#e9eef4';
const ORANGE = '#ff8a3d';

// on a 64 unit square
export const MARK = `<rect width="64" height="64" rx="14" fill="${INK}"/><path d="M38 28V41Q38 52 27 52H21" fill="none" stroke="${ICE}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path fill="${ORANGE}" d="M38 8l6.5 6.5-6.5 6.5-6.5-6.5z"/>`;

export const WORD_BOX = '-20 -2 304 106';
const LETTERS = [
  'M10 34V80Q10 98 -8 98H-14',
  'M62 34V70M62 48A14 14 0 0 0 48 34H44A14 14 0 0 0 30 48V56A14 14 0 0 0 44 70H80',
  'M80 34V70M80 50A16 16 0 0 1 112 50V70H130',
  'M120 12L130 4V70M130 48A14 14 0 0 1 144 34H148A14 14 0 0 1 162 48V56A14 14 0 0 1 148 70H130M148 70H194',
  'M212 34V70M212 48A14 14 0 0 0 198 34H194A14 14 0 0 0 180 48V56A14 14 0 0 0 194 70H230',
  'M220 12L230 4V70M256 34L232 55M241 48L256 68Q260 72 268 70Q278 68 278 58',
].join('');
export const word = (ink = INK) =>
  `<path d="${LETTERS}" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path fill="${ORANGE}" d="M10 0l10 10-10 10L0 10z"/>`;
