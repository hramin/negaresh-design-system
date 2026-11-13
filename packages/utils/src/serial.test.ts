import { describe, expect, it } from 'vitest';
import {
  formatSerial,
  isValidSerial,
  normalizeSerial,
  SERIAL_GROUPS,
  serialPattern,
} from './serial.ts';

describe('serial', () => {
  it('normalises', () => {
    expect(normalizeSerial(' ab cd-e1 2_345 ')).toBe('ABCDE12345');
    expect(normalizeSerial('abcde-۱۲۳۴۵')).toBe('ABCDE12345');
  });
  it('never corrects look-alikes', () => {
    expect(normalizeSerial('O0Il1')).toBe('O0IL1');
  });
  it('validates shape', () => {
    expect(isValidSerial('ABCDE-12345')).toBe(true);
    expect(isValidSerial('abcde12345')).toBe(true);
    expect(isValidSerial('ABCDE-1234')).toBe(false);
    expect(isValidSerial('ABCDE-1234ب')).toBe(false);
    expect(isValidSerial('ABCD-1234', [4, 4])).toBe(true);
  });
  it('formats for display', () => {
    expect(formatSerial('abcde12345')).toBe('ABCDE-12345');
    expect(formatSerial('abc')).toBe('ABC');
    expect(formatSerial('')).toBe('');
    expect(formatSerial('abcde123456')).toBe('ABCDE-123456');
    expect(formatSerial('AAAABBBBCCCC', [4, 4, 4])).toBe('AAAA-BBBB-CCCC');
  });
  it('describes the pattern', () => {
    expect(SERIAL_GROUPS).toEqual([5, 5]);
    expect(serialPattern()).toBe('XXXXX-XXXXX');
  });
});
