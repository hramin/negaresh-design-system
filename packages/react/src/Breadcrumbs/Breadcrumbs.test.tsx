import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs.tsx';

describe('Breadcrumbs', () => {
  it('renders a nav landmark with aria-current on the last item and mirrored RTL separators', async () => {
    const ref = createRef<HTMLElement>();
    const { container } = renderNds(
      <Breadcrumbs ref={ref}>
        <BreadcrumbItem id="home" href="/">
          خانه
        </BreadcrumbItem>
        <BreadcrumbItem id="tests" href="/tests">
          آزمون‌ها
        </BreadcrumbItem>
        <BreadcrumbItem id="neo">آزمون شخصیت نئو</BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(ref.current?.tagName).toBe('NAV');
    expect(ref.current?.getAttribute('aria-label')).toBe('مسیر راهنما');
    expect(screen.getByText('آزمون شخصیت نئو').closest('[aria-current="page"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-mirrored="true"]').length).toBeGreaterThanOrEqual(2);

    await expectNoAxeViolations(container);
  });

  it('collapses middle items into an accessible menu when exceeding maxItems', async () => {
    const onAction = vi.fn();
    const { container } = renderNds(
      <Breadcrumbs
        maxItems={3}
        onAction={onAction}
        items={[
          { id: 'home', label: 'خانه', href: '/' },
          { id: 'catalog', label: 'فهرست آزمون‌ها', href: '/tests' },
          { id: 'personality', label: 'آزمون‌های شخصیت', href: '/tests/personality' },
          { id: 'clinical', label: 'بالینی', href: '/tests/personality/clinical' },
          { id: 'neo', label: 'نئو فرم بلند' },
        ]}
      />,
    );

    expect(screen.getByText('خانه')).toBeTruthy();
    expect(screen.getByText('بالینی')).toBeTruthy();
    expect(screen.getByText('نئو فرم بلند')).toBeTruthy();
    expect(screen.queryByText('آزمون‌های شخصیت')).toBeNull();

    const expandBtn = screen.getByRole('button', { name: 'نمایش مسیرهای میانی' });
    await userEvent.click(expandBtn);
    const menuItem = await screen.findByRole('menuitem', { name: 'آزمون‌های شخصیت' });
    await userEvent.click(menuItem);
    expect(onAction).toHaveBeenCalledWith('personality');

    await expectNoAxeViolations(container);
  });
});
