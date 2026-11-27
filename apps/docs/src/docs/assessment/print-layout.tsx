import {
  type AssessmentMode,
  InterpretationBlock,
  PrintLayout,
  ResultChart,
  ResultSummary,
  ScoreTable,
} from '@negaresh/assessment';
import { mmpiTeen13Fixture, wellbeing8Fixture } from '@negaresh/assessment/fixtures';
import { iconExternalLink, iconPrint } from '@negaresh/icons';
import {
  Button,
  LinkButton,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './assessment.module.css';

type FixtureKey = 'mmpi-teen-13' | 'wellbeing-8';

function Example() {
  const [fixtureKey, setFixtureKey] = useState<FixtureKey>('mmpi-teen-13');
  const [mode, setMode] = useState<AssessmentMode>('professional');
  const fixture = fixtureKey === 'mmpi-teen-13' ? mmpiTeen13Fixture : wellbeing8Fixture;

  return (
    <div className={styles.wide} data-interactive="print-layout">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="نمونهٔ گزارش A4"
            value={fixtureKey}
            onChange={(k) => setFixtureKey(k as FixtureKey)}
          >
            <SegmentedControlItem id="mmpi-teen-13">MMPI-Teen-13</SegmentedControlItem>
            <SegmentedControlItem id="wellbeing-8">Wellbeing-8</SegmentedControlItem>
          </SegmentedControl>

          <SegmentedControl
            aria-label="حالت گزارش"
            value={mode}
            onChange={(k) => setMode(k as AssessmentMode)}
          >
            <SegmentedControlItem id="professional">حرفه‌ای (بالینی)</SegmentedControlItem>
            <SegmentedControlItem id="calm">آرام</SegmentedControlItem>
          </SegmentedControl>

          <LinkButton
            href={`/reference/assessment-report?fixture=${fixtureKey}&mode=${mode}`}
            variant="secondary"
            size="sm"
            iconEnd={iconExternalLink}
          >
            نمای مستقل چاپ A4 / PDF
          </LinkButton>
        </div>

        <PrintLayout
          title={fixture.testTitle}
          organizationName={fixture.organizationName}
          productLabel="سامانهٔ آزمون"
          mode={mode}
          takerName={fixture.takerName}
          issuedAt={fixture.completedAt}
          referenceId={fixture.attemptCode}
          normNote={fixture.normNote}
          footerNote={mode === 'calm' ? fixture.calmDisclaimer : fixture.disclaimer}
          headingLevel={3}
          screenActions={
            <Button
              type="button"
              size="sm"
              variant="secondary"
              iconStart={iconPrint}
              onPress={() => window.print()}
            >
              چاپ A4
            </Button>
          }
        >
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
            validity={fixture.validity}
            headingLevel={4}
          />
          <ResultChart spec={fixture.charts[0]!} mode={mode} tableMode="sr-only" />
          <ScoreTable
            title="نمرات مقیاس‌ها"
            items={fixture.scores.slice(0, 6)}
            mode={mode}
          />
          <InterpretationBlock
            sections={fixture.interpretations.slice(0, 2)}
            mode={mode}
          />
        </PrintLayout>
      </Stack>
    </div>
  );
}

export const printLayoutDoc: ComponentDoc = {
  slug: 'print-layout',
  title: 'چیدمان چاپ A4 (PrintLayout)',
  components: ['PrintLayout'],
  base: '@page A4 (14 × 10 mm) + LogoSlot + ResultSummary + ResultChart',
  summary:
    'قالب گزارش A4 با حاشیهٔ ۱۴×۱۰ میلی‌متر، سرصفحهٔ سازمان و شناسه، جلوگیری از شکستن نمودارها و کارت‌ها میان صفحات (break-inside: avoid)، چاپ سیاه‌وسفید امن و هم‌ارزی کامل صفحه و PDF.',
  status: 'approved',
  products: ['T', 'N', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="گزارش A4 · MMPI-Teen-13 (حرفه‌ای · کاغذ روشن)">
        <State label="PrintLayout — MMPI-Teen-13 (professional, forceLightPaper)">
          <div className={styles.wide}>
            <PrintLayout
              title={mmpiTeen13Fixture.testTitle}
              organizationName={mmpiTeen13Fixture.organizationName}
              productLabel="سامانهٔ آزمون"
              mode="professional"
              takerName={mmpiTeen13Fixture.takerName}
              issuedAt={mmpiTeen13Fixture.completedAt}
              referenceId={mmpiTeen13Fixture.attemptCode}
              normNote={mmpiTeen13Fixture.normNote}
              footerNote={mmpiTeen13Fixture.disclaimer}
              headingLevel={3}
              forceLightPaper
            >
              <ResultSummary
                testTitle={mmpiTeen13Fixture.testTitle}
                kind={mmpiTeen13Fixture.kind}
                mode="professional"
                headline={mmpiTeen13Fixture.headline}
                primaryBadge={mmpiTeen13Fixture.primaryBadge}
                overallSeverity={mmpiTeen13Fixture.overallSeverity}
                validity={mmpiTeen13Fixture.validity}
                headingLevel={4}
              />
              <ResultChart
                spec={mmpiTeen13Fixture.charts[0]!}
                mode="professional"
                tableMode="sr-only"
              />
            </PrintLayout>
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="گزارش A4 · Wellbeing-8 (آرام · سازگار با تم صفحه)">
        <State label="PrintLayout — Wellbeing-8 (calm)">
          <div className={styles.wide}>
            <PrintLayout
              title={wellbeing8Fixture.testTitle}
              organizationName={wellbeing8Fixture.organizationName}
              productLabel="سامانهٔ آزمون"
              mode="calm"
              takerName={wellbeing8Fixture.takerName}
              issuedAt={wellbeing8Fixture.completedAt}
              referenceId={wellbeing8Fixture.attemptCode}
              normNote={wellbeing8Fixture.normNote}
              footerNote={wellbeing8Fixture.calmDisclaimer}
              headingLevel={3}
            >
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
                headingLevel={4}
              />
              <ResultChart
                spec={wellbeing8Fixture.charts[0]!}
                mode="calm"
                tableMode="sr-only"
              />
            </PrintLayout>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در مسیر اختصاصی تولید PDF توسط Playwright از ویژگی forceLightPaper و جدول sr-only برای نمودارهای غیررادار (در کنار ScoreTable) استفاده کنید تا صفحه و PDF کاملاً هم‌ارز شوند.',
      'دکمه‌های صرفاً نمایشی مانند دکمهٔ «چاپ» را درون screenActions یا با data-print-hidden="true" قرار دهید تا در PDF ظاهر نشوند.',
      'حاشیهٔ ۱۴×۱۰ میلی‌متر @page را بدون تغییر نگه دارید و نمودارهای SVG سرورمحور @negaresh/charts را مستقیماً داخل PrintLayout بنشانید.',
    ],
    dont: [
      'برای چاپ از تصویر رستر یا بوم canvas استفاده نکنید؛ نمودارها باید SVG برداری با الگوهای امن سیاه‌وسفید بمانند.',
      'پس‌زمینهٔ تیره را روی کاغذ چاپ نکنید؛ PrintLayout هنگام چاپ به‌طور خودکار توکن‌های کاغذ روشن را فعال می‌کند.',
    ],
  },
  a11y: [
    'PrintLayout از نشانه‌گذاری معنایی <article>، <header> و <footer> استفاده می‌کند و در حالت بدون جاوااسکریپت کاملاً خواناست.',
    'در Playwright CI فایل PDF واقعی A4 ساخته و ابعاد ۵۹۵×۸۴۲ پوینت، تعداد صفحات، فونت Vazirmatn و هم‌ارزی تصویری صفحه و چاپ بررسی می‌شود.',
  ],
  rtl: [
    'چاپ A4 با فونت تعبیه‌شدهٔ Vazirmatn، جهت راست‌به‌چپ، ارقام فارسی و ایزولهٔ LTR برای شناسه‌ها تولید می‌شود.',
  ],
};
