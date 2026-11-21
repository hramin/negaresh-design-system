import { iconChart, iconFile } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { SegmentedControl, SegmentedControlItem } from './SegmentedControl.tsx';

describe('SegmentedControl', () => {
  it('enforces single non-empty selection, forwards ref, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <SegmentedControl
        ref={ref}
        label="نمای گزارش"
        description="برای نوجوانان نمای آرام پیشنهاد می‌شود."
        defaultValue="pro"
        onChange={onChange}
        className="custom-seg"
      >
        <SegmentedControlItem id="pro" icon={iconChart}>
          حرفه‌ای
        </SegmentedControlItem>
        <SegmentedControlItem id="calm" icon={iconFile}>
          آرام
        </SegmentedControlItem>
        <SegmentedControlItem id="print" isDisabled>
          چاپ
        </SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(
      container.querySelector('[data-nds="SegmentedControl"]')?.classList.contains('custom-seg'),
    ).toBe(true);
    expect(ref.current?.getAttribute('role')).toBe('radiogroup');
    const pro = screen.getByRole('radio', { name: 'حرفه‌ای' }) as HTMLButtonElement;
    const calm = screen.getByRole('radio', { name: 'آرام' }) as HTMLButtonElement;
    const print = screen.getByRole('radio', { name: 'چاپ' }) as HTMLButtonElement;

    expect(pro.getAttribute('aria-checked')).toBe('true');
    expect(print.disabled).toBe(true);

    // Clicking the already selected option keeps it selected (disallowEmptySelection).
    await user.click(pro);
    expect(pro.getAttribute('aria-checked')).toBe('true');

    await user.click(calm);
    expect(calm.getAttribute('aria-checked')).toBe('true');
    expect(onChange).toHaveBeenCalledWith('calm');
    await expectNoAxeViolations(container);
  });
});
