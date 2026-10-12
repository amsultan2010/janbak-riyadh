import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHours, openState, isAlwaysOpen, encodeWeek, decodeWeek, riyadhNow, formatTime, groupWeek } from '../src/lib/hours.js';

test('24/7 is always open', () => {
  const week = parseHours('24/7');
  assert.ok(isAlwaysOpen(week));
  assert.deepEqual(openState(week, { day: 5, min: 200 }), { open: true, always: true });
});

test('unknown or malformed hours give null', () => {
  assert.equal(parseHours(null), null);
  assert.equal(parseHours('sunrise-sunset'), null);
  assert.equal(parseHours('Mo-Xx 08:00-10:00'), null);
});

test('later rules override, off closes the day, PH is ignored', () => {
  const week = parseHours('Su-Th 08:00-16:00; Fr,Sa off; PH off');
  assert.deepEqual(week[0], [[480, 960]]);
  assert.deepEqual(week[5], []);
  assert.deepEqual(week[6], []);
});

test('day range that wraps the week', () => {
  const week = parseHours('Sa-Th 07:00-03:00; Fr 13:00-01:00');
  assert.deepEqual(week[6], [[420, 1620]]);
  assert.deepEqual(week[4], [[420, 1620]]);
  assert.deepEqual(week[5], [[780, 1500]]);
});

test('open after midnight counts against the day before', () => {
  const week = parseHours('Sa-Th 07:00-03:00; Fr 13:00-01:00');
  // Friday 02:00 is still Thursday's shift
  assert.deepEqual(openState(week, { day: 5, min: 120 }), { open: true, until: 180 });
  // Friday 04:00: closed, opens Friday 13:00
  assert.deepEqual(openState(week, { day: 5, min: 240 }), { open: false, day: 5, at: 780, today: true });
  // Saturday 00:30 is still Friday's shift, which ends 01:00
  assert.deepEqual(openState(week, { day: 6, min: 30 }), { open: true, until: 60 });
});

test('split hours and next opening on another day', () => {
  const week = parseHours('Su-Th 09:00-12:00,13:00-15:00; Fr,Sa off');
  assert.deepEqual(openState(week, { day: 1, min: 750 }), { open: false, day: 1, at: 780, today: true });
  assert.deepEqual(openState(week, { day: 4, min: 1000 }), { open: false, day: 0, at: 540, today: false });
});

test('closing at 24:00 reads as midnight', () => {
  const week = parseHours('Mo-Su 06:00-24:00');
  assert.deepEqual(openState(week, { day: 2, min: 1000 }), { open: true, until: 0 });
});

test('encode and decode round trip', () => {
  for (const s of ['24/7', 'Sa-Th 07:00-03:00; Fr 13:00-01:00', 'Tu,Th 10:00-14:00']) {
    const week = parseHours(s);
    assert.deepEqual(decodeWeek(encodeWeek(week)), week);
  }
});

test('riyadh clock is UTC+3 whatever the device zone', () => {
  assert.deepEqual(riyadhNow(new Date('2026-10-12T22:30:00Z')), { day: 2, min: 90 });
});

test('time format in both languages', () => {
  assert.equal(formatTime(0, 'en'), '12:00 am');
  assert.equal(formatTime(780, 'en'), '1:00 pm');
  assert.equal(formatTime(450, 'ar'), '7:30 ص');
  assert.equal(formatTime(1380, 'ar'), '11:00 م');
});

test('groups neighbouring days', () => {
  const groups = groupWeek(parseHours('Su-Th 08:00-16:00; Fr,Sa off'));
  assert.deepEqual(groups.map((g) => [g.from, g.to]), [[0, 4], [5, 6]]);
});
