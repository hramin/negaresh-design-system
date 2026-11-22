import { expect, type Locator, type Page, test } from '@playwright/test';
import { COMPONENT_SLUGS, THEMES } from './routes.ts';

/**
 * Visual snapshots of every states gallery (docs/quality.md): light/dark × 1440/390.
 * Baselines come from the pinned Playwright image (mcr.microsoft.com/playwright:v1.65.0-noble)
 * so fonts and rasterisation match CI. Run with NDS_VISUAL=1 inside that image:
 *   pnpm --filter @negaresh/docs test:visual
 */
test.skip(
  !process.env.NDS_VISUAL,
  'visual snapshots run in the pinned Playwright image (NDS_VISUAL=1)',
);

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(0, 0);
}

const HIDE_HEADER_SLUGS = new Set([
  'text-field',
  'text-area',
  'search-field',
  'phone-field',
  'serial-field',
  'password-field',
  'form',
  'select',
  'combobox',
  'checkbox',
  'radio-group',
  'choice-card',
  'segmented-control',
  'switch',
  'tag-group',
  'number-field',
  'slider',
  'date-picker',
  'time-field',
]);

const snap = (locator: Locator, name: string, hidePageHeader = false) =>
  expect(locator).toHaveScreenshot(name, {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.001,
    // Tall new galleries must remain fully visible beneath the sticky page chrome.
    // Existing P2 captures keep their original settings and baselines.
    ...(hidePageHeader ? { style: 'header { visibility: hidden !important; }' } : {}),
  });

