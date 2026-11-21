import { createElement, type ReactElement } from 'react';

export interface ReactAriaFormatter {
  plural(
    count: number,
    options: Record<string, string | (() => string)>,
    type?: 'cardinal' | 'ordinal',
  ): string;
  number(value: number): string;
  select(options: Record<string, string | (() => string)>, value: string | boolean): string;
}

export type ReactAriaVariables = Record<string, string | number | boolean>;

export type ReactAriaLocalizedMessage =
  | string
  | ((args: ReactAriaVariables, formatter: ReactAriaFormatter) => string);

export type ReactAriaStringDictionary = Record<string, Record<string, ReactAriaLocalizedMessage>>;

const LOCALE_SYMBOL = Symbol.for('react-aria.i18n.locale');
const STRINGS_SYMBOL = Symbol.for('react-aria.i18n.strings');
const DEFAULT_PERSIAN_LOCALE = 'fa-IR-u-ca-persian';

/**
 * Complete Persian (`fa-IR`) string dictionary for React Aria Components 1.22.1.
 *
 * React Aria's `LocalizedStringDictionary.getGlobalDictionaryForPackage` throws if any
 * active package key is omitted once global strings are registered, so every package key
 * present in `react-aria-components/i18n/en-US.mjs` is translated here.
 *
 * Formatter functions must remain self-contained (no outer closures) because
 * `getReactAriaLocalizationScript` serializes them with `Function.prototype.toString`.
 */
