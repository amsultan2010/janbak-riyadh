// Opening hours: parse the OpenStreetMap opening_hours subset used in research/,
// and answer "open now" in Riyadh time (UTC+3, no daylight saving).

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAY_MIN = 1440;

function parseDays(part) {
  if (!part) return [0, 1, 2, 3, 4, 5, 6];
  const days = new Set();
  for (const token of part.split(',').map((t) => t.trim()).filter(Boolean)) {
    if (token === 'PH') continue;
    const [a, b] = token.split('-').map((t) => DAYS.indexOf(t.trim()));
    if (a < 0 || b === -1) return null;
    if (b === undefined) days.add(a);
    else for (let d = a; ; d = (d + 1) % 7) { days.add(d); if (d === b) break; }
  }
  return [...days];
}

function parseTimes(part) {
  if (/^(off|closed)$/i.test(part)) return [];
  const out = [];
  for (const range of part.split(',').map((t) => t.trim())) {
    const m = range.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const start = +m[1] * 60 + +m[2];
    let end = +m[3] * 60 + +m[4];
    if (end <= start) end += DAY_MIN;
    out.push([start, end]);
  }
  return out;
}

// Returns 7 arrays (Sunday first) of [start, end] minutes; end > 1440 runs past midnight.
// Returns null when the string is missing or not understood.
export function parseHours(str) {
  if (!str) return null;
  const week = Array.from({ length: 7 }, () => []);
  // some mappers separate rules with a comma: "Sa-Th 08:00-20:00, Fr 13:00-20:00"
  const rules = str.replace(/(\d),\s*(?=(?:Su|Mo|Tu|We|Th|Fr|Sa)\b)/g, '$1;');
  for (const rule of rules.split(';').map((r) => r.trim()).filter(Boolean)) {
    if (rule === '24/7') { for (let d = 0; d < 7; d++) week[d] = [[0, DAY_MIN]]; continue; }
    const at = rule.search(/\d|off|closed/i);
    if (at < 0) return null;
    const days = parseDays(rule.slice(0, at).trim());
    const times = parseTimes(rule.slice(at).trim());
    if (!days || !times) return null;
    for (const d of days) week[d] = times;
  }
  return week;
}

export function isAlwaysOpen(week) {
  return week.every((d) => d.length === 1 && d[0][0] === 0 && d[0][1] === DAY_MIN);
}

// "480-1380|...|" with seven day segments, "*" for always open.
export function encodeWeek(week) {
  if (isAlwaysOpen(week)) return '*';
  return week.map((d) => d.map((r) => r.join('-')).join(',')).join('|');
}

export function decodeWeek(text) {
  if (text === '*') return Array.from({ length: 7 }, () => [[0, DAY_MIN]]);
  return text.split('|').map((d) => (d ? d.split(',').map((r) => r.split('-').map(Number)) : []));
}

export function riyadhNow(date = new Date()) {
  const t = new Date(date.getTime() + 3 * 3600e3);
  return { day: t.getUTCDay(), min: t.getUTCHours() * 60 + t.getUTCMinutes() };
}

// { open: true, always } | { open: true, until } | { open: false, day, at } | { open: false }
export function openState(week, now = riyadhNow()) {
  if (isAlwaysOpen(week)) return { open: true, always: true };
  const { day, min } = now;
  for (const [, end] of week[(day + 6) % 7]) {
    if (end > DAY_MIN && min < end - DAY_MIN) return { open: true, until: end - DAY_MIN };
  }
  for (const [start, end] of week[day]) {
    if (min >= start && min < end) return { open: true, until: end % DAY_MIN };
  }
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const next = week[d].map((r) => r[0]).filter((s) => i > 0 || s > min).sort((a, b) => a - b)[0];
    if (next !== undefined) return { open: false, day: d, at: next, today: i === 0 };
  }
  return { open: false };
}

export function formatTime(min, lang) {
  const h24 = Math.floor(min / 60) % 24;
  const m = String(min % 60).padStart(2, '0');
  const h = h24 % 12 || 12;
  const suffix = lang === 'ar' ? (h24 < 12 ? 'ص' : 'م') : h24 < 12 ? 'am' : 'pm';
  return `${h}:${m} ${suffix}`;
}

// Groups neighbouring days with the same hours: [{ from, to, ranges }]
export function groupWeek(week) {
  const groups = [];
  week.forEach((ranges, day) => {
    const key = JSON.stringify(ranges);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.to = day;
    else groups.push({ from: day, to: day, ranges, key });
  });
  return groups;
}