for (const theme of THEMES) {
  for (const slug of COMPONENT_SLUGS) {
    test(`gallery ${slug} (${theme})`, async ({ page }) => {
      await open(page, `/components/${slug}?theme=${theme}`);
      await snap(
        page.locator(`[data-gallery="${slug}"]`),
        `${slug}-${theme}.png`,
        HIDE_HEADER_SLUGS.has(slug),
      );
    });
  }

  test(`icon grid (${theme})`, async ({ page }) => {
    await open(page, `/foundations/icons?theme=${theme}`);
    await snap(page.locator('[data-gallery="icons"]'), `icons-${theme}.png`);
  });

  for (const slug of [
    'text-field',
    'text-area',
    'search-field',
    'phone-field',
    'serial-field',
    'password-field',
  ]) {
    test(`field ${slug} hover and focus-visible (${theme})`, async ({ page }) => {
      await open(page, `/components/${slug}?theme=${theme}`);
      const region = page.locator(`[data-interactive="${slug}"]`);
      const input = region.locator('input:not([type="hidden"]), textarea').first();
      await input.hover();
      await snap(region, `${slug}-hover-${theme}.png`, true);
      await page.mouse.move(0, 0);
      await input.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(input).toHaveAttribute('data-focus-visible', 'true');
      await snap(region, `${slug}-focus-${theme}.png`, true);
    });
  }

  test(`select open listbox (${theme})`, async ({ page }) => {
    await open(page, `/components/select?theme=${theme}`);
    const region = page.locator('[data-interactive="select"]');
    const trigger = region.getByRole('button', { name: /استان ارسال/ });
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.click();
    await expect(page.getByRole('listbox')).toBeVisible();
    const popover = page.locator('[data-nds="SelectPopover"]');
    await expect(page.locator('[data-nds="SelectPopover"][data-entering]')).toHaveCount(0);
    const box = await popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect);
    const x = Math.max(0, Math.floor(box.x));
    const y = Math.max(0, Math.floor(box.y));
    const width = Math.ceil(box.x + box.width) - x;
    const height = Math.ceil(box.y + box.height) - y;
    await expect(page).toHaveScreenshot(`select-open-${theme}.png`, {
      clip: { x, y, width, height },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`combobox open create-new listbox (${theme})`, async ({ page }) => {
    await open(page, `/components/combobox?theme=${theme}`);
    const region = page.locator('[data-interactive="combobox"]');
    const input = region.getByRole('combobox');
    await input.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await input.click();
    await input.fill('روان‌سنجی نوجوان');
    await expect(page.getByRole('option', { name: /افزودن «روان‌سنجی نوجوان»/ })).toBeVisible();
    const popover = page.locator('[data-nds="ComboBoxPopover"]');
    await expect(page.locator('[data-nds="ComboBoxPopover"][data-entering]')).toHaveCount(0);
    const box = await popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect);
    const x = Math.max(0, Math.floor(box.x));
    const y = Math.max(0, Math.floor(box.y));
    const width = Math.ceil(box.x + box.width) - x;
    const height = Math.ceil(box.y + box.height) - y;
    await expect(page).toHaveScreenshot(`combobox-open-${theme}.png`, {
      clip: { x, y, width, height },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`date-picker open Jalali calendar popover (${theme})`, async ({ page }) => {
    await open(page, `/components/date-picker?theme=${theme}`);
    const region = page.locator('[data-interactive="date-picker"]');
    const trigger = region
      .locator('[data-nds="DatePicker"]')
      .getByRole('button', { name: /باز کردن تقویم/ });
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.click();
    const popover = page.locator('[data-nds="DatePickerPopover"]');
    await expect(popover).toBeVisible();
    await expect(page.locator('[data-nds="DatePickerPopover"][data-entering]')).toHaveCount(0);
    const box = await popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect);
    const x = Math.max(0, Math.floor(box.x));
    const y = Math.max(0, Math.floor(box.y));
    const width = Math.ceil(box.x + box.width) - x;
    const height = Math.ceil(box.y + box.height) - y;
    await expect(page).toHaveScreenshot(`date-picker-open-${theme}.png`, {
      clip: { x, y, width, height },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`date-range-picker open Jalali calendar popover (${theme})`, async ({ page }) => {
    await open(page, `/components/date-picker?theme=${theme}`);
    const region = page.locator('[data-interactive="date-picker"]');
    const trigger = region
      .locator('[data-nds="DateRangePicker"]')
      .getByRole('button', { name: /باز کردن تقویم/ });
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.click();
    const popover = page.locator('[data-nds="DateRangePickerPopover"]');
    await expect(popover).toBeVisible();
    await expect(page.locator('[data-nds="DateRangePickerPopover"][data-entering]')).toHaveCount(0);
    const box = await popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect);
    const x = Math.max(0, Math.floor(box.x));
    const y = Math.max(0, Math.floor(box.y));
    const width = Math.ceil(box.x + box.width) - x;
    const height = Math.ceil(box.y + box.height) - y;
    await expect(page).toHaveScreenshot(`date-range-picker-open-${theme}.png`, {
      clip: { x, y, width, height },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test.describe('interaction states', () => {
    test.skip(({ isMobile }) => isMobile, 'pointer and keyboard states are captured on desktop');

    test(`wave2 focus-visible states (${theme})`, async ({ page }) => {
      for (const item of [
        { slug: 'segmented-control', selector: '[data-nds="SegmentedControlItem"]' },
        { slug: 'switch', selector: 'input[type="checkbox"]' },
        { slug: 'choice-card', selector: 'input[type="radio"]' },
      ] as const) {
        await open(page, `/components/${item.slug}?theme=${theme}`);
        const region = page.locator(`[data-interactive="${item.slug}"]`);
        const target = region.locator(item.selector).first();
        await target.focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await snap(region, `${item.slug}-focus-${theme}.png`, true);
      }
    });

    test(`wave3 focus-visible states (${theme})`, async ({ page }) => {
      for (const item of [
        { slug: 'number-field', selector: 'input:not([type="hidden"])' },
        { slug: 'slider', selector: 'input[type="range"]' },
        { slug: 'time-field', selector: '[role="spinbutton"]' },
      ] as const) {
        await open(page, `/components/${item.slug}?theme=${theme}`);
        const region = page.locator(`[data-interactive="${item.slug}"]`);
        const target = region.locator(item.selector).first();
        await target.focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await snap(region, `${item.slug}-focus-${theme}.png`, true);
      }
    });

    for (const variant of ['primary', 'secondary', 'ghost'] as const) {
      test(`button ${variant} hover / pressed / focus-visible (${theme})`, async ({ page }) => {
        await open(page, `/components/button?theme=${theme}`);
        const state = page.locator(`[data-interactive="${variant}"]`);
        const button = state.getByRole('button');
        await button.hover();
        await snap(state, `button-${variant}-hover-${theme}.png`);
        await page.mouse.down();
        await snap(state, `button-${variant}-pressed-${theme}.png`);
        await page.mouse.up();
        await page.mouse.move(0, 0);
        // Keyboard navigation (Tab) so React Aria marks the focus as visible.
        await button.focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await expect(button).toHaveAttribute('data-focus-visible', 'true');
        await snap(state, `button-${variant}-focus-${theme}.png`);
      });
    }

    test(`link hover / focus-visible (${theme})`, async ({ page }) => {
      await open(page, `/components/link?theme=${theme}`);
      const state = page.locator('[data-interactive="link"]');
      const link = state.getByRole('link');
      await link.hover();
      await snap(state, `link-hover-${theme}.png`);
      await page.mouse.move(0, 0);
      await link.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(link).toHaveAttribute('data-focus-visible', 'true');
      await snap(state, `link-focus-${theme}.png`);
    });

    test(`menu open with submenu, by keyboard (${theme})`, async ({ page }) => {
      await open(page, `/components/menu?theme=${theme}`);
      const trigger = page.locator('[data-interactive="menu"]').getByRole('button');
      await trigger.evaluate((el) => {
        el.scrollIntoView({ block: 'center' });
        window.scrollTo(0, Math.round(window.scrollY));
      });
      await trigger.focus();
      const settle = () =>
        page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
      await page.keyboard.press('Enter');
      // The submenu is placed from its item: open it only once the menu has stopped moving.
      await settle();
      await page.keyboard.press('ArrowDown');
      // RTL: the submenu opens towards the inline end (left) with ArrowLeft.
      await page.keyboard.press('ArrowLeft');
      await expect(page.getByRole('menu')).toHaveCount(2);
      // Measure after the enter animations: their transform moves the popovers' rects.
      await settle();
      await expect(page.locator('[data-nds="MenuPopover"][data-entering]')).toHaveCount(0);
      const boxes = await page
        .locator('[data-nds="MenuPopover"]')
        .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON() as DOMRect));
      // Whole-pixel clip around both popovers (fractional rects would change the size by 1 px).
      const pad = 8;
      const x = Math.floor(Math.min(...boxes.map((b) => b.x)) - pad);
      const y = Math.floor(Math.min(...boxes.map((b) => b.y)) - pad);
      const width = Math.ceil(Math.max(...boxes.map((b) => b.x + b.width)) + pad) - x;
      const height = Math.ceil(Math.max(...boxes.map((b) => b.y + b.height)) + pad) - y;
      await expect(page).toHaveScreenshot(`menu-open-${theme}.png`, {
        clip: { x, y, width, height },
        animations: 'disabled',
        caret: 'hide',
        maxDiffPixelRatio: 0.001,
      });
    });

    test(`top-bar nav link hover / focus-visible (${theme})`, async ({ page }) => {
      await open(page, `/components/top-bar?theme=${theme}`);
      const state = page.locator('[data-interactive="top-bar-link"]');
      const link = state.getByRole('link');
      await link.hover();
      await snap(state, `top-bar-link-hover-${theme}.png`);
      await page.mouse.move(0, 0);
      await link.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(link).toHaveAttribute('data-focus-visible', 'true');
      await snap(state, `top-bar-link-focus-${theme}.png`);
    });

    test(`account-pill hover / pressed / focus-visible (${theme})`, async ({ page }) => {
      await open(page, `/components/account-pill?theme=${theme}`);
      const state = page.locator('[data-interactive="account-pill"]');
      const button = state.getByRole('button');
      await button.hover();
      await snap(state, `account-pill-hover-${theme}.png`);
      await page.mouse.down();
      await snap(state, `account-pill-pressed-${theme}.png`);
      await page.mouse.up();
      await page.mouse.move(0, 0);
      await button.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(button).toHaveAttribute('data-focus-visible', 'true');
      await snap(state, `account-pill-focus-${theme}.png`);
    });
  });
}