export const faReactAriaStrings: ReactAriaStringDictionary = {
  '@react-aria/tree': {
    expand: 'باز کردن',
    collapse: 'بستن',
  },
  '@react-aria/toast': {
    close: 'بستن',
    notifications: (e, t) =>
      `${t.plural(Number(e.count), {
        other: () => `${t.number(Number(e.count))} اعلان`,
      })}.`,
  },
  '@react-aria/tag': {
    removeDescription: 'برای حذف برچسب کلید Delete را بزنید.',
    removeButtonLabel: 'حذف',
  },
  '@react-aria/table': {
    select: 'انتخاب',
    selectAll: 'انتخاب همه',
    sortable: 'ستون قابل مرتب‌سازی',
    ascending: 'صعودی',
    descending: 'نزولی',
    ascendingSort: (e) => `مرتب‌شده بر اساس ستون ${e.columnName} به صورت صعودی`,
    descendingSort: (e) => `مرتب‌شده بر اساس ستون ${e.columnName} به صورت نزولی`,
    columnSize: (e) => `${e.value} پیکسل`,
    resizerDescription: 'برای شروع تغییر اندازه کلید Enter را بزنید',
    expand: 'باز کردن',
    collapse: 'بستن',
  },
  '@react-aria/steplist': {
    steplist: 'فهرست مراحل',
  },
  '@react-aria/spinbutton': {
    Empty: 'خالی',
  },
  '@react-aria/searchfield': {
    'Clear search': 'پاک کردن جست‌وجو',
  },
  '@react-aria/previewtrigger': {
    longPressMessage: 'برای باز کردن پیش‌نمایش طولانی نگه دارید',
  },
  '@react-aria/overlays': {
    dismiss: 'بستن',
  },
  '@react-aria/numberfield': {
    decrease: (e) => `کاهش ${e.fieldLabel}`,
    increase: (e) => `افزایش ${e.fieldLabel}`,
    numberField: 'فیلد عددی',
  },
  '@react-aria/menu': {
    longPressMessage: 'برای باز کردن منو طولانی نگه دارید یا کلیدهای Alt + ArrowDown را بزنید',
  },
  '@react-aria/gridlist': {
    hasActionAnnouncement: 'ردیف دارای اقدام است',
    hasLinkAnnouncement: (e) => `ردیف دارای پیوند است: ${e.link}`,
  },
  '@react-aria/grid': {
    deselectedItem: (e) => `${e.item} انتخاب نشده است.`,
    select: 'انتخاب',
    selectedCount: (e, t) =>
      `${t.plural(Number(e.count), {
        '=0': 'هیچ موردی انتخاب نشده است',
        other: () => `${t.number(Number(e.count))} مورد انتخاب شده است`,
      })}.`,
    selectedAll: 'همهٔ موارد انتخاب شدند.',
    selectedItem: (e) => `${e.item} انتخاب شد.`,
    longPressToSelect: 'برای ورود به حالت انتخاب طولانی نگه دارید.',
  },
  '@react-aria/dnd': {
    dragItem: (e) => `کشیدن ${e.itemText}`,
    dragSelectedItems: (e, t) =>
      `کشیدن ${t.plural(Number(e.count), {
        other: () => `${t.number(Number(e.count))} مورد انتخاب‌شده`,
      })}`,
    dragDescriptionKeyboard: 'برای شروع کشیدن کلید Enter را بزنید.',
    dragDescriptionKeyboardAlt: 'برای شروع کشیدن کلیدهای Alt + Enter را بزنید.',
    dragDescriptionTouch: 'برای شروع کشیدن دو بار ضربه بزنید.',
    dragDescriptionVirtual: 'برای شروع کشیدن کلیک کنید.',
    dragDescriptionLongPress: 'برای شروع کشیدن طولانی نگه دارید.',
    dragSelectedKeyboard: (e, t) =>
      `برای کشیدن ${t.plural(Number(e.count), {
        other: () => `${t.number(Number(e.count))} مورد انتخاب‌شده`,
      })} کلید Enter را بزنید.`,
    dragSelectedKeyboardAlt: (e, t) =>
      `برای کشیدن ${t.plural(Number(e.count), {
        other: () => `${t.number(Number(e.count))} مورد انتخاب‌شده`,
      })} کلیدهای Alt + Enter را بزنید.`,
    dragSelectedLongPress: (e, t) =>
      `برای کشیدن ${t.plural(Number(e.count), {
        other: () => `${t.number(Number(e.count))} مورد انتخاب‌شده`,
      })} طولانی نگه دارید.`,
    dragStartedKeyboard:
      'کشیدن آغاز شد. با Tab به هدف رهاسازی بروید و برای رها کردن Enter یا برای لغو Escape را بزنید.',
    dragStartedTouch: 'کشیدن آغاز شد. به هدف رهاسازی بروید و برای رها کردن دو بار ضربه بزنید.',
    dragStartedVirtual:
      'کشیدن آغاز شد. به هدف رهاسازی بروید و برای رها کردن کلیک کنید یا Enter را بزنید.',
    endDragKeyboard: 'در حال کشیدن. برای لغو کلید Enter را بزنید.',
    endDragTouch: 'در حال کشیدن. برای لغو دو بار ضربه بزنید.',
    endDragVirtual: 'در حال کشیدن. برای لغو کلیک کنید.',
    dropDescriptionKeyboard: 'برای رها کردن Enter و برای لغو Escape را بزنید.',
    dropDescriptionTouch: 'برای رها کردن دو بار ضربه بزنید.',
    dropDescriptionVirtual: 'برای رها کردن کلیک کنید.',
    dropCanceled: 'رها کردن لغو شد.',
    dropComplete: 'رها کردن انجام شد.',
    dropIndicator: 'نشانگر رهاسازی',
    dropOnRoot: 'رها کردن روی',
    dropOnItem: (e) => `رها کردن روی ${e.itemText}`,
    insertBefore: (e) => `درج پیش از ${e.itemText}`,
    insertBetween: (e) => `درج میان ${e.beforeItemText} و ${e.afterItemText}`,
    insertAfter: (e) => `درج پس از ${e.itemText}`,
  },
  '@react-aria/datepicker': {
    era: 'دوره',
    year: 'سال',
    month: 'ماه',
    day: 'روز',
    hour: 'ساعت',
    minute: 'دقیقه',
    second: 'ثانیه',
    dayPeriod: 'ق.ظ/ب.ظ',
    calendar: 'تقویم',
    startDate: 'تاریخ شروع',
    endDate: 'تاریخ پایان',
    weekday: 'روز هفته',
    timeZoneName: 'منطقهٔ زمانی',
    selectedDateDescription: (e) => `تاریخ انتخاب‌شده: ${e.date}`,
    selectedRangeDescription: (e) => `بازهٔ انتخاب‌شده: ${e.startDate} تا ${e.endDate}`,
    selectedTimeDescription: (e) => `زمان انتخاب‌شده: ${e.time}`,
  },
  '@react-aria/combobox': {
    focusAnnouncement: (e, t) =>
      `${t.select(
        {
          true: () =>
            `وارد گروه ${e.groupTitle} با ${t.plural(Number(e.groupCount), {
              other: () => `${t.number(Number(e.groupCount))} گزینه`,
            })} شدید. `,
          other: '',
        },
        String(e.isGroupChange),
      )}${e.optionText}${t.select(
        {
          true: '، انتخاب‌شده',
          other: '',
        },
        String(e.isSelected),
      )}`,
    countAnnouncement: (e, t) =>
      `${t.plural(Number(e.optionCount), {
        other: () => `${t.number(Number(e.optionCount))} گزینه`,
      })} در دسترس است.`,
    selectedAnnouncement: (e) => `${e.optionText}، انتخاب شد`,
    buttonLabel: 'نمایش پیشنهادها',
    listboxLabel: 'پیشنهادها',
  },
  '@react-aria/color': {
    colorPicker: 'انتخابگر رنگ',
    twoDimensionalSlider: 'لغزندهٔ دوبعدی',
    colorNameAndValue: (e) => `${e.name}: ${e.value}`,
    colorInputLabel: (e) => `${e.label}، ${e.channelLabel}`,
    colorSwatch: 'نمونهٔ رنگ',
    transparent: 'شفاف',
  },
  '@react-aria/calendar': {
    previous: 'قبلی',
    next: 'بعدی',
    selectedDateDescription: (e) => `تاریخ انتخاب‌شده: ${e.date}`,
    selectedRangeDescription: (e) => `بازهٔ انتخاب‌شده: ${e.dateRange}`,
    todayDate: (e) => `امروز، ${e.date}`,
    todayDateSelected: (e) => `امروز، ${e.date} انتخاب شد`,
    dateSelected: (e) => `${e.date} انتخاب شد`,
    startRangeSelectionPrompt: 'برای شروع انتخاب بازهٔ تاریخی کلیک کنید',
    finishRangeSelectionPrompt: 'برای پایان انتخاب بازهٔ تاریخی کلیک کنید',
    minimumDate: 'نخستین تاریخ در دسترس',
    maximumDate: 'آخرین تاریخ در دسترس',
    dateRange: (e) => `${e.startDate} تا ${e.endDate}`,
  },
  '@react-aria/breadcrumbs': {
    breadcrumbs: 'مسیر راهنما',
  },
  '@react-aria/autocomplete': {
    collectionLabel: 'پیشنهادها',
  },
  '@react-stately/datepicker': {
    rangeUnderflow: (e) => `مقدار باید ${e.minValue} یا پس از آن باشد.`,
    rangeOverflow: (e) => `مقدار باید ${e.maxValue} یا پیش از آن باشد.`,
    rangeReversed: 'تاریخ شروع باید پیش از تاریخ پایان باشد.',
    unavailableDate: 'تاریخ انتخاب‌شده در دسترس نیست.',
  },
  '@react-stately/color': {
    hue: 'فام',
    saturation: 'اشباع',
    lightness: 'روشنایی',
    brightness: 'درخشندگی',
    red: 'قرمز',
    green: 'سبز',
    blue: 'آبی',
    alpha: 'شفافیت',
    colorName: (e) => `${e.hue} ${e.chroma} ${e.lightness}`,
    transparentColorName: (e) =>
      `${e.hue} ${e.chroma} ${e.lightness}، شفافیت ${e.percentTransparent}`,
    'very dark': 'بسیار تیره',
    dark: 'تیره',
    light: 'روشن',
    'very light': 'بسیار روشن',
    pale: 'کم‌رنگ',
    grayish: 'خاکستری‌فام',
    vibrant: 'پرجان',
    black: 'سیاه',
    white: 'سفید',
    gray: 'خاکستری',
    pink: 'صورتی',
    'pink red': 'قرمز صورتی',
    'red orange': 'نارنجی قرمز',
    brown: 'قهوه‌ای',
    orange: 'نارنجی',
    'orange yellow': 'زرد نارنجی',
    'brown yellow': 'زرد قهوه‌ای',
    yellow: 'زرد',
    'yellow green': 'سبز زرد',
    'green cyan': 'فیروزه‌ای سبز',
    cyan: 'فیروزه‌ای',
    'cyan blue': 'آبی فیروزه‌ای',
    'blue purple': 'بنفش آبی',
    purple: 'بنفش',
    'purple magenta': 'سرخابی بنفش',
    magenta: 'سرخابی',
    'magenta pink': 'صورتی سرخابی',
  },
  'react-aria-components': {
    selectPlaceholder: 'موردی را انتخاب کنید',
    tableResizer: 'تغییر اندازه',
    dropzoneLabel: 'ناحیهٔ رها کردن فایل',
    colorSwatchPicker: 'نمونه‌های رنگ',
  },
};

