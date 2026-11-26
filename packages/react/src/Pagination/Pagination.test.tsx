import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { LoadMore, Pagination } from './Pagination.tsx';

describe('Pagination and LoadMore', () => {
  it('renders server-rendered links with Persian digits, aria-current, disabled boundaries, and passes axe', async () => {
    const ref = createRef<HTMLElement>();
    const onPageChange = vi.fn();
    const { container } = renderNds(
      <Pagination
        ref={ref}
        page={1}
        totalPages={12}
        showSummary
        getPageHref={(p) => `/serials?page=${p}`}
        onPageChange={onPageChange}
      />,
    );

    expect(ref.current?.tagName).toBe('NAV');
    expect(ref.current?.getAttribute('aria-label')).toBe('صفحه‌بندی');
    expect(screen.getByRole('button', { name: 'صفحهٔ قبل' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'صفحهٔ ۱' }).getAttribute('aria-current')).toBe(
      'page',
    );
    const page2 = screen.getByRole('link', { name: 'صفحهٔ ۲' });
    expect(page2.getAttribute('href')).toBe('/serials?page=2');
    expect(screen.getByRole('link', { name: 'صفحهٔ ۱۲' }).textContent).toBe('۱۲');

    await userEvent.click(page2);
    expect(onPageChange).toHaveBeenCalledWith(2);

    await expectNoAxeViolations(container);
  });

  it('renders LoadMore with Persian counts, live status, and triggers onLoadMore', async () => {
    const onLoadMore = vi.fn();
    const { container, rerender } = renderNds(
      <LoadMore loaded={20} total={64} onLoadMore={onLoadMore} />,
    );

    expect(screen.getByText('نمایش ۲۰ از ۶۴ مورد')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'نمایش موارد بیشتر' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);

    rerender(<LoadMore loaded={64} total={64} onLoadMore={onLoadMore} />);
    expect(screen.queryByRole('button', { name: 'نمایش موارد بیشتر' })).toBeNull();
  });
});
