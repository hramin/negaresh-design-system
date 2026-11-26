import { Button, Inline, Stack, UsageMeter } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  const [used, setUsed] = useState(1);
  const limit = 3;
  return (
    <div className={styles.compact} data-interactive="usage-meter">
      <Stack gap="4">
        <UsageMeter
          label="رایانه‌های فعال‌شده"
          used={used}
          limit={limit}
          sourceNote="سقف اختصاصی این سریال"
          showFullIndicator
        />
        <Inline gap="2">
          <Button
            size="sm"
            variant="secondary"
            isDisabled={used <= 0}
            onPress={() => setUsed((u) => Math.max(0, u - 1))}
          >
            آزاد کردن ۱ ظرفیت
          </Button>
          <Button
            size="sm"
            variant="primary"
            isDisabled={used >= limit}
            onPress={() => setUsed((u) => Math.min(limit, u + 1))}
          >
            مصرف ۱ ظرفیت
          </Button>
        </Inline>
      </Stack>
    </div>
  );
}

export const usageMeterDoc: ComponentDoc = {
  slug: 'usage-meter',
  title: 'سنجشگر مصرف سهمیه (UsageMeter)',
  components: ['UsageMeter'],
  base: 'Meter',
  summary:
    'نشانگر سهمیهٔ فعال‌سازی یا صندلی‌های کارزار با بخش‌های مجزای کپسولی (تا ۱۰ سهمیه) یا نوار پیوسته (برای سقف‌های بزرگ)، یادداشت منبع سقف (FR-23) و حالت تکمیل ظرفیت.',
  status: 'review',
  products: ['R', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="سهمیه‌های مجزا (Registry)">
        <State label="خالی (۰ از ۱)">
          <div className={styles.compact}>
            <UsageMeter
              label="سقف این سریال"
              used={0}
              limit={1}
              sourceNote="نصب دوباره روی همین رایانه رایگان است و سقف را مصرف نمی‌کند."
            />
          </div>
        </State>
        <State label="بخشی مصرف‌شده (۲ از ۵)">
          <div className={styles.compact}>
            <UsageMeter
              label="رایانه‌های فعال‌شده"
              used={2}
              limit={5}
              sourceNote="سقف اختصاصی مشتری"
            />
          </div>
        </State>
        <State label="سقف پر شده (۱ از ۱)">
          <div className={styles.compact}>
            <UsageMeter
              label="رایانه‌های فعال‌شده"
              used={1}
              limit={1}
              sourceNote="سقف پیش‌فرض محصول"
              showFullIndicator
            />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="سهمیه‌های بزرگ (نوار پیوسته)">
        <State label="کارزار سازمانی (۴۲ از ۱۰۰)">
          <div className={styles.compact}>
            <UsageMeter
              label="صندلی‌های کارزار"
              used={42}
              limit={100}
              sourceNote="سقف قرارداد سازمانی"
            />
          </div>
        </State>
        <State label="کارزار تکمیل‌شده (۵۰ از ۵۰)">
          <div className={styles.compact}>
            <UsageMeter
              label="صندلی‌های کارزار"
              used={50}
              limit={50}
              sourceNote="سقف بستهٔ انتخاب‌شده"
              showFullIndicator
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'همیشه منبع سقف مؤثر را در sourceNote بنویسید (سریال، مشتری، محصول یا سراسری — FR-23).',
      'وقتی UsageMeter بدون یک InlineAlert هشدار نمایش داده می‌شود، showFullIndicator را روشن کنید تا حالت تکمیل ظرفیت علاوه بر رنگ، آیکن و واژه هم داشته باشد.',
    ],
    dont: [
      'برای سهمیه‌های بزرگ‌تر از ۱۰ بخش، تعداد بخش‌های ریز ایجاد نکنید؛ کامپوننت به صورت خودکار به نوار پیوسته می‌رود.',
      'مقادیر را با ارقام لاتین دستی قالب‌بندی نکنید؛ کامپوننت به صورت خودکار از messages.usageOf استفاده می‌کند.',
    ],
  },
  api: [
    {
      name: 'UsageMeter',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب سهمیه (الزامی).' },
        { name: 'used', type: 'number', description: 'تعداد سهمیهٔ مصرف‌شده.' },
        { name: 'limit', type: 'number', description: 'سقف مؤثر کل.' },
        {
          name: 'sourceNote',
          type: 'ReactNode',
          description: 'توضیح منبع سقف مؤثر (سریال، مشتری، محصول یا سراسری).',
        },
        {
          name: 'maxSegments',
          type: 'number',
          default: '10',
          description: 'حداکثر تعداد قطعات مجزا پیش از تبدیل خودکار به نوار پیوسته.',
        },
        {
          name: 'isFull',
          type: 'boolean',
          default: 'used >= limit',
          description: 'بازنویسی دستی وضعیت تکمیل سقف.',
        },
        {
          name: 'showFullIndicator',
          type: 'boolean',
          default: 'false',
          description: 'نمایش آیکن و متن هشدار «سقف پر شده است» در حالت تکمیل ظرفیت.',
        },
      ],
    },
  ],
  a11y: [
    'بر پایهٔ React Aria Meter (role="meter") پیاده‌سازی شده و aria-valuetext فارسی (و در حالت پر عبارت «سقف پر شده است») را اعلام می‌کند.',
    'قطعات بصری با aria-hidden="true" از شلوغی صفحه‌خوان جلوگیری می‌کنند.',
  ],
  rtl: [
    'برچسب در سمت راست و عدد مصرف‌شده در سمت چپ (با tabular-nums) تراز می‌شود و قطعات از راست به چپ پر می‌شوند.',
  ],
};