/** Whether a BCP 47 locale tag refers to Persian (`fa`, `fa-IR`, `fa-IR-u-ca-persian`, …). */
export function isPersianLocale(locale: string): boolean {
  return /^fa(?:-|$)/i.test(locale);
}

/**
 * Registers the Persian React Aria string dictionary on `window` for client rendering.
 * SSR-safe no-op when `window` is undefined, for non-Persian locales, or when a global
 * React Aria string dictionary is already present.
 */
export function installReactAriaPersianStrings(locale: string = DEFAULT_PERSIAN_LOCALE): boolean {
  if (typeof window === 'undefined' || !isPersianLocale(locale)) return false;
  const win = window as unknown as Record<symbol, unknown>;
  if (win[STRINGS_SYMBOL]) return false;
  win[LOCALE_SYMBOL] = locale;
  win[STRINGS_SYMBOL] = faReactAriaStrings;
  return true;
}

let cachedSerializedStrings: string | undefined;

function serializeDictionary(dict: ReactAriaStringDictionary): string {
  const pkgEntries: string[] = [];
  for (const [pkg, messages] of Object.entries(dict)) {
    const keyEntries: string[] = [];
    for (const [key, value] of Object.entries(messages)) {
      const serializedKey = /^[$A-Z_a-z][$\w]*$/.test(key) ? key : JSON.stringify(key);
      const serializedValue = typeof value === 'string' ? JSON.stringify(value) : value.toString();
      keyEntries.push(`${serializedKey}:${serializedValue}`);
    }
    pkgEntries.push(`${JSON.stringify(pkg)}:{${keyEntries.join(',')}}`);
  }
  return `{${pkgEntries.join(',')}}`;
}

