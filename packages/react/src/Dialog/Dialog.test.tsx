import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { AlertDialog, Dialog, DialogTrigger } from './Dialog.tsx';

describe('Dialog and AlertDialog', () => {
  it('opens from DialogTrigger, links heading, passes axe while open, closes via Escape and restores focus', async () => {
    const dialogRef = createRef<HTMLElement>();
    renderNds(
      <DialogTrigger>
        <Button>باز کردن پنجره</Button>
        <Dialog
          ref={dialogRef}
          title="جزئیات فعال‌سازی"
          description="اطلاعات کامل سریال را بررسی کنید."
          size="lg"
          footer={(close) => (
            <Button variant="primary" onPress={close}>
              بستن
            </Button>
          )}
        >
          متن بدنهٔ پنجره.
        </Dialog>
      </DialogTrigger>,
    );

    const trigger = screen.getByRole('button', { name: 'باز کردن پنجره' });
    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'جزئیات فعال‌سازی' });
    expect(dialog).toBe(dialogRef.current);
    expect(dialog.dataset.nds).toBe('Dialog');
    expect(screen.getByText('اطلاعات کامل سریال را بررسی کنید.')).toBeTruthy();
    expect(screen.getByText('متن بدنهٔ پنجره.')).toBeTruthy();

    await expectNoAxeViolations(document.body);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  });

  it('closes via the Persian close button and supports controlled open state', async () => {
    const onOpenChange = vi.fn();
    renderNds(
      <Dialog isOpen onOpenChange={onOpenChange} title="پنجرهٔ کنترل‌شده" size="sm">
        محتوای کنترل‌شده
      </Dialog>,
    );

    expect(await screen.findByRole('dialog', { name: 'پنجرهٔ کنترل‌شده' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'بستن پنجره' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders AlertDialog with alertdialog role, danger tone, confirm/cancel actions, and passes axe', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    renderNds(
      <DialogTrigger>
        <Button variant="danger">باطل کردن سریال</Button>
        <AlertDialog
          tone="danger"
          title="باطل کردن سریال؟"
          confirmLabel="باطل شود"
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          پس از باطل کردن، این سریال دیگر قابل فعال‌سازی نخواهد بود.
        </AlertDialog>
      </DialogTrigger>,
    );

    const trigger = screen.getByRole('button', { name: 'باطل کردن سریال' });
    await userEvent.click(trigger);

    const alertDialog = await screen.findByRole('alertdialog', { name: 'باطل کردن سریال؟' });
    expect(alertDialog.dataset.nds).toBe('AlertDialog');
    expect(alertDialog.dataset.tone).toBe('danger');
    await expectNoAxeViolations(document.body);

    await userEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).toBeNull();
    });

    await userEvent.click(trigger);
    await screen.findByRole('alertdialog');
    await userEvent.click(screen.getByRole('button', { name: 'باطل شود' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).toBeNull();
    });
  });
});
