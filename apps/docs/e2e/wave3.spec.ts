import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

test('number field displays Persian digits, normalizes Latin/Persian input, and steps via buttons and keyboard', async ({
  page,
}) => {
  await page.goto('/components/number-field');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('number-field'));
  const input = region.getByRole('textbox', { name: 'ظرفیت کارگاه' });
  await expect(input).toHaveValue('۱۲');

  const inc = region.getByRole('button', { name: /افزایش ظرفیت کارگاه/ });
  const dec = region.getByRole('button', { name: /کاهش ظرفیت کارگاه/ });
  await inc.click();
  await expect(input).toHaveValue('۱۳');
  await dec.click();
  await expect(input).toHaveValue('۱۲');

  // Latin input normalizes to Persian digits on blur
  await input.fill('25');
  await input.press('Tab');
  await expect(input).toHaveValue('۲۵');
  await expect(region).toContainText('۲۵ نفر');

  // ArrowUp stepping from focused Persian number
  await input.focus();
  await page.keyboard.press('ArrowUp');
  await expect(input).toHaveValue('۲۶');
});

test('slider and range slider support RTL keyboard stepping, Persian ticks, and Persian range output', async ({
  page,
}) => {
  await page.goto('/components/slider');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('slider'));

  const single = region.getByRole('slider', { name: 'آستانهٔ اطمینان آزمون' });
  await expect(single).toHaveValue('60');
  await expect(region).toContainText('۲۵٪');
  await expect(region).toContainText('۱۰۰٪');

  await single.focus();
  // In RTL horizontal slider, ArrowLeft increases toward inline-end.
  await page.keyboard.press('ArrowLeft');
  await expect(single).toHaveValue('65');
  await page.keyboard.press('End');
  await expect(single).toHaveValue('100');

  const lowThumb = region.getByRole('slider', { name: /حد پایین/ });
  const highThumb = region.getByRole('slider', { name: /حد بالا/ });
  await expect(lowThumb).toHaveValue('200000');
  await expect(highThumb).toHaveValue('700000');
  await expect(region.locator('[data-nds="RangeSlider"] output')).toContainText('تا');

  await lowThumb.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(lowThumb).toHaveValue('250000');
});

test('Jalali DatePicker and DateRangePicker pass RTL keyboard navigation, ARIA/SR checks, and axe with popover open', async ({
  page,
}) => {
  await page.goto('/components/date-picker');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('date-picker'));
  const singleField = region.locator('[data-nds="DatePicker"]');

  // Jalali segments display Persian digits for 2026-11-13 (۱۴۰۵/۸/۲۲)
  await expect(singleField.getByRole('spinbutton', { name: /^سال/ })).toHaveText('۱۴۰۵');
  await expect(singleField.getByRole('spinbutton', { name: /^ماه/ })).toHaveText('۸');
  await expect(singleField.getByRole('spinbutton', { name: /^روز/ })).toHaveText('۲۲');

  // Open Jalali popover strictly by keyboard
  const trigger = singleField.getByRole('button', { name: /باز کردن تقویم/ });
  await trigger.focus();
  await page.keyboard.press('Enter');

  const popover = page.locator('[data-nds="DatePickerPopover"]');
  const dialog = popover.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('[data-nds="DatePickerPopover"][data-entering]')).toHaveCount(0);

  // Persian visual month heading ("آبان ۱۴۰۵") & Saturday-first narrow headers
  await expect(dialog.locator('h2[aria-hidden="true"]')).toHaveText('آبان ۱۴۰۵');
  const headers = await dialog.locator('thead th').allTextContents();
  expect(headers).toEqual(['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']);

  // Localized Persian dismiss button inside popover (zero English "Dismiss")
  await expect(popover.locator('button[aria-label="بستن"]').first()).toBeAttached();
  await expect(popover.locator('button[aria-label="Dismiss"]')).toHaveCount(0);

  // Friday 22 Aban is focused, selected, and marked as weekend with Persian weekday label
  const activeBefore = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    ariaLabel: document.activeElement?.getAttribute('aria-label'),
    weekend: document.activeElement?.getAttribute('data-weekend'),
    selected: document.activeElement?.getAttribute('data-selected'),
  }));
  expect(activeBefore.text).toBe('۲۲');
  expect(activeBefore.ariaLabel).toContain('جمعه');
  expect(activeBefore.weekend).toBe('true');
  expect(activeBefore.selected).toBe('true');

  // Zero WCAG 2.2 AA axe violations while the Jalali calendar popover is open
  const openAxe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  expect(openAxe.violations).toEqual([]);

  // RTL grid keyboard traversal:
  // ArrowRight -> previous day (۲۱ آبان، پنجشنبه)
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(':focus')).toHaveText('۲۱');
  expect(await page.locator(':focus').getAttribute('aria-label')).toContain('پنجشنبه');

  // Home -> first day of visible Jalali month (۱ آبان ۱۴۰۵ = minValue: نخستین تاریخ در دسترس)
  await page.keyboard.press('Home');
  await expect(page.locator(':focus')).toHaveText('۱');
  expect(await page.locator(':focus').getAttribute('aria-label')).toContain('نخستین تاریخ در دسترس');

  // End -> last day of visible Jalali month (۳۰ آبان ۱۴۰۵)
  await page.keyboard.press('End');
  await expect(page.locator(':focus')).toHaveText('۳۰');

  // PageDown -> next Jalali month (آذر ۱۴۰۵); PageUp -> back to آبان ۱۴۰۵
  await page.keyboard.press('PageDown');
  await expect(dialog.locator('h2[aria-hidden="true"]')).toHaveText('آذر ۱۴۰۵');
  await expect(dialog.getByRole('grid')).toHaveAttribute('aria-label', /آذر/);
  await page.keyboard.press('PageUp');
  await expect(dialog.locator('h2[aria-hidden="true"]')).toHaveText('آبان ۱۴۰۵');
  await expect(dialog.getByRole('grid')).toHaveAttribute('aria-label', /آبان/);

  // Focus ۲۲ آبان, move forward via ArrowLeft across unavailable ۲۳ آبان to ۲۴ آبان, and select with Enter
  await dialog
    .locator('[role="gridcell"] [role="button"]:not([data-outside-month])', { hasText: /^۲۲$/ })
    .focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator(':focus')).toHaveAttribute('data-unavailable', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator(':focus')).toHaveText('۲۴');
  await page.keyboard.press('Enter');

  await expect(dialog).toBeHidden();
  await expect(singleField.getByRole('spinbutton', { name: /^روز/ })).toHaveText('۲۴');
  await expect(region).toContainText('2026-11-15');
  // Verify React Aria LiveAnnouncer announces the selected Persian date
  await expect(page.locator('[data-live-announcer="true"]')).toContainText(/آبان/);

  // Re-open and dismiss with Escape cleanly
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  // DateRangePicker keyboard range selection
  const rangeField = region.locator('[data-nds="DateRangePicker"]');
  const rangeTrigger = rangeField.getByRole('button', { name: /باز کردن تقویم/ });
  await rangeTrigger.focus();
  await page.keyboard.press('Enter');
  const rangeDialog = page.locator('[data-nds="DateRangePickerPopover"]').getByRole('dialog');
  await expect(rangeDialog).toBeVisible();
  await expect(rangeDialog.locator('h2[aria-hidden="true"]')).toHaveText('آبان ۱۴۰۵');

  // Initial focused cell announces the full selected Jalali range in Persian
  expect(await page.locator(':focus').getAttribute('aria-label')).toContain('بازهٔ انتخاب‌شده:');

  // Select 21 Aban -> 24 Aban via keyboard (Enter sets anchor 21 & advances focus to 22; ArrowLeft x2 -> 24)
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await expect(rangeDialog).toBeHidden();
  await expect(region).toContainText('۲۱ آبان ۱۴۰۵ تا ۲۴ آبان ۱۴۰۵');
});

