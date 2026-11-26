import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { TimeField } from './TimeField.tsx';

describe('TimeField', () => {
  it('renders 24-hour Persian segments, supports keyboard stepping, emits canonical HH:mm, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <TimeField
        ref={ref}
        label="ساعت شروع جلسه"
        description="قالب ۲۴ ساعته به وقت تهران"
        defaultValue="14:30"
        onChange={onChange}
        className="custom-time"
      />,
    );

    expect(ref.current?.getAttribute('data-nds')).toBe('TimeField');
    expect(ref.current?.classList.contains('custom-time')).toBe(true);

    const hour = screen.getByRole('spinbutton', { name: /^ساعت/ });
    const minute = screen.getByRole('spinbutton', { name: /^دقیقه/ });
    expect(hour.textContent).toBe('۱۴');
    expect(minute.textContent).toBe('۳۰');

    hour.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith('15:30');
    expect(hour.textContent).toBe('۱۵');

    minute.focus();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('15:29');

    await expectNoAxeViolations(container);
  });

  it('supports seconds granularity, invalid alerts, pending, and disabled states', async () => {
    const { container } = renderNds(
      <>
        <TimeField
          label="زمان دقیق"
          defaultValue="09:05:12"
          granularity="second"
          isInvalid
          errorMessage="ساعت انتخاب‌شده در بازهٔ کاری نیست."
        />
        <TimeField label="در حال بررسی" defaultValue="10:00" isPending />
        <TimeField label="غیرفعال" defaultValue="11:15" isDisabled />
      </>,
    );

    expect(screen.getByRole('spinbutton', { name: /ثانیه/ }).textContent).toBe('۱۲');
    expect(screen.getByRole('alert').textContent).toContain('ساعت انتخاب‌شده در بازهٔ کاری نیست.');
    expect(screen.getByRole('progressbar', { name: 'در حال انجام' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
