import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Link } from '../Link/Link.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { ContextualHelp } from './ContextualHelp.tsx';

describe('ContextualHelp', () => {
  it('renders localized trigger, opens popover with heading and link, passes axe, and restores focus on Escape', async () => {
    const triggerRef = createRef<HTMLButtonElement>();
    renderNds(
      <ContextualHelp
        ref={triggerRef}
        title="کد سیستم چیست؟"
        footer={<Link href="#help-guide">راهنمای دریافت کد سیستم</Link>}
      >
        کد سیستم در پنجرهٔ فعال‌سازی نرم‌افزار ویندوزی نمایش داده می‌شود.
      </ContextualHelp>,
    );

    const trigger = screen.getByRole('button', { name: 'راهنما' });
    expect(trigger).toBe(triggerRef.current);
    expect(trigger.dataset.nds).toBe('ContextualHelp');
    expect(trigger.dataset.variant).toBe('info');

    await userEvent.tab();
    expect(document.activeElement).toBe(trigger);
    await userEvent.keyboard('{Enter}');

    const dialog = await screen.findByRole('dialog', { name: 'کد سیستم چیست؟' });
    expect(dialog).toBeTruthy();
    expect(screen.getByRole('link', { name: 'راهنمای دریافت کد سیستم' })).toBeTruthy();

    await expectNoAxeViolations(document.body);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  });

  it('supports help variant and custom aria-label', async () => {
    renderNds(
      <ContextualHelp variant="help" aria-label="راهنمای شمارهٔ پروانه">
        شمارهٔ پروانهٔ سازمان نظام روان‌شناسی در صفحهٔ پروفایل درج می‌شود.
      </ContextualHelp>,
    );

    const trigger = screen.getByRole('button', { name: 'راهنمای شمارهٔ پروانه' });
    expect(trigger.dataset.variant).toBe('help');
    await userEvent.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'راهنمای شمارهٔ پروانه' })).toBeTruthy();
    await expectNoAxeViolations(document.body);
  });
});
