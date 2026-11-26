import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Stepper } from './Stepper.tsx';

describe('Stepper', () => {
  it('marks done/current/upcoming states, sets aria-current="step", formats Persian digits, and passes axe', async () => {
    const ref = createRef<HTMLElement>();
    const onBack = vi.fn();
    const { container } = renderNds(
      <Stepper
        ref={ref}
        currentStep={2}
        steps={[
          { id: 'open', title: 'باز کردن از برنامه.', description: 'از داخل نرم‌افزار.', inlineDescription: true, onPress: onBack },
          { id: 'serial', title: 'وارد کردن سریال.', description: 'روی جعبه یا پیامک.', inlineDescription: true },
          { id: 'code', title: 'وارد کردن کد در برنامه.', description: 'کپی و درج کد.', inlineDescription: true },
        ]}
      />,
    );

    expect(ref.current?.tagName).toBe('OL');
    const items = container.querySelectorAll('[data-nds="StepperStep"]');
    expect(items).toHaveLength(3);
    expect(items[0]?.getAttribute('data-done')).toBe('true');
    expect(items[1]?.getAttribute('aria-current')).toBe('step');
    expect(items[2]?.getAttribute('data-status')).toBe('upcoming');
    expect(screen.getByText('۳')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: /باز کردن از برنامه/ }));
    expect(onBack).toHaveBeenCalledTimes(1);

    await expectNoAxeViolations(container);
  });

  it('supports horizontal navigation mode with nav landmark', async () => {
    const { container } = renderNds(
      <Stepper
        asNav
        orientation="horizontal"
        aria-label="مراحل خرید"
        currentStep={1}
        steps={[
          { id: 'cart', title: 'سبد خرید' },
          { id: 'shipping', title: 'نشانی ارسال' },
          { id: 'payment', title: 'پرداخت' },
        ]}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'مراحل خرید' })).toBeTruthy();
    expect(container.querySelector('[data-orientation="horizontal"]')).toBeTruthy();

    await expectNoAxeViolations(container);
  });
});
