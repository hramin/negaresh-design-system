import { describe, expect, it } from 'vitest';
import { formatNumber, formatPercent, toLatinDigits, toPersianDigits } from './digits.ts';

describe('digits', () => {
  it('converts to Persian digits', () => {
    expect(toPersianDigits('0123456789')).toBe('۰۱۲۳۴۵۶۷۸۹');
    expect(toPersianDigits(2026)).toBe('۲۰۲۶');
    expect(toPersianDigits('٠١٩')).toBe('۰۱۹');
    expect(toPersianDigits('فعال‌سازی ۳')).toBe('فعال‌سازی ۳');
  });
  it('converts to Latin digits', () => {
    expect(toLatinDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789');
    expect(toLatinDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
    expect(toLatinDigits('AB-۱۲')).toBe('AB-12');
  });
  it('formats numbers and percentages', () => {
    expect(formatNumber(1234567)).toBe('۱٬۲۳۴٬۵۶۷');
    expect(formatNumber(1234.567)).toBe('۱٬۲۳۴٫۵۷');
    expect(formatNumber(1234, { useGrouping: false })).toBe('۱۲۳۴');
    expect(formatNumber(1.25, { maximumFractionDigits: 0 })).toBe('۱');
    expect(formatPercent(45)).toBe('۴۵٪');
    expect(formatPercent(12.5, 1)).toBe('۱۲٫۵٪');
  });
});
