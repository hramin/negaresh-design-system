import { iconFile, iconSettings, iconShield } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Tab, TabList, TabPanel, Tabs } from './Tabs.tsx';

describe('Tabs', () => {
  it('switches panels via click and RTL keyboard navigation, formats numeric badges, and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const onSelectionChange = vi.fn();

    const { container } = renderNds(
      <Tabs ref={ref} defaultSelectedKey="overview" onSelectionChange={onSelectionChange}>
        <TabList aria-label="بخش‌های محصول">
          <Tab id="overview" icon={iconFile}>
            نمای کلی
          </Tab>
          <Tab id="licenses" icon={iconShield} badge={12}>
            مجوزها
          </Tab>
          <Tab id="settings" icon={iconSettings} isDisabled>
            تنظیمات
          </Tab>
        </TabList>
        <TabPanel id="overview">محتوای نمای کلی محصول.</TabPanel>
        <TabPanel id="licenses">فهرست مجوزهای فعال.</TabPanel>
        <TabPanel id="settings">تنظیمات پیشرفته.</TabPanel>
      </Tabs>,
    );

    expect(ref.current?.dataset.nds).toBe('Tabs');
    expect(screen.getByText('۱۲')).toBeTruthy();
    expect(screen.getByText('محتوای نمای کلی محصول.')).toBeTruthy();

    const licensesTab = screen.getByRole('tab', { name: /مجوزها/ });
    await userEvent.click(licensesTab);
    expect(onSelectionChange).toHaveBeenCalledWith('licenses');
    expect(screen.getByText('فهرست مجوزهای فعال.')).toBeTruthy();

    // RTL horizontal keyboard navigation: ArrowRight moves back to start tab
    licensesTab.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'نمای کلی' }).getAttribute('aria-selected')).toBe(
      'true',
    );

    await expectNoAxeViolations(container);
  });

  it('supports vertical orientation (Ravanma leaf 3) and pill variant with ArrowDown/ArrowUp', async () => {
    const { container } = renderNds(
      <Tabs orientation="vertical" variant="pill" defaultSelectedKey="profile">
        <TabList aria-label="بخش‌های برگ سوم">
          <Tab id="profile">مشخصات</Tab>
          <Tab id="history">سابقه</Tab>
        </TabList>
        <TabPanel id="profile">پنل مشخصات</TabPanel>
        <TabPanel id="history">پنل سابقه</TabPanel>
      </Tabs>,
    );

    const root = container.querySelector('[data-nds="Tabs"]');
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(root?.getAttribute('data-variant')).toBe('pill');

    const profileTab = screen.getByRole('tab', { name: 'مشخصات' });
    profileTab.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'سابقه' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('پنل سابقه')).toBeTruthy();

    await expectNoAxeViolations(container);
  });
});
