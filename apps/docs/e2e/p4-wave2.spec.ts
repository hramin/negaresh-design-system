import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * When a modal Dialog, Sheet, or Popover is open, React Aria's `ariaHideOutside`
 * intentionally marks the background page (including `<main>` and `<h1>`) as `aria-hidden="true"`.
 * Resting-page landmark and h1 coverage is enforced in `smoke.spec.ts`.
 */
const MODAL_OPEN_DISABLED_RULES = ['landmark-one-main', 'page-has-heading-one'];

const settle = async (page: Page) => {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
};

test('Dialog and AlertDialog trap focus, restore focus on Escape, adapt to bottom sheet on mobile, and pass axe while open', async ({
  page,
  isMobile,
}) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`/components/dialog?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    const region = page.locator(example('dialog'));

    const openBtn = region.getByRole('button', { name: 'باز کردن پنجره (md)' });
    await openBtn.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'جزئیات فعال‌سازی سریال' });
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-nds="DialogModal"][data-entering]')).toHaveCount(0);
    await settle(page);

    const modal = page.locator('[data-nds="DialogModal"]');
    const shadow = await modal.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).not.toBe('none');

    // Close button >= 44x44
    const closeBtn = dialog.getByRole('button', { name: 'بستن پنجره' });
    const closeBox = await closeBtn.boundingBox();
    expect(closeBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(closeBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    // Mobile (< 900px) bottom-sheet check: docked to bottom of viewport and full width
    if (isMobile) {
      const box = await modal.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();
      if (box && viewport) {
        expect(Math.abs(box.width - viewport.width)).toBeLessThanOrEqual(2);
        expect(Math.abs(box.y + box.height - viewport.height)).toBeLessThanOrEqual(2);
      }
    }

    // Focus stays trapped inside dialog on Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusInsideDialog = await dialog.evaluate((el) => el.contains(document.activeElement));
    expect(focusInsideDialog).toBe(true);

    // Zero WCAG 2.2 AA violations while Dialog is open
    const axe = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(MODAL_OPEN_DISABLED_RULES)
      .analyze();
    expect(axe.violations, `dialog open (${theme})`).toEqual([]);

    // Escape closes and restores focus to trigger
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(openBtn).toBeFocused();

    // Destructive AlertDialog
    const alertTrigger = region.getByRole('button', { name: 'باطل کردن سریال (AlertDialog)' });
    await alertTrigger.click();
    const alertDialog = page.getByRole('alertdialog', { name: 'باطل کردن سریال؟' });
    await expect(alertDialog).toBeVisible();
    await expect(page.locator('[data-nds="AlertDialogModal"][data-entering]')).toHaveCount(0);
    await settle(page);

    const axeAlert = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(MODAL_OPEN_DISABLED_RULES)
      .analyze();
    expect(axeAlert.violations, `alertdialog open (${theme})`).toEqual([]);

    await alertDialog.getByRole('button', { name: 'باطل شود' }).click();
    await expect(alertDialog).toHaveCount(0);
    await expect(region).toContainText('سریال با تأیید کاربر باطل شد.');
  }
});

test('Sheet / Drawer supports desktop side drawer and TopBar mobileMenu bottom drawer with zero axe violations', async ({
  page,
  isMobile,
}) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`/components/sheet?theme=${theme}`);
    await page.waitForLoadState('networkidle');

    if (isMobile) {
      // Mobile (< 900px): verify TopBar mobileMenu Sheet drawer integration
      const topBarFrame = page.locator(example('topbar-sheet'));
      const menuBtn = topBarFrame.getByRole('button', { name: 'باز کردن منوی ناوبری موبایل' });
      await expect(menuBtn).toBeVisible();
      const btnBox = await menuBtn.boundingBox();
      expect(btnBox?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(btnBox?.height ?? 0).toBeGreaterThanOrEqual(44);

      await menuBtn.click();
      const drawer = page.getByRole('dialog', { name: 'بخش‌های رجیستری' });
      await expect(drawer).toBeVisible();
      await expect(page.locator('[data-nds="SheetModal"][data-entering]')).toHaveCount(0);
      await settle(page);

      const modal = page.locator('[data-nds="SheetModal"]');
      const box = await modal.boundingBox();
      const viewport = page.viewportSize();
      if (box && viewport) {
        expect(Math.abs(box.width - viewport.width)).toBeLessThanOrEqual(2);
        expect(Math.abs(box.y + box.height - viewport.height)).toBeLessThanOrEqual(2);
      }

      const axe = await new AxeBuilder({ page })
        .withTags(AXE_TAGS)
        .disableRules(MODAL_OPEN_DISABLED_RULES)
        .analyze();
      expect(axe.violations, `topbar sheet mobile (${theme})`).toEqual([]);

      await drawer.getByRole('link', { name: 'فعال‌سازی‌های من' }).click();
      await expect(drawer).toHaveCount(0);
      await expect(page.locator(example('sheet'))).toContainText('فعال‌سازی‌های من');
    } else {
      // Desktop (>= 900px): verify logical start drawer docks to RTL inline-start (right edge)
      const region = page.locator(example('sheet'));
      const trigger = region.getByRole('button', { name: 'کشوی ابتدای سطر (start)' });
      await trigger.focus();
      await page.keyboard.press('Enter');

      const sheet = page.getByRole('dialog', { name: 'فیلتر فهرست سریال‌ها' });
      await expect(sheet).toBeVisible();
      await expect(page.locator('[data-nds="SheetModal"][data-entering]')).toHaveCount(0);
      await settle(page);

      const modal = page.locator('[data-nds="SheetModal"]');
      const box = await modal.boundingBox();
      const viewport = page.viewportSize();
      if (box && viewport) {
        // RTL start = right edge of viewport
        expect(Math.abs(box.x + box.width - viewport.width)).toBeLessThanOrEqual(2);
        expect(Math.abs(box.height - viewport.height)).toBeLessThanOrEqual(2);
      }

      const axe = await new AxeBuilder({ page })
        .withTags(AXE_TAGS)
        .disableRules(MODAL_OPEN_DISABLED_RULES)
        .analyze();
      expect(axe.violations, `sheet desktop (${theme})`).toEqual([]);

      await page.keyboard.press('Escape');
      await expect(sheet).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
  }
});

test('Popover, Tooltip, and ContextualHelp open cleanly, meet touch targets, dismiss on Escape, and pass axe while open', async ({
  page,
}) => {
  for (const theme of ['light', 'dark'] as const) {
    // Popover
    await page.goto(`/components/popover?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    const popRegion = page.locator(example('popover'));
    const popTrigger = popRegion.getByRole('button', { name: 'نمایش پاپ‌اور با پیکان' });
    await popTrigger.focus();
    await page.keyboard.press('Enter');

    const popDialog = page.getByRole('dialog', { name: 'منبع سقف فعال‌سازی' });
    await expect(popDialog).toBeVisible();
    await expect(page.locator('[data-nds="Popover"][data-entering]')).toHaveCount(0);
    await settle(page);
    const popEl = page.locator('[data-nds="Popover"]');
    expect(await popEl.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
    await expect(page.locator('[data-nds="PopoverArrow"]')).toBeVisible();

    const axePop = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(MODAL_OPEN_DISABLED_RULES)
      .analyze();
    expect(axePop.violations, `popover open (${theme})`).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(popDialog).toHaveCount(0);
    await expect(popTrigger).toBeFocused();

    // Tooltip via keyboard focus
    await page.goto(`/components/tooltip?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    const tipRegion = page.locator(example('tooltip'));
    const tipTrigger = tipRegion.getByRole('button', { name: 'کپی کد فعال‌سازی' });
    await tipTrigger.focus();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(page.locator('[data-nds="Tooltip"][data-entering]')).toHaveCount(0);
    await settle(page);
    await expect(tooltip).toContainText('کپی کد فعال‌سازی');
    expect(await tooltip.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');

    // React Aria portals Tooltip into body-level div[data-overlay-container="true"];
    // axe's best-practice `region` rule does not exempt role="tooltip" outside landmarks,
    // while every WCAG 2.2 AA rule and all other best-practice rules must report 0 violations.
    const axeTip = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(['region'])
      .analyze();
    expect(axeTip.violations, `tooltip open (${theme})`).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(tooltip).toHaveCount(0);

    // ContextualHelp
    await page.goto(`/components/contextual-help?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    const helpRegion = page.locator(example('contextual-help'));
    const helpTrigger = helpRegion.getByRole('button', { name: 'راهنمای کد سیستم' });
    const helpBox = await helpTrigger.boundingBox();
    expect(helpBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(helpBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    await helpTrigger.focus();
    await page.keyboard.press('Enter');
    const helpDialog = page.getByRole('dialog', { name: 'کد سیستم را از کجا پیدا کنیم؟' });
    await expect(helpDialog).toBeVisible();
    await expect(page.locator('[data-nds="Popover"][data-entering]')).toHaveCount(0);
    await settle(page);
    await expect(helpDialog.getByRole('link', { name: 'مشاهدهٔ راهنمای تصویری' })).toBeVisible();

    const axeHelp = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(MODAL_OPEN_DISABLED_RULES)
      .analyze();
    expect(axeHelp.violations, `contextual-help open (${theme})`).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(helpDialog).toHaveCount(0);
    await expect(helpTrigger).toBeFocused();
  }
});

test('Avatar, VerifiedBadge, Card (zero resting shadow), Image, and KeyValueList work cleanly in Persian RTL', async ({
  page,
}) => {
  // Avatar / AvatarGroup
  await page.goto('/components/avatar');
  await page.waitForLoadState('networkidle');
  await expect(page.locator(example('avatar')).getByRole('img', { name: '۳ نفر دیگر' })).toBeVisible();

  // VerifiedBadge
  await page.goto('/components/verified-badge');
  await page.waitForLoadState('networkidle');
  const badgeRegion = page.locator(example('verified-badge'));
  await expect(badgeRegion).toContainText('پروانهٔ تأییدشده');
  await expect(badgeRegion).toContainText('۱۲۴۸۵');

  // Card: zero resting shadow (D-77)
  await page.goto('/components/card');
  await page.waitForLoadState('networkidle');
  const firstCard = page.locator(example('card')).locator('[data-nds="Card"]').first();
  expect(await firstCard.evaluate((el) => getComputedStyle(el).boxShadow)).toBe('none');

  // Image: aspect ratio & required alt
  await page.goto('/components/image');
  await page.waitForLoadState('networkidle');
  const img = page.locator(example('image')).locator('img').first();
  await expect(img).toHaveAttribute('alt', /نمونهٔ تصویر گزارش/);
  await expect(img).toHaveAttribute('loading', 'lazy');

  // KeyValueList: LTR isolation and copyable row touch target
  await page.goto('/components/key-value-list');
  await page.waitForLoadState('networkidle');
  const kvRegion = page.locator(example('key-value-list'));
  await expect(kvRegion.locator('[data-nds="Code"]').first()).toHaveAttribute('dir', 'ltr');
  const copyBtn = kvRegion.getByRole('button', { name: 'کپی شمارهٔ سریال' });
  const copyBox = await copyBtn.boundingBox();
  expect(copyBox?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test('Wave 2 pages honor forced-colors and prefers-reduced-motion without axe violations', async ({
  page,
}) => {
  test.slow();
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  for (const route of [
    '/components/dialog',
    '/components/sheet',
    '/components/popover',
    '/components/tooltip',
    '/components/contextual-help',
    '/components/avatar',
    '/components/verified-badge',
    '/components/card',
    '/components/image',
    '/components/key-value-list',
  ]) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(axe.violations, `${route} forced-colors/reduced-motion`).toEqual([]);
  }
});
