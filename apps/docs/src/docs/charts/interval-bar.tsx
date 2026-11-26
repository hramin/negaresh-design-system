import {
  buildIntervalBarTable,
  ChartFrame,
  type ChartMode,
  IntervalBar,
  type IntervalBarItem,
} from '@negaresh/charts';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './charts.module.css';

const sampleItems: IntervalBarItem[] = [
  {
    id: 'mood',
    label: 'خلق و انرژی',
    description: 'مقیاس D',
    value: 52,
    low: 47,
    high: 57,
    severity: 'ok',
  },
  {
    id: 'anx',
    label: 'اضطراب و نگرانی',
    description: 'مقیاس Pt',
    value: 64,
    low: 59,
    high: 69,
    severity: 'caution',
  },
  {
    id: 'som',
    label: 'تنش بدنی',
    description: 'مقیاس Hs',
    value: 73,
    low: 68,
    high: 78,
    severity: 'severe',
  },
  {
    id: 'soc',
    label: 'انزوای اجتماعی',
    description: 'مقیاس Si',
    value: 46,
    low: 41,
    high: 51,
    severity: 'ok',
  },
];

const normBands = [{ from: 40, to: 60, tone: 'band' as const, label: 'بازهٔ هنجار' }];
const refLines = [
  { value: 50, label: 'میانگین ۵۰' },
  { value: 65, label: '۶۵', tone: 'warning' as const },
  { value: 70, label: '۷۰', tone: 'danger' as const },
];

function Example() {
  const [mode, setMode] = useState<ChartMode>('professional');

  return (
    <div className={styles.wide} data-interactive="interval-bar">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="حالت نمایش شدت"
            value={mode}
            onChange={(k) => setMode(k as ChartMode)}
          >
            <SegmentedControlItem id="professional">نمای حرفه‌ای (بالینی)</SegmentedControlItem>
            <SegmentedControlItem id="calm">نمای آرام (آزمون‌دهنده / والدین)</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ChartFrame
          title="نمرات مقیاس‌ها همراه با بازهٔ اطمینان ۹۵٪"
          takeaway={
            mode === 'calm'
              ? 'بیشتر شاخص‌ها در بازهٔ معمول قرار دارند و در یک شاخص گفت‌وگو با متخصص پیشنهاد می‌شود.'
              : 'مقیاس تنش بدنی بالاتر از آستانهٔ بالینی ۷۰ و اضطراب در ناحیهٔ توجه است.'
          }
          sourceNote="مقیاس نمرهٔ T (میانگین ۵۰، انحراف معیار ۱۰) — بازهٔ خطا ±۵ نمره"
          table={buildIntervalBarTable(sampleItems, { mode })}
        >
          <IntervalBar
            ariaLabel="نمودار بازه‌ای نمرات مقیاس‌ها"
            items={sampleItems}
            domain={[30, 85]}
            ticks={[30, 40, 50, 60, 70, 80]}
            bands={normBands}
            referenceLines={refLines}
            mode={mode}
          />
        </ChartFrame>
      </Stack>
    </div>
  );
}

