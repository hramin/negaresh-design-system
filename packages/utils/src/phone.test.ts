import { describe, expect, it } from 'vitest';
import { formatPhoneInput, isValidPhone, maskPhone, normalizePhone } from './phone.ts';

describe('phone', () => {
  it.each([
    '09121234567',
    '9121234567',
    '+989121234567',
    '00989121234567',
    '989121234567',
    '0912 123 4567',
    '0912-123-4567',
    '۰۹۱۲۱۲۳۴۵۶۷',
    '٠٩١٢١٢٣٤٥٦٧',
    '+98 (912) 123-4567',
    '+98 0912 123 4567',
  ])('normalises %s', (input) => {
    expect(normalizePhone(input)).toBe('+989121234567');
  });

  it.each(['', '0212345678', '091212345', '091212345678', '+1 912 123 4567', '09a21234567', '+'])(
    'rejects %s',
    (input) => {
      expect(normalizePhone(input)).toBeNull();
      expect(isValidPhone(input)).toBe(false);
    },
  );

  it('formats for LTR inputs', () => {
    expect(formatPhoneInput('+989121234567')).toBe('0912 123 4567');
    expect(formatPhoneInput('۰۹۱۲')).toBe('0912');
  });

  it('masks for display', () => {
    expect(maskPhone('09121234567')).toBe('۰۹۱۲ ••• ۴۵۶۷');
    expect(maskPhone('123')).toBeNull();
  });
});
