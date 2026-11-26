import {
  Band,
  ChartFrame,
  type ChartFrameState,
  type ChartTableMode,
  ReferenceLine,
} from '@negaresh/charts';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './charts.module.css';

const sampleTable = {
  caption: 'داده‌های نمونه برای قاب نمودار',
  columns: [
    { key: 'label', label: 'مقیاس' },
    { key: 'score', label: 'نمرهٔ T', align: 'numeric' as const },
    { key: 'band', label: 'وضعیت' },
  ],
  rows: [
    { id: 'r1', cells: { label: 'مقیاس پایه', score: '۵۰', band: 'میانگین هنجار' } },
    { id: 'r2', cells: { label: 'آستانهٔ توجه', score: '۶۵', band: 'نیازمند توجه' } },
    { id: 'r3', cells: { label: 'آستانهٔ بالینی', score: '۷۰', band: 'بالاتر از آستانه' } },
  ],
};

function PrimitivesPreview({ mode = 'professional' }: { mode?: 'professional' | 'calm' }) {
  return (
    <svg
      className={styles.primitiveSvg}
      viewBox="0 0 420 110"
      role="img"
      aria-label="نمونهٔ بازه‌های هنجار و خطوط مرجع"
    >
      <title>نمونهٔ بازه‌های هنجار و خطوط مرجع</title>
      <rect x="12" y="24" width="396" height="68" rx="4" className={styles.primitiveBg} />
      <Band
        orientation="vertical"
        fromCoord={120}
        toCoord={260}
        spanStart={25}
        spanEnd={91}
        label="بازهٔ هنجار"
        tone="band"
        mode={mode}
      />
      <Band
        orientation="vertical"
        fromCoord={260}
        toCoord={330}
        spanStart={25}
        spanEnd={91}
        label="توجه"
        tone="caution"
        mode={mode}
      />
      <Band
        orientation="vertical"
        fromCoord={330}
        toCoord={406}
        spanStart={25}
        spanEnd={91}
        label="بالینی"
        tone="severe"
        mode={mode}
      />
      <ReferenceLine
        orientation="vertical"
        position={190}
        start={20}
        end={96}
        label="میانگین ۵۰"
        tone="ref"
        mode={mode}
      />
      <ReferenceLine
        orientation="vertical"
        position={295}
        start={20}
        end={96}
        label="آستانهٔ ۶۵"
        tone="warning"
        mode={mode}
        lineStyle="dotted"
      />
      <ReferenceLine
        orientation="vertical"
        position={355}
        start={20}
        end={96}
        label="آستانهٔ ۷۰"
        tone="danger"
        mode={mode}
      />
    </svg>
  );
}

function Example() {
  const [state, setState] = useState<ChartFrameState>('ready');
  const [tableMode, setTableMode] = useState<ChartTableMode>('toggle');

  return (
    <div className={styles.wide} data-interactive="chart-frame">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="حالت قاب نمودار"
            value={state}
            onChange={(k) => setState(k as ChartFrameState)}
          >
            <SegmentedControlItem id="ready">آماده</SegmentedControlItem>
            <SegmentedControlItem id="loading">بارگذاری</SegmentedControlItem>
            <SegmentedControlItem id="empty">خالی</SegmentedControlItem>
            <SegmentedControlItem id="error">خطا</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl
            aria-label="حالت نمایش جدول داده‌ها"
            value={tableMode}
            onChange={(k) => setTableMode(k as ChartTableMode)}
          >
            <SegmentedControlItem id="toggle">بازشونده</SegmentedControlItem>
            <SegmentedControlItem id="visible">همیشه نمایان</SegmentedControlItem>
            <SegmentedControlItem id="sr-only">فقط صفحه‌خوان</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ChartFrame
          title="قاب نمودار، بازه و خط مرجع"
          takeaway="هر نمودار دارای عنوان، پیام یک‌جمله‌ای، منبع هنجار و جدول داده‌های جایگزین بدون نیاز به جاوااسکریپت است."
          legend={[
            { id: 'l1', label: 'سری اول', toneIndex: 1, shape: 'circle' },
            { id: 'l2', label: 'سری دوم', toneIndex: 2, dashArray: '6 3', shape: 'square' },
          ]}
          sourceNote="منبع: جدول هنجار نمونه — ارقام فارسی با عرض ثابت"
          state={state}
          table={sampleTable}
          tableMode={tableMode}
          onRetry={() => setState('ready')}
        >
          <PrimitivesPreview />
        </ChartFrame>
      </Stack>
    </div>
  );
}

