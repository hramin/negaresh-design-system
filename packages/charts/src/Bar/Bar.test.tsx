import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderCharts } from '../test/render.tsx';
import { Bar, buildBarLegend, buildBarTable } from './Bar.tsx';

const categories = [
  { id: 'c1', label: 'فروردین' },
  { id: 'c2', label: 'اردیبهشت' },
  { id: 'c3', label: 'خرداد' },
];

describe('Bar', () => {
  it('renders vertical bars with direct Persian value labels and arrow keyboard navigation', async () => {
    const user = userEvent.setup();
    const { container } = renderCharts(
      <Bar
        ariaLabel="فروش فصلی"
        categories={categories}
        series={[{ id: 'sales', label: 'تعداد فعال‌سازی', values: [120, 185, 160] }]}
        referenceLines={[{ value: 150, label: 'هدف ۱۵۰' }]}
      />,
    );

    expect(container.querySelector('[data-nds="Bar"]')).toBeTruthy();
    expect(screen.getByText('۱۸۵')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    buttons[0]!.focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('status').textContent).toContain('اردیبهشت');
    await expectNoAxeViolations(container);
  });

  it('renders horizontal multi-series bars with SVG greyscale patterns and passes axe', async () => {
    const multiSeries = [
      { id: 's1', label: '۱۴۰۴', values: [42, 64, 58] },
      { id: 's2', label: '۱۴۰۵', values: [55, 72, 69] },
    ];
    const { container } = renderCharts(
      <Bar
        ariaLabel="مقایسهٔ دو سال"
        orientation="horizontal"
        categories={categories}
        series={multiSeries}
      />,
    );

    expect(container.querySelectorAll('defs pattern')).toHaveLength(2);
    expect(buildBarLegend(multiSeries)).toHaveLength(2);
    const table = buildBarTable(categories, multiSeries);
    expect(table.rows[1]?.cells.s2).toBe('۷۲');
    await expectNoAxeViolations(container);
  });
});
