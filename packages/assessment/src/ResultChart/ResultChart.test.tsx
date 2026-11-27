import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mmpiTeen13Fixture, wellbeing8Fixture } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import type { BarChartSpec } from '../types.ts';
import { ResultChart } from './ResultChart.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

const sampleBarSpec: BarChartSpec = {
  id: 'bar-demo',
  type: 'bar',
  title: 'مقایسهٔ ابعاد',
  takeaway: 'بیشترین امتیاز متعلق به روابط حمایتی است.',
  ariaLabel: 'نمودار ستونی مقایسهٔ ابعاد',
  categories: [
    { id: 'c1', label: 'روابط' },
    { id: 'c2', label: 'هدفمندی' },
  ],
  series: [{ id: 's1', label: 'نمره', values: [84, 79] }],
};

describe('ResultChart', () => {
  it('maps all 5 chart spec types cleanly onto @negaresh/charts with zero danger in calm mode', async () => {
    const { container } = renderWithTheme(
      <div>
        <ResultChart spec={mmpiTeen13Fixture.charts[0]!} mode="calm" />
        <ResultChart spec={mmpiTeen13Fixture.charts[1]!} mode="calm" />
        <ResultChart spec={wellbeing8Fixture.charts[0]!} mode="calm" />
        <ResultChart spec={wellbeing8Fixture.charts[2]!} mode="professional" />
        <ResultChart spec={sampleBarSpec} mode="professional" />
      </div>,
    );

    expect(container.querySelector('[data-nds="ProfileLine"]')).toBeTruthy();
    expect(container.querySelector('[data-nds="IntervalBar"]')).toBeTruthy();
    expect(container.querySelector('[data-nds="Gauge"]')).toBeTruthy();
    expect(container.querySelector('[data-nds="Radar"]')).toBeTruthy();
    expect(container.querySelector('[data-nds="Bar"]')).toBeTruthy();
    // Radar always pairs with a visible data table (D-67)
    expect(container.querySelectorAll('table').length).toBeGreaterThanOrEqual(1);
    await expectNoAxeViolations(container);
  });
});
