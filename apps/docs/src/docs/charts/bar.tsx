import {
  Bar,
  type BarOrientation,
  buildBarLegend,
  buildBarTable,
  ChartFrame,
} from '@negaresh/charts';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './charts.module.css';

const monthlyCategories = [
  { id: 'far', label: 'فروردین' },
  { id: 'ord', label: 'اردیبهشت' },
  { id: 'kho', label: 'خرداد' },
  { id: 'tir', label: 'تیر' },
  { id: 'mor', label: 'مرداد' },
];

const singleSeries = [{ id: 'act', label: 'فعال‌سازی موفق', values: [142, 186, 168, 214, 195] }];
const groupedSeries = [
  { id: 'y1404', label: 'سال ۱۴۰۴', values: [110, 145, 132, 160, 152] },
  { id: 'y1405', label: 'سال ۱۴۰۵', values: [142, 186, 168, 214, 195] },
];

const productCategories = [
  { id: 'p1', label: 'نگارش تست هوش ۴' },
  { id: 'p2', label: 'مقیاس اضطراب نوجوان' },
  { id: 'p3', label: 'پرسشنامهٔ بهزیستی ۸' },
  { id: 'p4', label: 'آزمون شخصیت جامع' },
];
const productSeries = [{ id: 'orders', label: 'سفارش ماهانه', values: [84, 62, 95, 48] }];

function Example() {
  const [orientation, setOrientation] = useState<BarOrientation>('vertical');
  const [grouped, setGrouped] = useState<'single' | 'grouped'>('single');
  const series = grouped === 'grouped' ? groupedSeries : singleSeries;

  return (
    <div className={styles.wide} data-interactive="bar-chart">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="جهت نمودار ستونی"
            value={orientation}
            onChange={(k) => setOrientation(k as BarOrientation)}
          >
            <SegmentedControlItem id="vertical">عمودی</SegmentedControlItem>
            <SegmentedControlItem id="horizontal">افقی</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl
            aria-label="نوع سری"
            value={grouped}
            onChange={(k) => setGrouped(k as 'single' | 'grouped')}
          >
            <SegmentedControlItem id="single">تک‌سری</SegmentedControlItem>
            <SegmentedControlItem id="grouped">مقایسه‌ای (دو سری)</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ChartFrame
          title="فعال‌سازی‌های ماهانهٔ رجیستری"
          takeaway="تیرماه با ۲۱۴ فعال‌سازی بیشترین رشد فصلی را ثبت کرده است."
          legend={grouped === 'grouped' ? buildBarLegend(series) : undefined}
          sourceNote="مقادیر به تعداد فعال‌سازی تأییدشده — خط‌چین نشانگر هدف ماهانه (۱۷۰) است."
          table={buildBarTable(monthlyCategories, series)}
        >
          <Bar
            ariaLabel="نمودار ستونی فعال‌سازی‌های ماهانه"
            orientation={orientation}
            categories={monthlyCategories}
            series={series}
            referenceLines={[{ value: 170, label: 'هدف ۱۷۰' }]}
          />
        </ChartFrame>
      </Stack>
    </div>
  );
}

export const barDoc: ComponentDoc = {
  slug: 'bar',
  title: 'نمودار ستونی (Bar)',
  components: ['Bar'],
  summary:
    'نمودار ستونی عمودی و افقی برای مقایسهٔ دسته‌ها با برچسب‌های عددی مستقیم فارسی و هاشورهای SVG برای تفکیک در چاپ سیاه‌وسفید.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="ستونی عمودی تک‌سری با برچسب مستقیم و خط هدف">
        <State label="Vertical single series">
          <div className={styles.wide}>
            <ChartFrame
              title="فعال‌سازی ماهانه"
              takeaway="برچسب عددی مستقیم نیاز به راهنمای اضافه را برطرف می‌کند."
              table={buildBarTable(monthlyCategories, singleSeries)}
            >
              <Bar
                ariaLabel="فعال‌سازی ماهانه"
                categories={monthlyCategories}
                series={singleSeries}
                referenceLines={[{ value: 170, label: 'هدف ۱۷۰' }]}
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="ستونی افقی (برای نام دسته‌های طولانی فارسی) و گروهی با هاشور چاپی">
        <State label="Horizontal & grouped multi-series">
          <div className={styles.gridTwo}>
            <ChartFrame
              title="سفارش به تفکیک آزمون (افقی)"
              table={buildBarTable(productCategories, productSeries)}
            >
              <Bar
                ariaLabel="سفارش به تفکیک آزمون"
                orientation="horizontal"
                categories={productCategories}
                series={productSeries}
              />
            </ChartFrame>
            <ChartFrame
              title="مقایسهٔ ۱۴۰۴ و ۱۴۰۵ (گروهی)"
              legend={buildBarLegend(groupedSeries)}
              table={buildBarTable(monthlyCategories, groupedSeries)}
            >
              <Bar
                ariaLabel="مقایسه دو سال"
                categories={monthlyCategories}
                series={groupedSeries}
                showDirectLabels={false}
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'وقتی نام دسته‌های فارسی طولانی است از orientation="horizontal" استفاده کنید تا برچسب‌ها افقی و خوانا بمانند.',
      'در حالت تک‌سری showDirectLabels را فعال بگذارید و از افزودن legend غیرضروری بپرهیزید.',
    ],
    dont: [
      'محور عددی نمودار ستونی را از عددی غیر از صفر برش ندهید (در غیر این صورت تناسب طول ستون‌ها گمراه‌کننده می‌شود).',
      'از گرادیان یا افکت سه‌بعدی روی ستون‌ها استفاده نکنید.',
    ],
  },
  api: [
    {
      name: 'Bar',
      props: [
        { name: 'categories', type: 'readonly BarCategory[]', description: 'دسته‌های محور.' },
        { name: 'series', type: 'readonly BarSeries[]', description: '۱ تا ۶ سری عددی.' },
        { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'جهت ستون‌ها.' },
        { name: 'domain', type: 'readonly [number, number]', description: 'دامنهٔ عددی اختیاری (پیش‌فرض از ۰ تا ۱٫۱۵ برابر بیشینه).' },
        { name: 'showDirectLabels', type: 'boolean', default: 'true', description: 'نمایش مستقیم مقدار فارسی روی هر ستون.' },
        { name: 'referenceLines', type: 'readonly ReferenceLineSpec[]', description: 'خطوط هدف یا میانگین.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'ورود به ستون‌های نمودار' },
    { keys: 'ArrowLeft / ArrowRight (عمودی) · ArrowUp / ArrowDown (افقی)', action: 'پیمایش ستون‌ها و خوانش مقدار دقیق' },
  ],
  a11y: [
    'در نمودار چندسری، الگوهای SVG (هاشور مورب، نقطه، خطوط افقی) در کنار رنگ به‌کار می‌روند تا در چاپ سیاه‌وسفید متمایز باشند.',
    'هر ستون دارای aria-label فارسی و حلقهٔ فوکوس واضح روی خود عنصر است.',
  ],
  rtl: [
    'در حالت عمودی RTL اولین دسته در سمت راست قرار می‌گیرد؛ در حالت افقی برچسب دسته‌ها در راست و ستون‌ها از راست به چپ رشد می‌کنند.',
  ],
};
