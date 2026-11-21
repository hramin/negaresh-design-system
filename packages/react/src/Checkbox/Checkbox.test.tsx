import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Checkbox, CheckboxGroup } from './Checkbox.tsx';

describe('Checkbox and CheckboxGroup', () => {
  it('toggles selection, supports indeterminate state, forwards ref, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container, rerender } = renderNds(
      <Checkbox
        ref={ref}
        description="پیامک اطلاع‌رسانی فقط برای فعال‌سازی ارسال می‌شود."
        onChange={onChange}
        className="custom-root"
      >
        دریافت پیامک اطلاع‌رسانی
      </Checkbox>,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'دریافت پیامک اطلاع‌رسانی',
    }) as HTMLInputElement;
    expect(ref.current).toBe(checkbox);
    expect(container.querySelector('[data-nds="Checkbox"]')?.classList.contains('custom-root')).toBe(
      true,
    );
    const describedBy = checkbox.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(describedBy)?.textContent).toContain('پیامک اطلاع‌رسانی');

    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(
      <Checkbox isIndeterminate onChange={onChange}>
        انتخاب همهٔ موارد
      </Checkbox>,
    );
    const indeterminate = screen.getByRole('checkbox', {
      name: 'انتخاب همهٔ موارد',
    }) as HTMLInputElement;
    expect(indeterminate.indeterminate).toBe(true);
    await expectNoAxeViolations(container);
  });

  it('manages group selection, horizontal orientation, and invalid alerts', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderNds(
      <CheckboxGroup
        label="کانال‌های هشدار"
        description="دست‌کم یک روش را انتخاب کنید."
        orientation="horizontal"
        defaultValue={['sms']}
        onChange={onChange}
        isInvalid
        errorMessage="انتخاب ایمیل برای گزارش ماهانه الزامی است."
      >
        <Checkbox value="sms">پیامک</Checkbox>
        <Checkbox value="email">ایمیل</Checkbox>
        <Checkbox value="panel" isDisabled>
          اعلان پنل
        </Checkbox>
      </CheckboxGroup>,
    );

    const sms = screen.getByRole('checkbox', { name: 'پیامک' }) as HTMLInputElement;
    const email = screen.getByRole('checkbox', { name: 'ایمیل' }) as HTMLInputElement;
    const panel = screen.getByRole('checkbox', { name: 'اعلان پنل' }) as HTMLInputElement;
    expect(sms.checked).toBe(true);
    expect(email.checked).toBe(false);
    expect(panel.disabled).toBe(true);
    expect(screen.getByRole('alert').textContent).toContain(
      'انتخاب ایمیل برای گزارش ماهانه الزامی است.',
    );

    await user.click(email);
    expect(onChange).toHaveBeenCalledWith(['sms', 'email']);
    await expectNoAxeViolations(container);
  });
});
