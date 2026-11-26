import {
  buildProfileLineLegend,
  buildProfileLineTable,
  ChartFrame,
  ProfileLine,
} from '@negaresh/charts';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './charts.module.css';

const mmpiCategories = [
  { id: 'L', label: 'دروغ‌سنجی (L)', shortLabel: 'L' },
  { id: 'F', label: 'بسآمد پایین (F)', shortLabel: 'F' },
  { id: 'K', label: 'تصحیح (K)', shortLabel: 'K' },
  { id: 'Hs', label: 'خودبیمارانگاری (Hs)', shortLabel: 'Hs' },
  { id: 'D', label: 'افسردگی (D)', shortLabel: 'D' },
  { id: 'Hy', label: 'هیستری (Hy)', shortLabel: 'Hy' },
  { id: 'Pd', label: 'انحراف اجتماعی (Pd)', shortLabel: 'Pd' },
  { id: 'Pt', label: 'اضطراب (Pt)', shortLabel: 'Pt' },
  { id: 'Sc', label: 'پریشانی فکری (Sc)', shortLabel: 'Sc' },
  { id: 'Si', label: 'درون‌گرایی (Si)', shortLabel: 'Si' },
];

const primarySeries = [
  { id: 'initial', label: 'ارزیابی اول (آبان ۱۴۰۵)', values: [48, 55, 51, 58, 68, 54, 52, 66, 56, 49] },
];

const comparisonSeries = [
  ...primarySeries,
  { id: 'followup', label: 'پیگیری (دی ۱۴۰۵)', values: [50, 51, 53, 52, 57, 51, 49, 56, 51, 47] },
];

const profileBands = [{ from: 40, to: 60, label: 'بازهٔ هنجار (۴۰ تا ۶۰)' }];
const profileRefs = [
  { value: 50, label: 'میانگین ۵۰' },
  { value: 65, label: 'آستانهٔ ۶۵', tone: 'warning' as const, lineStyle: 'dotted' as const },
  { value: 70, label: 'آستانهٔ ۷۰', tone: 'danger' as const },
];
const profileDividers = [{ afterCategoryId: 'K', label: 'جداکنندهٔ روایی / بالینی' }];

function Example() {
  const [compare, setCompare] = useState<'single' | 'compare'>('compare');
  const activeSeries = compare === 'compare' ? comparisonSeries : primarySeries;

  return (
    <div className={styles.wide} data-interactive="profile-line">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="تعداد سری در نمودار نیمرخ"
            value={compare}
            onChange={(k) => setCompare(k as 'single' | 'compare')}
          >
            <SegmentedControlItem id="single">تک‌سری با برچسب مستقیم</SegmentedControlItem>
            <SegmentedControlItem id="compare">مقایسهٔ دو نوبت ارزیابی</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ChartFrame
          title="نیمرخ مقیاس‌های MMPI (نمرات T)"
          takeaway="در نوبت پیگیری، نمرات افسردگی (D) و اضطراب (Pt) به محدودهٔ هنجار بازگشته‌اند."
          legend={buildProfileLineLegend(activeSeries)}
          sourceNote="مقیاس‌های روایی (L، F، K) با خط عمودی از مقیاس‌های بالینی جدا شده‌اند."
          table={buildProfileLineTable(mmpiCategories, activeSeries)}
        >
          <ProfileLine
            ariaLabel="نیمرخ خطی مقیاس‌های MMPI"
            categories={mmpiCategories}
            series={activeSeries}
            domain={[30, 85]}
            ticks={[30, 40, 50, 65, 70, 85]}
            bands={profileBands}
            referenceLines={profileRefs}
            dividers={profileDividers}
          />
        </ChartFrame>
      </Stack>
    </div>
  );
}

