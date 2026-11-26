import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Toast, ToastProvider, useToast } from './Toast.tsx';

function ToastTriggerDemo({ onUndo }: { onUndo: () => void }) {
  const toast = useToast();
  return (
    <>
      <Button
        onPress={() =>
          toast.add({
            title: 'سریال ذخیره شد',
            description: 'تغییرات در فهرست ثبت شدند.',
            tone: 'success',
            actionLabel: 'بازگردانی',
            onAction: onUndo,
          })
        }
      >
        نمایش اعلان
      </Button>
      <Button
        onPress={() =>
          toast.add({
            title: 'کپی شد',
            tone: 'neutral',
          })
        }
      >
        اعلان خنثی
      </Button>
    </>
  );
}

describe('Toast and ToastRegion', () => {
  it('enqueues, triggers action, and dismisses toasts via ToastProvider', async () => {
    const onUndo = vi.fn();
    renderNds(
      <ToastProvider>
        <ToastTriggerDemo onUndo={onUndo} />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'نمایش اعلان' }));
    expect(await screen.findByText('سریال ذخیره شد')).toBeTruthy();
    expect(screen.getByText('تغییرات در فهرست ثبت شدند.')).toBeTruthy();

    await expectNoAxeViolations(document.body);

    await userEvent.click(screen.getByRole('button', { name: 'بازگردانی' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText('سریال ذخیره شد')).toBeNull();
    });

    await userEvent.click(screen.getByRole('button', { name: 'اعلان خنثی' }));
    expect(await screen.findByText('کپی شد')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'بستن' }));
    await waitFor(() => {
      expect(screen.queryByText('کپی شد')).toBeNull();
    });
  });

  it('renders static preview toasts cleanly with status/alert roles and zero axe violations', async () => {
    const { container } = renderNds(
      <>
        <Toast title="پیوند کپی شد" tone="neutral" />
        <Toast title="اطلاع" description="نسخهٔ تازه در دسترس است." tone="info" />
        <Toast title="ذخیره شد" tone="success" />
        <Toast title="هشدار" tone="warning" actionLabel="بررسی" />
        <Toast title="خطا در ارسال" description="دوباره تلاش کنید." tone="danger" />
      </>,
    );

    expect(screen.getAllByRole('status')).toHaveLength(4);
    expect(screen.getByRole('alert')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
