import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select, SelectItem } from '../Select/Select.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { FilterBar } from './FilterBar.tsx';

describe('FilterBar', () => {
  it('supports search, active filter chip removal, reset, mobile Sheet drawer, and passes axe', async () => {
    const ref = createRef<HTMLElement>();
    const onSearchChange = vi.fn();
    const onRemoveFilter = vi.fn();
    const onReset = vi.fn();

    const { container } = renderNds(
      <FilterBar
        ref={ref}
        searchValue="N25AG"
        onSearchChange={onSearchChange}
        filters={
          <Select label="وضعیت" defaultValue="active">
            <SelectItem id="active">فعال</SelectItem>
            <SelectItem id="revoked">باطل‌شده</SelectItem>
          </Select>
        }
        activeFilters={[
          { id: 'status', label: 'وضعیت', value: 'فعال' },
          { id: 'product', label: 'محصول', value: 'تست هوش ۴' },
        ]}
        onRemoveFilter={onRemoveFilter}
        onReset={onReset}
      />,
    );

    expect(ref.current?.dataset.nds).toBe('FilterBar');
    expect(screen.getByText('وضعیت: فعال')).toBeTruthy();
    expect(screen.getByText('محصول: تست هوش ۴')).toBeTruthy();

    // Remove first active chip via its remove button
    const removeButtons = screen.getAllByRole('button', { name: /^حذف/ });
    await userEvent.click(removeButtons[0]!);
    expect(onRemoveFilter).toHaveBeenCalledWith('status');

    // Reset button
    await userEvent.click(screen.getByRole('button', { name: 'پاک کردن فیلترها' }));
    expect(onReset).toHaveBeenCalledTimes(1);

    await expectNoAxeViolations(container);

    // Open mobile filter Sheet
    await userEvent.click(screen.getByRole('button', { name: /^فیلترها/ }));
    expect(screen.getByRole('dialog', { name: 'فیلتر کردن نتایج' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'اعمال فیلترها' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
