import {
  type AssessmentMode,
  ResultChart,
  ResultSummary,
  ScoreTable,
} from '@negaresh/assessment';
import { mmpiTeen13Fixture, wellbeing8Fixture } from '@negaresh/assessment/fixtures';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './assessment.module.css';

type FixtureKey = 'mmpi' | 'wellbeing';

function Example() {
  const [fixtureKey, setFixtureKey] = useState<FixtureKey>('mmpi');
  const [mode, setMode] = useState<AssessmentMode>('professional');

  const fixture = fixtureKey === 'mmpi' ? mmpiTeen13Fixture : wellbeing8Fixture;

  return (
    <div className={styles.wide} data-interactive="result-overview">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="انتخاب نمونهٔ آزمون"
            value={fixtureKey}
            onChange={(k) => setFixtureKey(k as FixtureKey)}
          >
            <SegmentedControlItem id="mmpi">MMPI-Teen-13 (نیمرخ ۱۳ مقیاس)</SegmentedControlItem>
            <SegmentedControlItem id="wellbeing">Wellbeing-8 (شاخص ۸ بُعد)</SegmentedControlItem>
          </SegmentedControl>

          <SegmentedControl
            aria-label="حالت نمایش مخاطب"
            value={mode}
            onChange={(k) => setMode(k as AssessmentMode)}
          >
            <SegmentedControlItem id="professional">نمای حرفه‌ای (بالینی)</SegmentedControlItem>
            <SegmentedControlItem id="calm">نمای آرام (بدون رنگ هشدار قرمز)</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ResultSummary
          testTitle={fixture.testTitle}
          kind={fixture.kind}
          mode={mode}
          headline={fixture.headline}
          calmHeadline={fixture.calmHeadline}
          primaryBadge={fixture.primaryBadge}
          calmPrimaryBadge={fixture.calmPrimaryBadge}
          indexScore={fixture.indexScore}
          indexDomain={fixture.indexDomain}
          overallSeverity={fixture.overallSeverity}
          themes={fixture.themes}
          validity={fixture.validity}
          completedAt={fixture.completedAt}
          attemptCode={fixture.attemptCode}
          takerName={fixture.takerName}
        />

        {fixture.charts.map((spec) => (
          <ResultChart key={spec.id} spec={spec} mode={mode} />
        ))}

        <ScoreTable
          title="جدول کامل نمرات مقیاس‌ها"
          items={fixture.scores}
          mode={mode}
        />
      </Stack>
    </div>
  );
}

