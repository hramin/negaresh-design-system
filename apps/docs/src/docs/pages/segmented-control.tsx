import { iconChart, iconFile, iconPrint } from '@negaresh/icons';
import { SegmentedControl, SegmentedControlItem, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [view, setView] = useState('pro');
  return (
    <div className={styles.example} data-interactive="segmented-control">
      <Stack gap="3">
        <SegmentedControl
          label="نمای نتیجهٔ آزمون"
          description="برای والدین و نوجوانان نمای آرام پیشنهاد می‌شود."
          value={view}
          onChange={(next) => setView(String(next))}
        >
          <SegmentedControlItem id="pro" icon={iconChart}>
            حرفه‌ای
          </SegmentedControlItem>
          <SegmentedControlItem id="calm" icon={iconFile}>
            آرام
          </SegmentedControlItem>
          <SegmentedControlItem id="print" icon={iconPrint}>
            چاپ A4
          </SegmentedControlItem>
        </SegmentedControl>
        <Text size="sm" tone="muted">
          نمای فعال: {view === 'pro' ? 'حرفه‌ای' : view === 'calm' ? 'آرام' : 'چاپ A4'}
        </Text>
      </Stack>
    </div>
  );
}

export const segmentedControlDoc: ComponentDoc = {
  slug: 'segmented-control',
  title: 'کنترل بخش‌بندی‌شده',
  components: ['SegmentedControl', 'SegmentedControlItem'],
  base: 'ToggleButtonGroup, ToggleButton',
  summary:
    'انتخاب تکی و سریع میان ۲ تا ۵ گزینهٔ کوتاه هم‌تراز روی یک ریل فرورفته؛ همیشه یک گزینه فعال باقی می‌ماند.',
  status: 'review',
  products: ['N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="تعداد گزینه‌ها و آیکون">
        <State label="۲ گزینه با آیکون">
          <SegmentedControl aria-label="نمای نتیجه" defaultValue="pro">
            <SegmentedControlItem id="pro" icon={iconChart}>
              حرفه‌ای
            </SegmentedControlItem>
            <SegmentedControlItem id="calm" icon={iconFile}>
              آرام
            </SegmentedControlItem>
          </SegmentedControl>
        </State>
        <State label="۴ گزینه">
          <SegmentedControl label="بازهٔ گزارش" defaultValue="month">
            <SegmentedControlItem id="day">امروز</SegmentedControlItem>
            <SegmentedControlItem id="week">هفته</SegmentedControlItem>
            <SegmentedControlItem id="month">ماه</SegmentedControlItem>
            <SegmentedControlItem id="year">سال</SegmentedControlItem>
          </SegmentedControl>
        </State>
      </GalleryRow>
      <GalleryRow title="اندازه، عرض کامل و غیرفعال">
        <State label='size="sm"'>
          <SegmentedControl aria-label="تراکم" size="sm" defaultValue="normal">
            <SegmentedControlItem id="normal">راحت</SegmentedControlItem>
            <SegmentedControlItem id="compact">فشرده</SegmentedControlItem>
          </SegmentedControl>
        </State>
        <State label="fullWidth">
          <div className={styles.field}>
            <SegmentedControl aria-label="مرتب‌سازی" fullWidth defaultValue="newest">
              <SegmentedControlItem id="newest">تازه‌ترین</SegmentedControlItem>
              <SegmentedControlItem id="popular">پرمخاطب</SegmentedControlItem>
              <SegmentedControlItem id="price">قیمت</SegmentedControlItem>
            </SegmentedControl>
          </div>
        </State>
        <State label="گزینهٔ غیرفعال و گروه غیرفعال">
          <Stack gap="3">
            <SegmentedControl aria-label="نوع خروجی" defaultValue="screen">
              <SegmentedControlItem id="screen">نمایشگر</SegmentedControlItem>
              <SegmentedControlItem id="pdf" isDisabled>
                پی‌دی‌اف (به‌زودی)
              </SegmentedControlItem>
            </SegmentedControl>
            <SegmentedControl aria-label="حالت قفل‌شده" defaultValue="a" isDisabled>
              <SegmentedControlItem id="a">گزینهٔ اول</SegmentedControlItem>
              <SegmentedControlItem id="b">گزینهٔ دوم</SegmentedControlItem>
            </SegmentedControl>
          </Stack>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای جابه‌جایی فوری میان ۲ تا ۵ نمای کوتاه یا بازهٔ زمانی از SegmentedControl استفاده کنید.',
      'برچسب گزینه‌ها را کوتاه (۱ تا ۲ واژه) نگه دارید.',
    ],
    dont: [
      'بیش از ۵ گزینه در SegmentedControl نگذارید؛ از Select یا Tabs استفاده کنید.',
      'برای انتخاب چندگزینه‌ای هم‌زمان از SegmentedControl استفاده نکنید؛ ToggleButtonGroup برای چندانتخابی است.',
    ],
  },
  api: [
    {
      name: 'SegmentedControl',
      props: [
        { name: 'label / aria-label', type: 'ReactNode / string', description: 'برچسب دیدنی یا دسترس‌پذیر.' },
        { name: 'description', type: 'ReactNode', description: 'توضیح تکمیلی زیر ریل.' },
        { name: 'value / defaultValue', type: 'Key', description: 'کلید گزینهٔ فعال.' },
        { name: 'onChange', type: '(value: Key) => void', description: 'اعلام تغییر گزینه.' },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'هر دو اندازه ≥ ۴۴ پیکسل هدف لمسی دارند.' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'توزیع هم‌عرض گزینه‌ها.' },
        { name: 'isDisabled', type: 'boolean', description: 'غیرفعال کردن کل کنترل.' },
      ],
    },
    {
      name: 'SegmentedControlItem',
      props: [
        { name: 'id', type: 'Key', description: 'کلید یکتای گزینه.' },
        { name: 'icon', type: 'IconDefinition', description: 'آیکون اختیاری آغاز گزینه.' },
        { name: 'isDisabled', type: 'boolean', description: 'غیرفعال کردن همین گزینه.' },
        { name: 'children', type: 'ReactNode', description: 'متن کوتاه گزینه.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'ورود و خروج از گروه با roving tabindex' },
    { keys: '← / →', action: 'جابه‌جایی میان گزینه‌ها بر اساس جهت راست‌به‌چپ' },
    { keys: 'Space / Enter', action: 'انتخاب گزینهٔ دارای فوکوس' },
  ],
  a11y: [
    'روی ToggleButtonGroup با selectionMode="single" و disallowEmptySelection ساخته شده و نقش radiogroup دارد.',
    'گزینهٔ فعال با سطح روشن‌تر، مرز و وزن نیمه‌سیاه مشخص می‌شود (بدون سایهٔ ایستا، D-77).',
  ],
  rtl: [
    'نخستین گزینه در سمت راست قرار می‌گیرد و کلید جهت چپ (←) به گزینهٔ بعدی می‌رود.',
  ],
};
