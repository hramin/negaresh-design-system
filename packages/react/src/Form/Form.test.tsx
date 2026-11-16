import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { FieldError, Input, Label, TextField } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
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

describe('Form', () => {
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
