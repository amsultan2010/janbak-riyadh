import { decodeWeek, groupWeek, isAlwaysOpen, formatTime } from './hours.js';

// The weekly table shown under a place, as [{ days, times }] in one language.
// `words` carries the few translated words so this file works in the build and the browser.
export function hoursLines(encoded, lang, words) {
  const week = decodeWeek(encoded);
  if (isAlwaysOpen(week)) return [{ days: words.everyDay, times: words.always }];
  const groups = groupWeek(week);
  const to = ` ${words.to} `;
  return groups.map((g) => ({
    days: groups.length === 1 ? words.everyDay : g.from === g.to ? words.days[g.from] : words.days[g.from] + to + words.days[g.to],
    times: g.ranges.length
      ? g.ranges.map(([a, b]) => formatTime(a, lang) + to + formatTime(b, lang)).join(lang === 'ar' ? '، ' : ', ')
      : words.closed,
  }));
}
