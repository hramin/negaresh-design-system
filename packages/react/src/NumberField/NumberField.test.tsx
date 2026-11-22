import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { NumberField } from './NumberField.tsx';

describe('NumberField', () => {
  it('displays Persian digits, accepts Latin and Persian input, steps via buttons/keys, forwards ref, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <NumberField
        ref={ref}
        label="ظرفیت صندلی"
        description="بین ۱ تا ۵۰ نفر"
        suffix="نفر"
        defaultValue={12}
        minValue={1}
        maxValue={50}
        step={1}
        onChange={onChange}
        className="custom-num"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'ظرفیت صندلی' }) as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(
      container.querySelector('[data-nds="NumberField"]')?.classList.contains('custom-num'),
    ).toBe(true);
    // Persian digit display
    expect(input.value).toBe('۱۲');

    // Stepper increment button localized to Persian
    const inc = screen.getByRole('button', { name: /افزایش ظرفیت صندلی/ });
    const dec = screen.getByRole('button', { name: /کاهش ظرفیت صندلی/ });
    await user.click(inc);
    expect(onChange).toHaveBeenLastCalledWith(13);
    expect(input.value).toBe('۱۳');

    await user.click(dec);
    expect(onChange).toHaveBeenLastCalledWith(12);

    // Accept Latin digits and normalize display to Persian on blur/commit
    await user.clear(input);
    await user.type(input, '25');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(25);
    expect(input.value).toBe('۲۵');

    // Accept Persian digits directly
    await user.clear(input);
    await user.type(input, '۴۰');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(40);
    expect(input.value).toBe('۴۰');

    // Accept Arabic-Indic digits and ArrowUp keyboard stepping
    await user.clear(input);
    await user.type(input, '٣٢');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(32);
    expect(input.value).toBe('۳۲');

    input.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(33);
    expect(input.value).toBe('۳۳');

    await expectNoAxeViolations(container);
  });

  it('announces invalid error alerts and supports hideStepper, pending, and disabled states', async () => {
    const { container } = renderNds(
      <>
        <NumberField
          label="مبلغ تخفیف"
          suffix="تومان"
          hideStepper
          isInvalid
          errorMessage="مبلغ تخفیف نمی‌تواند منفی باشد."
        />
        <NumberField label="موجودی" defaultValue={5} isPending />
        <NumberField label="سقف ثابت" defaultValue={10} isDisabled />
      </>,
    );

    expect(screen.getByRole('alert').textContent).toContain('مبلغ تخفیف نمی‌تواند منفی باشد.');
    expect(screen.getByRole('progressbar', { name: 'در حال انجام' })).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'سقف ثابت' }) as HTMLInputElement).disabled,
    ).toBe(true);
    await expectNoAxeViolations(container);
  });
});
