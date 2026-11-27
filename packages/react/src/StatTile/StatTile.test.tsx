import { iconKey, iconUsers } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { StatGroup, StatTile } from './StatTile.tsx';

describe('StatTile and StatGroup', () => {
  it('formats Persian numbers, Toman, percent, deltas with icon + accessible direction, and sparkline slot', async () => {
    const groupRef = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <StatGroup ref={groupRef} columns={3} aria-label="شاخص‌های کلیدی">
        <StatTile
          label="سریال‌های فعال"
          value={1248}
          icon={iconKey}
          delta={{ value: '۱۲٪', direction: 'up', label: 'نسبت به ماه قبل' }}
          sparkline={<svg data-testid="spark" aria-hidden="true" width="64" height="24" />}
        />
        <StatTile
          label="فروش ماه جاری"
          value={4500000}
          format="toman"
          delta={{ value: '۴٪', direction: 'down', sentiment: 'negative' }}
        />
        <StatTile
          label="نرخ فعال‌سازی"
          value={86}
          format="percent"
          icon={iconUsers}
          delta={{ value: '۰٪', direction: 'neutral' }}
        />
      </StatGroup>,
    );

    expect(groupRef.current?.dataset.nds).toBe('StatGroup');
    expect(groupRef.current?.getAttribute('role')).toBe('group');
    expect(screen.getByText('۱٬۲۴۸')).toBeTruthy();
    expect(screen.getByText('۴٬۵۰۰٬۰۰۰ تومان')).toBeTruthy();
    expect(screen.getByText('۸۶٪')).toBeTruthy();
    expect(screen.getByText('افزایش:')).toBeTruthy();
    expect(screen.getByText('کاهش:')).toBeTruthy();
    expect(screen.getByText('بدون تغییر:')).toBeTruthy();
    expect(screen.getByTestId('spark')).toBeTruthy();

    await expectNoAxeViolations(container);
  });

  it('supports interactive button/link modes and loading skeleton state', async () => {
    const onPress = vi.fn();
    const { container } = renderNds(
      <StatGroup columns={2}>
        <StatTile label="در انتظار بررسی" value={14} onPress={onPress} />
        <StatTile label="در حال بارگذاری" value={0} isLoading />
      </StatGroup>,
    );

    const btn = screen.getByRole('button', { name: /در انتظار بررسی/ });
    await userEvent.click(btn);
    expect(onPress).toHaveBeenCalledTimes(1);

    const busyTile = container.querySelector('[aria-busy="true"]');
    expect(busyTile).toBeTruthy();
    expect(busyTile?.querySelector('[data-nds="Skeleton"]')).toBeTruthy();

    await expectNoAxeViolations(container);
  });
});
