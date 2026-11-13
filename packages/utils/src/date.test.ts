import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatDateNumeric,
  formatDateTime,
  formatRelative,
  formatTime,
  fromJalali,
  parseJalali,
  TEHRAN,
  toJalali,
} from './date.ts';

// 13 Nov 2026 13:34 UTC = 22 Aban 1405, 17:04 in Tehran (UTC+03:30, no DST)
const instant = '2026-11-13T13:34:00Z';

describe('date', () => {
  it('formats in Jalali, Tehran time, Persian digits', () => {
    expect(TEHRAN).toBe('Asia/Tehran');
    expect(formatDate(instant)).toBe('۲۲ آبان ۱۴۰۵');
    expect(formatTime(instant)).toBe('۱۷:۰۴');
    expect(formatDateTime(instant)).toBe('۲۲ آبان ۱۴۰۵، ساعت ۱۷:۰۴');
    expect(formatDateNumeric(new Date(instant))).toBe('۱۴۰۵/۰۸/۲۲');
    expect(formatDate(Date.parse(instant))).toBe('۲۲ آبان ۱۴۰۵');
  });

  it('uses Tehran, not the host zone, around midnight', () => {
    // 20:45 UTC is 00:15 the next day in Tehran
    expect(toJalali('2026-11-13T20:45:00Z')).toEqual({ year: 1405, month: 8, day: 23 });
    expect(formatTime('2026-11-13T20:45:00Z')).toBe('۰۰:۱۵');
  });

  it('applies no daylight saving in summer', () => {
    // 1 Tir 1405 = 22 June 2026; noon in Tehran is 08:30 UTC
    expect(fromJalali(1405, 4, 1, 12, 0)?.toISOString()).toBe('2026-06-22T08:30:00.000Z');
  });

  it('rejects invalid input', () => {
    expect(() => formatDate('not a date')).toThrow(RangeError);
    expect(fromJalali(1404, 12, 30)).toBeNull(); // 1404 is a common year
    expect(fromJalali(1403, 12, 30)?.toISOString()).toBe('2025-03-19T20:30:00.000Z');
    expect(fromJalali(1405, 13, 1)).toBeNull();
    expect(fromJalali(1405, 7, 31)).toBeNull();
    expect(fromJalali(1405, 1, 1, 24)).toBeNull();
    expect(fromJalali(1405, 1, 1, 0, 60)).toBeNull();
    expect(fromJalali(1405.5, 1, 1)).toBeNull();
    expect(fromJalali(0, 1, 1)).toBeNull();
  });

  it('parses typed Jalali dates', () => {
    expect(parseJalali('1405/8/22')?.toISOString()).toBe('2026-11-12T20:30:00.000Z');
    expect(parseJalali('۱۴۰۵-۰۸-۲۲ ۱۷:۰۴')?.toISOString()).toBe('2026-11-13T13:34:00.000Z');
    expect(parseJalali('1405.08.22T09:05')?.toISOString()).toBe('2026-11-13T05:35:00.000Z');
    expect(parseJalali('22/8/1405')).toBeNull();
    expect(parseJalali('1405/02/32')).toBeNull();
    expect(parseJalali('')).toBeNull();
  });

  it('formats relative time up to 24 hours', () => {
    expect(formatRelative(instant, '2026-11-13T13:34:20Z')).toBe('اکنون');
    expect(formatRelative(instant, '2026-11-13T13:39:30Z')).toBe('۵ دقیقه پیش');
    expect(formatRelative(instant, '2026-11-13T16:00:00Z')).toBe('۲ ساعت پیش');
    expect(formatRelative('2026-11-13T14:00:00Z', instant)).toBe('۲۶ دقیقه بعد');
    expect(formatRelative(instant, '2026-11-15T00:00:00Z')).toBe('۲۲ آبان ۱۴۰۵، ساعت ۱۷:۰۴');
    expect(typeof formatRelative(new Date())).toBe('string');
  });
});
