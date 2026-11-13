import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderNds } from '../test/render.tsx';
import { CopyButton } from './CopyButton.tsx';

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('CopyButton', () => {
  afterEach(() => vi.useRealTimers());

  it('copies the value and announces success, then resets', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    const onCopy = vi.fn();
    mockClipboard(writeText);
    renderNds(
      <CopyButton
        value="441790826153"
        aria-label="کپی کد فعال‌سازی"
        onCopy={onCopy}
        feedbackDuration={50}
      >
        کپی کد
      </CopyButton>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'کپی کد فعال‌سازی' }));
    expect(writeText).toHaveBeenCalledWith('441790826153');
    expect(onCopy).toHaveBeenCalledWith('441790826153');
    expect(screen.getByRole('status').textContent).toBe('کپی شد');
    expect(screen.getByRole('button').textContent).toContain('کپی شد');
    await act(() => new Promise((r) => setTimeout(r, 80)));
    expect(screen.getByRole('status').textContent).toBe('');
    expect(screen.getByRole('button').textContent).toContain('کپی کد');
  });

  it('uses the catalogue label and reports failures', async () => {
    mockClipboard(() => Promise.reject(new Error('denied')));
    renderNds(<CopyButton value="x" />);
    const button = screen.getByRole('button', { name: 'کپی' });
    await userEvent.click(button);
    expect(screen.getByRole('status').textContent).toBe('کپی نشد؛ متن را دستی انتخاب کنید');
  });
});
