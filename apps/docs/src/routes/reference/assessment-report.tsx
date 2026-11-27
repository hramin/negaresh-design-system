import {
  type AssessmentMode,
  InterpretationBlock,
  PrintLayout,
  ResultChart,
  ResultSummary,
  ScoreTable,
} from '@negaresh/assessment';
import { mmpiTeen13Fixture, wellbeing8Fixture } from '@negaresh/assessment/fixtures';
import { iconArrowStart, iconPrint } from '@negaresh/icons';
import { Button, LinkButton, SkipLink } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from './assessment-report.module.css';

type FixtureId = 'mmpi-teen-13' | 'wellbeing-8';

export interface AssessmentReportSearch {
  fixture: FixtureId;
  mode: AssessmentMode;
}

function parseFixture(raw: unknown): FixtureId {
  return raw === 'wellbeing-8' ? 'wellbeing-8' : 'mmpi-teen-13';
}

function parseMode(raw: unknown): AssessmentMode {
  return raw === 'calm' ? 'calm' : 'professional';
}

export const Route = createFileRoute('/reference/assessment-report')({
  validateSearch: (search: Record<string, unknown>): AssessmentReportSearch => ({
    fixture: parseFixture(search.fixture),
    mode: parseMode(search.mode),
  }),
  head: () => ({
    meta: [{ title: 'گزارش چاپی A4 آزمون · دیزاین سیستم نگرش' }],
  }),
  component: AssessmentReportReferencePage,
});

function AssessmentReportReferencePage() {
  const { fixture: fixtureId, mode } = Route.useSearch();
  const fixture = fixtureId === 'wellbeing-8' ? wellbeing8Fixture : mmpiTeen13Fixture;

  return (
    <div className={styles.page}>
      <SkipLink />

      <nav className={styles.toolbar} aria-label="تنظیمات پیش‌نمایش چاپ A4" data-print-hidden="true">
        <div className={styles.toolbarGroup}>
          <LinkButton href="/assessment/print-layout" variant="ghost" size="sm" iconStart={iconArrowStart}>
            بازگشت به مستندات
          </LinkButton>
          <LinkButton
            href={`/reference/assessment-report?fixture=mmpi-teen-13&mode=${mode}`}
            variant={fixtureId === 'mmpi-teen-13' ? 'primary' : 'secondary'}
            size="sm"
          >
            MMPI-Teen-13
          </LinkButton>
          <LinkButton
            href={`/reference/assessment-report?fixture=wellbeing-8&mode=${mode}`}
            variant={fixtureId === 'wellbeing-8' ? 'primary' : 'secondary'}
            size="sm"
          >
            Wellbeing-8
          </LinkButton>
        </div>

        <div className={styles.toolbarGroup}>
          <LinkButton
            href={`/reference/assessment-report?fixture=${fixtureId}&mode=professional`}
            variant={mode === 'professional' ? 'primary' : 'secondary'}
            size="sm"
          >
            نمای حرفه‌ای
          </LinkButton>
          <LinkButton
            href={`/reference/assessment-report?fixture=${fixtureId}&mode=calm`}
            variant={mode === 'calm' ? 'primary' : 'secondary'}
            size="sm"
          >
            نمای آرام
          </LinkButton>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            iconStart={iconPrint}
            onPress={() => window.print()}
          >
            چاپ A4 / PDF
          </Button>
        </div>
      </nav>

      <main id="main" className={styles.main} tabIndex={-1}>
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
          headingLevel={1}
          forceLightPaper
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
            themes={fixture.themes}
            validity={fixture.validity}
            completedAt={fixture.completedAt}
            attemptCode={fixture.attemptCode}
            takerName={fixture.takerName}
            headingLevel={2}
          />

          {fixture.charts.map((spec) => (
            <ResultChart
              key={spec.id}
              spec={spec}
              mode={mode}
              headingLevel={3}
              tableMode={spec.type === 'radar' ? 'visible' : 'sr-only'}
            />
          ))}

          <ScoreTable title="جدول کامل نمرات مقیاس‌ها" items={fixture.scores} mode={mode} />

          <InterpretationBlock sections={fixture.interpretations} mode={mode} />
        </PrintLayout>
      </main>
    </div>
  );
}
