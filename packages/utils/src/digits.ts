/**
 * Digit conversion (D-86). Display digits are Persian; codes and phone inputs are Latin.
 */

const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';

/** Replaces Latin (and Arabic-Indic) digits with Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9٠-٩]/g, (d) => {
    const latin = d >= '0' && d <= '9' ? d.charCodeAt(0) - 48 : ARABIC_INDIC.indexOf(d);
    return PERSIAN.charAt(latin);
  });
}

/** Replaces Persian and Arabic-Indic digits with Latin digits (input normalisation). */
export function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (d) => {
    const p = PERSIAN.indexOf(d);
    return String(p >= 0 ? p : ARABIC_INDIC.indexOf(d));
  });
}

export interface FormatNumberOptions {
  /** Maximum fraction digits (default 0 for integers, up to 2 otherwise). */
  maximumFractionDigits?: number;
  /** Group thousands with «٬» (default true). */
  useGrouping?: boolean;
}

/** Formats a number with Persian digits, «٬» thousands and «٫» decimal separators. */
export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
  return new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    useGrouping: options.useGrouping ?? true,
  }).format(value);
}

/** Formats a percentage (0–100 scale) with Persian digits, e.g. «۴۵٪». */
export function formatPercent(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('fa-IR', { style: 'percent', maximumFractionDigits }).format(
    value / 100,
  );
}
