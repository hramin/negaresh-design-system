import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Code } from '../Ltr/Ltr.tsx';
import { StatusBadge } from '../StatusBadge/StatusBadge.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { ActivityList, Timeline } from './Timeline.tsx';

describe('Timeline and ActivityList', () => {
  it('renders chronological Timeline with Jalali Tehran timestamps, tones, metadata, and passes axe', async () => {
    const ref = createRef<HTMLOListElement>();
    const { container } = renderNds(
      <Timeline
        ref={ref}
        aria-label="تاریخچهٔ سریال"
        items={[
          {
            id: 'e1',
            title: 'فعال‌سازی موفق روی رایانهٔ کلینیک',
            description: 'کد فعال‌سازی ساخته شد و یک ظرفیت مصرف شد.',
            timestamp: '2026-11-13T13:34:00Z',
            tone: 'success',
            actor: 'سامانهٔ خودکار',
            badge: <StatusBadge domain="serial" status="active" size="sm" />,
            meta: <Code>882859354</Code>,
          },
          {
            id: 'e2',
            title: 'افزایش سقف فعال‌سازی',
            timestamp: '2026-11-10T09:15:00Z',
            tone: 'info',
            actor: 'سارا رضایی (مدیر)',
          },
        ]}
      />,
    );

    expect(ref.current?.tagName).toBe('OL');
    expect(ref.current?.dataset.nds).toBe('Timeline');
    expect(screen.getByText('فعال‌سازی موفق روی رایانهٔ کلینیک')).toBeTruthy();
    expect(screen.getByText('882859354')).toBeTruthy();
    expect(container.querySelectorAll('time').length).toBe(2);
    expect(container.textContent).toContain('آبان ۱۴۰۵');

    await expectNoAxeViolations(container);
  });

  it('supports ActivityList keyboard navigation, row action, empty state, and loading state', async () => {
    const onAction = vi.fn();
    const { container, rerender } = renderNds(
      <ActivityList
        aria-label="گزارش ممیزی"
        onAction={onAction}
        items={[
          {
            id: 'rev-1',
            title: 'ویرایش سقف به ۳ دستگاه',
            timestamp: '2026-11-14T10:00:00Z',
            tone: 'warning',
          },
          {
            id: 'rev-2',
            title: 'ایجاد سریال در دستهٔ آبان',
            timestamp: '2026-11-01T08:00:00Z',
            tone: 'neutral',
          },
        ]}
      />,
    );

    const grid = screen.getByRole('grid', { name: 'گزارش ممیزی' });
    expect(grid.dataset.nds).toBe('ActivityList');

    const rows = screen.getAllByRole('row');
    await userEvent.click(rows[0]!);
    expect(onAction).toHaveBeenCalledWith('rev-1');

    await expectNoAxeViolations(container);

    rerender(<ActivityList aria-label="گزارش ممیزی" items={[]} />);
    expect(screen.getByText('رویدادی ثبت نشده است')).toBeTruthy();

    rerender(<ActivityList aria-label="گزارش ممیزی" isLoading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
  });
});
