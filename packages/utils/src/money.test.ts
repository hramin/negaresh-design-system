import { describe, expect, it } from 'vitest';
import { FREE, formatPrice, formatToman, formatTomanCompact, TOMAN } from './money.ts';

describe('money', () => {
  it('formats Toman with Persian digits and «٬»', () => {
    expect(formatToman(120000)).toBe('۱۲۰٬۰۰۰ تومان');
    expect(formatToman(0)).toBe('۰ تومان');
    expect(formatToman(999.6)).toBe('۱٬۰۰۰ تومان');
    expect(formatToman(-5000)).toBe('‎−۵٬۰۰۰ تومان');
    expect(() => formatToman(Number.NaN)).toThrow(RangeError);
    expect(TOMAN).toBe('تومان');
  });
  it('shows «رایگان» for free', () => {
    expect(formatPrice(0)).toBe(FREE);
    expect(formatPrice(45000)).toBe('۴۵٬۰۰۰ تومان');
  });
  it('compacts large amounts for cards', () => {
    expect(formatTomanCompact(1_200_000)).toBe('۱٫۲ میلیون تومان');
    expect(formatTomanCompact(2_000_000_000)).toBe('۲ میلیارد تومان');
    expect(formatTomanCompact(350_000)).toBe('۳۵۰ هزار تومان');
    expect(formatTomanCompact(800)).toBe('۸۰۰ تومان');
    expect(() => formatTomanCompact(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
