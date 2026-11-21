import { createRef, useState } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { faMessages } from '../messages/fa.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { TextField } from './TextField.tsx';

function ControlledTextField({ changed }: { changed: (value: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <TextField
      label="نام"
      value={value}
      onChange={(next) => {
        setValue(next);
        changed(next);
      }}
    />
  );
}

describe('TextField', () => {
  it('associates a visible label, help, affixes and Persian character count with the input', async () => {
    const { container } = renderNds(
      <TextField
        label="نام"
        description="نام کامل"
        prefix="نام:"
        suffix="کاربر"
        defaultValue="سارا"
        maxLength={20}
        showCharacterCount
      />,
    );
    const input = screen.getByRole('textbox', { name: 'نام' }) as HTMLInputElement;
    expect(input.value).toBe('سارا');
    const description = document.getElementById(input.getAttribute('aria-describedby') ?? '');
    expect(description?.textContent).toContain('نام کامل');
    expect(description?.textContent).toContain(faMessages.characterCount(4, 20));
    expect(screen.getByText('نام:')).toBeTruthy();
    expect(screen.getByText('کاربر')).toBeTruthy();
    await userEvent.type(input, 'ا');
    expect(screen.getByText(faMessages.characterCount(5, 20))).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('passes changed strings and supports a controlled value', async () => {
    const changed = vi.fn();
    renderNds(<ControlledTextField changed={changed} />);
    await userEvent.type(screen.getByRole('textbox'), 'نام');
    expect(changed).toHaveBeenLastCalledWith('نام');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('نام');
  });

  it('keeps className at the root, forwards the input ref and uses id for the actual control', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = renderNds(
      <TextField
        label="ایمیل"
        id="email"
        name="email"
        ref={ref}
        dir="ltr"
        type="email"
        className="application-field"
      />,
    );
    const input = screen.getByRole('textbox', { name: 'ایمیل' });
    expect(ref.current).toBe(input);
    expect(input.id).toBe('email');
    expect(input.getAttribute('dir')).toBe('ltr');
    expect(input.classList.contains('application-field')).toBe(false);
    expect(
      container.querySelector('[data-nds="TextField"]')?.classList.contains('application-field'),
    ).toBe(true);
    ref.current?.focus();
    expect(document.activeElement).toBe(input);
  });

  it('links a product-specific error to the invalid input', async () => {
    const { container } = renderNds(
      <TextField label="سریال" isInvalid errorMessage="این سریال معتبر نیست" />,
    );
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(
      ids.some((id) => document.getElementById(id)?.textContent === 'این سریال معتبر نیست'),
    ).toBe(true);
    await expectNoAxeViolations(container);
  });

  it('retains the error layout slot when validation clears without announcing an empty error', () => {
    const { container, rerender } = renderNds(
      <TextField label="نام" isInvalid errorMessage="نام را اصلاح کنید" />,
    );
    const slot = container.querySelector('[data-field-error-slot]');
    expect(slot).toBeTruthy();
    expect(slot?.querySelector('[role="alert"]')?.textContent).toBe('نام را اصلاح کنید');
    rerender(<TextField label="نام" />);
    expect(container.querySelector('[data-field-error-slot]')).toBe(slot);
    expect(slot?.querySelector('[role="alert"]')).toBeNull();
    expect(slot?.textContent).toBe('');
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBeNull();
  });

  it('preserves Form server errors by field name and clears them after editing', async () => {
    renderNds(
      <Form validationErrors={{ email: 'این ایمیل ثبت شده است' }}>
        <TextField label="ایمیل" name="email" />
      </Form>,
    );
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('این ایمیل ثبت شده است')).toBeTruthy();
    await userEvent.type(input, 'a');
    // Native text-input change commits when focus leaves the edited control.
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByText('این ایمیل ثبت شده است')).toBeNull());
  });

  it('localizes native required errors without translating application validator messages', async () => {
    renderNds(
      <Form>
        <TextField label="نام" isRequired />
      </Form>,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.invalid(input);
    await waitFor(() => expect(screen.getByText(faMessages.fieldRequired)).toBeTruthy());
  });

  it('prevents edits in disabled, read-only and pending fields', async () => {
    renderNds(
      <>
        <TextField label="غیرفعال" isDisabled defaultValue="الف" />
        <TextField label="فقط خواندنی" isReadOnly defaultValue="ب" />
        <TextField label="در انتظار" name="pending" isPending defaultValue="ج" />
      </>,
    );
    for (const name of ['غیرفعال', 'فقط خواندنی', 'در انتظار']) {
      const input = screen.getByRole('textbox', { name }) as HTMLInputElement;
      const initial = input.value;
      await userEvent.type(input, 'تغییر');
      expect(input.value).toBe(initial);
    }
    expect(screen.getByRole('progressbar', { name: faMessages.pending })).toBeTruthy();
  });

  it('resets an uncontrolled value and its character count with the form', async () => {
    renderNds(
      <Form>
        <TextField label="نام" defaultValue="الف" showCharacterCount />
        <button type="reset">بازنشانی</button>
      </Form>,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'ب');
    await userEvent.click(screen.getByRole('button', { name: 'بازنشانی' }));
    expect(input.value).toBe('الف');
    expect(screen.getByText(faMessages.characterCount(3))).toBeTruthy();
  });

  it('submits a canonical value while retaining named server validation for a formatted control', async () => {
    const { container } = renderNds(
      <Form validationErrors={{ serial: 'سریال نامعتبر' }}>
        <TextField
          label="سریال"
          name="serial"
          value="ABCDE-12345"
          submissionValue="ABCDE12345"
          onChange={() => {}}
        />
      </Form>,
    );
    expect(
      new FormData(container.querySelector('form') as HTMLFormElement).getAll('serial'),
    ).toEqual(['ABCDE12345']);
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('سریال نامعتبر')).toBeTruthy();
  });
});
