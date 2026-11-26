import { iconKey, iconReceipt, iconShield } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { TabStrip, TabStripItem } from './TabStrip.tsx';

describe('TabStrip', () => {
  it('renders a scrollable nav landmark with links, aria-current, Persian badges, and passes axe', async () => {
    const ref = createRef<HTMLElement>();
    const { container } = renderNds(
      <TabStrip ref={ref} aria-label="بخش‌های حساب کاربری">
        <TabStripItem href="#activations" icon={iconKey} isCurrent badge={3}>
          فعال‌سازی‌ها
        </TabStripItem>
        <TabStripItem href="#orders" icon={iconReceipt}>
          سفارش‌ها
        </TabStripItem>
        <TabStripItem href="#security" icon={iconShield} isDisabled>
          امنیت
        </TabStripItem>
      </TabStrip>,
    );

    expect(ref.current?.tagName).toBe('NAV');
    expect(ref.current?.dataset.nds).toBe('TabStrip');
    expect(screen.getByRole('link', { name: /فعال‌سازی‌ها/ }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(screen.getByText('۳')).toBeTruthy();

    await expectNoAxeViolations(container);
  });

  it('supports declarative interactive items and embedded div mode', async () => {
    const onSelect = vi.fn();
    const { container } = renderNds(
      <TabStrip
        as="div"
        selectedKey="orders"
        onSelect={onSelect}
        items={[
          { id: 'overview', label: 'نمای کلی' },
          { id: 'orders', label: 'سفارش‌ها', badge: 5 },
        ]}
      />,
    );

    expect(container.querySelector('nav')).toBeNull();
    expect(screen.getByRole('button', { name: /سفارش‌ها/ }).getAttribute('aria-current')).toBe(
      'page',
    );

    await userEvent.click(screen.getByRole('button', { name: 'نمای کلی' }));
    expect(onSelect).toHaveBeenCalledWith('overview');
    await expectNoAxeViolations(container);
  });
});
