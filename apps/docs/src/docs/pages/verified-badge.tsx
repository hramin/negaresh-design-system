import { Avatar, Inline, Stack, Text, VerifiedBadge } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="verified-badge">
      <Inline gap="3">
        <Avatar name="دکتر سارا رضایی" tone="accent" size="lg" alt="" />
        <Stack gap="1">
          <Inline gap="2">
            <Text weight="semibold" size="md">
              دکتر سارا رضایی
            </Text>
            <VerifiedBadge licenceNumber="12485" />
          </Inline>
          <Text size="sm" tone="muted">
            روان‌شناس بالینی کودک و نوجوان
          </Text>
        </Stack>
      </Inline>
    </div>
  );
}

export const verifiedBadgeDoc: ComponentDoc = {
  slug: 'verified-badge',
  title: 'نشان پروانهٔ تأییدشده (VerifiedBadge)',
  components: ['VerifiedBadge'],
  base: 'Badge (Wave 1)',
  summary:
    'نشان تأیید پروانهٔ متخصصان در صفحهٔ پروفایل و فهرست متخصصان نگارش، ساخته‌شده روی Badge موج ۱ با آیکون سپر، برچسب بومی فارسی و شمارهٔ پروانهٔ اختیاری با ارقام فارسی.',
  status: 'approved',
  products: ['N'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="حالت‌ها و اندازه‌ها">
        <State label="پیش‌فرض (md · success)">
          <VerifiedBadge />
        </State>
        <State label="همراه با شمارهٔ پروانه">
          <VerifiedBadge licenceNumber="12485" />
        </State>
        <State label="کوچک (sm · کارت فهرست)">
          <VerifiedBadge size="sm" licenceNumber="9032" />
        </State>
        <State label="لحن تاکیدی (accent)">
          <VerifiedBadge tone="accent" label="متخصص تأییدشده" />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در کنار نام متخصصانی نمایش دهید که شمارهٔ پروانهٔ سازمان نظام روان‌شناسی آن‌ها بررسی و تأیید شده است.',
      'در کارت‌های فشردهٔ فهرست از size="sm" و در سرصفحهٔ پروفایل از size="md" استفاده کنید.',
    ],
    dont: [
      'برای وضعیت سفارش، پرداخت یا سریال استفاده نکنید؛ آن‌ها از StatusBadge استفاده می‌کنند.',
      'صرفاً آیکون بدون متن نمایش ندهید؛ برچسب فارسی همیشه همراه آیکون سپر می‌آید.',
    ],
  },
  a11y: [
    'بر پایهٔ Badge موج ۱ ساخته شده و هرگز تنها به رنگ متکی نیست: آیکون سپر + متن فارسی «پروانهٔ تأییدشده».',
    'کنتراست هر دو لحن success و accent در حالت روشن و تیره توسط tokens:check تضمین می‌شود.',
  ],
  rtl: [
    'شمارهٔ پروانه به طور خودکار با toPersianDigits به ارقام فارسی و tabular-nums تبدیل می‌شود.',
  ],
};
