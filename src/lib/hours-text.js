import { decodeWeek, groupWeek, isAlwaysOpen, formatTime } from './hours.js';
import { DAYS } from '../i18n.js';

// The weekly table shown under a place, as [{ days, times }] in one language.
export function hoursLines(encoded, lang, t) {
  const week = decodeWeek(encoded);
  if (isAlwaysOpen(week)) return [{ days: t('place.everyDay'), times: t('place.always') }];
  const groups = groupWeek(week);
  const to = ` ${t('place.to')} `;
  return groups.map((g) => ({
    days: groups.length === 1 ? t('place.everyDay') : g.from === g.to ? DAYS[lang][g.from] : DAYS[lang][g.from] + to + DAYS[lang][g.to],
    times: g.ranges.length
      ? g.ranges.map(([a, b]) => formatTime(a, lang) + to + formatTime(b, lang)).join(lang === 'ar' ? '، ' : ', ')
      : t('place.closed'),
  }));
}
