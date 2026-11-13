/**
 * Iranian mobile numbers. Input accepts `09…`, `9…`, `+98…`, `0098…`, `98…`, spaces,
 * dashes, Persian/Arabic digits; the canonical value is `+989xxxxxxxxx`.
 */
import { toLatinDigits, toPersianDigits } from './digits.ts';

/** Returns `+989xxxxxxxxx`, or `null` when the input is not an Iranian mobile number. */
export function normalizePhone(input: string): string | null {
  let digits = toLatinDigits(input).replace(/[\s\-().‌‎‏]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith('98')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return /^9\d{9}$/.test(digits) ? `+98${digits}` : null;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

/** National form for LTR inputs: `+989121234567` → `0912 123 4567` (Latin digits). */
export function formatPhoneInput(input: string): string {
  const n = normalizePhone(input);
  if (!n) return toLatinDigits(input);
  const local = `0${n.slice(3)}`;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}

/** Masked display where the full number is not needed: «۰۹۱۲ ••• ۴۵۶۷». */
export function maskPhone(input: string): string | null {
  const n = normalizePhone(input);
  if (!n) return null;
  const local = `0${n.slice(3)}`;
  return `${toPersianDigits(local.slice(0, 4))} ••• ${toPersianDigits(local.slice(7))}`;
}
