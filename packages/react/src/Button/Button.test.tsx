import { iconCopy, iconLock, iconMoon } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Button, IconButton, LinkButton } from './Button.tsx';

describe('Button', () => {
  it('presses with mouse and keyboard', async () => {
    const onPress = vi.fn();
    renderNds(
      <Button variant="primary" onPress={onPress} iconStart={iconLock}>
        پرداخت و ساخت کد
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'پرداخت و ساخت کد' });
    expect(button.dataset.variant).toBe('primary');
    expect(button.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('does not press when disabled', async () => {
    const onPress = vi.fn();
    renderNds(
      <Button isDisabled onPress={onPress}>
        ذخیره
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'ذخیره' });
    expect(button.hasAttribute('disabled')).toBe(true);
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('stays focusable while pending and labels the progress in Persian', async () => {
    const onPress = vi.fn();
    renderNds(
      <Button isPending onPress={onPress} type="submit">
        ساخت کد فعال‌سازی
      </Button>,
    );
    const button = screen.getByRole('button', { name: /ساخت کد فعال‌سازی/ });
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.dataset.pending).toBe('true');
    expect(screen.getByRole('progressbar', { name: 'در حال انجام' })).toBeTruthy();
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('links the pending progress to an aria-label', () => {
    renderNds(
      <Button isPending aria-label="ذخیرهٔ فرم">
        ذخیره
      </Button>,
    );
    const ids = screen.getByRole('button').getAttribute('aria-labelledby')?.split(' ') ?? [];
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[1] as string)?.getAttribute('role')).toBe('progressbar');
  });

  it('renders link buttons and icon buttons', async () => {
    const { container } = renderNds(
      <>
        <LinkButton href="/activations" size="sm" variant="secondary" iconEnd={iconCopy} fullWidth>
          فعال‌سازی‌های من
        </LinkButton>
        <IconButton icon={iconMoon} aria-label="تغییر به حالت تیره" />
      </>,
    );
    const link = screen.getByRole('link', { name: 'فعال‌سازی‌های من' });
    expect([link.getAttribute('href'), link.dataset.size, link.dataset.fullWidth]).toEqual([
      '/activations',
      'sm',
      'true',
    ]);
    const icon = screen.getByRole('button', { name: 'تغییر به حالت تیره' });
    expect(icon.dataset.iconOnly).toBe('true');
    await expectNoAxeViolations(container);
  });
});