/**
 * Produces an inline `<script>` body that initializes React Aria's global Persian strings
 * before client hydration (same symbol contract as `react-aria`'s `PackageLocalizationProvider`).
 */
export function getReactAriaLocalizationScript(locale: string = DEFAULT_PERSIAN_LOCALE): string {
  cachedSerializedStrings ??= serializeDictionary(faReactAriaStrings);
  const safeLocale = JSON.stringify(locale).replaceAll('<', '\\u003c');
  const safeStrings = cachedSerializedStrings.replaceAll('<', '\\u003c');
  return `window[Symbol.for('react-aria.i18n.locale')]=${safeLocale};window[Symbol.for('react-aria.i18n.strings')]=${safeStrings};`;
}

export interface ReactAriaLocalizationScriptProps {
  /** Active BCP 47 locale. Emits nothing for non-Persian locales. Default `fa-IR-u-ca-persian`. */
  locale?: string | undefined;
  /** Optional Content-Security-Policy nonce attribute for the inline `<script>`. */
  nonce?: string | undefined;
}

/**
 * Renders the inline `<script>` that populates React Aria's Persian string dictionary before
 * hydration. Place inside `<head>` of SSR documents (e.g. TanStack Start `RootDocument`).
 */
export function ReactAriaLocalizationScript({
  locale = DEFAULT_PERSIAN_LOCALE,
  nonce,
}: ReactAriaLocalizationScriptProps): ReactElement | null {
  if (!isPersianLocale(locale)) return null;
  return createElement('script', {
    ...(nonce !== undefined ? { nonce: typeof window === 'undefined' ? nonce : '' } : {}),
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: getReactAriaLocalizationScript(locale) },
  });
}
