import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { mmpiTeen13Fixture } from '../fixtures/index.ts';
import { PrintLayout } from '../PrintLayout/PrintLayout.tsx';
import { ResultSummary } from '../ResultSummary/ResultSummary.tsx';
import { SubmittedPage } from '../SubmittedPage/SubmittedPage.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { ReportStatus } from './ReportStatus.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('ReportStatus, SubmittedPage & PrintLayout', () => {
  it('renders all 5 ReportStatus states and invokes retry handler in failed state', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    const { container } = renderWithTheme(
      <div>
        <ReportStatus status="none" onGenerate={() => {}} />
        <ReportStatus status="pending" />
        <ReportStatus
          status="ready"
          downloadHref="/api/v1/reports/sample.pdf"
          generatedAt="2026-11-18T08:20:00.000Z"
          expiresAt="2027-05-17T08:20:00.000Z"
        />
        <ReportStatus status="failed" onRetry={onRetry} />
        <ReportStatus status="purged" onGenerate={() => {}} />
      </div>,
    );

    expect(container.querySelectorAll('[data-nds="ReportStatus"]')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });

  it('renders SubmittedPage reassurance and PrintLayout A4 composition with forceLightPaper', async () => {
    const { container } = renderWithTheme(
      <div>
        <SubmittedPage
          organizationName="مرکز مشاورهٔ دانش‌آموزی نگرش"
          testTitle={mmpiTeen13Fixture.testTitle}
          submittedAt={mmpiTeen13Fixture.completedAt}
          trackingCode={mmpiTeen13Fixture.attemptCode}
        />
        <PrintLayout
          title={mmpiTeen13Fixture.testTitle}
          organizationName={mmpiTeen13Fixture.organizationName}
          mode="professional"
          takerName={mmpiTeen13Fixture.takerName}
          issuedAt={mmpiTeen13Fixture.completedAt}
          referenceId={mmpiTeen13Fixture.attemptCode}
          normNote={mmpiTeen13Fixture.normNote}
          footerNote={mmpiTeen13Fixture.disclaimer}
          forceLightPaper
        >
          <ResultSummary
            testTitle={mmpiTeen13Fixture.testTitle}
            kind={mmpiTeen13Fixture.kind}
            mode="professional"
            headline={mmpiTeen13Fixture.headline}
            primaryBadge={mmpiTeen13Fixture.primaryBadge}
          />
        </PrintLayout>
      </div>,
    );

    expect(container.textContent).toContain('می‌توانید این صفحه را ببندید');
    const sheet = container.querySelector('[data-nds="PrintLayout"]');
    expect(sheet?.getAttribute('data-theme')).toBe('light');
    await expectNoAxeViolations(container);
  });
});
