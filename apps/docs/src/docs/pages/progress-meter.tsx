import { Button, Inline, Meter, ProgressBar, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  const [value, setValue] = useState(40);
  return (
    <div className={styles.block} data-interactive="progress-meter">
      <Stack gap="4">
        <ProgressBar label="درون‌ریزی فهرست سریال‌ها" value={value} />
        <Inline gap="2">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => setValue((v) => Math.max(0, v - 20))}
          >
            کاهش ۲۰٪
          </Button>
          <Button
            size="sm"
            variant="primary"
            onPress={() => setValue((v) => Math.min(100, v + 20))}
          >
            افزایش ۲۰٪
          </Button>
        </Inline>
      </Stack>
    </div>
  );
}

export const progressMeterDoc: ComponentDoc = {
  slug: 'progress-meter',
  title: 'نوار پیشرفت و سنجش (ProgressBar / Meter)',
  components: ['ProgressBar', 'Meter'],
  base: 'ProgressBar, Meter',
  summary:
    'نمایش پیشرفت عملیات زمان‌بر (معین یا نامعین) با ProgressBar و سنجش مقدار در بازهٔ مشخص با Meter، هر دو روی React Aria با ارقام فارسی و جهت پرشدن راست‌به‌چپ.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="ProgressBar — معین و نامعین">
        <State label="پیش‌فرض (۶۴٪)">
          <div className={styles.compact}>
            <ProgressBar label="بارگذاری پرونده" value={64} />
          </div>
        </State>
        <State label="تکمیل‌شده (success)">
          <div className={styles.compact}>
            <ProgressBar label="ساخت گزارش PDF" value={100} tone="success" />
          </div>
        </State>
        <State label="نامعین (indeterminate)">
          <div className={styles.compact}>
            <ProgressBar label="در حال بررسی سریال‌ها…" isIndeterminate />
          </div>
        </State>
        <State label="باریک (sm)">
          <div className={styles.compact}>
            <ProgressBar label="همگام‌سازی" value={45} size="sm" />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="Meter — سنجش مقدار در بازه">
        <State label="عادی (accent)">
          <div className={styles.compact}>
            <Meter label="فضای ذخیره‌سازی پرونده‌ها" value={42} />
          </div>
        </State>
        <State label="هشدار (warning)">
          <div className={styles.compact}>
            <Meter label="سقف ارسال پیامک ماهانه" value={85} tone="warning" valueLabel="۸۵۰ از ۱٬۰۰۰" />
          </div>
        </State>
        <State label="بحرانی (danger)">
          <div className={styles.compact}>
            <Meter label="مصرف حافظه" value={96} tone="danger" />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای عملیات در حال اجرا (بارگذاری، پردازش، دانلود) از ProgressBar استفاده کنید.',
      'برای نمایش نسبت یک کمیت ثابت در بازهٔ مشخص (حافظه، ظرفیت، امتیاز) از Meter استفاده کنید.',
      'برای سهمیه‌های شمارشی مانند سقف فعال‌سازی یا صندلی کارزار از UsageMeter استفاده کنید.',
    ],
    dont: [
      'Meter را برای عملیات زمان‌بر در حال پیشرفت به کار نبرید.',
      'ProgressBar نامعین را بدون برچسب متنی واضح رها نکنید.',
    ],
  },
  api: [
    {
      name: 'ProgressBar',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب مرئی بالای نوار.' },
        { name: 'value', type: 'number', default: '0', description: 'مقدار فعلی در بازه.' },
        { name: 'minValue / maxValue', type: 'number', default: '0 / 100', description: 'کران‌های بازه.' },
        {
          name: 'isIndeterminate',
          type: 'boolean',
          default: 'false',
          description: 'حالت نامعین وقتی درصد دقیق مشخص نیست.',
        },
        {
          name: 'valueLabel',
          type: 'ReactNode',
          description: 'متن سفارشی مقدار؛ پیش‌فرض درصد فارسی از formatPercent.',
        },
        {
          name: 'tone',
          type: "'accent' | 'success' | 'warning' | 'danger'",
          default: "'accent'",
          description: 'رنگ نوار پرشونده.',
        },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'ضخامت نوار.' },
      ],
    },
    {
      name: 'Meter',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب مرئی بالای سنجشگر.' },
        { name: 'value', type: 'number', description: 'مقدار اندازه‌گیری‌شده (الزامی).' },
        { name: 'minValue / maxValue', type: 'number', default: '0 / 100', description: 'کران‌های بازه.' },
        { name: 'valueLabel', type: 'ReactNode', description: 'متن قالب‌بندی‌شدهٔ مقدار.' },
        {
          name: 'tone',
          type: "'accent' | 'success' | 'warning' | 'danger'",
          default: "'accent'",
          description: 'رنگ نوار پرشونده.',
        },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'ضخامت نوار.' },
      ],
    },
  ],
  a11y: [
    'ProgressBar نقش role="progressbar" و Meter نقش role="meter" را با aria-valuenow، aria-valuemin، aria-valuemax و aria-valuetext فارسی منتشر می‌کنند.',
    'در prefers-reduced-motion: reduce حرکت نوار نامعین متوقف و گذارها حذف می‌شوند.',
    'در forced-colors: active نوار پرشونده با رنگ Highlight و شیار با حاشیهٔ CanvasText نمایش داده می‌شود.',
  ],
  rtl: [
    'جهت پرشدن نوار در محیط RTL به طور خودکار از راست (inline-start) به چپ (inline-end) است و انیمیشن نامعین نیز در RTL معکوس می‌شود.',
  ],
};
