import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { FieldError, Input, Label, TextField } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { PhoneField } from '../PhoneField/PhoneField.tsx';
import { SerialField } from '../SerialField/SerialField.tsx';
import { TextField as NdsTextField } from '../TextField/TextField.tsx';
import { Form } from './Form.tsx';

function ServerErrorForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <Form
      validationBehavior="aria"
      validationErrors={errors}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmitted();
        setErrors({ email: 'ایمیل را بررسی کنید', phone: 'شماره را بررسی کنید' });
      }}
    >
      <TextField name="email" onChange={() => setErrors({ phone: 'شماره را بررسی کنید' })}>
        <Label>ایمیل</Label>
        <Input />
        <FieldError />
      </TextField>
      <TextField name="phone">
        <Label>شماره</Label>
        <Input />
        <FieldError />
      </TextField>
      <button type="submit">ثبت</button>
    </Form>
  );
}

function DelayedServerForm({ validationBehavior }: { validationBehavior: 'native' | 'aria' }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <Form
      validationBehavior={validationBehavior}
      validationErrors={errors}
      onSubmit={(event) => {
        event.preventDefault();
        setTimeout(() => setErrors({ phone: 'شماره پذیرفته نشد', serial: 'سریال پذیرفته نشد' }), 0);
      }}
    >
      <PhoneField label="موبایل" name="phone" defaultValue="+989121234567" />
      <SerialField label="سریال" name="serial" defaultValue="ABCDE12345" />
      <button type="submit">ثبت</button>
    </Form>
  );
}

function DelayedValidationForm() {
  const [invalid, setInvalid] = useState(false);
  return (
    <Form
      validationBehavior="aria"
      onSubmit={(event) => {
        event.preventDefault();
        setTimeout(() => setInvalid(true), 0);
      }}
    >
      <NdsTextField label="نام" isInvalid={invalid} errorMessage="نام را بررسی کنید" />
      <button type="submit">ثبت</button>
    </Form>
  );
}

