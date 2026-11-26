import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Calendar, RangeCalendar } from './Calendar.tsx';

// Fixed Jalali anchor: 2026-11-13 = Friday 22 Aban 1405 (جمعه ۲۲ آبان ۱۴۰۵)
// Aban 1405 starts on 2026-10-23 (Friday, 1 Aban 1405) and has 30 days.
const ABAN_22_ISO = '2026-11-13';

/** Matches an ICU Persian date label regardless of month/day ordering across ICU versions. */
function persianDay(month: string, day: string): RegExp {
  return new RegExp(`(${month}\\s+${day}(?![۰-۹])|(?<![۰-۹])${day}\\s+${month})`);
}

describe('Jalali Calendar and RangeCalendar', () => {
  it('renders Persian month heading, Saturday-first headers, Friday weekend markers, RTL keyboard navigation, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <Calendar
        ref={ref}
        aria-label="تاریخ جلسه"
        defaultValue={ABAN_22_ISO}
        isDateUnavailable={(iso) => iso === '2026-11-14'}
        onChange={onChange}
        className="custom-cal"
      />,
    );

    expect(ref.current?.getAttribute('data-nds')).toBe('Calendar');
    expect(ref.current?.classList.contains('custom-cal')).toBe(true);

    // Accessible Jalali month & year heading (آبان + ۱۴۰۵)
    const heading = screen.getByRole('heading', { name: /آبان/ });
    expect(heading.textContent).toContain('۱۴۰۵');

    // Saturday-first narrow Persian weekday headers in the grid
    const headers = Array.from(container.querySelectorAll('thead th'));
    expect(headers).toHaveLength(7);
    expect(headers.map((h) => h.textContent)).toEqual(['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']);

    // Friday (22 Aban 1405 = 2026-11-13) marked as weekend with full Persian weekday name
    const grid = screen.getByRole('grid');
    const friday22 = within(grid).getByRole('button', { name: persianDay('آبان', '۲۲') });
    const thursday21 = within(grid).getByRole('button', { name: persianDay('آبان', '۲۱') });
    expect(friday22.getAttribute('aria-label')).toContain('جمعه');
    expect(friday22.getAttribute('data-weekend')).toBe('true');
    expect(friday22.getAttribute('data-selected')).toBe('true');
    expect(thursday21.getAttribute('aria-label')).toContain('پنجشنبه');
    expect(thursday21.getAttribute('data-weekend')).toBeNull();

    // Unavailable date (23 Aban 1405 = 2026-11-14, Saturday) stays focusable with data-unavailable
    const unavailable23 = within(grid).getByRole('button', { name: persianDay('آبان', '۲۳') });
    expect(unavailable23.getAttribute('aria-label')).toContain('شنبه');
    expect(unavailable23.getAttribute('data-unavailable')).toBe('true');

    // RTL keyboard traversal: ArrowRight moves to previous day (21 Aban),
    // ArrowLeft moves to next day (22 -> 23 -> 24 Aban), PageDown/PageUp change Jalali months.
    friday22.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(thursday21);

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('2026-11-12');

    // Navigate forward across unavailable Saturday 23 Aban to Sunday 24 Aban
    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    const sunday24 = within(grid).getByRole('button', { name: persianDay('آبان', '۲۴') });
    expect(document.activeElement).toBe(sunday24);
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('2026-11-15');

    // PageDown advances to next Jalali month (آذر ۱۴۰۵) and PageUp returns to آبان ۱۴۰۵
    await user.keyboard('{PageDown}');
    expect(screen.getByRole('heading', { name: /آذر/ })).toBeTruthy();
    await user.keyboard('{PageUp}');
    expect(screen.getByRole('heading', { name: /آبان/ })).toBeTruthy();

    // Next / previous month buttons have localized Persian labels
    const nextBtn = screen.getByRole('button', { name: 'ماه بعد' });
    const prevBtn = screen.getByRole('button', { name: 'ماه قبل' });
    await user.click(nextBtn);
    expect(screen.getByRole('heading', { name: /آذر/ })).toBeTruthy();
    await user.click(prevBtn);
    expect(screen.getByRole('heading', { name: /آبان/ })).toBeTruthy();

    await expectNoAxeViolations(container);
  });

  it('supports RangeCalendar selection with logical start/end caps, min/max bounds, and passes axe', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderNds(
      <RangeCalendar
        aria-label="بازهٔ رزرو"
        defaultValue={{ start: '2026-11-11', end: '2026-11-15' }}
        minValue="2026-11-05"
        maxValue="2026-11-20"
        onChange={onChange}
      />,
    );

    const grid = screen.getByRole('grid');
    const dayCell = (digits: string) => {
      const cell = Array.from(
        grid.querySelectorAll<HTMLElement>(
          '[role="gridcell"] [role="button"]:not([data-outside-month])',
        ),
      ).find((el) => el.textContent?.trim() === digits);
      if (!cell) throw new Error(`Day cell ${digits} not found`);
      return cell;
    };

    // 20 Aban = 2026-11-11 (start), 22 Aban = 2026-11-13 (mid), 24 Aban = 2026-11-15 (end)
    const startCell = dayCell('۲۰');
    const midCell = dayCell('۲۲');
    const endCell = dayCell('۲۴');

    expect(startCell.getAttribute('data-selection-start')).toBe('true');
    expect(startCell.getAttribute('aria-label')).toContain('آبان');
    expect(midCell.getAttribute('data-selected')).toBe('true');
    expect(midCell.getAttribute('data-selection-start')).toBeNull();
    expect(endCell.getAttribute('data-selection-end')).toBe('true');

    // Date before minValue (1 Aban = 2026-10-23) is disabled
    const disabledDay = dayCell('۱');
    expect(disabledDay.getAttribute('data-disabled')).toBe('true');

    // Select a new range: 21 Aban (2026-11-12) to 25 Aban (2026-11-16)
    await user.click(dayCell('۲۱'));
    await user.click(dayCell('۲۵'));
    expect(onChange).toHaveBeenCalledWith({ start: '2026-11-12', end: '2026-11-16' });

    await expectNoAxeViolations(container);
  });
});
