import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderCharts } from '../test/render.tsx';
import { buildGaugeTable, Gauge } from './Gauge.tsx';

describe('Gauge', () => {
  it('renders Persian value, required band word, segmented bands, and passes axe', async () => {
    const { container } = renderCharts(
      <Gauge
        value={74}
        domain={[0, 100]}
        label="شاخص بهزیستی"
        bandWord="در محدودهٔ طبیعی"
        severity="ok"
        bands={[
          { from: 0, to: 40, tone: 'severe' },
          { from: 40, to: 65, tone: 'caution' },
          { from: 65, to: 100, tone: 'ok' },
        ]}
        referenceLines={[{ value: 50, label: 'میانگین' }]}
      />,
    );

    expect(container.querySelector('[data-nds="Gauge"]')).toBeTruthy();
    expect(screen.getByText('۷۴')).toBeTruthy();
    expect(screen.getByText('در محدودهٔ طبیعی')).toBeTruthy();
    expect(buildGaugeTable('شاخص بهزیستی', 74, [0, 100], 'در محدودهٔ طبیعی').rows[0]?.cells.value).toBe('۷۴');
    await expectNoAxeViolations(container);
  });

  it('prevents severe/rose band and pill tones in calm mode', async () => {
    const { container } = renderCharts(
      <Gauge
        value={82}
        domain={[0, 100]}
        label="فشار ذهنی"
        bandWord="قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود"
        severity="severe"
        mode="calm"
        bands={[{ from: 70, to: 100, tone: 'severe' }]}
      />,
    );

    expect(container.querySelector('[data-tone="severe"]')).toBeNull();
    expect(container.querySelector('[data-tone="calm-highlight"]')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
