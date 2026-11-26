import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Radio, RadioGroup } from './RadioGroup.tsx';

describe('RadioGroup and Radio', () => {
  it('selects options via click and keyboard, forwards ref, and passes axe', async () => {
    const user = userEvent.setup();
    const groupRef = createRef<HTMLDivElement>();
    const radioRef = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <RadioGroup
        ref={groupRef}
        label="نوع گزارش"
        description="قابل تغییر پس از ثبت نیز هست."
        defaultValue="pro"
        onChange={onChange}
        className="custom-radio-group"
      >
        <Radio ref={radioRef} value="pro" description="مناسب متخصص و روان‌سنج">
          نمای حرفه‌ای
        </Radio>
        <Radio value="calm">نمای آرام</Radio>
        <Radio value="archive" isDisabled>
          بایگانی
        </Radio>
      </RadioGroup>,
    );

    expect(groupRef.current?.getAttribute('data-nds')).toBe('RadioGroup');
    expect(groupRef.current?.classList.contains('custom-radio-group')).toBe(true);
    const pro = screen.getByRole('radio', { name: 'نمای حرفه‌ای' }) as HTMLInputElement;
    const calm = screen.getByRole('radio', { name: 'نمای آرام' }) as HTMLInputElement;
    const archive = screen.getByRole('radio', { name: 'بایگانی' }) as HTMLInputElement;
    expect(radioRef.current).toBe(pro);
    expect(pro.checked).toBe(true);
    const descIds = (pro.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(descIds.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain(
      'متخصص',
    );
    expect(archive.disabled).toBe(true);

    await user.click(calm);
    expect(calm.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith('calm');
    await expectNoAxeViolations(container);
  });

  it('supports horizontal orientation and invalid alert announcement', async () => {
    const { container } = renderNds(
      <RadioGroup
        label="روش ارسال"
        orientation="horizontal"
        isInvalid
        errorMessage="یکی از روش‌ها را انتخاب کنید."
      >
        <Radio value="post">پست پیشتاز</Radio>
        <Radio value="courier">پیک شهری</Radio>
      </RadioGroup>,
    );

    const group = screen.getByRole('radiogroup', { name: 'روش ارسال' });
    expect(group.getAttribute('data-orientation')).toBe('horizontal');
    expect(screen.getByRole('alert').textContent).toContain('یکی از روش‌ها را انتخاب کنید.');
    await expectNoAxeViolations(container);
  });
});
