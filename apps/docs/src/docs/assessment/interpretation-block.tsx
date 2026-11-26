import { type AssessmentMode, InterpretationBlock } from '@negaresh/assessment';
import { mmpiTeen13Fixture, wellbeing8Fixture } from '@negaresh/assessment/fixtures';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './assessment.module.css';

function Example() {
  const [mode, setMode] = useState<AssessmentMode>('professional');

  return (
    <div className={styles.wide} data-interactive="interpretation-block">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="حالت نمایش تفسیر"
            value={mode}
            onChange={(k) => setMode(k as AssessmentMode)}
          >
            <SegmentedControlItem id="professional">نمای حرفه‌ای (بالینی)</SegmentedControlItem>
            <SegmentedControlItem id="calm">نمای آرام (آزمون‌دهنده / والدین)</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <InterpretationBlock sections={mmpiTeen13Fixture.interpretations} mode={mode} />
      </Stack>
    </div>
  );
}

export const interpretationBlockDoc: ComponentDoc = {
  slug: 'interpretation-block',
  title: 'بلوک تفسیر نتایج (InterpretationBlock)',
  components: ['InterpretationBlock'],
  base: 'Badge + Code',
  summary:
    'نمایش بخش‌بندی‌شدهٔ تفسیر متنی نتایج بر پایهٔ بخش، روایی پاسخ‌دهی و سطح شدت در دو نمای حرفه‌ای (بالینی) و آرام (بدون رنگ رز و لحن هشداردهنده).',
  status: 'review',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نمای حرفه‌ای (بالینی — MMPI-Teen-13)">
        <State label="Professional mode (validity + severe + ok)">
          <div className={styles.wide}>
            <InterpretationBlock
              sections={mmpiTeen13Fixture.interpretations}
              mode="professional"
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="نمای آرام (آزمون‌دهنده / والدین — بدون رنگ رز)">
        <State label="Calm mode (MMPI-Teen-13 — zero rose/danger)">
          <div className={styles.wide}>
            <InterpretationBlock sections={mmpiTeen13Fixture.interpretations} mode="calm" />
          </div>
        </State>
        <State label="Calm mode (Wellbeing-8)">
          <div className={styles.wide}>
            <InterpretationBlock sections={wellbeing8Fixture.interpretations} mode="calm" />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="حالت خالی">
        <State label="Empty interpretation list">
          <div className={styles.wide}>
            <InterpretationBlock sections={[]} />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای هر بخش تفسیر هم متن بالینی (body) و هم نسخهٔ ساده و حمایتی (calmBody) فراهم کنید تا در نمای نوجوان/والدین لحن آرام حفظ شود.',
      'بخش روایی پاسخ‌دهی را با isValidity: true مشخص کنید تا پیش از تفسیر بالینی برجسته شود.',
    ],
    dont: [
      'در نمای آرام کدهای اختصاری بالینی نامفهوم یا حاشیهٔ قرمز (danger) نمایش ندهید.',
      'شدت یک بخش را فقط با نوار رنگی کنار کارت منتقل نکنید؛ برچسب متنی + آیکون الزامی است.',
    ],
  },
  api: [
    {
      name: 'InterpretationBlock',
      props: [
        { name: 'sections', type: 'readonly AssessmentInterpretationSection[]', description: 'آرایهٔ بخش‌های تفسیر (بخش، عنوان، متن، شدت، روایی، پیشنهادها)' },
        { name: 'title', type: 'ReactNode', default: "'تفسیر نتایج'", description: 'عنوان کلی بلوک تفسیر' },
        { name: 'mode', type: "'professional' | 'calm'", default: "'professional'", description: 'حالت مخاطب (بالینی در برابر آرام)' },
      ],
    },
  ],
  a11y: [
    'هر بخش تفسیر به‌صورت <article> با سلسله‌مراتب عنوانی منظم (h3 -> h4) و نشان شدت دارای واژه + آیکون رندر می‌شود.',
    'هر کارت دارای break-inside: avoid است تا در چاپ A4 میان دو صفحه شکسته نشود.',
  ],
  rtl: [
    'نوار رنگی تأکید از border-inline-start استفاده می‌کند و در RTL به لبهٔ راست می‌نشیند.',
    'کدهای مقیاس (D / Pt) تنها در نمای حرفه‌ای و درون ایزولهٔ <Code> نمایش داده می‌شوند.',
  ],
};
