import { iconKey, iconSettings, iconShield, iconUsers } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { SideNav, type SideNavGroupData, SideNavGroup, SideNavItem } from './SideNav.tsx';

const GROUPS: SideNavGroupData[] = [
  {
    id: 'account',
    title: 'حساب من',
    items: [
      { id: 'activations', label: 'فعال‌سازی‌ها', href: '#activations', icon: iconKey, isCurrent: true, badge: 4 },
      { id: 'security', label: 'امنیت', href: '#security', icon: iconShield },
    ],
  },
  {
    id: 'admin',
    title: 'مدیریت',
    roles: ['admin'],
    items: [
      { id: 'users', label: 'کاربران', href: '#users', icon: iconUsers, badge: 120 },
      { id: 'settings', label: 'تنظیمات سامانه', href: '#settings', icon: iconSettings },
    ],
  },
];

describe('SideNav', () => {
  it('filters groups and items by userRoles, formats badges in Persian, renders mobile TabStrip, and passes axe', async () => {
    const ref = createRef<HTMLElement>();
    const { container, rerender } = renderNds(
      <SideNav ref={ref} aria-label="ناوبری پنل" groups={GROUPS} userRoles={['customer']} />,
    );

    expect(ref.current?.tagName).toBe('NAV');
    expect(ref.current?.dataset.nds).toBe('SideNav');
    expect(screen.getAllByRole('link', { name: /فعال‌سازی‌ها/ })[0]?.getAttribute('aria-current')).toBe(
      'page',
    );
    expect(screen.getAllByText('۴').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('کاربران')).toBeNull();
    expect(screen.queryByText('مدیریت')).toBeNull();
    expect(container.querySelector('[data-nds="TabStrip"]')).toBeTruthy();

    await expectNoAxeViolations(container);

    rerender(
      <SideNav ref={ref} aria-label="ناوبری پنل" groups={GROUPS} userRoles={['customer', 'admin']} />,
    );
    expect(screen.getAllByText('کاربران').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('۱۲۰').length).toBeGreaterThanOrEqual(1);
  });

  it('supports composable SideNavGroup with collapsible disclosure and role filtering', async () => {
    const { container } = renderNds(
      <SideNav aria-label="ناوبری ترکیبی" userRoles={['editor']} adaptToTabStrip={false}>
        <SideNavGroup title="محتوا" isCollapsible defaultExpanded>
          <SideNavItem href="#posts" isCurrent>
            نوشته‌ها
          </SideNavItem>
          <SideNavItem href="#audit" roles={['admin']}>
            گزارش ممیزی
          </SideNavItem>
        </SideNavGroup>
      </SideNav>,
    );

    expect(screen.getByRole('link', { name: 'نوشته‌ها' })).toBeTruthy();
    expect(screen.queryByText('گزارش ممیزی')).toBeNull();

    const toggle = screen.getByRole('button', { name: 'محتوا' });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    await expectNoAxeViolations(container);
  });
});