export const resultOverviewDoc: ComponentDoc = {
  slug: 'result-overview',
  title: 'خلاصه، نمودار و جدول نمرات (ResultSummary · ResultChart · ScoreTable)',
  components: ['ResultSummary', 'ResultChart', 'ScoreTable'],
  base: '@negaresh/charts + Badge + InlineAlert',
  summary:
    'نمایش ساختاریافتهٔ خروجی `/api/v1` آزمون‌ها در هر دو نمای حرفه‌ای (بالینی) و آرام (نوجوان/والدین بدون رنگ رز) همراه با آداپتور خودکار نمودارها و جدول نمرات.',
  status: 'approved',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="MMPI-Teen-13 · نمای حرفه‌ای (بالینی)">
        <State label="ResultSummary — Professional (with validity alert)">
          <div className={styles.wide}>
            <ResultSummary
              testTitle={mmpiTeen13Fixture.testTitle}
              kind={mmpiTeen13Fixture.kind}
              mode="professional"
              headline={mmpiTeen13Fixture.headline}
              calmHeadline={mmpiTeen13Fixture.calmHeadline}
              primaryBadge={mmpiTeen13Fixture.primaryBadge}
              calmPrimaryBadge={mmpiTeen13Fixture.calmPrimaryBadge}
              overallSeverity={mmpiTeen13Fixture.overallSeverity}
              themes={mmpiTeen13Fixture.themes}
              validity={mmpiTeen13Fixture.validity}
              completedAt={mmpiTeen13Fixture.completedAt}
              attemptCode={mmpiTeen13Fixture.attemptCode}
              takerName={mmpiTeen13Fixture.takerName}
            />
          </div>
        </State>
        <State label="ResultChart — MMPI ProfileLine (Professional)">
          <div className={styles.wide}>
            <ResultChart spec={mmpiTeen13Fixture.charts[0]!} mode="professional" />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="MMPI-Teen-13 · نمای آرام (بدون رز/خطر)">
        <State label="ResultSummary — Calm (zero danger/rose)">
          <div className={styles.wide}>
            <ResultSummary
              testTitle={mmpiTeen13Fixture.testTitle}
              kind={mmpiTeen13Fixture.kind}
              mode="calm"
              headline={mmpiTeen13Fixture.headline}
              calmHeadline={mmpiTeen13Fixture.calmHeadline}
              primaryBadge={mmpiTeen13Fixture.primaryBadge}
              calmPrimaryBadge={mmpiTeen13Fixture.calmPrimaryBadge}
              overallSeverity={mmpiTeen13Fixture.overallSeverity}
              validity={mmpiTeen13Fixture.validity}
              completedAt={mmpiTeen13Fixture.completedAt}
              attemptCode={mmpiTeen13Fixture.attemptCode}
            />
          </div>
        </State>
        <State label="ScoreTable — Calm mode (excerpt)">
          <div className={styles.wide}>
            <ScoreTable
              title="نمرات کلیدی در نمای آرام"
              items={mmpiTeen13Fixture.scores.slice(0, 6)}
              mode="calm"
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="Wellbeing-8 · شاخص کلی و نمودارهای بهزیستی">
        <State label="ResultSummary + Gauge — Wellbeing-8 (Calm)">
          <div className={styles.stack}>
            <ResultSummary
              testTitle={wellbeing8Fixture.testTitle}
              kind={wellbeing8Fixture.kind}
              mode="calm"
              headline={wellbeing8Fixture.headline}
              calmHeadline={wellbeing8Fixture.calmHeadline}
              primaryBadge={wellbeing8Fixture.primaryBadge}
              calmPrimaryBadge={wellbeing8Fixture.calmPrimaryBadge}
              indexScore={wellbeing8Fixture.indexScore}
              indexDomain={wellbeing8Fixture.indexDomain}
              completedAt={wellbeing8Fixture.completedAt}
              attemptCode={wellbeing8Fixture.attemptCode}
            />
            <ResultChart spec={wellbeing8Fixture.charts[0]!} mode="calm" />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای نمایش نتیجه به نوجوان، والدین یا آزمون‌دهنده همیشه mode="calm" را فعال کنید تا رنگ رز/خطر به‌طور کامل حذف و واژه‌گزینی آرام جایگزین شود.',
      'شدت و وضعیت را همیشه با واژه + آیکون نمایش دهید و هرگز صرفاً به رنگ تکیه نکنید.',
      'از ResultChart برای نگاشت مستقیم spec نمودار `/api/v1` به `@negaresh/charts` و تولید خودکار جدول جایگزین استفاده کنید.',
    ],
    dont: [
      'در نمای آرام از رنگ یا برچسب danger استفاده نکنید.',
      'نمودار رادار را بدون جدول دادهٔ مرئی نمایش ندهید (ResultChart به‌صورت پیش‌فرض tableMode="visible" را برای رادار اعمال می‌کند).',
    ],
  },
  a11y: [
    'ScoreTable داخل ظرف دارای tabIndex={0} و role="region" قرار دارد تا در عرض‌های کم با کیبورد پیمایش شود (WCAG 2.1.1).',
    'شدت هر مقیاس علاوه بر رنگ، دارای آیکون معنایی و برچسب فارسی صریح است.',
    'ResultChart برای همهٔ نمودارها جدول دادهٔ دسترس‌پذیر تولید می‌کند و در حالت بدون جاوااسکریپت نیز کاملاً خواناست.',
  ],
  rtl: [
    'کدهای مقیاس (L، F، K، D، Pt) و شناسهٔ تلاش در <Code> با ایزولهٔ LTR نمایش داده می‌شوند (D-86).',
    'تمام نمرات و بازه‌های اطمینان با ارقام فارسی و ویژگی tabular-nums قالب‌بندی می‌شوند.',
  ],
};
