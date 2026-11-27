// @vitest-environment node
import { ChartMessagesProvider } from '@negaresh/charts';
import { faChartMessages } from '@negaresh/charts/messages/fa';
import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  mmpiTeen13Fixture,
  sampleQuestions,
  startFormSchema,
  unfinishedAttempt,
  wellbeing8Fixture,
} from './fixtures/index.ts';
import {
  AnswerPage,
  AnswerProgress,
  AssessmentMessagesProvider,
  InterpretationBlock,
  PrintLayout,
  QuestionItem,
  questionDefinitionToProps,
  ReportStatus,
  ResultChart,
  ResultSummary,
  ResumeOrRestart,
  ScoreTable,
  StartForm,
  SubmittedPage,
} from './index.ts';
import { faAssessmentMessages } from './messages/fa.ts';

describe('@negaresh/assessment Node SSR', () => {
  it('renders all 12 exported assessment components on the server without window/document access', () => {
    const html = renderToString(
      <ThemeProvider messages={faMessages}>
        <ChartMessagesProvider messages={faChartMessages}>
          <AssessmentMessagesProvider messages={faAssessmentMessages}>
            <StartForm title="اطلاعات پایه" fields={startFormSchema} />
            <ResumeOrRestart
              testTitle={unfinishedAttempt.testTitle}
              lastSavedAt={unfinishedAttempt.lastSavedAt}
              answeredCount={unfinishedAttempt.answeredCount}
              totalQuestions={unfinishedAttempt.totalQuestions}
              onResume={() => {}}
              onRestart={() => {}}
            />
            <AnswerProgress currentPage={2} totalPages={6} answeredCount={5} totalQuestions={24} />
            <QuestionItem {...questionDefinitionToProps(sampleQuestions[0]!)} />
            <AnswerPage
              title="آزمون نمونه"
              questions={sampleQuestions.slice(0, 2)}
              currentPage={1}
              totalPages={3}
            />
            <PrintLayout
              title={mmpiTeen13Fixture.testTitle}
              organizationName={mmpiTeen13Fixture.organizationName}
              mode="calm"
              takerName={mmpiTeen13Fixture.takerName}
              issuedAt={mmpiTeen13Fixture.completedAt}
              referenceId={mmpiTeen13Fixture.attemptCode}
              normNote={mmpiTeen13Fixture.normNote}
              footerNote={mmpiTeen13Fixture.calmDisclaimer}
              forceLightPaper
            >
              <ResultSummary
                testTitle={mmpiTeen13Fixture.testTitle}
                kind={mmpiTeen13Fixture.kind}
                mode="calm"
                headline={mmpiTeen13Fixture.headline}
                calmHeadline={mmpiTeen13Fixture.calmHeadline}
                primaryBadge={mmpiTeen13Fixture.primaryBadge}
                calmPrimaryBadge={mmpiTeen13Fixture.calmPrimaryBadge}
                validity={mmpiTeen13Fixture.validity}
                completedAt={mmpiTeen13Fixture.completedAt}
                attemptCode={mmpiTeen13Fixture.attemptCode}
              />
              <ResultChart spec={mmpiTeen13Fixture.charts[0]!} mode="calm" tableMode="sr-only" />
              <ResultChart spec={wellbeing8Fixture.charts[0]!} mode="calm" tableMode="sr-only" />
              <ScoreTable items={mmpiTeen13Fixture.scores} mode="calm" />
              <InterpretationBlock sections={mmpiTeen13Fixture.interpretations} mode="calm" />
            </PrintLayout>
            <ReportStatus status="ready" downloadHref="/report.pdf" />
            <SubmittedPage
              organizationName={mmpiTeen13Fixture.organizationName}
              testTitle={mmpiTeen13Fixture.testTitle}
              submittedAt={mmpiTeen13Fixture.completedAt}
              trackingCode={mmpiTeen13Fixture.attemptCode}
            />
          </AssessmentMessagesProvider>
        </ChartMessagesProvider>
      </ThemeProvider>,
    );

    for (const marker of [
      'StartForm',
      'ResumeOrRestart',
      'AnswerProgress',
      'QuestionItem',
      'AnswerPage',
      'PrintLayout',
      'ResultSummary',
      'ChartFrame',
      'ScoreTable',
      'InterpretationBlock',
      'ReportStatus',
      'SubmittedPage',
    ]) {
      expect(html, `SSR markup contains ${marker}`).toContain(`data-nds="${marker}"`);
    }
    expect(html).toContain('<fieldset');
    expect(html).toContain('<legend');
    expect(html).toContain('<svg');
    expect(html).not.toContain('NaN');
  });
});
