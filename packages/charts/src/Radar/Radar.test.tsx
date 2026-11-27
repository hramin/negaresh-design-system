import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderCharts } from '../test/render.tsx';
import { buildRadarLegend, buildRadarTable, Radar } from './Radar.tsx';

const axes = [
  { id: 'a1', label: 'تاب‌آوری' },
  { id: 'a2', label: 'تنظیم هیجان' },
  { id: 'a3', label: 'حمایت اجتماعی' },
  { id: 'a4', label: 'خودکارآمدی' },
  { id: 'a5', label: 'کیفیت خواب' },
];

const series = [
  { id: 's1', label: 'ارزیابی فعلی', values: [72, 64, 80, 68, 56] },
  { id: 's2', label: 'میانگین هنجار', values: [60, 60, 65, 62, 60] },
];

describe('Radar', () => {
  it('renders polygons, concentric rings, non-diamond markers, keyboard readout, and table helper', async () => {
    const user = userEvent.setup();
    const { container } = renderCharts(
      <Radar ariaLabel="نیمرخ پنج‌بعدی بهزیستی" axes={axes} series={series} domain={[0, 100]} />,
    );

    expect(container.querySelector('[data-nds="Radar"]')).toBeTruthy();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(10);
    buttons[0]!.focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('status').textContent).toContain('تنظیم هیجان');

    expect(buildRadarLegend(series)).toHaveLength(2);
    const table = buildRadarTable(axes, series);
    expect(table.rows[0]?.cells.s1).toBe('۷۲');
    await expectNoAxeViolations(container);
  });
});
