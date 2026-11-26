import { iconMenu } from '@negaresh/icons';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button, IconButton } from '../Button/Button.tsx';
import { DialogTrigger } from '../Dialog/Dialog.tsx';
import { LogoSlot } from '../LogoSlot/LogoSlot.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { TopBar, TopBarBrand, TopBarNav, TopBarNavLink } from '../TopBar/TopBar.tsx';
import { Drawer, Sheet, SheetTrigger } from './Sheet.tsx';

describe('Sheet / Drawer', () => {
  it('opens from SheetTrigger with logical side/size, passes axe while open, and closes cleanly', async () => {
    const sheetRef = createRef<HTMLElement>();
    renderNds(
      <SheetTrigger>
        <Button>باز کردن فیلترها</Button>
        <Sheet
          ref={sheetRef}
          side="end"
          size="md"
          title="فیلتر سریال‌ها"
          description="نتایج را بر اساس وضعیت محدود کنید."
          footer={(close) => (
            <Button variant="primary" onPress={close}>
              اعمال فیلتر
            </Button>
          )}
        >
          بخش گزینه‌های فیلتر.
        </Sheet>
      </SheetTrigger>,
    );

    const trigger = screen.getByRole('button', { name: 'باز کردن فیلترها' });
    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'فیلتر سریال‌ها' });
    expect(dialog).toBe(sheetRef.current);
    expect(dialog.dataset.nds).toBe('Sheet');
    expect(dialog.dataset.side).toBe('end');
    await expectNoAxeViolations(document.body);

    await userEvent.click(screen.getByRole('button', { name: 'بستن کشو' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    expect(document.activeElement).toBe(trigger);
  });

  it('integrates with TopBar mobileMenu slot via Drawer alias with zero axe violations', async () => {
    renderNds(
      <TopBar
        as="div"
        sticky={false}
        brand={
          <TopBarBrand href="#home" aria-label="رجیستری نگارش برتر">
            <LogoSlot name="نگارش برتر" product="رجیستری" />
          </TopBarBrand>
        }
        mobileMenu={
          <DialogTrigger>
            <IconButton icon={iconMenu} aria-label="باز کردن منوی ناوبری" />
            <Drawer side="start" title="بخش‌های سامانه">
              {(close) => (
                <TopBarNav aria-label="ناوبری موبایل" hideOnMobile={false}>
                  <TopBarNavLink href="#activate" isCurrent onPress={close}>
                    فعال‌سازی
                  </TopBarNavLink>
                  <TopBarNavLink href="#mine" onPress={close}>
                    فعال‌سازی‌های من
                  </TopBarNavLink>
                </TopBarNav>
              )}
            </Drawer>
          </DialogTrigger>
        }
      />,
    );

    const menuButton = screen.getByRole('button', { name: 'باز کردن منوی ناوبری' });
    await userEvent.click(menuButton);

    const drawer = await screen.findByRole('dialog', { name: 'بخش‌های سامانه' });
    expect(drawer.dataset.nds).toBe('Sheet');
    await expectNoAxeViolations(document.body);

    await userEvent.click(screen.getByRole('link', { name: 'فعال‌سازی‌های من' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    expect(document.activeElement).toBe(menuButton);
  });
});
