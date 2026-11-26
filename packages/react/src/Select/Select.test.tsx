import { iconBook, iconCard } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Select, SelectItem, SelectSection, SelectSeparator } from './Select.tsx';

describe('Select', () => {
  it('supports single selection, sections, icons, Persian placeholder, ref forwarding, and axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <Select
        ref={ref}
        label="استان"
        description="برای ارسال نسخهٔ چاپی استفاده می‌شود."
        onChange={onChange}
        className="custom-select"
      >
        <SelectSection title="مرکز">
          <SelectItem id="tehran" icon={iconBook} description="ارسال یک‌روزه">
            تهران
          </SelectItem>
          <SelectItem id="isfahan" icon={iconCard}>
            اصفهان
          </SelectItem>
        </SelectSection>
        <SelectSeparator />
        <SelectItem id="shiraz" isDisabled>
          شیراز
        </SelectItem>
      </Select>,
    );

    const trigger = screen.getByRole('button', { name: /استان/ });
    expect(ref.current).toBe(trigger);
    expect(container.querySelector('[data-nds="Select"]')?.classList.contains('custom-select')).toBe(
      true,
    );
    expect(trigger.textContent).toContain('موردی را انتخاب کنید');

    await user.click(trigger);
    const tehran = screen.getByRole('option', { name: /تهران/ });
    expect(screen.getByRole('option', { name: 'شیراز' }).getAttribute('aria-disabled')).toBe(
      'true',
    );
    await user.click(tehran);

    expect(onChange).toHaveBeenCalledWith('tehran');
    expect(trigger.textContent).toContain('تهران');
    await expectNoAxeViolations(container);
  });

  it('supports multiple selection with Persian comma and count summary', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderNds(
      <Select
        label="حوزه‌های تخصصی"
        selectionMode="multiple"
        defaultValue={['clinical']}
        onChange={onChange}
      >
        <SelectItem id="clinical">روان‌شناسی بالینی</SelectItem>
        <SelectItem id="child">روان‌شناسی کودک</SelectItem>
        <SelectItem id="edu">روان‌شناسی تربیتی</SelectItem>
      </Select>,
    );

    const trigger = screen.getByRole('button', { name: /حوزه‌های تخصصی/ });
    expect(trigger.textContent).toContain('روان‌شناسی بالینی');

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'روان‌شناسی کودک' }));
    expect(onChange).toHaveBeenCalledWith(['clinical', 'child']);
    expect(trigger.textContent).toContain('روان‌شناسی بالینی، روان‌شناسی کودک');

    await user.click(screen.getByRole('option', { name: 'روان‌شناسی تربیتی' }));
    expect(trigger.textContent).toContain('۳ مورد انتخاب‌شده');

    await user.keyboard('{Escape}');
    await expectNoAxeViolations(container);
  });

  it('announces invalid error alerts and supports pending/disabled states', async () => {
    const { container } = renderNds(
      <>
        <Select label="محصول" isInvalid errorMessage="محصول مورد نظر را انتخاب کنید.">
          <SelectItem id="reg">رجیستری</SelectItem>
        </Select>
        <Select label="فهرست در حال بارگذاری" isPending>
          <SelectItem id="a">گزینه</SelectItem>
        </Select>
      </>,
    );

    expect(screen.getByRole('alert').textContent).toContain('محصول مورد نظر را انتخاب کنید.');
    expect(screen.getByRole('progressbar', { name: 'در حال انجام' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
