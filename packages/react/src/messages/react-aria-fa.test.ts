import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import {
  faReactAriaStrings,
  getReactAriaLocalizationScript,
  installReactAriaPersianStrings,
  isPersianLocale,
  type ReactAriaFormatter,
  type ReactAriaStringDictionary,
} from './react-aria-fa.ts';

const require = createRequire(import.meta.url);
const enUsStrings = require('react-aria-components/i18n/en-US') as ReactAriaStringDictionary;

const LOCALE_SYMBOL = Symbol.for('react-aria.i18n.locale');
const STRINGS_SYMBOL = Symbol.for('react-aria.i18n.strings');

const testFormatter: ReactAriaFormatter = {
  number: (value) => new Intl.NumberFormat('fa-IR').format(value),
  plural: (count, options) => {
    const exact = options[`=${count}`];
    if (exact) return typeof exact === 'function' ? exact() : exact;
    const opt = options.other ?? '';
    return typeof opt === 'function' ? opt() : opt;
  },
  select: (options, value) => {
    const opt = options[String(value)] ?? options.other ?? '';
    return typeof opt === 'function' ? opt() : opt;
  },
};

const sampleArgs: Record<string, string | number | boolean> = {
  afterItemText: 'مورد دوم',
  beforeItemText: 'مورد اول',
  channelLabel: 'روشنایی',
  chroma: 'پرجان',
  columnName: 'تاریخ',
  count: 3,
  date: '۱۴۰۵/۰۸/۲۲',
  dateRange: '۱۴۰۵/۰۸/۰۱ تا ۱۴۰۵/۰۸/۲۲',
  endDate: '۱۴۰۵/۰۸/۲۲',
  fieldLabel: 'تعداد',
  groupCount: 2,
  groupTitle: 'گروه',
  hue: 'آبی',
  isGroupChange: true,
  isSelected: true,
  item: 'آیتم',
  itemText: 'آیتم',
  label: 'رنگ',
  lightness: 'روشن',
  link: 'https://negaresh.ir',
  maxValue: '۱۴۰۵/۱۲/۲۹',
  minValue: '۱۴۰۵/۰۱/۰۱',
  name: 'آبی',
  optionCount: 4,
  optionText: 'گزینه اول',
  percentTransparent: '۵۰٪',
  startDate: '۱۴۰۵/۰۸/۰۱',
  time: '۱۷:۰۴',
  value: '۱۲۰',
};

describe('Persian React Aria string dictionary', () => {
  it('covers every package and key present in react-aria-components en-US', () => {
    const enPackages = Object.keys(enUsStrings).sort();
    const faPackages = Object.keys(faReactAriaStrings).sort();
    expect(faPackages).toEqual(enPackages);

    for (const [pkg, enMessages] of Object.entries(enUsStrings)) {
      const faMessages = faReactAriaStrings[pkg];
      expect(faMessages, pkg).toBeDefined();
      expect(Object.keys(faMessages ?? {}).sort(), pkg).toEqual(Object.keys(enMessages).sort());

      for (const [key, enValue] of Object.entries(enMessages)) {
        const faValue = faMessages?.[key];
        expect(typeof faValue, `${pkg}.${key}`).toBe(typeof enValue);
        if (typeof faValue === 'string') {
          expect(faValue.trim().length, `${pkg}.${key}`).toBeGreaterThan(0);
          expect(faValue, `${pkg}.${key}`).toMatch(/[\u0600-\u06FF]/);
        } else if (typeof faValue === 'function') {
          const rendered = faValue(sampleArgs, testFormatter);
          expect(rendered.trim().length, `${pkg}.${key}`).toBeGreaterThan(0);
          expect(rendered, `${pkg}.${key}`).toMatch(/[\u0600-\u06FF]/);
        }
      }
    }
  });

  it('serializes a valid, self-contained bootstrap script with escaped tags', () => {
    const script = getReactAriaLocalizationScript('fa-IR-u-ca-persian');
    expect(script).not.toContain('</script');

    const fakeWindow: Record<symbol, unknown> = {};
    // Execute the generated script in isolation (verifies no outer closures are referenced).
    const run = new Function('window', script);
    run(fakeWindow);

    expect(fakeWindow[LOCALE_SYMBOL]).toBe('fa-IR-u-ca-persian');
    const strings = fakeWindow[STRINGS_SYMBOL] as typeof faReactAriaStrings;
    expect(strings['@react-aria/overlays']?.dismiss).toBe('بستن');
    expect(strings['@react-aria/menu']?.longPressMessage).toContain('منو');

    const toastFn = strings['@react-aria/toast']?.notifications;
    expect(typeof toastFn).toBe('function');
    if (typeof toastFn === 'function') {
      expect(toastFn({ count: 3 }, testFormatter)).toBe('۳ اعلان.');
    }

    const zeroGridFn = strings['@react-aria/grid']?.selectedCount;
    if (typeof zeroGridFn === 'function') {
      expect(zeroGridFn({ count: 0 }, testFormatter)).toBe('هیچ موردی انتخاب نشده است.');
    }

    const escaped = getReactAriaLocalizationScript('fa-IR</script>');
    expect(escaped).not.toContain('</script>');
    expect(escaped).toContain('\\u003c/script>');
  });

  it('detects Persian locales and ignores non-Persian locales when installing', () => {
    expect(isPersianLocale('fa')).toBe(true);
    expect(isPersianLocale('fa-IR')).toBe(true);
    expect(isPersianLocale('fa-IR-u-ca-persian')).toBe(true);
    expect(isPersianLocale('en-US')).toBe(false);
    expect(isPersianLocale('ar-AE')).toBe(false);
    expect(installReactAriaPersianStrings('en-US')).toBe(false);
  });
});
