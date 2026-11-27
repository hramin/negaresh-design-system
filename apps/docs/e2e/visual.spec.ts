import { expect, type Locator, type Page, test } from '@playwright/test';
import { ASSESSMENT_SLUGS, CHART_SLUGS, COMPONENT_SLUGS, PATTERN_SLUGS, THEMES } from './routes.ts';

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
  'otp-field',
  'file-upload',
  'inline-alert',
  'banner',
  'toast',
  'badge',
  'status-badge',
  'progress-meter',
  'usage-meter',
  'spinner',
  'skeleton',
  'empty-state',
  'error-page',
  'dialog',
  'sheet',
  'popover',
  'tooltip',
  'contextual-help',
  'avatar',
  'verified-badge',
  'card',
  'image',
  'key-value-list',
  'side-nav',
  'tab-strip',
  'tabs',
  'breadcrumbs',
  'pagination',
  'stepper',
  'disclosure',
  'user-menu',
  'footer',
  'data-table',
  'filter-bar',
  'bulk-action-bar',
  'list',
  'stat-tile',
  'timeline',
  'diff-view',
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

const PREHIDE_HEADER_SLUGS = new Set([
  'otp-field',
  'file-upload',
  'inline-alert',
  'banner',
  'toast',
  'badge',
  'status-badge',
  'progress-meter',
  'usage-meter',
  'spinner',
  'skeleton',
  'empty-state',
  'error-page',
  'dialog',
  'sheet',
  'popover',
  'tooltip',
  'contextual-help',
  'avatar',
  'verified-badge',
  'card',
  'image',
  'key-value-list',
  'side-nav',
  'tab-strip',
  'tabs',
  'breadcrumbs',
  'pagination',
  'stepper',
  'disclosure',
  'user-menu',
  'footer',
  'data-table',
  'filter-bar',
  'bulk-action-bar',
  'list',
  'stat-tile',
  'timeline',
  'diff-view',
]);

