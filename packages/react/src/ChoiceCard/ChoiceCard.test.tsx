import { iconBook, iconCard, iconKey } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxGroup } from '../Checkbox/Checkbox.tsx';
import { RadioGroup } from '../RadioGroup/RadioGroup.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { ChoiceCard } from './ChoiceCard.tsx';

describe('ChoiceCard', () => {
  it('renders radio choice cards with icon, description, Toman/free prices and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <RadioGroup label="انتخاب بسته" defaultValue="free" onChange={onChange}>
        <ChoiceCard
          ref={ref}
          value="free"
          icon={iconBook}
          title="نسخهٔ پایه"
          description="مناسب آشنایی اولیه با آزمون‌ها"
          price={0}
        />
        <ChoiceCard
          value="pro"
          icon={iconCard}
          title="نسخهٔ کلینیک"
          badge="پیشنهادی"
          description="گزارش کامل و چاپ استاندارد"
          price={250000}
        />
      </RadioGroup>,
    );

    const freeRadio = screen.getByRole('radio', { name: /نسخهٔ پایه/ }) as HTMLInputElement;
    const proRadio = screen.getByRole('radio', { name: /نسخهٔ کلینیک/ }) as HTMLInputElement;
    expect(ref.current).toBe(freeRadio);
    expect(freeRadio.checked).toBe(true);
    expect(container.textContent).toContain('رایگان');
    expect(container.textContent).toContain('۲۵۰٬۰۰۰ تومان');

    await user.click(proRadio);
    expect(proRadio.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith('pro');
    await expectNoAxeViolations(container);
  });

  it('supports checkbox mode inside CheckboxGroup and disabled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderNds(
      <CheckboxGroup label="افزونه‌های فعال‌سازی" defaultValue={['slot']} onChange={onChange}>
        <ChoiceCard
          control="checkbox"
          value="slot"
          icon={iconKey}
          title="یک فعال‌سازی اضافه"
          description="افزایش ظرفیت سریال روی دستگاه تازه"
          price={120000}
        />
        <ChoiceCard
          control="checkbox"
          value="print"
          title="چاپ اختصاصی"
          description="درج لوگوی مرکز روی گزارش"
          price={90000}
          isDisabled
        />
      </CheckboxGroup>,
    );

    const slot = screen.getByRole('checkbox', { name: /یک فعال‌سازی اضافه/ }) as HTMLInputElement;
    const print = screen.getByRole('checkbox', { name: /چاپ اختصاصی/ }) as HTMLInputElement;
    expect(slot.checked).toBe(true);
    expect(print.disabled).toBe(true);

    await user.click(slot);
    expect(onChange).toHaveBeenCalledWith([]);
    await expectNoAxeViolations(container);
  });
});
