import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderCharts } from '../test/render.tsx';
import { buildProfileLineLegend, buildProfileLineTable, ProfileLine } from './ProfileLine.tsx';

const categories = [
  { id: 'L', label: 'دروغ‌سنجی', shortLabel: 'L' },
  { id: 'F', label: 'بسآمد پایین', shortLabel: 'F' },
  { id: 'D', label: 'افسردگی', shortLabel: 'D' },
  { id: 'Pt', label: 'اضطراب', shortLabel: 'Pt' },
];

const series = [
  { id: 't1', label: 'ارزیابی اول', values: [48, 54, 68, 63] },
  { id: 't2', label: 'پیگیری', values: [50, 51, 58, 55] },
];

describe('ProfileLine', () => {
  it('renders SVG paths, reference lines, section dividers, non-diamond markers, and arrow navigation', async () => {
    const user = userEvent.setup();
    const { container } = renderCharts(
      <ProfileLine
        ariaLabel="نیمرخ مقیاس‌های MMPI"
        categories={categories}
        series={series}
        domain={[30, 85]}
        ticks={[30, 50, 65, 70, 85]}
        bands={[{ from: 40, to: 60, label: 'بازهٔ هنجار' }]}
        referenceLines={[
          { value: 50, label: '۵۰' },
          { value: 65, label: '۶۵', tone: 'warning' },
          { value: 70, label: '۷۰', tone: 'danger' },
        ]}
        dividers={[{ afterCategoryId: 'F', label: 'مقیاس‌های بالینی' }]}
      />,
    );

    expect(container.querySelector('[data-nds="ProfileLine"]')).toBeTruthy();
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('[data-nds-slot="divider"]')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(8);
    buttons[0]!.focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('status').textContent).toContain('بسآمد پایین');

    const legend = buildProfileLineLegend(series);
    expect(legend[0]?.shape).toBe('circle');
    expect(legend[1]?.shape).toBe('square');
    const table = buildProfileLineTable(categories, series);
    expect(table.rows[2]?.cells.t1).toBe('۶۸');

    await expectNoAxeViolations(container);
  });
});
