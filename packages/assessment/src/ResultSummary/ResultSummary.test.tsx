import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mmpiTeen13Fixture, wellbeing8Fixture } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { ResultSummary } from './ResultSummary.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('ResultSummary', () => {
  it('renders MMPI-Teen-13 in professional mode with clinical validity alert and danger badge', async () => {
    const { container } = renderWithTheme(
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
      />,
    );

    expect(container.textContent).toContain(mmpiTeen13Fixture.primaryBadge);
    expect(container.querySelector('[data-nds="InlineAlert"]')).toBeTruthy();
    expect(container.querySelector('[data-tone="danger"]')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('renders MMPI-Teen-13 in calm mode with zero danger/rose tones and Wellbeing-8 index box', async () => {
    const { container } = renderWithTheme(
      <div>
        <ResultSummary
          testTitle={mmpiTeen13Fixture.testTitle}
          kind={mmpiTeen13Fixture.kind}
          mode="calm"
          headline={mmpiTeen13Fixture.headline}
          calmHeadline={mmpiTeen13Fixture.calmHeadline}
          primaryBadge={mmpiTeen13Fixture.primaryBadge}
          calmPrimaryBadge={mmpiTeen13Fixture.calmPrimaryBadge}
          overallSeverity="severe"
          validity={mmpiTeen13Fixture.validity}
        />
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
        />
      </div>,
    );

    expect(container.querySelectorAll('[data-tone="danger"]')).toHaveLength(0);
    expect(container.textContent).toContain(mmpiTeen13Fixture.calmHeadline);
    expect(container.textContent).toContain('۷۲');
    await expectNoAxeViolations(container);
  });
});
