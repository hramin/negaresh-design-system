import {
  buildGaugeTable,
  ChartFrame,
  type ChartMode,
  type ChartSeverity,
  Gauge,
} from '@negaresh/charts';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './charts.module.css';

const gaugeBands = [
  { from: 0, to: 40, tone: 'ok' as const },
  { from: 40, to: 70, tone: 'caution' as const },
  { from: 70, to: 100, tone: 'severe' as const },
];

function Example() {
  const [mode, setMode] = useState<ChartMode>('calm');
  const [level, setLevel] = useState<ChartSeverity>('ok');

  const presets: Record<ChartSeverity, { value: number; pro: string; calm: string }> = {
    ok: { value: 32, pro: 'در محدودهٔ طبیعی', calm: 'در بازهٔ معمول' },
    caution: { value: 58, pro: 'نیازمند توجه', calm: 'کمی بالاتر از معمول' },
    severe: {
      value: 81,
      pro: 'بالاتر از آستانهٔ بالینی',
      calm: 'قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود',
    },
  };
  const current = presets[level];
  const bandWord = mode === 'calm' ? current.calm : current.pro;

  return (
    <div className={styles.wide} data-interactive="gauge-chart">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="حالت نمایش گیج"
            value={mode}
            onChange={(k) => setMode(k as ChartMode)}
          >
            <SegmentedControlItem id="calm">نمای آرام</SegmentedControlItem>
            <SegmentedControlItem id="professional">نمای حرفه‌ای</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl
            aria-label="سطح نمونه"
            value={level}
            onChange={(k) => setLevel(k as ChartSeverity)}
          >
            <SegmentedControlItem id="ok">معمول (۳۲)</SegmentedControlItem>
            <SegmentedControlItem id="caution">توجه (۵۸)</SegmentedControlItem>
            <SegmentedControlItem id="severe">بالا (۸۱)</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ChartFrame
          title="شاخص کلی فشار ذهنی"
          takeaway={`نمرهٔ فعلی ${bandWord} ارزیابی شده است.`}
          sourceNote="دامنهٔ شاخص از ۰ تا ۱۰۰ — خط‌چین روی ۵۰ میانگین جمعیت مرجع است."
          table={buildGaugeTable('شاخص فشار ذهنی', current.value, [0, 100], bandWord)}
        >
          <Gauge
            value={current.value}
            domain={[0, 100]}
            label="شاخص فشار ذهنی"
            bandWord={bandWord}
            severity={level}
            mode={mode}
            bands={gaugeBands}
            referenceLines={[{ value: 50, label: '۵۰' }]}
          />
        </ChartFrame>
      </Stack>
    </div>
  );
}

export const gaugeDoc: ComponentDoc = {
  slug: 'gauge',
  title: 'شاخص قوسی (Gauge)',
  components: ['Gauge'],
  summary:
    'نمایش یک شاخص واحد روی مقیاس کران‌دار (مانند ۰ تا ۱۰۰) همراه با عدد فارسی هم‌عرض و برچسب متنی الزامی بازه.',
  status: 'approved',
  products: ['T', 'V', 'N'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نمای حرفه‌ای (طبیعی، توجه، بالینی) در برابر نمای آرام">
        <State label="Professional vs Calm modes">
          <div className={styles.gridTwo}>
            <ChartFrame
              title="شاخص بهزیستی (حرفه‌ای)"
              table={buildGaugeTable('شاخص بهزیستی', 76, [0, 100], 'در محدودهٔ طبیعی')}
            >
              <Gauge
                value={76}
                domain={[0, 100]}
                label="شاخص بهزیستی"
                bandWord="در محدودهٔ طبیعی"
                severity="ok"
                mode="professional"
                bands={[
                  { from: 0, to: 40, tone: 'severe' },
                  { from: 40, to: 65, tone: 'caution' },
                  { from: 65, to: 100, tone: 'ok' },
                ]}
                referenceLines={[{ value: 50 }]}
              />
            </ChartFrame>

            <ChartFrame
              title="شاخص فشار ذهنی (آرام — بدون رز)"
              table={buildGaugeTable(
                'فشار ذهنی',
                81,
                [0, 100],
                'قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود',
              )}
            >
              <Gauge
                value={81}
                domain={[0, 100]}
                label="فشار ذهنی"
                bandWord="قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود"
                severity="severe"
                mode="calm"
                bands={gaugeBands}
                referenceLines={[{ value: 50 }]}
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای یک شاخص ترکیبی واحد با کمینه و بیشینهٔ مشخص (۰ تا ۱۰۰) استفاده کنید.',
      'همواره bandWord گویا کنار عدد بنویسید تا وضعیت هرگز فقط با رنگ منتقل نشود.',
    ],
    dont: [
      'برای مقایسهٔ چندین مقیاس در کنار هم از چند Gauge پیاپی استفاده نکنید؛ IntervalBar بسیار خواناتر است.',
    ],
  },
  a11y: [
    'SVG دارای role="img" و aria-label ترکیبی شامل نام شاخص، مقدار فارسی و واژهٔ وضعیت است.',
    'در چاپ و حالت forced-colors، مقدار عددی، کرانه‌های کمینه/بیشینه و کپسول وضعیت کاملاً خوانا می‌مانند.',
  ],
  rtl: [
    'در جهت RTL کرانهٔ کمینه در سمت راست (آغاز خوانش) و بیشینه در سمت چپ قرار می‌گیرد و قوس از راست به چپ پر می‌شود.',
  ],
};
