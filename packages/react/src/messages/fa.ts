import type { NdsMessages } from './types.ts';
import { toPersianDigits } from '@negaresh/utils';

/** Persian strings for NDS components (company products are Persian-only, D-30). */
export const faMessages: NdsMessages = {
  skipToContent: 'پرش به محتوا',
  opensInNewTab: '(در زبانهٔ تازه باز می‌شود)',
  copy: 'کپی',
  copied: 'کپی شد',
  copyFailed: 'کپی نشد؛ متن را دستی انتخاب کنید',
  pending: 'در حال انجام',
  logoPlaceholder: 'لوگو',
  fieldRequired: 'این بخش را تکمیل کنید.',
  fieldInvalid: 'مقدار واردشده را بررسی کنید.',
  fieldTooShort: 'مقدار واردشده کوتاه‌تر از حد مجاز است.',
  fieldTooLong: 'مقدار واردشده بلندتر از حد مجاز است.',
  fieldPatternMismatch: 'مقدار را با الگوی راهنما وارد کنید.',
  fieldTypeMismatch: 'مقدار را با قالب درست وارد کنید.',
  characterCount: (count, maximum) =>
    maximum === undefined
      ? `${toPersianDigits(count)} نویسه`
      : `${toPersianDigits(count)} از ${toPersianDigits(maximum)} نویسه`,
  searchClear: 'پاک کردن جست‌وجو',
  showPassword: 'نمایش گذرواژه',
  hidePassword: 'پنهان کردن گذرواژه',
  serialHint: (pattern) => `الگوی سریال: ${pattern}؛ بزرگی حروف، فاصله و خط تیره مهم نیست.`,
  phoneInvalid: 'شمارهٔ همراه ایران را با قالب راهنما وارد کنید.',
  serialInvalid: 'سریال را مطابق الگوی راهنما وارد کنید.',
  errorSummaryTitle: 'بخش‌های مشخص‌شده را بررسی کنید',
};

export {
  faReactAriaStrings,
  getReactAriaLocalizationScript,
  installReactAriaPersianStrings,
  isPersianLocale,
  ReactAriaLocalizationScript,
  type ReactAriaFormatter,
  type ReactAriaLocalizationScriptProps,
  type ReactAriaLocalizedMessage,
  type ReactAriaStringDictionary,
  type ReactAriaVariables,
} from './react-aria-fa.ts';