export const profileLineDoc: ComponentDoc = {
  slug: 'profile-line',
  title: 'نمودار خطی نیمرخ (ProfileLine)',
  components: ['ProfileLine'],
  summary:
    'نمودار خطی مقیاس‌های روان‌سنجی (مانند MMPI) با خطوط مرجع ۵۰/۶۵/۷۰، بازهٔ هنجار، جداکننده‌های بخشی و نقاط قابل فوکوس با نشانگرهای غیرلوزی.',
  status: 'review',
  products: ['T', 'V', 'N'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="تک‌سری با برچسب‌های مستقیم و جداکنندهٔ روایی / بالینی">
        <State label="Single series + direct labels">
          <div className={styles.wide}>
            <ChartFrame
              title="نیمرخ تک‌نوبتی"
              takeaway="برچسب عدد هر مقیاس مستقیماً بالای نقطه نمایش داده می‌شود."
              table={buildProfileLineTable(mmpiCategories, primarySeries)}
            >
              <ProfileLine
                ariaLabel="نیمرخ تک‌نوبتی"
                categories={mmpiCategories}
                series={primarySeries}
                domain={[30, 85]}
                ticks={[30, 40, 50, 65, 70, 85]}
                bands={profileBands}
                referenceLines={profileRefs}
                dividers={profileDividers}
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="مقایسهٔ چندسری (الگوی خط‌چین + شکل نشانگر متمایز برای چاپ سیاه‌وسفید)">
        <State label="Multi-series comparison">
          <div className={styles.wide}>
            <ChartFrame
              title="مقایسهٔ دو ارزیابی"
              takeaway="سری اول خط پیوسته با دایره و سری دوم خط‌چین با مربع است (بدون نشانگر لوزی)."
              legend={buildProfileLineLegend(comparisonSeries)}
              table={buildProfileLineTable(mmpiCategories, comparisonSeries)}
            >
              <ProfileLine
                ariaLabel="مقایسهٔ دو ارزیابی"
                categories={mmpiCategories}
                series={comparisonSeries}
                domain={[30, 85]}
                ticks={[30, 40, 50, 65, 70, 85]}
                bands={profileBands}
                referenceLines={profileRefs}
                dividers={profileDividers}
              />
            </ChartFrame>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای نیمرخ‌های چندمقیاسی مانند MMPI با آستانه‌های استاندارد (۵۰، ۶۵، ۷۰) استفاده کنید.',
      'وقتی دو یا چند سری مقایسه می‌شوند، راهنمای buildProfileLineLegend را به ChartFrame بدهید.',
      'از dividers برای تفکیک مقیاس‌های روایی از مقیاس‌های بالینی بهره ببرید.',
    ],
    dont: [
      'بیش از ۶ سری روی یک نمودار نگذارید؛ به جای آن نمودارها را تفکیک (facet) کنید.',
      'از محور عمودی دوگانه (dual axis) استفاده نکنید.',
    ],
  },
  api: [
    {
      name: 'ProfileLine',
      props: [
        { name: 'categories', type: 'readonly ProfileLineCategory[]', description: 'مقیاس‌های محور افقی (id، label و shortLabel اختیاری).' },
        { name: 'series', type: 'readonly ProfileLineSeries[]', description: '۱ تا ۶ سری داده؛ مقدار null خط را به‌صورت تمیز قطع می‌کند.' },
        { name: 'domain', type: 'readonly [number, number]', description: 'دامنهٔ محور عمودی (مثلاً [30, 85]).' },
        { name: 'bands', type: 'readonly BandSpec[]', description: 'بازه‌های افقی هنجار.' },
        { name: 'referenceLines', type: 'readonly ReferenceLineSpec[]', description: 'خطوط مرجع افقی (۵۰، ۶۵، ۷۰).' },
        { name: 'dividers', type: 'readonly ProfileLineDivider[]', description: 'جداکننده‌های عمودی میان گروه‌های مقیاس.' },
        { name: 'showValueLabels', type: 'boolean', default: 'true (single)', description: 'نمایش عدد مستقیم بالای هر نقطه.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'ورود به نقاط داده‌ای نمودار' },
    { keys: 'ArrowLeft / ArrowRight', action: 'حرکت بین نقاط در جهت خوانش RTL و به‌روزرسانی خوانش زنده' },
  ],
  a11y: [
    'هر نقطه در SVG قابل فوکوس است و نام کامل مقیاس و عدد فارسی را اعلام می‌کند.',
    'سری‌های چندگانه علاوه بر رنگ از خط‌چین و شکل نشانگر غیرلوزی (دایره، مربع، مثلث، ضربدر، حلقه) متمایز می‌شوند.',
  ],
  rtl: [
    'در جهت RTL اولین مقیاس در سمت راست قرار می‌گیرد و محور عمودی در سمت راست (آغاز خوانش) ترسیم می‌شود.',
    'برچسب‌های خطوط مرجع همواره درون محدودهٔ نمودار هم‌تراز می‌شوند و هرگز بریده نمی‌شوند.',
  ],
};
