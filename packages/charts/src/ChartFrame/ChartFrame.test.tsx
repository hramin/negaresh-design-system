import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Band, ReferenceLine } from '../primitives/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderCharts } from '../test/render.tsx';
import { ChartFrame } from './ChartFrame.tsx';

const sampleTable = {
  caption: 'نمرات مقیاس‌ها',
  columns: [
    { key: 'scale', label: 'مقیاس' },
    { key: 'score', label: 'نمره', align: 'numeric' as const },
  ],
  rows: [
    { id: 'r1', cells: { scale: 'اضطراب', score: '۶۲' } },
    { id: 'r2', cells: { scale: 'افسردگی', score: '۵۴' } },
  ],
};

describe('ChartFrame, ReferenceLine, and Band', () => {
  it('renders title, takeaway, legend, sourceNote, and native JS-free data table disclosure', async () => {
    const user = userEvent.setup();
    const { container } = renderCharts(
      <ChartFrame
        title="نیمرخ مقیاس‌های اصلی"
        takeaway="مقیاس اضطراب اندکی بالاتر از بازهٔ هنجار قرار دارد."
        sourceNote="هنجار نوجوانان ایران (میانگین ۵۰)"
        legend={[
          { id: 's1', label: 'آزمون اول', toneIndex: 1, shape: 'circle' },
          { id: 's2', label: 'پیگیری', toneIndex: 2, dashArray: '6 3', shape: 'square' },
        ]}
        table={sampleTable}
      >
        <svg viewBox="0 0 320 120" role="img" aria-label="نمونهٔ خطوط و بازه">
          <Band orientation="vertical" fromCoord={100} toCoord={220} spanStart={10} spanEnd={100} label="بازهٔ هنجار" />
          <ReferenceLine orientation="vertical" position={160} start={10} end={100} label="۵۰" />
        </svg>
      </ChartFrame>,
    );

    expect(container.querySelector('[data-nds="ChartFrame"]')).toBeTruthy();
    expect(container.querySelector('[data-nds="Band"]')).toBeTruthy();
    expect(container.querySelector('[data-nds="ReferenceLine"]')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'نیمرخ مقیاس‌های اصلی' })).toBeTruthy();
    expect(screen.getByText('مقیاس اضطراب اندکی بالاتر از بازهٔ هنجار قرار دارد.')).toBeTruthy();

    const summary = screen.getByText('جدول داده‌ها');
    await user.click(summary);
    expect(screen.getByRole('table', { name: 'نمرات مقیاس‌ها' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('prevents danger/rose tone on Band and ReferenceLine in calm mode', () => {
    const { container } = renderCharts(
      <svg viewBox="0 0 200 100" role="img" aria-label="حالت آرام">
        <Band
          orientation="vertical"
          fromCoord={20}
          toCoord={120}
          spanStart={10}
          spanEnd={90}
          tone="severe"
          mode="calm"
        />
        <ReferenceLine
          orientation="vertical"
          position={150}
          start={10}
          end={90}
          tone="danger"
          mode="calm"
        />
      </svg>,
    );
    expect(container.querySelector('[data-nds="Band"]')?.getAttribute('data-tone')).toBe('calm');
    expect(container.querySelector('[data-nds="ReferenceLine"]')?.getAttribute('data-tone')).toBe(
      'accent',
    );
  });

  it('renders loading, empty, and error states with retry callback and passes axe', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    const { container, rerender } = renderCharts(
      <ChartFrame title="نمودار آزمایشی" state="loading" />,
    );
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
    await expectNoAxeViolations(container);

    rerender(<ChartFrame title="نمودار آزمایشی" state="empty" />);
    expect(screen.getByText('داده‌ای برای نمایش وجود ندارد')).toBeTruthy();
    await expectNoAxeViolations(container);

    rerender(<ChartFrame title="نمودار آزمایشی" state="error" onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});
