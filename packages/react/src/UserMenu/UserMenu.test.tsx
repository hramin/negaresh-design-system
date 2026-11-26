import { iconKey, iconSettings } from '@negaresh/icons';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { UserMenu } from './UserMenu.tsx';

describe('UserMenu', () => {
  it('composes AccountPill + Menu + Avatar, switches roles and theme, fires signOut, and passes axe', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onRoleChange = vi.fn();
    const onSignOut = vi.fn();

    renderNds(
      <UserMenu
        ref={ref}
        label="۰۹۱۲ ••• ۴۵۶۷"
        ltr
        aria-label="حساب کاربری ۰۹۱۲ ••• ۴۵۶۷"
        name="سارا رضایی"
        subtitle="۰۹۱۲ ••• ۴۵۶۷"
        ltrSubtitle
        showInitialsAvatar
        showThemeToggle
        activeRole="customer"
        onRoleChange={onRoleChange}
        onSignOut={onSignOut}
        roles={[
          { id: 'customer', label: 'مشتری' },
          { id: 'admin', label: 'مدیر سامانه' },
        ]}
        items={[
          { id: 'activations', label: 'فعال‌سازی‌های من', icon: iconKey },
          { id: 'admin-panel', label: 'پنل مدیریت', icon: iconSettings, roles: ['admin'] },
        ]}
      />,
    );

    expect(ref.current?.dataset.nds).toBe('AccountPill');
    await userEvent.click(ref.current!);

    expect(await screen.findByRole('menu')).toBeTruthy();
    expect(screen.getByText('سارا رضایی')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'فعال‌سازی‌های من' })).toBeTruthy();
    expect(screen.queryByRole('menuitem', { name: 'پنل مدیریت' })).toBeNull();

    await expectNoAxeViolations(document.body);

    // Switch theme to dark
    await userEvent.click(screen.getByRole('menuitemradio', { name: 'تیره' }));
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    // Reopen and switch role
    await userEvent.click(ref.current!);
    await userEvent.click(await screen.findByRole('menuitemradio', { name: 'مدیر سامانه' }));
    expect(onRoleChange).toHaveBeenCalledWith('admin');

    // Reopen and sign out
    await userEvent.click(ref.current!);
    await userEvent.click(await screen.findByRole('menuitem', { name: 'خروج از حساب' }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
