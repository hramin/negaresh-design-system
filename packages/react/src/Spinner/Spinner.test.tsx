import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { GlobalLoadingBar, Spinner } from './Spinner.tsx';

describe('Spinner and GlobalLoadingBar', () => {
  it('renders Spinner with status announcement or decorative mode and passes axe', async () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = renderNds(
      <>
        <Spinner ref={ref} size="md" />
        <Spinner size="sm" tone="muted" label="بارگذاری فهرست" />
        <Spinner size="lg" tone="current" decorative />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Spinner');
    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(2);
    expect(screen.getByText('در حال بارگذاری…')).toBeTruthy();
    expect(screen.getByText('بارگذاری فهرست')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('renders GlobalLoadingBar only when loading and supports determinate/indeterminate modes', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container, rerender } = renderNds(
      <>
        <GlobalLoadingBar ref={ref} isLoading position="static" />
        <GlobalLoadingBar isLoading value={55} position="static" label="انتقال صفحه" />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('GlobalLoadingBar');
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(2);
    expect(bars[0]?.getAttribute('aria-label')).toBe('در حال بارگذاری صفحه');
    expect(bars[0]?.getAttribute('aria-valuenow')).toBeNull();
    expect(bars[1]?.getAttribute('aria-valuenow')).toBe('55');
    await expectNoAxeViolations(container);

    rerender(<GlobalLoadingBar isLoading={false} />);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