test('time field supports 24-hour Persian segment stepping and direct editing', async ({ page }) => {
  await page.goto('/components/time-field');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('time-field'));
  const firstField = region.locator('[data-nds="TimeField"]').first();

  const hour = firstField.getByRole('spinbutton', { name: /^ساعت/ });
  const minute = firstField.getByRole('spinbutton', { name: /^دقیقه/ });
  await expect(hour).toHaveText('۱۴');
  await expect(minute).toHaveText('۳۰');

  await hour.focus();
  await page.keyboard.press('ArrowUp');
  await expect(hour).toHaveText('۱۵');
  await expect(region).toContainText('۱۵:۳۰');

  await minute.focus();
  await page.keyboard.press('ArrowDown');
  await expect(minute).toHaveText('۲۹');
  await expect(region).toContainText('۱۵:۲۹');
});

test('wave 3 controls keep 44 px targets and visible focus under forced colors and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });

  // NumberField stepper >= 44x44
  await page.goto('/components/number-field');
  await page.waitForLoadState('networkidle');
  const incBtn = page
    .locator(example('number-field'))
    .getByRole('button', { name: /افزایش ظرفیت کارگاه/ });
  const incRect = await incBtn.boundingBox();
  expect(incRect?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(incRect?.height ?? 0).toBeGreaterThanOrEqual(44);

  // DatePicker trigger + open Jalali Calendar day cells >= 44x44 and visible focus
  await page.goto('/components/date-picker');
  await page.waitForLoadState('networkidle');
  const trigger = page
    .locator(example('date-picker'))
    .locator('[data-nds="DatePicker"]')
    .getByRole('button', { name: /باز کردن تقویم/ });
  await trigger.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(trigger).toHaveAttribute('data-focus-visible', 'true');
  const trigMetrics = await trigger.evaluate((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      outlineStyle: s.outlineStyle,
      outlineWidth: Number.parseFloat(s.outlineWidth),
      width: r.width,
      height: r.height,
    };
  });
  expect(trigMetrics.outlineStyle).not.toBe('none');
  expect(trigMetrics.outlineWidth).toBeGreaterThan(0);
  expect(trigMetrics.width).toBeGreaterThanOrEqual(44);
  expect(trigMetrics.height).toBeGreaterThanOrEqual(44);

  await page.keyboard.press('Enter');
  const focusedCell = page.locator('[data-nds="DatePickerPopover"] [role="gridcell"] [role="button"]:focus');
  const cellRect = await focusedCell.boundingBox();
  expect(cellRect?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(cellRect?.height ?? 0).toBeGreaterThanOrEqual(44);
});
