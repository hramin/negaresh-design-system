import { ContextualHelp, Link, Stack, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="contextual-help">
      <Stack gap="3">
        <div className={styles.labelRow}>
          <Text weight="semibold" size="sm">
            کد سیستم
          </Text>
          <ContextualHelp
            title="کد سیستم را از کجا پیدا کنیم؟"
            aria-label="راهنمای کد سیستم"
            footer={<Link href="#system-code-guide">مشاهدهٔ راهنمای تصویری</Link>}
          >
            در نرم‌افزار ویندوزی نگارش، پنجرهٔ فعال‌سازی را باز کنید. کد ۱۰ کاراکتری نمایش‌داده‌شده
            در بالای پنجره، کد سیستم شماست.
          </ContextualHelp>
        </div>

        <div className={styles.labelRow}>
          <Text weight="semibold" size="sm">
            شمارهٔ پروانهٔ اشتغال
          </Text>
          <ContextualHelp
            variant="help"
            title="تأیید پروانهٔ متخصص"
            aria-label="راهنمای شمارهٔ پروانه"
          >
            شمارهٔ پروانهٔ سازمان نظام روان‌شناسی پس از بررسی کارشناسان نگارش با نشان تأیید نمایش
            داده می‌شود.
          </ContextualHelp>
        </div>
      </Stack>
    </div>
  );
}

export const contextualHelpDoc: ComponentDoc = {
  slug: 'contextual-help',
  title: 'راهنمای بافتی (ContextualHelp)',
  components: ['ContextualHelp'],
  base: 'DialogTrigger + Popover',
  summary:
    'دکمهٔ راهنمای (i) یا (?) کنار برچسب فیلدها و تیتر بخش‌ها با ترکیب DialogTrigger و Popover و هدف لمسی تضمینی حداقل ۴۴×۴۴ پیکسل.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <GalleryRow title="انواع و حالت‌ها">
      <State label="اطلاعات (info · پیش‌فرض)">
        <div className={styles.labelRow}>
          <Text size="sm" weight="medium">
            سقف فعال‌سازی
          </Text>
          <ContextualHelp title="سقف فعال‌سازی" aria-label="راهنمای سقف فعال‌سازی">
            تعداد رایانه‌هایی که هم‌زمان با این سریال فعال می‌شوند.
          </ContextualHelp>
        </div>
      </State>
      <State label="پرسش (help)">
        <div className={styles.labelRow}>
          <Text size="sm" weight="medium">
            گزارش آرام
          </Text>
          <ContextualHelp variant="help" title="نمای آرام گزارش" aria-label="راهنمای نمای آرام">
            زبان ساده و بدون اصطلاحات بالینی نگران‌کننده برای والدین و نوجوانان.
          </ContextualHelp>
        </div>
      </State>
      <State label="غیرفعال (disabled)">
        <ContextualHelp isDisabled aria-label="راهنمای غیرفعال">
          این راهنما در حال حاضر غیرفعال است.
        </ContextualHelp>
      </State>
    </GalleryRow>
  ),
  usage: {
    do: [
      'کنار برچسب فیلدها یا تیترهایی قرار دهید که توضیح تکمیلی آن‌ها بیش از یک جمله یا شامل پیوند راهنماست.',
      'برای هر راهنما یک aria-label اختصاصی (مانند «راهنمای کد سیستم») بدهید تا در صفحه‌ای با چند راهنما متمایز باشد.',
    ],
    dont: [
      'الزامات اجباری ورودی (مانند «الزامی» یا الگوی فیلد) را درون ContextualHelp پنهان نکنید؛ آن‌ها را زیر فیلد بنویسید.',
    ],
  },
  keyboard: [
    { keys: 'Enter / Space', action: 'باز کردن پاپ‌اور راهنما.' },
    { keys: 'Tab', action: 'حرکت به پیوندهای داخل راهنما.' },
    { keys: 'Escape', action: 'بستن راهنما و بازگشت فوکوس به دکمهٔ (i).' },
  ],
  a11y: [
    'برخلاف Tooltip، روی موبایل و لمس نیز کار می‌کند و می‌تواند شامل پیوند و متن چندپاراگرافی باشد.',
    'اندازهٔ هدف دکمه دست‌کم ۴۴×۴۴ پیکسل است و حلقهٔ فوکوس ۲ پیکسلی دارد.',
  ],
  rtl: [
    'پاپ‌اور پیش‌فرض در جایگاه bottom start هم‌تراز با لبهٔ راست محرک در فارسی باز می‌شود.',
  ],
};
