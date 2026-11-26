import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Banner } from './Banner.tsx';

describe('Banner', () => {
  it('renders page-level tones with accessible landmarks and live roles', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <Banner ref={ref} tone="neutral" aria-label="اعلان عمومی" title="نسخهٔ تازه">
          ویژگی‌های جدید اضافه شدند.
        </Banner>
        <Banner tone="info" aria-label="اطلاعیهٔ نگهداری">
          به‌روزرسانی کوتاه ساعت ۳ بامداد انجام می‌شود.
        </Banner>
        <Banner tone="warning">مهلت اشتراک شما ۳ روز دیگر پایان می‌یابد.</Banner>
        <Banner tone="danger">ارتباط با سرور برقرار نشد.</Banner>
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Banner');
    expect(screen.getByRole('region', { name: 'اعلان عمومی' })).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('supports action and dismiss button with Persian default label', async () => {
    const onDismiss = vi.fn();
    const { container } = renderNds(
      <Banner
        tone="success"
        title="ذخیره شد"
        isDismissible
        onDismiss={onDismiss}
        action={
          <Button size="sm" variant="secondary">
            بازبینی
          </Button>
        }
      >
        تغییرات حساب اعمال شدند.
      </Banner>,
    );

    expect(screen.getByRole('button', { name: 'بازبینی' })).toBeTruthy();
    await expectNoAxeViolations(container);

    await userEvent.click(screen.getByRole('button', { name: 'بستن اعلان صفحه' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
