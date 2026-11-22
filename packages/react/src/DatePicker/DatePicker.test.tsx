import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { DatePicker, DateRangePicker } from './DatePicker.tsx';

// 2026-11-13 = Friday 22 Aban 1405 (۱۴۰۵/۸/۲۲)
const ABAN_22_ISO = '2026-11-13';

function persianDay(month: string, day: string): RegExp {
  return new RegExp(`(${month}\\s+${day}(?![۰-۹])|(?<![۰-۹])${day}\\s+${month})`);
}

describe('Jalali DatePicker and DateRangePicker', () => {
  it('displays Persian Jalali date segments, opens Jalali popover via keyboard, navigates & selects, closes on Escape, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <DatePicker
        ref={ref}
        label="تاریخ تولد"
        description="تقویم خورشیدی (جلالی)"
        defaultValue={ABAN_22_ISO}
        onChange={onChange}
        className="custom-dp"
      />,
    );

    expect(ref.current?.getAttribute('data-nds')).toBe('DatePicker');
    expect(ref.current?.classList.contains('custom-dp')).toBe(true);

    // Jalali segments rendered in Persian digits: year ۱۴۰۵, month ۸, day ۲۲
    const yearSeg = screen.getByRole('spinbutton', { name: /^سال/ });
    const monthSeg = screen.getByRole('spinbutton', { name: /^ماه/ });
    const daySeg = screen.getByRole('spinbutton', { name: /^روز/ });
    expect(yearSeg.textContent).toBe('۱۴۰۵');
    expect(monthSeg.textContent).toBe('۸');
    expect(daySeg.textContent).toBe('۲۲');

    // Open calendar popover via keyboard on trigger button
    const trigger = screen.getByRole('button', { name: /باز کردن تقویم/ });
    trigger.focus();
    await user.keyboard('{Enter}');

    const dialog = screen.getByRole('dialog');
    const heading = within(dialog).getByRole('heading', { name: /آبان/ });
    expect(heading.textContent).toContain('۱۴۰۵');

    // Localized Persian dismiss button inside popover (from @react-aria/overlays)
    expect(screen.getAllByRole('button', { name: 'بستن' }).length).toBeGreaterThan(0);

    // Zero axe violations while calendar popover is open
    await expectNoAxeViolations(document.body);

    // Navigate RTL with ArrowRight (previous day: 21 Aban = 2026-11-12) and select with Enter
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenCalledWith('2026-11-12');
    expect(daySeg.textContent).toBe('۲۱');
    expect(screen.queryByRole('dialog')).toBeNull();

    // Re-open and close cleanly with Escape
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();

    await expectNoAxeViolations(container);
  });

  it('supports DateRangePicker start/end Jalali segments, popover range selection, invalid alerts, and passes axe', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderNds(
      <>
        <DateRangePicker
          label="بازهٔ برگزاری دوره"
          defaultValue={{ start: '2026-11-11', end: '2026-11-17' }}
          onChange={onChange}
        />
        <DatePicker
          label="تاریخ انقضا"
          placeholderValue={ABAN_22_ISO}
          isInvalid
          errorMessage="تاریخ انقضا الزامی است."
        />
        <DatePicker
          label="در حال بررسی"
          defaultValue={ABAN_22_ISO}
          isPending
        />
      </>,
    );

    expect(screen.getByRole('alert').textContent).toContain('تاریخ انقضا الزامی است.');
    expect(screen.getByRole('progressbar', { name: 'در حال انجام' })).toBeTruthy();

    // Open DateRangePicker popover (first calendar trigger button)
    const triggers = screen.getAllByRole('button', { name: /باز کردن تقویم/ });
    const rangeTrigger = triggers[0];
    expect(rangeTrigger).toBeTruthy();
    await user.click(rangeTrigger as HTMLElement);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /آبان/ })).toBeTruthy();

    // Select 21 Aban (2026-11-12) -> 24 Aban (2026-11-15)
    await user.click(within(dialog).getByRole('button', { name: persianDay('آبان', '۲۱') }));
    await user.click(within(dialog).getByRole('button', { name: persianDay('آبان', '۲۴') }));
    expect(onChange).toHaveBeenCalledWith({ start: '2026-11-12', end: '2026-11-15' });

    await expectNoAxeViolations(container);
  });
});
