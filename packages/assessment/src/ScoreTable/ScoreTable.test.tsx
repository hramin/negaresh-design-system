import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mmpiTeen13Fixture } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { ScoreTable } from './ScoreTable.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('ScoreTable', () => {
  it('renders grouped 13-scale MMPI scores in professional mode and eliminates danger tones in calm mode', async () => {
    const pro = renderWithTheme(
      <ScoreTable
        title="جدول نمرات مقیاس‌ها"
        items={mmpiTeen13Fixture.scores}
        mode="professional"
      />,
    );

    expect(pro.container.textContent).toContain('مقیاس‌های روایی');
    expect(pro.container.textContent).toContain('مقیاس‌های بالینی');
    expect(pro.container.textContent).toContain('۷۱');
    expect(pro.container.querySelectorAll('[data-tone="danger"]').length).toBeGreaterThan(0);
    await expectNoAxeViolations(pro.container);
    pro.unmount();

    const calm = renderWithTheme(
      <ScoreTable title="جدول نمرات مقیاس‌ها" items={mmpiTeen13Fixture.scores} mode="calm" />,
    );

    expect(calm.container.querySelectorAll('[data-tone="danger"]')).toHaveLength(0);
    expect(calm.container.textContent).toContain('قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود');
    await expectNoAxeViolations(calm.container);
  });
});