describe('Form', () => {
  it('focuses post-submit errors once and preserves later user focus', async () => {
    const example = (first: boolean, second: boolean) => (
      <Form validationBehavior="aria" onSubmit={(event) => event.preventDefault()}>
        <NdsTextField label="نام" isInvalid={first} />
        <NdsTextField label="ایمیل" isInvalid={second} />
        <button type="submit">ثبت</button>
      </Form>
    );
    const { rerender } = renderNds(example(false, false));
    await userEvent.click(screen.getByRole('button'));
    rerender(example(true, false));
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'نام' })),
    );
    const email = screen.getByRole('textbox', { name: 'ایمیل' });
    await userEvent.click(email);
    rerender(example(true, true));
    await waitFor(() => expect(email.getAttribute('aria-invalid')).toBe('true'));
    expect(document.activeElement).toBe(email);
  });

  it('cancels pending error focus when the form is reset', async () => {
    const example = (invalid: boolean) => (
      <Form validationBehavior="aria" onSubmit={(event) => event.preventDefault()}>
        <NdsTextField label="نام" isInvalid={invalid} />
        <button type="submit">ثبت</button>
        <button type="reset">بازنشانی</button>
      </Form>
    );
    const { rerender } = renderNds(example(false));
    await userEvent.click(screen.getByRole('button', { name: 'ثبت' }));
    const reset = screen.getByRole('button', { name: 'بازنشانی' });
    await userEvent.click(reset);
    rerender(example(true));
    await waitFor(() =>
      expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true'),
    );
    expect(document.activeElement).toBe(reset);
  });

  it.each(['native', 'aria'] as const)(
    'focuses normalized fields after asynchronous named server errors in %s mode',
    async (validationBehavior) => {
      renderNds(<DelayedServerForm validationBehavior={validationBehavior} />);
      const phone = screen.getByRole('textbox', { name: 'موبایل' });
      await userEvent.click(screen.getByRole('button', { name: 'ثبت' }));
      await waitFor(() => expect(phone.getAttribute('aria-invalid')).toBe('true'));
      await waitFor(() => expect(document.activeElement).toBe(phone));
    },
  );

  it('focuses delayed application validation errors supplied directly to a field', async () => {
    renderNds(<DelayedValidationForm />);
    const input = screen.getByRole('textbox', { name: 'نام' });
    await userEvent.click(screen.getByRole('button', { name: 'ثبت' }));
    await waitFor(() => expect(input.getAttribute('aria-invalid')).toBe('true'));
    await waitFor(() => expect(document.activeElement).toBe(input));
  });

  it('preserves named form submission, reset and the native ref', async () => {
    const ref = createRef<HTMLFormElement>();
    const submitted = vi.fn();
    const reset = vi.fn();
    renderNds(
      <Form
        ref={ref}
        aria-label="حساب"
        className="account-form"
        onSubmit={(event) => {
          event.preventDefault();
          submitted(new FormData(event.currentTarget).get('name'));
        }}
        onReset={reset}
      >
        <TextField name="name" defaultValue="مینا">
          <Label>نام</Label>
          <Input />
        </TextField>
        <button type="submit">ذخیره</button>
        <button type="reset">بازنشانی</button>
      </Form>,
    );
    expect(ref.current).toBe(screen.getByRole('form', { name: 'حساب' }));
    expect(ref.current?.classList.contains('account-form')).toBe(true);
    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'سارا');
    await userEvent.click(screen.getByRole('button', { name: 'ذخیره' }));
    expect(submitted).toHaveBeenCalledWith('سارا');
    await userEvent.click(screen.getByRole('button', { name: 'بازنشانی' }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('مینا');
  });

  it('keeps native validation as the default and blocks an empty required field', async () => {
    const submit = vi.fn();
    const { container } = renderNds(
      <Form aria-label="عضویت" onSubmit={submit}>
        <TextField name="email" isRequired>
          <Label>ایمیل</Label>
          <Input type="email" />
          <FieldError />
        </TextField>
        <button type="submit">عضویت</button>
      </Form>,
    );
    expect(screen.getByRole('form').hasAttribute('novalidate')).toBe(false);
    await userEvent.click(screen.getByRole('button'));
    expect(submit).not.toHaveBeenCalled();
    expect((screen.getByRole('textbox') as HTMLInputElement).validity.valueMissing).toBe(true);
    await expectNoAxeViolations(container);
  });

  it('maps server errors by name and clears an edited field error on blur', async () => {
    renderNds(
      <Form validationErrors={{ username: 'این نام قبلاً ثبت شده است' }}>
        <TextField name="username" defaultValue="mina">
          <Label>نام کاربری</Label>
          <Input />
          <FieldError />
        </TextField>
        <TextField name="email">
          <Label>ایمیل</Label>
          <Input />
          <FieldError />
        </TextField>
      </Form>,
    );
    const username = screen.getByRole('textbox', { name: 'نام کاربری' });
    expect(username.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('textbox', { name: 'ایمیل' }).getAttribute('aria-invalid')).not.toBe(
      'true',
    );
    const error = screen.getByText('این نام قبلاً ثبت شده است');
    expect(username.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
    await userEvent.type(username, '2');
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByText('این نام قبلاً ثبت شده است')).toBeNull());
  });

  it('lets an aria-mode application submit and focuses its first newly invalid field', async () => {
    const submit = vi.fn();
    renderNds(<ServerErrorForm onSubmitted={submit} />);
    expect(screen.getByRole('textbox', { name: 'ایمیل' })).not.toBe(document.activeElement);
    await userEvent.click(screen.getByRole('button'));
    expect(submit).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'ایمیل' })).toBe(document.activeElement),
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'ایمیل' }), 'a');
    expect(screen.getByRole('textbox', { name: 'ایمیل' })).toBe(document.activeElement);
  });
});
