import { describe, expect, it } from 'vitest';
import {
  colorToCss,
  componentsToHex,
  cubicBezierToCss,
  dimensionToCss,
  durationToCss,
  fontFamilyToCss,
  hexToRgb,
  shadowToCss,
} from './values.ts';

describe('values', () => {
  it('converts colours', () => {
    expect(
      colorToCss({ colorSpace: 'srgb', components: [1, 0.9922, 0.9804], hex: '#fffdfa' }),
    ).toBe('#FFFDFA');
    expect(colorToCss({ colorSpace: 'srgb', components: [0, 0, 0] })).toBe('#000000');
    expect(
      colorToCss({ colorSpace: 'srgb', components: [0, 0, 0], hex: '#1A1410', alpha: 0.18 }),
    ).toBe('rgb(26 20 16 / 0.18)');
    expect(colorToCss('#123456')).toBe('#123456');
    expect(() => colorToCss({ colorSpace: 'oklch', components: [0.5, 0.1, 100] })).toThrow();
    expect(componentsToHex([1, 'none', 2])).toBe('#FF00FF');
    expect(() => hexToRgb('red')).toThrow();
  });
  it('converts dimensions, durations, easings and fonts', () => {
    expect(dimensionToCss({ value: 12, unit: 'px' }, { rem: true })).toBe('0.75rem');
    expect(dimensionToCss({ value: 0, unit: 'px' })).toBe('0');
    expect(dimensionToCss({ value: 1.5, unit: 'rem' })).toBe('1.5rem');
    expect(dimensionToCss('var(--x)')).toBe('var(--x)');
    expect(durationToCss({ value: 120, unit: 'ms' })).toBe('120ms');
    expect(durationToCss('1s')).toBe('1s');
    expect(cubicBezierToCss([0.2, 0.7, 0.2, 1])).toBe('cubic-bezier(0.2, 0.7, 0.2, 1)');
    expect(cubicBezierToCss('ease')).toBe('ease');
    expect(fontFamilyToCss(['Vazirmatn', 'SF Mono', 'system-ui'])).toBe(
      'Vazirmatn, "SF Mono", system-ui',
    );
    expect(fontFamilyToCss('Abar Pro')).toBe('"Abar Pro"');
  });
  it('converts shadows', () => {
    const s = {
      color: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.5 },
      offsetX: { value: 0, unit: 'px' as const },
      offsetY: { value: 4, unit: 'px' as const },
      blur: { value: 8, unit: 'px' as const },
      spread: { value: 0, unit: 'px' as const },
    };
    expect(shadowToCss(s)).toBe('0 4px 8px 0 rgb(0 0 0 / 0.5)');
    expect(shadowToCss([s, { ...s, inset: true }])).toBe(
      '0 4px 8px 0 rgb(0 0 0 / 0.5), inset 0 4px 8px 0 rgb(0 0 0 / 0.5)',
    );
    expect(shadowToCss('none')).toBe('none');
  });
});
