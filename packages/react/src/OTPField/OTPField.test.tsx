import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Form } from '../Form/Form.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { OTPField } from './OTPField.tsx';

describe('OTPField', () => {
  it('renders 6 LTR numeric slots with autocomplete="one-time-code" and Persian slot labels', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = renderNds(
      <OTPField
        id="login-otp"
        ref={ref}
        label="کد تأیید پیامکی"
        description="کد ۶ رقمی ارسال‌شده به شمارهٔ همراه را وارد کنید."
      />,
    );

    const group = screen.getByRole('group', { name: 'کد تأیید پیامکی' });
    expect(group.getAttribute('dir')).toBe('ltr');

    const slots = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(slots).toHaveLength(6);
    expect(slots[0]?.id).toBe('login-otp');
    expect(ref.current).toBe(slots[0]);
    expect(slots[0]?.getAttribute('autocomplete')).toBe('one-time-code');
    expect(slots[0]?.getAttribute('inputmode')).toBe('numeric');
    expect(slots[0]?.getAttribute('maxlength')).toBeNull();
    expect(slots[0]?.getAttribute('aria-label')).toBe('رقم ۱ از ۶');
    expect(slots[5]?.getAttribute('aria-label')).toBe('رقم ۶ از ۶');
    expect(container.querySelector('[data-nds="OTPField"]')).toBeTruthy();
  });

  it('normalizes Persian, Arabic-Indic, and Latin digits while auto-advancing and firing onComplete', async () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    const { container } = renderNds(
      <Form>
        <OTPField label="کد تأیید" name="otp" onChange={onChange} onComplete={onComplete} />
      </Form>,
    );

    const slots = screen.getAllByRole('textbox') as HTMLInputElement[];
    await userEvent.click(slots[0]!);
    await userEvent.keyboard('۴٨2۹٠6');

    expect(slots.map((s) => s.value)).toEqual(['4', '8', '2', '9', '0', '6']);
    expect(onChange).toHaveBeenLastCalledWith('482906');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('482906');
    expect(
      new FormData(container.querySelector('form') as HTMLFormElement).getAll('otp'),
    ).toEqual(['482906']);
  });

  it('handles full and partial paste including Persian SMS text and mobile autofill multi-digit input', () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    renderNds(<OTPField label="کد تأیید" onChange={onChange} onComplete={onComplete} />);
    const slots = screen.getAllByRole('textbox') as HTMLInputElement[];

    // Full paste from a Persian SMS into slot 2 still fills from slot 0.
    slots[2]!.focus();
    fireEvent.paste(slots[2]!, {
      clipboardData: { getData: () => 'کد ورود نگارش: ۱۲۳۴۵۶' },
    });
    expect(slots.map((s) => s.value)).toEqual(['1', '2', '3', '4', '5', '6']);
    expect(onComplete).toHaveBeenCalledWith('123456');

    // Partial paste into slot 2 overwrites slots 2..4.
    slots[2]!.focus();
    fireEvent.paste(slots[2]!, {
      clipboardData: { getData: () => '٧٨٩' },
    });
    expect(slots.map((s) => s.value)).toEqual(['1', '2', '7', '8', '9', '6']);

    // Mobile OS SMS autofill inserts all 6 digits via input change without paste event.
    fireEvent.change(slots[0]!, { target: { value: '۹۸۷۶۵۴' } });
    expect(slots.map((s) => s.value)).toEqual(['9', '8', '7', '6', '5', '4']);
    expect(onChange).toHaveBeenLastCalledWith('987654');
  });

  it('supports Backspace, Delete, ArrowLeft, ArrowRight, Home, and End navigation', async () => {
    const onChange = vi.fn();
    renderNds(<OTPField label="کد تأیید" defaultValue="123456" onChange={onChange} />);
    const slots = screen.getAllByRole('textbox') as HTMLInputElement[];

    slots[3]!.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(slots[2]);

    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(document.activeElement).toBe(slots[4]);

    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(slots[0]);

    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(slots[5]);

    // First Backspace clears slot 5; second Backspace moves to slot 4 and clears it.
    await userEvent.keyboard('{Backspace}');
    expect(slots[5]?.value).toBe('');
    expect(document.activeElement).toBe(slots[5]);

    await userEvent.keyboard('{Backspace}');
    expect(slots[4]?.value).toBe('');
    expect(document.activeElement).toBe(slots[4]);

    // Delete clears slot 0 in place.
    slots[0]!.focus();
    await userEvent.keyboard('{Delete}');
    expect(slots[0]?.value).toBe('');
    expect(onChange).toHaveBeenLastCalledWith('234');
  });

  it('supports resend button and countdown timer, plus Form validationErrors', async () => {
    vi.useFakeTimers();
    const onResend = vi.fn();
    try {
      renderNds(
        <Form validationErrors={{ otp: 'کد واردشده منقضی شده است.' }}>
          <OTPField label="کد تأیید" name="otp" onResend={onResend} resendCooldown={3} />
        </Form>,
      );

      expect(screen.getByRole('alert').textContent).toBe('کد واردشده منقضی شده است.');
      const resendBtn = screen.getByRole('button', { name: 'ارسال دوبارهٔ کد' });
      fireEvent.click(resendBtn);
      expect(onResend).toHaveBeenCalledTimes(1);
      expect(screen.getByText('ارسال دوباره تا ۳ ثانیهٔ دیگر')).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByRole('button', { name: 'ارسال دوبارهٔ کد' })).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it('passes axe accessibility checks across default, invalid, and resend states', async () => {
    const { container } = renderNds(
      <OTPField
        label="کد تأیید پیامکی"
        description="کد ۶ رقمی را وارد کنید."
        defaultValue="123"
        isInvalid
        errorMessage="کد واردشده نادرست است."
        resendSecondsRemaining={45}
      />,
    );
    await expectNoAxeViolations(container);
  });
});
