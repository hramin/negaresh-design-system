import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Meter, ProgressBar } from './Progress.tsx';

describe('ProgressBar and Meter', () => {
  it('renders determinate and indeterminate ProgressBar with Persian value text and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <ProgressBar ref={ref} label="درون‌ریزی سریال‌ها" value={64} />
        <ProgressBar label="در حال پردازش" isIndeterminate />
        <ProgressBar aria-label="پیشرفت بدون برچسب مرئی" value={100} tone="success" size="sm" />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('ProgressBar');
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(3);
    expect(bars[0]?.getAttribute('aria-valuenow')).toBe('64');
    expect(bars[0]?.getAttribute('aria-valuetext')).toContain('۶۴');
    expect(bars[1]?.getAttribute('aria-valuenow')).toBeNull();
    await expectNoAxeViolations(container);
  });

  it('renders Meter with role=meter, Persian percentage, custom valueLabel, and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <Meter ref={ref} label="فضای ذخیره‌سازی" value={75} tone="warning" />
        <Meter label="ظرفیت کارزار" value={30} maxValue={50} valueLabel="۳۰ از ۵۰" />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Meter');
    const meters = screen.getAllByRole('meter');
    expect(meters).toHaveLength(2);
    expect(meters[0]?.getAttribute('aria-valuenow')).toBe('75');
    expect(meters[1]?.getAttribute('aria-valuetext')).toBe('۳۰ از ۵۰');
    await expectNoAxeViolations(container);
  });
});
