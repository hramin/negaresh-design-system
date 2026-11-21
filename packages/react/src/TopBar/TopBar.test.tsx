import { iconMenu, iconMoon } from '@negaresh/icons';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AccountPill } from '../AccountPill/AccountPill.tsx';
import { IconButton } from '../Button/Button.tsx';
import { LogoSlot } from '../LogoSlot/LogoSlot.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { TopBar, TopBarBrand, TopBarNav, TopBarNavLink } from './TopBar.tsx';

describe('TopBar', () => {
  it('renders banner, brand link, current nav link, actions and forwards refs with no axe violations', async () => {
    const barRef = createRef<HTMLElement>();
    const brandRef = createRef<HTMLAnchorElement>();
    const navRef = createRef<HTMLElement>();
    const linkRef = createRef<HTMLAnchorElement>();
    const onPress = vi.fn();

    const { container } = renderNds(
      <TopBar
        ref={barRef}
        data-region="header"
        mobileMenu={<IconButton icon={iconMenu} aria-label="باز کردن منوی ناوبری" />}
        brand={
          <TopBarBrand ref={brandRef} href="/" aria-label="رجیستری نگارش برتر، صفحهٔ اصلی">
            <LogoSlot name="نگارش برتر" product="رجیستری" />
          </TopBarBrand>
        }
        nav={
          <TopBarNav ref={navRef} aria-label="بخش‌های رجیستری">
            <TopBarNavLink ref={linkRef} href="#activate" isCurrent>
              فعال‌سازی
            </TopBarNavLink>
            <TopBarNavLink href="#list" onPress={onPress}>
              فعال‌سازی‌های من
            </TopBarNavLink>
            <TopBarNavLink href="#disabled" isDisabled>
              به‌زودی
            </TopBarNavLink>
          </TopBarNav>
        }
        actions={
          <>
            <IconButton icon={iconMoon} aria-label="تغییر به حالت تیره" />
            <AccountPill label="۰۹۱۲ ••• ۴۵۶۷" ltr aria-label="حساب کاربری ۰۹۱۲ ••• ۴۵۶۷" />
          </>
        }
      />,
    );

    const header = screen.getByRole('banner');
    expect(header).toBe(barRef.current);
    expect(header.dataset.nds).toBe('TopBar');
    expect(header.dataset.region).toBe('header');
    expect(header.hasAttribute('data-sticky')).toBe(true);

    const brand = screen.getByRole('link', { name: 'رجیستری نگارش برتر، صفحهٔ اصلی' });
    expect(brand).toBe(brandRef.current);
    expect(brand.dataset.nds).toBe('TopBarBrand');

    const nav = screen.getByRole('navigation', { name: 'بخش‌های رجیستری' });
    expect(nav).toBe(navRef.current);
    expect(nav.dataset.nds).toBe('TopBarNav');
    expect(nav.hasAttribute('data-hide-on-mobile')).toBe(true);

    const activeLink = within(nav).getByRole('link', { name: 'فعال‌سازی' });
    expect(activeLink).toBe(linkRef.current);
    expect(activeLink.getAttribute('aria-current')).toBe('page');
    expect(activeLink.hasAttribute('data-current')).toBe(true);

    const secondLink = within(nav).getByRole('link', { name: 'فعال‌سازی‌های من' });
    await userEvent.click(secondLink);
    expect(onPress).toHaveBeenCalledTimes(1);

    const disabledLink = within(nav).getByRole('link', { name: 'به‌زودی' });
    expect(disabledLink.getAttribute('aria-disabled')).toBe('true');

    await expectNoAxeViolations(container);
  });

  it('supports non-sticky, wide container, div root and mobile-visible nav', () => {
    const { container } = renderNds(
      <TopBar
        as="div"
        size="wide"
        sticky={false}
        nav={
          <TopBarNav aria-label="ناوبری نمونه" hideOnMobile={false}>
            <TopBarNavLink href="#a">صفحهٔ نخست</TopBarNavLink>
          </TopBarNav>
        }
      />,
    );
    const bar = container.querySelector('[data-nds="TopBar"]');
    expect(bar?.tagName).toBe('DIV');
    expect(bar?.hasAttribute('data-sticky')).toBe(false);
    expect(container.querySelector('[data-nds="Container"]')?.getAttribute('data-size')).toBe(
      'wide',
    );
    expect(
      container.querySelector('[data-nds="TopBarNav"]')?.hasAttribute('data-hide-on-mobile'),
    ).toBe(false);
  });
});
