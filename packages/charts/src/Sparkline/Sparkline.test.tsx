import { StatTile } from '@negaresh/react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderCharts } from '../test/render.tsx';
import { Sparkline } from './Sparkline.tsx';

describe('Sparkline', () => {
  it('renders an accessible SVG trend line with summary and integrates cleanly into StatTile', async () => {
    const { container } = renderCharts(
      <StatTile
        label="فعال‌سازی هفتگی"
        value={184}
        delta={{ value: '۱۲٪', direction: 'up', label: 'نسبت به هفتهٔ قبل' }}
        sparkline={
          <Sparkline
            values={[22, 26, 24, 30, 35, 33, 41]}
            baseline={30}
            tone="positive"
            summary="روند صعودی هفتگی از ۲۲ به ۴۱ فعال‌سازی"
          />
        }
      />,
    );

    expect(container.querySelector('[data-nds="Sparkline"]')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'روند صعودی هفتگی از ۲۲ به ۴۱ فعال‌سازی' })).toBeTruthy();
    expect(container.querySelector('[data-nds="Sparkline"] path')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('handles empty or single-point data gracefully without NaN coordinates', async () => {
    const { container } = renderCharts(
      <div>
        <Sparkline values={[]} summary="بدون داده" />
        <Sparkline values={[42]} summary="یک نقطه: ۴۲" />
      </div>,
    );
    expect(container.innerHTML).not.toContain('NaN');
    await expectNoAxeViolations(container);
  });
});
