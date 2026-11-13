/**
 * Toman formatting (D-26). Toman is not an ISO currency: format the number and append
 * «تومان»; never `style: 'currency'`, never «T» or «IRT». Components never convert units.
 */
import { formatNumber } from './digits.ts';

export const TOMAN = 'تومان';
export const FREE = 'رایگان';

/** `120000` → «۱۲۰٬۰۰۰ تومان». Amounts are rounded to whole Toman. */
export function formatToman(amount: number): string {
  if (!Number.isFinite(amount)) throw new RangeError(`Invalid amount: ${amount}`);
  return `${formatNumber(Math.round(amount), { maximumFractionDigits: 0 })} ${TOMAN}`;
}

/** Like formatToman, but a zero price reads «رایگان» (shown as a badge, not «۰ تومان»). */
export function formatPrice(amount: number): string {
  return amount === 0 ? FREE : formatToman(amount);
}

const COMPACT_UNITS: readonly [number, string][] = [
  [1e9, 'میلیارد'],
  [1e6, 'میلیون'],
  [1e3, 'هزار'],
];

/**
 * Compact price for tight spaces (cards only — never checkout or invoices):
 * `1_200_000` → «۱٫۲ میلیون تومان».
 */
export function formatTomanCompact(amount: number): string {
  if (!Number.isFinite(amount)) throw new RangeError(`Invalid amount: ${amount}`);
  const abs = Math.abs(amount);
  for (const [size, word] of COMPACT_UNITS) {
    if (abs >= size) {
      return `${formatNumber(amount / size, { maximumFractionDigits: 1 })} ${word} ${TOMAN}`;
    }
  }
  return formatToman(amount);
}
