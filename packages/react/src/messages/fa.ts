import type { NdsMessages } from './types.ts';
import { formatNumber, formatPercent, toPersianDigits } from '@negaresh/utils';

function formatPersianFileSize(bytes: number): string {
  const safe = Math.max(0, bytes);
  if (safe < 1024) return `${formatNumber(safe, { maximumFractionDigits: 0 })} بایت`;
  const kb = safe / 1024;
  if (kb < 1024) return `${formatNumber(kb, { maximumFractionDigits: kb >= 100 ? 0 : 1 })} کیلوبایت`;
  const mb = kb / 1024;
  if (mb < 1024) return `${formatNumber(mb, { maximumFractionDigits: mb >= 100 ? 0 : 1 })} مگابایت`;
  const gb = mb / 1024;
  return `${formatNumber(gb, { maximumFractionDigits: 1 })} گیگابایت`;
}

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
  selectPlaceholder: 'موردی را انتخاب کنید',
  selectSelectedCount: (count) => `${toPersianDigits(count)} مورد انتخاب‌شده`,
  comboBoxNoResults: 'موردی یافت نشد',
  comboBoxLoading: 'در حال بارگذاری…',
  comboBoxToggle: 'نمایش گزینه‌ها',
  comboBoxCreateOption: (query) => `افزودن «${query}»`,
  tagFieldPlaceholder: 'برچسب تازه بنویسید و Enter بزنید',
  tagAdded: (tag) => `برچسب «${tag}» افزوده شد.`,
  tagRemoved: (tag) => `برچسب «${tag}» حذف شد.`,
  tagDuplicate: 'این برچسب قبلاً افزوده شده است.',
  tagLimitReached: (max) => `حداکثر ${toPersianDigits(max)} برچسب مجاز است.`,
  fieldRangeUnderflow: 'مقدار واردشده کمتر از حد مجاز است.',
  fieldRangeOverflow: 'مقدار واردشده بیشتر از حد مجاز است.',
  fieldStepMismatch: 'مقدار را مطابق گام مجاز وارد کنید.',
  sliderRangeStart: 'حد پایین',
  sliderRangeEnd: 'حد بالا',
  rangeSeparator: 'تا',
  openCalendar: 'باز کردن تقویم',
  previousMonth: 'ماه قبل',
  nextMonth: 'ماه بعد',
  numberIncrement: 'افزایش',
  numberDecrement: 'کاهش',
  otpSlotLabel: (index, total) => `رقم ${toPersianDigits(index)} از ${toPersianDigits(total)}`,
  otpIncomplete: (length) => `کد ${toPersianDigits(length)} رقمی را کامل وارد کنید.`,
  otpResend: 'ارسال دوبارهٔ کد',
  otpResendWait: (seconds) => `ارسال دوباره تا ${toPersianDigits(seconds)} ثانیهٔ دیگر`,
  otpResendReady: 'امکان ارسال دوبارهٔ کد فعال شد.',
  otpResent: 'کد تازه ارسال شد.',
  fileUploadDropPrompt: 'پرونده را اینجا رها کنید یا از دستگاه انتخاب کنید',
  fileUploadChoose: 'انتخاب پرونده',
  fileUploadChooseMultiple: 'انتخاب پرونده‌ها',
  fileUploadRemove: (name) => `حذف پروندهٔ «${name}»`,
  fileUploadUploading: (percent) =>
    percent === undefined ? 'در حال بارگذاری…' : `در حال بارگذاری، ${formatPercent(percent)}`,
  fileUploadComplete: 'بارگذاری کامل شد',
  fileUploadError: 'خطا در بارگذاری پرونده',
  fileUploadInvalidType: (name, accept) =>
    `قالب پروندهٔ «${name}» مجاز نیست (قالب‌های مجاز: ${accept}).`,
  fileUploadTooLarge: (name, maxSize) =>
    `حجم پروندهٔ «${name}» بیشتر از سقف مجاز (${maxSize}) است.`,
  fileUploadTooMany: (maxFiles) =>
    `حداکثر ${toPersianDigits(maxFiles)} پرونده می‌توانید انتخاب کنید.`,
  fileSize: formatPersianFileSize,
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
