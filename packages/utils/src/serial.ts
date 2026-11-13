/**
 * Serials and codes (D-86): Latin, LTR, uppercase. Dashes and spaces are ignored when
 * validating; look-alike characters are never corrected silently.
 */
import { toLatinDigits } from './digits.ts';

/** Group sizes of the serial pattern (5-5), used as a hint and for display. */
export const SERIAL_GROUPS: readonly number[] = [5, 5];

/** Uppercase, Latin digits, no spaces or dashes. This is the value to store and copy. */
export function normalizeSerial(input: string): string {
  return toLatinDigits(input)
    .replace(/[\s\-_‌‎‏]/g, '')
    .toUpperCase();
}

/** Whether the normalised serial has the expected length and only A–Z / 0–9. */
export function isValidSerial(input: string, groups: readonly number[] = SERIAL_GROUPS): boolean {
  const n = normalizeSerial(input);
  const length = groups.reduce((a, b) => a + b, 0);
  return n.length === length && /^[A-Z0-9]+$/.test(n);
}

/** Display form with dashes between groups: `abcde12345` → `ABCDE-12345`. Extra characters stay in the last group. */
export function formatSerial(input: string, groups: readonly number[] = SERIAL_GROUPS): string {
  const n = normalizeSerial(input);
  const parts: string[] = [];
  let i = 0;
  for (const [index, size] of groups.entries()) {
    if (i >= n.length) break;
    const isLast = index === groups.length - 1;
    parts.push(isLast ? n.slice(i) : n.slice(i, i + size));
    i += size;
  }
  return parts.join('-');
}

/** Pattern hint for a field, e.g. `XXXXX-XXXXX`. */
export function serialPattern(groups: readonly number[] = SERIAL_GROUPS): string {
  return groups.map((g) => 'X'.repeat(g)).join('-');
}
