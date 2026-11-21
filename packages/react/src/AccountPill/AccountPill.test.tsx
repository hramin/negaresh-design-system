import { maskPhone } from '@negaresh/utils';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Menu, MenuItem, MenuTrigger } from '../Menu/Menu.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { AccountPill } from './AccountPill.tsx';

describe('AccountPill', () => {
  it('renders masked LTR label, avatar, forwards ref and fires onPress with no axe violations', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onPress = vi.fn();
    const phone = maskPhone('09121234567');

    const { container } = renderNds(
      <AccountPill
        ref={ref}
        label={phone}
        ltr
        aria-label={`حساب کاربری ${phone}`}
        onPress={onPress}
      />,
    );

    const button = screen.getByRole('button', { name: `حساب کاربری ${phone}` });
    expect(button).toBe(ref.current);
    expect(button.dataset.nds).toBe('AccountPill');
    const ltrEl = button.querySelector('[data-nds="Ltr"]');
    expect(ltrEl?.getAttribute('dir')).toBe('ltr');
    expect(ltrEl?.textContent).toBe(phone);

    await userEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });

  it('supports custom avatar, Persian label without LTR wrapper and disabled state', async () => {
    const onPress = vi.fn();
    renderNds(
      <AccountPill
        label="سارا محمدی"
        avatar="سم"
        aria-label="حساب کاربری سارا محمدی"
        isDisabled
        onPress={onPress}
      />,
    );

    const button = screen.getByRole('button', { name: 'حساب کاربری سارا محمدی' });
    expect(button.querySelector('[data-nds="Ltr"]')).toBeNull();
    expect(button.textContent).toContain('سارا محمدی');
    expect(button.textContent).toContain('سم');
    expect(button.hasAttribute('disabled')).toBe(true);
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('works as a MenuTrigger button with keyboard open/close and Persian dismiss label', async () => {
    const onAction = vi.fn();
    const phone = maskPhone('09121234567');
    renderNds(
      <MenuTrigger>
        <AccountPill label={phone} ltr aria-label={`حساب کاربری ${phone}`} />
        <Menu placement="bottom end" onAction={onAction}>
          <MenuItem id="activations">فعال‌سازی‌های من</MenuItem>
          <MenuItem id="signout">خروج</MenuItem>
        </Menu>
      </MenuTrigger>,
    );

    const trigger = screen.getByRole('button', { name: `حساب کاربری ${phone}` });
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    trigger.focus();
    await userEvent.keyboard('{Enter}');

    const menu = screen.getByRole('menu', { name: `حساب کاربری ${phone}` });
    expect(within(menu).getByRole('menuitem', { name: 'فعال‌سازی‌های من' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'بستن' }).length).toBeGreaterThan(0);
    await expectNoAxeViolations(menu);

    await userEvent.click(within(menu).getByRole('menuitem', { name: 'خروج' }));
    expect(onAction.mock.calls[0]?.[0]).toBe('signout');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