export const chartFrameDoc: ComponentDoc = {
  slug: 'chart-frame',
  title: 'قاب نمودار، خط مرجع و بازه (ChartFrame · ReferenceLine · Band)',
  components: ['ChartFrame', 'ReferenceLine', 'Band'],
  summary:
    'قاب استاندارد هر نمودار در دیزاین سیستم نگرش شامل عنوان، پیام یک‌جمله‌ای، راهنما، منبع و جدول جایگزین بومی (<details>)، همراه با اجزای پایهٔ ReferenceLine و Band.',
  status: 'review',
  products: ['T', 'V', 'N', 'R'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="حالت آماده با جدول بازشونده و بازه‌های حرفه‌ای در برابر آرام">
        <State label="Professional mode · toggle table">
          <div className={styles.wide}>
            <ChartFrame
              title="بازه‌ها و خطوط مرجع (نمای حرفه‌ای)"
              takeaway="آستانهٔ ۶۵ با خط نقطه‌چین و آستانهٔ ۷۰ با خط‌چین متمایز شده‌اند."
              sourceNote="هنجار استاندارد (میانگین ۵۰)"
              table={sampleTable}
              tableMode="toggle"
            >
              <PrimitivesPreview mode="professional" />
            </ChartFrame>
          </div>
        </State>
        <State label="Calm mode · visible table (بدون رنگ قرمز/رز)">
          <div className={styles.wide}>
            <ChartFrame
              title="بازه‌ها در نمای آرام"
              takeaway="در نمای آرام هیچ بازه یا خطی با رنگ قرمز نمایش داده نمی‌شود."
              table={sampleTable}
              tableMode="visible"
            >
              <PrimitivesPreview mode="calm" />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="حالت‌های خالی، بارگذاری و خطا">
        <State label="empty & error">
          <div className={styles.gridTwo}>
            <ChartFrame title="گزارش خالی" state="empty" />
            <ChartFrame title="خطای بارگذاری" state="error" />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'همهٔ نمودارهای مستقل را درون ChartFrame قرار دهید تا عنوان، پیام کلیدی و جدول جایگزین یکپارچه باشند.',
      'در حالت نمای آرام (مخاطب نوجوان یا والدین) مقدار mode="calm" را روی Band و ReferenceLine تنظیم کنید تا رنگ رز حذف شود.',
      'در نمودار رادار همواره tableMode="visible" را انتخاب کنید.',
    ],
    dont: [
      'جدول داده‌ها را حذف نکنید یا تنها به نمایش بصری SVG اکتفا نکنید.',
      'در ChartFrame از سایه‌های تزئینی یا قاب‌های اضافی استفاده نکنید (D-77).',
    ],
  },
  api: [
    {
      name: 'ChartFrame',
      props: [
        { name: 'title', type: 'ReactNode', description: 'عنوان نمودار (الزامی).' },
        { name: 'takeaway', type: 'ReactNode', description: 'خلاصهٔ یک‌جمله‌ای نکتهٔ اصلی نمودار.' },
        { name: 'legend', type: 'readonly ChartLegendItem[]', description: 'راهنمای سری‌ها شامل رنگ، خط‌چین و شکل نشانگر غیرلوزی.' },
        { name: 'sourceNote', type: 'ReactNode', description: 'یادداشت منبع یا هنجار در پایین قاب.' },
        { name: 'state', type: "'ready' | 'loading' | 'empty' | 'error'", default: "'ready'", description: 'وضعیت دادهٔ نمودار.' },
        { name: 'table', type: 'ChartTableData', description: 'داده‌های جدول جایگزین دسترس‌پذیر.' },
        { name: 'tableMode', type: "'toggle' | 'visible' | 'sr-only'", default: "'toggle'", description: 'نحوهٔ نمایش جدول جایگزین (حالت toggle بدون جاوااسکریپت کار می‌کند).' },
        { name: 'onRetry', type: '() => void', description: 'کال‌بک دکمهٔ تلاش دوباره در حالت error.' },
      ],
    },
    {
      name: 'ReferenceLine',
      props: [
        { name: 'orientation', type: "'vertical' | 'horizontal'", description: 'جهت خط مرجع در SVG.' },
        { name: 'position', type: 'number', description: 'مختصات عمود بر خط.' },
        { name: 'start / end', type: 'number', description: 'مبدأ و مقصد خط مرجع.' },
        { name: 'tone', type: "'ref' | 'accent' | 'info' | 'warning' | 'danger'", default: "'ref'", description: 'لحن معنایی خط (در حالت calm رنگ danger به accent تبدیل می‌شود).' },
        { name: 'lineStyle', type: "'dashed' | 'dotted' | 'solid'", default: "'dashed'", description: 'الگوی خط برای خوانایی در چاپ سیاه‌وسفید.' },
      ],
    },
    {
      name: 'Band',
      props: [
        { name: 'orientation', type: "'vertical' | 'horizontal'", description: 'جهت بازه در محور.' },
        { name: 'fromCoord / toCoord', type: 'number', description: 'مختصات شروع و پایان بازه.' },
        { name: 'spanStart / spanEnd', type: 'number', description: 'گسترهٔ عمود بر بازه.' },
        { name: 'tone', type: "'band' | 'ok' | 'caution' | 'severe' | 'calm'", default: "'band'", description: 'لحن بازه (در حالت calm رنگ severe به calm تبدیل می‌شود).' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'انتقال فوکوس به دکمهٔ «جدول داده‌ها» (<summary>)' },
    { keys: 'Enter / Space', action: 'باز یا بسته کردن جدول داده‌های جایگزین (حتی بدون جاوااسکریپت)' },
  ],
  a11y: [
    'قاب از عناصر معنایی <figure> و <figcaption> و هدینگ ساختاریافته استفاده می‌کند.',
    'جدول جایگزین با <details>/<summary> حداقل هدف لمسی ۴۴ پیکسل دارد و بدون جاوااسکریپت کاملاً قابل باز شدن است.',
    'در حالت forced-colors: active بازه‌ها با خط‌چین و خطوط مرجع با CanvasText خوانا می‌مانند.',
  ],
  rtl: [
    'چیدمان سرآیند، جدول داده‌ها و برچسب‌های خطوط مرجع تماماً با ویژگی‌های منطقی CSS و جهت RTL تنظیم شده‌اند.',
    'اعداد در جدول با font-variant-numeric: tabular-nums هم‌تراز می‌شوند.',
  ],
};
