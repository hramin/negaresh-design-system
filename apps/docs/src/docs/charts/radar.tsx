import {
  buildRadarLegend,
  buildRadarTable,
  ChartFrame,
  Radar,
} from '@negaresh/charts';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './charts.module.css';

const wellbeingAxes = [
  { id: 'resilience', label: 'تاب‌آوری' },
  { id: 'emotion', label: 'تنظیم هیجان' },
  { id: 'support', label: 'حمایت اجتماعی' },
  { id: 'efficacy', label: 'خودکارآمدی' },
  { id: 'sleep', label: 'کیفیت خواب' },
  { id: 'meaning', label: 'معناداری' },
];

const singleSeries = [{ id: 'current', label: 'ارزیابی فعلی', values: [74, 62, 82, 70, 54, 78] }];
const compareSeries = [
  ...singleSeries,
  { id: 'norm', label: 'میانگین هنجار', values: [60, 60, 65, 62, 60, 64] },
];

function Example() {
  const [view, setView] = useState<'single' | 'compare'>('compare');
  const activeSeries = view === 'compare' ? compareSeries : singleSeries;

  return (
    <div className={styles.wide} data-interactive="radar-chart">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="تعداد سری نمودار رادار"
            value={view}
            onChange={(k) => setView(k as 'single' | 'compare')}
          >
            <SegmentedControlItem id="single">تک‌سری</SegmentedControlItem>
            <SegmentedControlItem id="compare">مقایسه با هنجار</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ChartFrame
          title="نمای کلی شش‌بعدی بهزیستی (مختص نمای حرفه‌ای)"
          takeaway="حمایت اجتماعی (۸۲) قوی‌ترین بُعد و کیفیت خواب (۵۴) نیازمند توجه بیشتر است."
          legend={buildRadarLegend(activeSeries)}
          sourceNote="مطابق D-67، نمودار رادار فقط در نمای حرفه‌ای/مروری و همواره همراه با جدول داده نمایش داده می‌شود."
          table={buildRadarTable(wellbeingAxes, activeSeries)}
          tableMode="visible"
        >
          <Radar
            ariaLabel="نمودار رادار شش‌بعدی بهزیستی"
            axes={wellbeingAxes}
            series={activeSeries}
            domain={[0, 100]}
          />
        </ChartFrame>
      </Stack>
    </div>
  );
}

export const radarDoc: ComponentDoc = {
  slug: 'radar',
  title: 'نمودار رادار (Radar)',
  components: ['Radar'],
  summary:
    'نمودار چندمحورهٔ مروری (تنها برای بافت حرفه‌ای مطابق D-67) که همواره همراه با جدول داده‌های نمایان، خط‌چین و نشانگرهای غیرلوزی ارائه می‌شود.',
  status: 'review',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نمای مقایسه‌ای همراه با جدول اجباری (tableMode='visible')">
        <State label="2-series radar + visible table">
          <div className={styles.wide}>
            <ChartFrame
              title="مقایسهٔ نیمرخ بهزیستی با هنجار"
              takeaway="پنج بُعد بالاتر از میانگین هنجار و تنها بُعد خواب کمی پایین‌تر از میانگین است."
              legend={buildRadarLegend(compareSeries)}
              table={buildRadarTable(wellbeingAxes, compareSeries)}
              tableMode="visible"
            >
              <Radar
                ariaLabel="مقایسه نیمرخ بهزیستی"
                axes={wellbeingAxes}
                series={compareSeries}
                domain={[0, 100]}
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'تنها در گزارش‌های حرفه‌ای و مروری (متخصصان) برای مقایسهٔ ۴ تا ۸ بُعد هم‌مقیاس به کار ببرید (D-67).',
      'همواره جدول داده‌ها را به‌صورت نمایان (tableMode="visible") در کنار رادار قرار دهید.',
    ],
    dont: [
      'در نمای آرام ویژهٔ آزمون‌دهنده یا نوجوانان از رادار استفاده نکنید؛ به جای آن IntervalBar به‌کار ببرید.',
      'بیش از ۳ سری روی رادار نکشید تا چندضلعی‌ها خوانا بمانند.',
    ],
  },
  api: [
    {
      name: 'Radar',
      props: [
        { name: 'axes', type: 'readonly RadarAxis[]', description: 'محورهای شعاعی (پیشنهاد ۴ تا ۸ بُعد).' },
        { name: 'series', type: 'readonly RadarSeries[]', description: 'سری‌های مقایسه با مقادیر هم‌راستا با axes.' },
        { name: 'domain', type: 'readonly [number, number]', description: 'دامنهٔ عددی محور شعاعی (مثلاً [0, 100]).' },
        { name: 'rings', type: 'number', default: '4', description: 'تعداد حلقه‌های هم‌مرکز.' },
        { name: 'ariaLabel', type: 'string', description: 'نام دسترس‌پذیر نمودار.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'ورود به رئوس چندضلعی' },
    { keys: 'ArrowLeft / ArrowRight', action: 'حرکت بین محورها و خوانش عدد دقیق در نوار وضعیت' },
  ],
  a11y: [
    'هر رأس با شکل غیرلوزی (دایره، مربع، مثلث…) و خط‌چین متمایز می‌شود و قابل فوکوس با صفحه‌کلید است.',
    'جدول دادهٔ نمایان خواندن مقادیر دقیق را برای همهٔ کاربران و صفحه‌خوان‌ها تضمین می‌کند.',
  ],
  rtl: [
    'برچسب‌های فارسی محورها و اعداد حلقه‌های هم‌مرکز تماماً با ارقام فارسی نمایش داده می‌شوند.',
  ],
};
