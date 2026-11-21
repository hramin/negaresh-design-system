import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { PasswordField } from './PasswordField.tsx';

describe('PasswordField', () => {
  it('allows paste and reveals/hides without changing value or selection', async () => {
    const ref = createRef<HTMLInputElement>();
    renderNds(<PasswordField label="رمز عبور" ref={ref} />);
    const input = screen.getByLabelText('رمز عبور') as HTMLInputElement;
    const user = userEvent.setup();
    await user.click(input);
    await user.paste('A secure password');
    expect(input.type).toBe('password');
    input.setSelectionRange(2, 7);
    await user.click(screen.getByRole('button', { name: 'نمایش گذرواژه' }));
    expect(input.type).toBe('text');
    expect(input.value).toBe('A secure password');
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(7);
    expect(document.activeElement).toBe(input);
    await user.click(screen.getByRole('button', { name: 'پنهان کردن گذرواژه' }));
    expect(input.type).toBe('password');
    expect(ref.current).toBe(input);
  });

  it('associates supplied strength guidance, respects disabled state and passes axe', async () => {
    const { container } = renderNds(
      <PasswordField
        label="رمز عبور"
        description="رمز تازه انتخاب کنید"
        strengthHint="از چند واژه استفاده کنید"
        isDisabled
      />,
    );
    const input = screen.getByLabelText('رمز عبور') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'نمایش گذرواژه' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(screen.getByText(/از چند واژه استفاده کنید/)).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
