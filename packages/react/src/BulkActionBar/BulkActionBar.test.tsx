import { iconDownload, iconTrash } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { BulkActionBar } from './BulkActionBar.tsx';

describe('BulkActionBar', () => {
  it('hides when selectedCount is 0 unless alwaysVisible is true', () => {
    const { container } = renderNds(<BulkActionBar selectedCount={0} />);
    expect(container.querySelector('[data-nds="BulkActionBar"]')).toBeNull();
  });

  it('renders React Aria Toolbar with Persian count, actions, select-all, clear-selection, and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const onClear = vi.fn();
    const onSelectAll = vi.fn();
    const onRevoke = vi.fn();

    const { container } = renderNds(
      <BulkActionBar
        ref={ref}
        selectedCount={3}
        totalCount={12}
        onSelectAll={onSelectAll}
        onClearSelection={onClear}
      >
        <Button variant="secondary" size="sm" iconStart={iconDownload}>
          خروجی CSV
        </Button>
        <Button variant="danger" size="sm" iconStart={iconTrash} onPress={onRevoke}>
          ابطال انتخاب‌شده‌ها
        </Button>
      </BulkActionBar>,
    );

    const toolbar = screen.getByRole('toolbar', { name: 'اقدام‌های گروهی' });
    expect(toolbar).toBe(ref.current);
    expect(screen.getByRole('status').textContent).toContain('۳ مورد انتخاب‌شده');

    await userEvent.click(screen.getByRole('button', { name: 'انتخاب همه' }));
    expect(onSelectAll).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'ابطال انتخاب‌شده‌ها' }));
    expect(onRevoke).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'لغو انتخاب' }));
    expect(onClear).toHaveBeenCalledTimes(1);

    await expectNoAxeViolations(container);
  });
});
