import { BreadcrumbItem, Breadcrumbs, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

const LONG_TRAIL = [
  { id: 'home', label: 'خانه', href: '#home' },
  { id: 'tests', label: 'پلتفرم آزمون', href: '#tests' },
  { id: 'personality', label: 'آزمون‌های شخصیت', href: '#personality' },
  { id: 'clinical', label: 'بستهٔ بالینی', href: '#clinical' },
  { id: 'neo', label: 'آزمون نئو فرم بلند' },
];

function Example() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className={styles.block} data-interactive="breadcrumbs">
      <Stack gap="4">
        <Breadcrumbs
          aria-label="مسیر راهنمای جمع‌شده (تعاملی)"
          maxItems={3}
          items={LONG_TRAIL}
          onAction={(key) => setPicked(String(key))}
        />
        {picked && (
          <Text size="xs" tone="muted" className={styles.output}>
            مسیر انتخاب‌شده: {picked}
          </Text>
        )}
      </Stack>
    </div>
  );
}

export const breadcrumbsDoc: ComponentDoc = {
  slug: 'breadcrumbs',
  title: 'مسیر راهنما (Breadcrumbs)',
  components: ['Breadcrumbs', 'BreadcrumbItem'],
  summary:
    'نمایش سلسله‌مراتب صفحات ساخته‌شده روی React Aria Breadcrumbs با جداکنندهٔ آینه‌ای در RTL و جمع‌کردن خودکار مسیرهای میانی در یک منوی دسترس‌پذیر.',
  status: 'review',
  products: ['N', 'T'],
  base: 'React Aria Breadcrumbs / Breadcrumb + Menu',
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="مسیر استاندارد و جداکنندهٔ خط مورب">
        <State label="chevron (RTL mirrored)">
          <div className={styles.block}>
            <Breadcrumbs aria-label="مسیر آزمون (گالری)">
              <BreadcrumbItem id="h" href="#h">
                خانه
              </BreadcrumbItem>
              <BreadcrumbItem id="t" href="#t">
                آزمون‌ها
              </BreadcrumbItem>
              <BreadcrumbItem id="n">آزمون هوش وکسلر</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </State>
        <State label="slash separator">
          <div className={styles.block}>
            <Breadcrumbs aria-label="مسیر فروشگاه (گالری)" separator="slash">
              <BreadcrumbItem id="s1" href="#s1">
                فروشگاه
              </BreadcrumbItem>
              <BreadcrumbItem id="s2" href="#s2">
                کتاب‌های روان‌سنجی
              </BreadcrumbItem>
              <BreadcrumbItem id="s3">راهنمای تفسیر</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="جمع‌کردن مسیرهای میانی (maxItems=3)">
        <State label="collapsed middle menu">
          <div className={styles.block}>
            <Breadcrumbs aria-label="مسیر بلند جمع‌شده (گالری)" maxItems={3} items={LONG_TRAIL} />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در سلسله‌مراتب عمیق (بیش از ۴ سطح) ویژگی maxItems را تنظیم کنید تا روی موبایل شلوغ نشود.',
      'آخرین مورد را بدون href بگذارید تا صفحهٔ جاری با aria-current="page" مشخص شود.',
    ],
    dont: [
      'برای مراحل خطی یک فرایند (مانند فعال‌سازی یا خرید) از Breadcrumbs استفاده نکنید؛ از Stepper استفاده کنید.',
    ],
  },
  api: [
    {
      name: 'Breadcrumbs',
      props: [
        { name: 'items', type: 'readonly BreadcrumbItemData[]', description: 'آرایهٔ مسیرها (لازم برای جمع‌کردن خودکار مسیرهای میانی).' },
        { name: 'maxItems', type: 'number', description: 'حداکثر موارد قابل نمایش پیش از تبدیل مسیرهای میانی به منوی «…».' },
        { name: 'itemsBeforeCollapse / itemsAfterCollapse', type: 'number / number', default: '1 / 2', description: 'تعداد موارد ابتدایی و انتهایی که قابل مشاهده می‌مانند.' },
        { name: 'separator', type: "'chevron' | 'slash'", default: "'chevron'", description: 'جداکنندهٔ منطقی بین مسیرها.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت میان پیوندهای مسیر و دکمهٔ نمایش مسیرهای میانی.' },
    { keys: 'Enter / Space', action: 'باز کردن پیوند یا منوی مسیرهای میانی جمع‌شده.' },
    { keys: 'Escape', action: 'بستن منوی مسیرهای میانی و بازگرداندن فوکوس به دکمهٔ «…».' },
  ],
  a11y: [
    'درون <nav aria-label="مسیر راهنما"> قرار می‌گیرد و آخرین مورد به طور خودکار aria-current="page" می‌گیرد.',
    'دکمهٔ «…» هدف لمسی ۴۴×۴۴ پیکسل و برچسب فارسی «نمایش مسیرهای میانی» دارد.',
  ],
  rtl: [
    'آیکن iconChevronEnd دارای پرچم mirrored است و در RTL به سمت چپ (پایان سطر) اشاره می‌کند.',
  ],
};
