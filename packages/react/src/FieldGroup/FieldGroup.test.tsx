import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { FieldGroup } from './FieldGroup.tsx';

describe('FieldGroup', () => {
  it('uses a visible legend and associates shared instructions and errors', async () => {
    const ref = createRef<HTMLFieldSetElement>();
    const { container } = renderNds(
      <FieldGroup
        ref={ref}
        label="اطلاعات تماس"
        description="یکی از راه‌های تماس را وارد کنید"
        errorMessage="یک راه تماس لازم است"
      >
        <label htmlFor="contact-email">ایمیل</label>
        <input id="contact-email" />
      </FieldGroup>,
    );
    const group = screen.getByRole('group', { name: 'اطلاعات تماس' });
    expect(group.tagName).toBe('FIELDSET');
    expect(ref.current).toBe(group);
    expect(group.getAttribute('aria-invalid')).toBe('true');
    const described = group.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(described).toContain(screen.getByText('یکی از راه‌های تماس را وارد کنید').id);
    expect(described).toContain(screen.getByText('یک راه تماس لازم است').id);
    await expectNoAxeViolations(container);
  });

  it('preserves native group disabling and suppresses an explicitly valid error', () => {
    renderNds(
      <FieldGroup label="حساب" isDisabled isInvalid={false} errorMessage="خطا">
        <label htmlFor="disabled-name">نام</label>
        <input id="disabled-name" />
      </FieldGroup>,
    );
    const group = screen.getByRole('group') as HTMLFieldSetElement;
    expect(group.disabled).toBe(true);
    expect(screen.getByRole('textbox').matches(':disabled')).toBe(true);
    expect(group.hasAttribute('aria-invalid')).toBe(false);
    expect(screen.queryByText('خطا')).toBeNull();
  });
});
