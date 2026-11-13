/**
 * Jalali dates in Tehran time. Store and transmit ISO-8601 UTC; convert only at the edge.
 * Iran has had no daylight saving since 2022 — always format with `Asia/Tehran`, never
 * the browser zone (docs/04-stack.md).
 */
import { CalendarDateTime, PersianCalendar, toZoned } from '@internationalized/date';
import { toLatinDigits, toPersianDigits } from './digits.ts';

export const TEHRAN = 'Asia/Tehran';

export type DateInput = Date | string | number;

const persian = new PersianCalendar();

function toDate(input: DateInput): Date {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new RangeError(`Invalid date: ${String(input)}`);
  return d;
}

const formatters = new Map<string, Intl.DateTimeFormat>();
function fmt(
  options: Intl.DateTimeFormatOptions,
  locale = 'fa-IR-u-ca-persian',
): Intl.DateTimeFormat {
  const key = locale + JSON.stringify(options);
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, { timeZone: TEHRAN, ...options });
    formatters.set(key, f);
  }
  return f;
}

/** «۲۲ آبان ۱۴۰۵» */
export function formatDate(input: DateInput): string {
  return fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(toDate(input));
}

/** «۱۷:۰۴» (24-hour, Tehran) */
export function formatTime(input: DateInput): string {
  return fmt({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(toDate(input));
}

/** «۲۲ آبان ۱۴۰۵، ساعت ۱۷:۰۴» */
export function formatDateTime(input: DateInput): string {
  return `${formatDate(input)}، ساعت ${formatTime(input)}`;
}

export interface JalaliDate {
  year: number;
  /** 1–12 (Farvardin = 1) */
  month: number;
  day: number;
}

/** The Jalali calendar date of an instant, in Tehran. */
export function toJalali(input: DateInput): JalaliDate {
  const parts = fmt(
    { year: 'numeric', month: 'numeric', day: 'numeric' },
    'fa-IR-u-ca-persian-nu-latn',
  ).formatToParts(toDate(input));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/** «۱۴۰۵/۰۸/۲۲» — numeric form for tables and inputs. */
export function formatDateNumeric(input: DateInput): string {
  const { year, month, day } = toJalali(input);
  const pad = (n: number) => String(n).padStart(2, '0');
  return toPersianDigits(`${year}/${pad(month)}/${pad(day)}`);
}

/**
 * The instant of a Jalali wall-clock time in Tehran, or `null` if the date does not exist
 * (e.g. 30 Esfand in a common year).
 */
export function fromJalali(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): Date | null {
  if (![year, month, day, hour, minute].every(Number.isInteger)) return null;
  if (year < 1 || year > 9999 || hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  const dt = new CalendarDateTime(persian, year, month, day, hour, minute);
  // CalendarDateTime constrains out-of-range fields; reject instead of silently moving the date.
  if (dt.year !== year || dt.month !== month || dt.day !== day) return null;
  return toZoned(dt, TEHRAN).toDate();
}

/**
 * Parses a Jalali date typed by a person: `1405/8/22`, `۱۴۰۵-۰۸-۲۲`, optionally followed
 * by `HH:mm`. Returns the instant in Tehran, or `null`.
 */
export function parseJalali(input: string): Date | null {
  const m = /^\s*(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})(?:[\sT،,]+(\d{1,2}):(\d{2}))?\s*$/.exec(
    toLatinDigits(input),
  );
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  return fromJalali(Number(y), Number(mo), Number(d), h ? Number(h) : 0, mi ? Number(mi) : 0);
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Relative time for recent events («۵ دقیقه پیش») up to 24 hours, then the full date
 * and time. `now` is injectable for SSR and tests.
 */
export function formatRelative(input: DateInput, now: DateInput = Date.now()): string {
  const diff = toDate(input).getTime() - toDate(now).getTime();
  const abs = Math.abs(diff);
  if (abs >= DAY) return formatDateTime(input);
  const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' });
  if (abs < MINUTE) return rtf.format(0, 'second');
  if (abs < HOUR) return rtf.format(Math.trunc(diff / MINUTE), 'minute');
  return rtf.format(Math.trunc(diff / HOUR), 'hour');
}
