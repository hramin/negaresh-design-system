import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Code } from '../Ltr/Ltr.tsx';
import { StatusBadge } from '../StatusBadge/StatusBadge.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { DataTable, type DataTableColumn } from './DataTable.tsx';

interface SampleSerial {
  id: string;
  serial: string;
  product: string;
  used: number;
  status: 'active' | 'revoked';
}

const ROWS: SampleSerial[] = [
  { id: 's1', serial: 'N25AG-EMV0K', product: 'تست هوش ۴', used: 2, status: 'active' },
  { id: 's2', serial: 'N25BG-9K1LP', product: 'بستهٔ بالینی', used: 5, status: 'revoked' },
];

const COLUMNS: DataTableColumn<SampleSerial>[] = [
  {
    id: 'serial',
    header: 'شمارهٔ سریال',
    isRowHeader: true,
    hideable: false,
    allowsSorting: true,
    sortValue: (r) => r.serial,
    cell: (r) => <Code>{r.serial}</Code>,
  },
  {
    id: 'product',
    header: 'محصول',
    allowsSorting: true,
    sortValue: (r) => r.product,
    cell: (r) => r.product,
  },
  {
    id: 'used',
    header: 'فعال‌سازی',
    allowsSorting: true,
    sortValue: (r) => r.used,
    cell: (r) => r.used,
  },
  {
    id: 'status',
    header: 'وضعیت',
    cell: (r) => <StatusBadge domain="serial" status={r.status} size="sm" />,
  },
];

describe('DataTable', () => {
  it('supports sorting, multiple selection, column visibility toggle, density toggle, and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const onSelectionChange = vi.fn();

    const { container } = renderNds(
      <DataTable
        ref={ref}
        aria-label="فهرست سریال‌ها"
        columns={COLUMNS}
        rows={ROWS}
        getRowKey={(r) => r.id}
        getRowTextValue={(r) => r.serial}
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
        enableColumnVisibility
        showDensityToggle
        stickyHeader
      />,
    );

    expect(ref.current?.dataset.nds).toBe('DataTable');
    expect(ref.current?.dataset.density).toBe('comfortable');

    // Sort by used column
    const usedHeader = screen.getByRole('columnheader', { name: 'فعال‌سازی' });
    await userEvent.click(usedHeader);
    expect(usedHeader.getAttribute('aria-sort')).toBe('ascending');
    await userEvent.click(usedHeader);
    expect(usedHeader.getAttribute('aria-sort')).toBe('descending');

    // Select first row
    const firstRowCheckbox = screen.getByRole('checkbox', { name: 'انتخاب N25AG-EMV0K' });
    await userEvent.click(firstRowCheckbox);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);

    // Toggle density
    await userEvent.click(screen.getByRole('radio', { name: 'فشرده' }));
    expect(ref.current?.dataset.density).toBe('compact');

    // Toggle column visibility
    await userEvent.click(screen.getByRole('button', { name: 'ستون‌ها' }));
    const menu = screen.getByRole('menu');
    await userEvent.click(within(menu).getByRole('menuitemcheckbox', { name: 'محصول' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('columnheader', { name: 'محصول' })).toBeNull();

    await expectNoAxeViolations(container);
  });

  it('composes Wave 1 Skeleton, EmptyState, and ErrorState cleanly', async () => {
    const onRetry = vi.fn();
    const { container, rerender } = renderNds(
      <DataTable
        aria-label="جدول در حال بارگذاری"
        columns={COLUMNS}
        rows={[]}
        getRowKey={(r) => r.id}
        isLoading
      />,
    );

    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
    expect(container.querySelector('[data-nds="Skeleton"]')).toBeTruthy();
    await expectNoAxeViolations(container);

    rerender(
      <DataTable
        aria-label="جدول خالی"
        columns={COLUMNS}
        rows={[]}
        getRowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText('موردی برای نمایش وجود ندارد')).toBeTruthy();
    await expectNoAxeViolations(container);

    rerender(
      <DataTable
        aria-label="جدول با خطا"
        columns={COLUMNS}
        rows={[]}
        getRowKey={(r) => r.id}
        error
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText('خطا در دریافت داده‌ها')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});
