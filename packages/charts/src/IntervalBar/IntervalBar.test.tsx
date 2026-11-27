import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderCharts } from '../test/render.tsx';
import { buildIntervalBarTable, IntervalBar, type IntervalBarItem } from './IntervalBar.tsx';

const items: IntervalBarItem[] = [
  { id: 'anx', label: 'اضطراب', value: 64, low: 59, high: 69, severity: 'caution' },
  { id: 'dep', label: 'خلق و انرژی', value: 52, low: 47, high: 57, severity: 'ok' },
  { id: 'som', label: 'تنش بدنی', value: 73, low: 68, high: 78, severity: 'severe' },
];

describe('IntervalBar', () => {
  it('renders Persian numbers, bands, reference lines, and keyboard-focusable markers', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = renderCharts(
      <IntervalBar
        ariaLabel="نمودار بازه‌ای نمرات"
        items={items}
        domain={[30, 85]}
        ticks={[30, 50, 65, 80]}
        bands={[{ from: 40, to: 60, tone: 'band', label: 'هنجار' }]}
        referenceLines={[
          { value: 50, label: '۵۰' },
          { value: 65, label: '۶۵', tone: 'warning' },
        ]}
        onSelectItem={onSelect}
      />,
    );

    expect(container.querySelector('[data-nds="IntervalBar"]')).toBeTruthy();
    expect(screen.getByText('۶۴')).toBeTruthy();
    expect(screen.getByText('نیازمند توجه')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    buttons[0]!.focus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith(items[1]);
    await expectNoAxeViolations(container);
  });

  it('uses calm phrasing and zero severe/danger badge tones in calm mode', async () => {
    const { container } = renderCharts(
      <IntervalBar ariaLabel="نمای آرام" items={items} domain={[30, 85]} mode="calm" />,
    );
    expect(screen.getByText('قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود')).toBeTruthy();
    expect(container.querySelector('[data-tone="severe"]')).toBeNull();
    await expectNoAxeViolations(container);
  });

  it('builds an accessible table structure with Persian digits', () => {
    const table = buildIntervalBarTable(items);
    expect(table.columns).toHaveLength(4);
    expect(table.rows[0]?.cells.value).toBe('۶۴');
    expect(table.rows[0]?.cells.interval).toBe('۵۹ تا ۶۹');
  });
});
