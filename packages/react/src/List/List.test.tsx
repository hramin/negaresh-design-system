import { iconLaptop, iconTrash } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { Code } from '../Ltr/Ltr.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { GridList, GridListItem, List, ListItem } from './List.tsx';

describe('List and GridList', () => {
  it('supports multiple selection, keyboard navigation, trailing actions, and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const onSelectionChange = vi.fn();
    const onRemove = vi.fn();

    const { container } = renderNds(
      <GridList
        ref={ref}
        aria-label="رایانه‌های فعال"
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      >
        <GridListItem
          id="pc-1"
          title="رایانهٔ اتاق مشاوره ۱"
          description="ویندوز ۱۱ · فعال‌شده در ۲۲ آبان ۱۴۰۵"
          leading={<Icon icon={iconLaptop} size="sm" />}
          meta={<Code>882859354</Code>}
          actions={
            <IconButton
              icon={iconTrash}
              variant="ghost"
              size="sm"
              aria-label="حذف رایانهٔ ۱"
              onPress={onRemove}
            />
          }
        />
        <GridListItem
          id="pc-2"
          title="رایانهٔ پذیرش"
          description="ویندوز ۱۰ · فعال‌شده در ۱۵ آبان ۱۴۰۵"
          leading={<Icon icon={iconLaptop} size="sm" />}
          meta={<Code>419022108</Code>}
        />
      </GridList>,
    );

    expect(ref.current?.dataset.nds).toBe('GridList');
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);

    await userEvent.click(checkboxes[0]!);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'حذف رایانهٔ ۱' }));
    expect(onRemove).toHaveBeenCalledTimes(1);

    await expectNoAxeViolations(container);
  });

  it('supports List alias, empty state, and loading skeleton', async () => {
    const { container, rerender } = renderNds(
      <List aria-label="فهرست ساده">
        <ListItem id="a" title="مورد اول" />
      </List>,
    );

    expect(screen.getByText('مورد اول')).toBeTruthy();
    await expectNoAxeViolations(container);

    rerender(
      <List aria-label="فهرست خالی" items={[]}>
        {() => null}
      </List>,
    );
    expect(screen.getByText('موردی ثبت نشده است')).toBeTruthy();

    rerender(
      <List aria-label="در حال بارگذاری" isLoading>
        {null}
      </List>,
    );
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
  });
});