export const intervalBarDoc: ComponentDoc = {
  slug: 'interval-bar',
  title: 'نمودار بازه‌ای (IntervalBar)',
  components: ['IntervalBar'],
  summary:
    'نمودار شاخص سیستم برای نمایش نمره همراه با بازهٔ اطمینان، بازه‌های هنجار و خطوط مرجع؛ با دو نمای حرفه‌ای و آرام و چیدمان واکنش‌گرا در موبایل.',
  status: 'review',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نمای حرفه‌ای (بالینی با توکن‌های وضعیت)">
        <State label="Professional mode">
          <div className={styles.wide}>
            <ChartFrame
              title="نتایج بالینی (نمای حرفه‌ای)"
              takeaway="خط مرجع ۵۰ میانگین هنجار و ۶۵/۷۰ آستانه‌های توجه و بالینی را نشان می‌دهند."
              table={buildIntervalBarTable(sampleItems, { mode: 'professional' })}
            >
              <IntervalBar
                ariaLabel="نتایج بالینی"
                items={sampleItems}
                domain={[30, 85]}
                ticks={[30, 40, 50, 60, 70, 80]}
                bands={normBands}
                referenceLines={refLines}
                mode="professional"
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="نمای آرام (بدون رنگ رز — مناسب نوجوانان و والدین)">
        <State label="Calm mode">
          <div className={styles.wide}>
            <ChartFrame
              title="خلاصهٔ نتیجه (نمای آرام)"
              takeaway="واژه‌های آرام و رنگ‌های خنثی و فیروزه‌ای جایگزین برچسب‌های هشدار قرمز شده‌اند."
              table={buildIntervalBarTable(sampleItems, { mode: 'calm' })}
            >
              <IntervalBar
                ariaLabel="خلاصهٔ نتیجه در نمای آرام"
                items={sampleItems}
                domain={[30, 85]}
                ticks={[30, 40, 50, 60, 70, 80]}
                bands={normBands}
                referenceLines={[{ value: 50, label: 'میانگین ۵۰' }]}
                mode="calm"
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای نمایش نمره‌های روان‌سنجی همراه با بازهٔ اطمینان و محدودهٔ هنجار از IntervalBar استفاده کنید.',
      'برای مخاطب آزمون‌دهنده، نوجوان یا والدین همیشه mode="calm" را فعال کنید.',
      'همیشه واژهٔ وضعیت را در کنار عدد نشان دهید تا معنا هرگز وابسته به رنگ نباشد.',
    ],
    dont: [
      'در نمای آزمون‌دهنده از رنگ قرمز/رز یا برچسب‌های تشخیصی هشدارآمیز استفاده نکنید.',
      'بازهٔ اطمینان را بدون توضیح منبع هنجار در sourceNote نمایش ندهید.',
    ],
  },
  api: [
    {
      name: 'IntervalBar',
      props: [
        { name: 'items', type: 'readonly IntervalBarItem[]', description: 'ردیف‌های مقیاس شامل label، value، low/high اختیاری و severity.' },
        { name: 'domain', type: 'readonly [number, number]', description: 'دامنهٔ عددی محور افقی.' },
        { name: 'ticks', type: 'readonly number[]', description: 'درجه‌های صریح محور عددی.' },
        { name: 'bands', type: 'readonly BandSpec[]', description: 'بازه‌های هنجار سایه‌دار روی مسیر.' },
        { name: 'referenceLines', type: 'readonly ReferenceLineSpec[]', description: 'خطوط مرجع عمودی (میانگین، آستانه).' },
        { name: 'mode', type: "'professional' | 'calm'", default: "'professional'", description: 'مقیاس شدت حرفه‌ای یا آرام (بدون رنگ رز).' },
        { name: 'dir', type: "'rtl' | 'ltr'", default: "'rtl'", description: 'جهت محور عددی (کم به زیاد از آغاز به پایان خط).' },
        { name: 'ariaLabel', type: 'string', description: 'نام دسترس‌پذیر نمودار.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'فوکوس روی نشانگر ردیف بعدی' },
    { keys: 'ArrowDown / ArrowUp', action: 'جابه‌جایی سریع میان مقیاس‌ها و به‌روزرسانی نوار خوانش زنده' },
    { keys: 'Enter / Space', action: 'انتخاب مقیاس و فراخوانی onSelectItem' },
  ],
  a11y: [
    'هر نشانگر دارای aria-label کامل شامل نام مقیاس، نمره، بازهٔ اطمینان و وضعیت متنی است.',
    'تغییر فوکوس یا هاور نوار وضعیت زنده (role="status") را به‌روزرسانی می‌کند.',
    'در عرض‌های کم (موبایل) برچسب‌ها و نمره در بالای مسیر SVG تمام‌عرض چیده می‌شوند تا فونت فارسی هرگز ریز نشود.',
  ],
  rtl: [
    'در حالت RTL نام مقیاس در آغاز خط (راست)، مسیر در میانه و نمره+برچسب وضعیت در پایان خط (چپ) قرار می‌گیرند.',
    'محور عددی از کم (راست) به زیاد (چپ) با برچسب‌های صریح فارسی حرکت می‌کند (data-viz.md).',
  ],
};