for (const theme of THEMES) {
  for (const slug of COMPONENT_SLUGS) {
    test(`gallery ${slug} (${theme})`, async ({ page }) => {
      await open(page, `/components/${slug}?theme=${theme}`);
      if (PREHIDE_HEADER_SLUGS.has(slug)) {
        await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
      }
      await snap(
        page.locator(`[data-gallery="${slug}"]`),
        `${slug}-${theme}.png`,
        HIDE_HEADER_SLUGS.has(slug),
      );
    });
  }

  for (const slug of CHART_SLUGS) {
    test(`chart gallery ${slug} (${theme})`, async ({ page }) => {
      await open(page, `/charts/${slug}?theme=${theme}`);
      await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
      await snap(page.locator(`[data-gallery="chart-${slug}"]`), `chart-${slug}-${theme}.png`, true);
    });
  }

  for (const slug of ASSESSMENT_SLUGS) {
    test(`assessment gallery ${slug} (${theme})`, async ({ page }) => {
      await open(page, `/assessment/${slug}?theme=${theme}`);
      await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
      await snap(
        page.locator(`[data-gallery="assessment-${slug}"]`),
        `assessment-${slug}-${theme}.png`,
        true,
      );
    });
  }

  for (const slug of PATTERN_SLUGS) {
    test(`pattern gallery ${slug} (${theme})`, async ({ page }) => {
      await open(page, `/patterns/${slug}?theme=${theme}`);
      await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
      await snap(
        page.locator(`[data-gallery="pattern-${slug}"]`),
        `pattern-${slug}-${theme}.png`,
        true,
      );
    });
  }

  test(`icon grid (${theme})`, async ({ page }) => {
    await open(page, `/foundations/icons?theme=${theme}`);
    await snap(page.locator('[data-gallery="icons"]'), `icons-${theme}.png`);
  });

  test(`toast open floating notification (${theme})`, async ({ page }) => {
    await open(page, `/components/toast?theme=${theme}`);
    const region = page.locator('[data-interactive="toast"]');
    await region.getByRole('button', { name: 'اعلان با اقدام' }).click();
    const liveToast = page.locator('[data-nds="ToastRegion"] [data-nds="Toast"]').first();
    await expect(liveToast).toBeVisible();
    await snap(liveToast, `toast-open-${theme}.png`, true);
  });

  test(`dialog open modal / mobile bottom sheet (${theme})`, async ({ page }) => {
    await open(page, `/components/dialog?theme=${theme}`);
    const region = page.locator('[data-interactive="dialog"]');
    await region.getByRole('button', { name: 'باز کردن پنجره (md)' }).click();
    await expect(page.locator('[data-nds="Dialog"]')).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="DialogModal"][data-entering]')).toHaveCount(0);
    await expect(page).toHaveScreenshot(`dialog-open-${theme}.png`, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`alert-dialog open destructive prompt (${theme})`, async ({ page }) => {
    await open(page, `/components/dialog?theme=${theme}`);
    const region = page.locator('[data-interactive="dialog"]');
    await region.getByRole('button', { name: 'باطل کردن سریال (AlertDialog)' }).click();
    await expect(page.locator('[data-nds="AlertDialog"]')).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="AlertDialogModal"][data-entering]')).toHaveCount(0);
    await expect(page).toHaveScreenshot(`alert-dialog-open-${theme}.png`, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`sheet open side drawer / TopBar mobile drawer (${theme})`, async ({ page, isMobile }) => {
    await open(page, `/components/sheet?theme=${theme}`);
    if (isMobile) {
      await page
        .locator('[data-interactive="topbar-sheet"]')
        .getByRole('button', { name: 'باز کردن منوی ناوبری موبایل' })
        .click();
    } else {
      await page
        .locator('[data-interactive="sheet"]')
        .getByRole('button', { name: 'کشوی ابتدای سطر (start)' })
        .click();
    }
    await expect(page.locator('[data-nds="Sheet"]')).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="SheetModal"][data-entering]')).toHaveCount(0);
    await expect(page).toHaveScreenshot(`sheet-open-${theme}.png`, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`popover open floating layer with arrow (${theme})`, async ({ page }) => {
    await open(page, `/components/popover?theme=${theme}`);
    const trigger = page
      .locator('[data-interactive="popover"]')
      .getByRole('button', { name: 'نمایش پاپ‌اور با پیکان' });
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.click();
    const popover = page.locator('[data-nds="Popover"]');
    await expect(popover).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="Popover"][data-entering]')).toHaveCount(0);
    const boxes = await Promise.all([
      trigger.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
      popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    ]);
    const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
    const pad = 12;
    const x = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.x)) - pad));
    const y = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.y)) - pad));
    const right = Math.min(viewport.width, Math.ceil(Math.max(...boxes.map((b) => b.x + b.width)) + pad));
    const bottom = Math.min(viewport.height, Math.ceil(Math.max(...boxes.map((b) => b.y + b.height)) + pad));
    await expect(page).toHaveScreenshot(`popover-open-${theme}.png`, {
      clip: { x, y, width: right - x, height: bottom - y },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`tooltip open inverse hint (${theme})`, async ({ page }) => {
    await open(page, `/components/tooltip?theme=${theme}`);
    const trigger = page
      .locator('[data-interactive="tooltip"]')
      .getByRole('button', { name: 'کپی کد فعال‌سازی' });
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.focus();
    const tooltip = page.locator('[data-nds="Tooltip"]');
    await expect(tooltip).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="Tooltip"][data-entering]')).toHaveCount(0);
    const boxes = await Promise.all([
      trigger.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
      tooltip.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    ]);
    const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
    const pad = 12;
    const x = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.x)) - pad));
    const y = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.y)) - pad));
    const right = Math.min(viewport.width, Math.ceil(Math.max(...boxes.map((b) => b.x + b.width)) + pad));
    const bottom = Math.min(viewport.height, Math.ceil(Math.max(...boxes.map((b) => b.y + b.height)) + pad));
    await expect(page).toHaveScreenshot(`tooltip-open-${theme}.png`, {
      clip: { x, y, width: right - x, height: bottom - y },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`contextual-help open popover (${theme})`, async ({ page }) => {
    await open(page, `/components/contextual-help?theme=${theme}`);
    const trigger = page
      .locator('[data-interactive="contextual-help"]')
      .getByRole('button', { name: 'راهنمای کد سیستم' });
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.click();
    const popover = page.locator('[data-nds="Popover"]');
    await expect(popover).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="Popover"][data-entering]')).toHaveCount(0);
    const boxes = await Promise.all([
      trigger.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
      popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    ]);
    const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
    const pad = 12;
    const x = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.x)) - pad));
    const y = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.y)) - pad));
    const right = Math.min(viewport.width, Math.ceil(Math.max(...boxes.map((b) => b.x + b.width)) + pad));
    const bottom = Math.min(viewport.height, Math.ceil(Math.max(...boxes.map((b) => b.y + b.height)) + pad));
    await expect(page).toHaveScreenshot(`contextual-help-open-${theme}.png`, {
      clip: { x, y, width: right - x, height: bottom - y },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`user-menu open account dropdown (${theme})`, async ({ page }) => {
    await open(page, `/components/user-menu?theme=${theme}`);
    const trigger = page
      .locator('[data-interactive="user-menu"]')
      .locator('[data-nds="AccountPill"]');
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.click();
    const popover = page.locator('[data-nds="MenuPopover"]');
    await expect(popover).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="MenuPopover"][data-entering]')).toHaveCount(0);
    const boxes = await Promise.all([
      trigger.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
      popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    ]);
    const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
    const pad = 12;
    const x = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.x)) - pad));
    const y = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.y)) - pad));
    const right = Math.min(viewport.width, Math.ceil(Math.max(...boxes.map((b) => b.x + b.width)) + pad));
    const bottom = Math.min(viewport.height, Math.ceil(Math.max(...boxes.map((b) => b.y + b.height)) + pad));
    await expect(page).toHaveScreenshot(`user-menu-open-${theme}.png`, {
      clip: { x, y, width: right - x, height: bottom - y },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
  });

  test(`breadcrumbs collapsed menu open (${theme})`, async ({ page }) => {
    await open(page, `/components/breadcrumbs?theme=${theme}`);
    const trigger = page
      .locator('[data-interactive="breadcrumbs"]')
      .getByRole('button', { name: 'نمایش مسیرهای میانی' });
    await trigger.evaluate((el) => {
      el.scrollIntoView({ block: 'center' });
      window.scrollTo(0, Math.round(window.scrollY));
    });
    await trigger.click();
    const popover = page.locator('[data-nds="MenuPopover"]');
    await expect(popover).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="MenuPopover"][data-entering]')).toHaveCount(0);
    const boxes = await Promise.all([
      trigger.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
      popover.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect),
    ]);
    const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
    const pad = 12;
    const x = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.x)) - pad));
    const y = Math.max(0, Math.floor(Math.min(...boxes.map((b) => b.y)) - pad));
    const right = Math.min(viewport.width, Math.ceil(Math.max(...boxes.map((b) => b.x + b.width)) + pad));
    const bottom = Math.min(viewport.height, Math.ceil(Math.max(...boxes.map((b) => b.y + b.height)) + pad));
    await expect(page).toHaveScreenshot(`breadcrumbs-collapsed-open-${theme}.png`, {
      clip: { x, y, width: right - x, height: bottom - y },
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    });
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

  test(`tanstack-form-zod guide form (${theme})`, async ({ page }) => {
    await open(page, `/guides/tanstack-form-zod?theme=${theme}`);
    await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
    await snap(
      page.locator('[data-gallery="tanstack-form-zod"]'),
      `tanstack-form-zod-${theme}.png`,
      true,
    );
  });

  for (const state of ['form', 'error', 'success', 'limit'] as const) {
    test(`registry-activation ${state} (${theme})`, async ({ page }) => {
      await open(page, `/reference/registry-activation?state=${state}&theme=${theme}`);
      await page.addStyleTag({
        content: 'header, [data-region="mobile-bar"] { position: static !important; }',
      });
      await snap(
        page.locator('[data-reference-rebuild]'),
        `registry-activation-${state}-${theme}.png`,
        false,
      );
    });
  }

  test(`admin-serials list (${theme})`, async ({ page }) => {
    await open(page, `/reference/admin-serials?theme=${theme}`);
    await page.addStyleTag({
      content:
        '[data-admin-sample] header, [data-admin-sample] [data-nds="SideNav"], [data-admin-sample] th { position: static !important; }',
    });
    await snap(page.locator('[data-admin-sample]'), `admin-serials-list-${theme}.png`, false);
  });

  test(`admin-serials detail (${theme})`, async ({ page }) => {
    await open(page, `/reference/admin-serials/N25AG-EMV0K?theme=${theme}`);
    await page.addStyleTag({
      content:
        '[data-admin-sample] header, [data-admin-sample] [data-nds="SideNav"] { position: static !important; }',
    });
    await snap(page.locator('[data-admin-sample]'), `admin-serials-detail-${theme}.png`, false);
  });

  test(`filter-bar mobile sheet open (${theme})`, async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile filter sheet drawer renders below 900 px');
    await open(page, `/components/filter-bar?theme=${theme}`);
    await page
      .locator('[data-interactive="filter-bar"]')
      .getByRole('button', { name: /^فیلترها/ })
      .click();
    await expect(page.locator('[data-nds="Sheet"]')).toBeVisible();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    await expect(page.locator('[data-nds="SheetModal"][data-entering]')).toHaveCount(0);
    await expect(page).toHaveScreenshot(`filter-bar-sheet-open-${theme}.png`, {
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

    test(`wave4 focus-visible states (${theme})`, async ({ page }) => {
      for (const item of [
        { slug: 'otp-field', selector: 'input:not([type="hidden"])' },
        { slug: 'file-upload', selector: '[data-nds="DropZone"] [data-nds="Button"]' },
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

test.describe('A4 assessment print baselines', () => {
  test('MMPI-Teen-13 professional A4 print layout', async ({ page, isMobile }) => {
    test.skip(isMobile, 'A4 print baselines run on desktop viewport');
    await page.setViewportSize({ width: 794, height: 1123 });
    await open(page, '/reference/assessment-report?fixture=mmpi-teen-13&mode=professional');
    await page.emulateMedia({ media: 'print' });
    await snap(page.locator('[data-nds="PrintLayout"]'), 'assessment-print-mmpi-teen-13.png');
  });

  test('Wellbeing-8 calm A4 print layout', async ({ page, isMobile }) => {
    test.skip(isMobile, 'A4 print baselines run on desktop viewport');
    await page.setViewportSize({ width: 794, height: 1123 });
    await open(page, '/reference/assessment-report?fixture=wellbeing-8&mode=calm');
    await page.emulateMedia({ media: 'print' });
    await snap(page.locator('[data-nds="PrintLayout"]'), 'assessment-print-wellbeing-8-calm.png');
  });
});
