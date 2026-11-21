import { iconEdit, iconTrash, iconUser } from '@negaresh/icons';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import {
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
} from './Menu.tsx';

function AccountMenu({ onAction }: { onAction: (key: unknown) => void }) {
  return (
    <MenuTrigger>
      <Button iconStart={iconUser}>حساب</Button>
      <Menu aria-label="حساب کاربری" onAction={onAction}>
        <MenuSection title="حساب">
          <MenuItem id="profile" icon={iconEdit} description="نام و شماره" shortcut="Ctrl+P">
            ویرایش نمایه
          </MenuItem>
          <SubmenuTrigger>
            <MenuItem id="theme">حالت نمایش</MenuItem>
            <Menu aria-label="حالت نمایش" selectionMode="single" defaultSelectedKeys={['dark']}>
              <MenuItem id="light">روشن</MenuItem>
              <MenuItem id="dark">تیره</MenuItem>
            </Menu>
          </SubmenuTrigger>
        </MenuSection>
        <MenuSeparator />
        <MenuItem id="signout" icon={iconTrash} tone="danger" textValue="خروج">
          <span>خروج</span>
        </MenuItem>
        <MenuItem id="disabled" isDisabled>
          غیرفعال
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

describe('Menu', () => {
  it('opens from the trigger, runs actions and closes', async () => {
    const onAction = vi.fn();
    renderNds(<AccountMenu onAction={onAction} />);
    const trigger = screen.getByRole('button', { name: 'حساب' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    await userEvent.click(trigger);
    const menu = screen.getByRole('menu', { name: 'حساب' });
    expect(within(menu).getByText('حساب').tagName).toBeTruthy();
    const profile = within(menu).getByRole('menuitem', { name: /ویرایش نمایه/ });
    expect(profile.textContent).toContain('Ctrl+P');
    expect(
      within(menu).getByRole('menuitem', { name: 'غیرفعال' }).getAttribute('aria-disabled'),
    ).toBe('true');
    expect(within(menu).getByRole('menuitem', { name: 'خروج' }).dataset.tone).toBe('danger');
    expect(within(menu).getByRole('separator')).toBeTruthy();
    await userEvent.click(profile);
    expect(onAction.mock.calls[0]?.[0]).toBe('profile');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens with the keyboard and shows selection in a submenu', async () => {
    renderNds(<AccountMenu onAction={() => {}} />);
    screen.getByRole('button', { name: 'حساب' }).focus();
    await userEvent.keyboard('{Enter}');
    const menu = screen.getByRole('menu', { name: 'حساب' });
    await expectNoAxeViolations(menu);
    const theme = within(menu).getByRole('menuitem', { name: 'حالت نمایش' });
    expect(theme.getAttribute('aria-haspopup')).toBe('menu');
    await userEvent.click(theme);
    const sub = await screen.findByRole('menu', { name: 'حالت نمایش' });
    const dark = within(sub).getByRole('menuitemradio', { name: 'تیره' });
    expect(dark.getAttribute('aria-checked')).toBe('true');
    expect(dark.querySelector('svg')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
  });

  it('localizes React Aria popover dismiss and long-press labels to Persian with no axe violations', async () => {
    renderNds(
      <MenuTrigger trigger="longPress">
        <Button iconStart={iconUser}>حساب</Button>
        <Menu aria-label="حساب کاربری">
          <MenuItem id="profile">ویرایش نمایه</MenuItem>
        </Menu>
      </MenuTrigger>,
    );
    const trigger = screen.getByRole('button', { name: 'حساب' });
    const descriptionId = trigger.getAttribute('aria-describedby');
    expect(descriptionId).toBeTruthy();
    const descriptionEl = descriptionId ? document.getElementById(descriptionId) : null;
    expect(descriptionEl?.textContent).toContain('برای باز کردن منو');
    expect(descriptionEl?.textContent).not.toContain('Long press');

    trigger.focus();
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    const menu = screen.getByRole('menu', { name: 'حساب' });
    const popover = menu.closest('[data-nds="MenuPopover"]');
    expect(popover).toBeTruthy();

    const dismissButtons = screen.getAllByRole('button', { name: 'بستن' });
    expect(dismissButtons.length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
    if (popover instanceof HTMLElement) {
      await expectNoAxeViolations(popover);
    }

    await userEvent.click(dismissButtons[0]!);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
