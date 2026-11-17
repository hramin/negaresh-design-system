import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { Form } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { PhoneField } from './PhoneField.tsx';

function ControlledPhoneExample() {
  const [value, setValue] = useState('');
  return (
    <>
      <PhoneField label="موبایل" value={value} onChange={setValue} />
      <button type="button" onClick={() => setValue('+989351234567')}>
        بازنشانی
      </button>
      <button type="button" onClick={() => setValue('+989121234567')}>
        شماره دیگر
      </button>
    </>
  );
}

describe('PhoneField', () => {
  it('preserves middle-edit selection with a controlled canonical value', async () => {
    renderNds(<ControlledPhoneExample />);
    await userEvent.click(screen.getByRole('button', { name: 'شماره دیگر' }));
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.click(input);
    input.setSelectionRange(2, 3);
    await userEvent.keyboard('۳');
    expect(input.value).toBe('0932 123 4567');
    expect(input.selectionStart).toBe(3);
    await userEvent.keyboard('{Backspace}');
    expect(input.value).toBe('092 123 4567');
  });

  it.each(['۳', '٣'])(
    'preserves the caret when a middle digit is replaced with %s',
    async (digit) => {
      renderNds(<PhoneField label="موبایل" defaultValue="09121234567" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await userEvent.click(input);
      input.setSelectionRange(2, 3);
      await userEvent.keyboard(digit);
      expect(input.value).toBe('0932 123 4567');
      expect(input.selectionStart).toBe(3);
      await userEvent.keyboard('{Backspace}');
      expect(input.value).toBe('092 123 4567');
      expect(input.selectionStart).toBe(2);
    },
  );

  it('retains incomplete input and emits canonical complete numbers', async () => {
    const onChange = vi.fn();
    renderNds(<PhoneField label="موبایل" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'موبایل' }) as HTMLInputElement;
    await userEvent.type(input, '۰۹۱۲');
    expect(input.value).toBe('0912');
    expect(onChange).toHaveBeenLastCalledWith('0912');
    await userEvent.type(input, '۱۲۳۴۵۶۷');
    expect(onChange).toHaveBeenLastCalledWith('+989121234567');
    await userEvent.tab();
    expect(input.value).toBe('0912 123 4567');
    expect(input.dir).toBe('ltr');
  });

  it.each([
    '09121234567',
    '9121234567',
    '+989121234567',
    '00989121234567',
    '989121234567',
    '٠٩١٢ ١٢٣ ٤٥٦٧',
  ])('submits the canonical value for %s', (value) => {
    const { container } = renderNds(
      <Form>
        <PhoneField label="موبایل" name="phone" defaultValue={value} />
      </Form>,
    );
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    expect(new FormData(form as HTMLFormElement).getAll('phone')).toEqual(['+989121234567']);
  });

  it('supports controlled editing and external resets without erasing partial text', async () => {
    renderNds(<ControlledPhoneExample />);
    const input = screen.getByRole('textbox', { name: 'موبایل' }) as HTMLInputElement;
    await userEvent.type(input, '۰۹');
    expect(input.value).toBe('09');
    await userEvent.click(screen.getByRole('button', { name: 'بازنشانی' }));
    expect(input.value).toBe('0935 123 4567');
  });

  it('restores the nonempty initial display and canonical submission on native form reset', async () => {
    const { container } = renderNds(
      <Form>
        <PhoneField label="موبایل" name="phone" defaultValue="+989121234567" />
        <button type="reset">بازنشانی فرم</button>
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'موبایل' }) as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, '09351234567');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('phone')).toBe(
      '+989351234567',
    );
    await userEvent.click(screen.getByRole('button', { name: 'بازنشانی فرم' }));
    expect(input.value).toBe('0912 123 4567');
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('phone')).toBe(
      '+989121234567',
    );
  });

  it('honors a controlled parent that rejects changes', async () => {
    const onChange = vi.fn();
    renderNds(<PhoneField label="موبایل" value="+989121234567" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'موبایل' }) as HTMLInputElement;
    await userEvent.clear(input);
    expect(onChange).toHaveBeenCalledWith('');
    expect(input.value).toBe('0912 123 4567');
    await userEvent.type(input, '8');
    expect(input.value).toBe('0912 123 4567');
  });

  it('handles an external reset back to a previously emitted canonical value', async () => {
    renderNds(<ControlledPhoneExample />);
    const input = screen.getByRole('textbox', { name: 'موبایل' }) as HTMLInputElement;
    await userEvent.type(input, '09351234567');
    await userEvent.click(screen.getByRole('button', { name: 'شماره دیگر' }));
    expect(input.value).toBe('0912 123 4567');
    await userEvent.click(screen.getByRole('button', { name: 'بازنشانی' }));
    expect(input.value).toBe('0935 123 4567');
  });

  it('keeps server errors associated with the visible input and forwards its ref', async () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = renderNds(
      <Form validationErrors={{ phone: 'شماره پذیرفته نشد' }}>
        <PhoneField label="موبایل" name="phone" ref={ref} />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'موبایل' });
    expect(ref.current).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('شماره پذیرفته نشد')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('announces invalid incomplete input after submitting', async () => {
    renderNds(
      <Form>
        <PhoneField label="موبایل" name="phone" />
        <button type="submit">ثبت</button>
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'موبایل' });
    fireEvent.change(input, { target: { value: '123' } });
    await userEvent.click(screen.getByRole('button', { name: 'ثبت' }));
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
