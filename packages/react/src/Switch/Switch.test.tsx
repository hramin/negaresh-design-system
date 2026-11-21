import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Switch } from './Switch.tsx';

describe('Switch', () => {
  it('toggles via pointer and keyboard, supports description/readOnly/disabled, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <>
        <Switch
          ref={ref}
          description="پس از ثبت نتیجه، لینک گزارش پیامک می‌شود."
          onChange={onChange}
          className="custom-switch"
        >
          ارسال خودکار گزارش
        </Switch>
        <Switch defaultSelected isReadOnly>
          ثبت گزارش ممیزی
        </Switch>
        <Switch isDisabled>ارسال شبانه</Switch>
      </>,
    );

    const toggle = screen.getByRole('switch', { name: 'ارسال خودکار گزارش' }) as HTMLInputElement;
    expect(ref.current).toBe(toggle);
    expect(container.querySelector('[data-nds="Switch"]')?.classList.contains('custom-switch')).toBe(
      true,
    );
    const describedBy = toggle.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(describedBy)?.textContent).toContain('لینک گزارش');
    expect(toggle.checked).toBe(false);

    await user.click(toggle);
    expect(toggle.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);

    await user.keyboard(' ');
    expect(toggle.checked).toBe(false);

    const readOnly = screen.getByRole('switch', { name: 'ثبت گزارش ممیزی' }) as HTMLInputElement;
    await user.click(readOnly);
    expect(readOnly.checked).toBe(true);

    expect((screen.getByRole('switch', { name: 'ارسال شبانه' }) as HTMLInputElement).disabled).toBe(
      true,
    );
    await expectNoAxeViolations(container);
  });
});
