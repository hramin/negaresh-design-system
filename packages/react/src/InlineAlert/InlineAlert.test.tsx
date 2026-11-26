import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { InlineAlert } from './InlineAlert.tsx';

describe('InlineAlert', () => {
  it('renders semantic roles per tone and forwards ref', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <InlineAlert ref={ref} tone="info" title="اطلاع">
          متن اطلاع‌رسانی
        </InlineAlert>
        <InlineAlert tone="success" title="موفق">
          کد فعال‌سازی ساخته شد.
        </InlineAlert>
        <InlineAlert tone="warning" title="هشدار">
          سقف فعال‌سازی پر شده است.
        </InlineAlert>
        <InlineAlert tone="danger" title="خطا" headingLevel={2}>
          سریال واردشده معتبر نیست.
        </InlineAlert>
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('InlineAlert');
    expect(ref.current?.getAttribute('role')).toBe('note');
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'خطا' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('supports uncontrolled dismissal, custom actions, and icon suppression', async () => {
    const onDismiss = vi.fn();
    const { container } = renderNds(
      <InlineAlert
        tone="warning"
        title="سقف نزدیک به تکمیل"
        icon={false}
        isDismissible
        onDismiss={onDismiss}
        actions={
          <Button size="sm" variant="secondary">
            مشاهدهٔ جزئیات
          </Button>
        }
      >
        یک ظرفیت باقی مانده است.
      </InlineAlert>,
    );

    expect(screen.getByRole('button', { name: 'مشاهدهٔ جزئیات' })).toBeTruthy();
    await expectNoAxeViolations(container);

    await userEvent.click(screen.getByRole('button', { name: 'بستن پیام' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
