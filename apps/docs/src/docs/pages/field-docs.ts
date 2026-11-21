import type { ComponentApi, PropRow } from '../types.ts';

export const fieldKeyboard = [
  { keys: 'Tab / Shift+Tab', action: 'حرکت میان فیلدها و دکمه‌های همراه، با ترتیب منطقی.' },
  {
    keys: 'Arrow / Home / End',
    action: 'ویرایش متن با رفتار بومی مرورگر؛ میان‌برهای انتخاب و چسباندن حفظ می‌شوند.',
  },
];

export const fieldA11y = [
  'برچسب دیدنی به ورودی وصل است؛ راهنما و خطای مشخص با aria-describedby خوانده می‌شوند.',
  'حلقهٔ فوکوس روی خود ورودی، هدف لمسی دست‌کم ۴۴ پیکسل و هر دو حالت روشن و تیره حفظ می‌شوند.',
  'فیلد خطادار فقط با رنگ مشخص نمی‌شود؛ متن خطا و aria-invalid نیز وجود دارند.',
  'ref به ورودی واقعی می‌رسد؛ برای فوکوس خطای فرم می‌توان از آن استفاده کرد.',
];

export const fieldRtl = [
  'چیدمان و فاصله‌ها منطقی‌اند؛ برچسب و راهنمای فارسی راست‌به‌چپ می‌مانند.',
  'جهت ورودی کد، تلفن و نشانی لاتین، مستقل از برچسب فارسی، چپ‌به‌راست است.',
];

export function fieldApi(name: string, extra: PropRow[] = []): ComponentApi {
  return {
    name,
    props: [
      {
        name: 'label',
        type: 'ReactNode',
        description: 'برچسب دیدنی و الزامی؛ placeholder جای آن را نمی‌گیرد.',
      },
      {
        name: 'description / errorMessage',
        type: 'ReactNode',
        description: 'راهنما و خطای متصل به ورودی.',
      },
      {
        name: 'value / defaultValue',
        type: 'string',
        description: 'مقدار کنترل‌شده یا مقدار اولیهٔ کنترل‌نشده.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        description: 'مقدار متنی؛ قرارداد نرمال‌سازی هر فیلد در همین صفحه آمده است.',
      },
      {
        name: 'name / id',
        type: 'string',
        description: 'نام برای ارسال و خطای سرور؛ شناسهٔ ورودی برای پیوند خلاصهٔ خطا.',
      },
      {
        name: 'isRequired / isDisabled / isReadOnly / isInvalid',
        type: 'boolean',
        description: 'الزامی، غیرفعال، فقط‌خواندنی و خطادار.',
      },
      {
        name: 'validationBehavior',
        type: "'native' | 'aria'",
        default: "'native'",
        description:
          'اعتبارسنجی بومی مانع ارسال نامعتبر می‌شود؛ aria برای مدیریت اعتبارسنجی توسط برنامه است.',
      },
      {
        name: 'validate',
        type: '(value: string) => string | string[] | true | null | undefined',
        description: 'اعتبارسنجی اختصاصی؛ متن خطا باید فارسی و مشخص باشد.',
      },
      {
        name: 'size / isPending',
        type: "'sm' | 'md' | 'lg' / boolean",
        default: "'md' / false",
        description: 'اندازه و اعلام در حال انجام.',
      },
      {
        name: 'className / ref',
        type: 'string / Ref<input>',
        description: 'کلاس فقط روی ریشه؛ ref به ورودی واقعی.',
      },
      ...extra,
    ],
  };
}
