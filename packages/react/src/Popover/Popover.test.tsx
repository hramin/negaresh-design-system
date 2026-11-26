import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Popover, PopoverTrigger } from './Popover.tsx';

describe('Popover', () => {
  it('opens from PopoverTrigger with optional arrow and heading, passes axe while open, and closes with Escape', async () => {
    const popoverRef = createRef<HTMLElement>();
    renderNds(
      <PopoverTrigger>
        <Button>جزئیات سهمیه</Button>
        <Popover ref={popoverRef} title="منبع سقف فعال‌سازی" showArrow placement="bottom start">
          {(close) => (
            <>
              <p>سقف این سریال از تنظیمات محصول خوانده شده است.</p>
              <Button size="sm" onPress={close}>
                متوجه شدم
              </Button>
            </>
          )}
        </Popover>
      </PopoverTrigger>,
    );

    const trigger = screen.getByRole('button', { name: 'جزئیات سهمیه' });
    await userEvent.tab();
    expect(document.activeElement).toBe(trigger);
    await userEvent.keyboard('{Enter}');

    const dialog = await screen.findByRole('dialog', { name: 'منبع سقف فعال‌سازی' });
    expect(dialog).toBeTruthy();
    expect(popoverRef.current?.dataset.nds).toBe('Popover');
    expect(document.querySelector('[data-nds="PopoverArrow"]')).toBeTruthy();

    await expectNoAxeViolations(document.body);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  });
});
