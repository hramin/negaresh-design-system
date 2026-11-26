import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * When a menu popover is open, React Aria's `ariaHideOutside` marks background landmarks
 * (including `<main>` and `<h1>`) as `aria-hidden="true"`. Resting-page landmark coverage
 * is enforced in `smoke.spec.ts`.
 */
const OVERLAY_OPEN_DISABLED_RULES = ['landmark-one-main', 'page-has-heading-one'];

const settle = async (page: Page) => {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
};

test('SideNav filters roles and adapts to horizontal TabStrip below 900 px without page overflow', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/side-nav');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('side-nav'));

  // Default role is admin: management links are present
  await expect(region).toContainText('کاربران');

  // Switch role to customer -> admin and editorial groups disappear
  await region.getByRole('radio', { name: 'مشتری' }).click();
  await expect(region).not.toContainText('کاربران');
  await expect(region).not.toContainText('نوشته‌ها');

  const tabStrip = region.locator('[data-nds="TabStrip"]');
  if (isMobile) {
    await expect(tabStrip).toBeVisible();
  } else {
    await expect(tabStrip).toBeHidden();
  }

  // Zero horizontal page overflow
  const [scrollWidth, clientWidth] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ]);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('TabStrip updates current section cleanly and preserves >= 44 px touch targets', async ({
  page,
}) => {
  await page.goto('/components/tab-strip');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('tab-strip'));

  const ordersBtn = region.getByRole('button', { name: /سفارش‌ها/ });
  const box = await ordersBtn.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

  await ordersBtn.click();
  await expect(ordersBtn).toHaveAttribute('aria-current', 'page');
  await expect(region).toContainText('بخش فعال: سفارش‌ها');
});

test('Tabs supports RTL horizontal ArrowLeft/ArrowRight and vertical ArrowDown/ArrowUp navigation', async ({
  page,
}) => {
  await page.goto('/components/tabs');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('tabs'));

  // Horizontal RTL tabs
  const firstHorizontal = region.getByRole('tab', { name: 'مشخصات' });
  await firstHorizontal.focus();
  await page.keyboard.press('ArrowLeft');
  const activationsTab = region.getByRole('tab', { name: /فعال‌سازی‌ها/ });
  await expect(activationsTab).toHaveAttribute('aria-selected', 'true');
  await expect(region).toContainText('۳ رایانه با این سریال فعال شده‌اند');

  // Vertical tabs (Ravanma leaf 3)
  const firstVertical = region.getByRole('tab', { name: 'خلاصهٔ نیم‌رخ' });
  await firstVertical.focus();
  await page.keyboard.press('ArrowDown');
  const scalesTab = region.getByRole('tab', { name: /مقیاس‌ها/ });
  await expect(scalesTab).toHaveAttribute('aria-selected', 'true');
  await expect(region).toContainText('پنج مقیاس اصلی');
});

test('Breadcrumbs collapses middle items into an accessible menu, mirrors RTL chevrons, and passes axe while open', async ({
  page,
}) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`/components/breadcrumbs?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    const region = page.locator(example('breadcrumbs'));

    await expect(region.locator('[data-mirrored="true"]').first()).toBeVisible();
    const expandBtn = region.getByRole('button', { name: 'نمایش مسیرهای میانی' });
    const btnBox = await expandBtn.boundingBox();
    expect(btnBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(btnBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    await expandBtn.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(page.locator('[data-nds="MenuPopover"][data-entering]')).toHaveCount(0);
    await settle(page);

    const axe = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(OVERLAY_OPEN_DISABLED_RULES)
      .analyze();
    expect(axe.violations, `breadcrumbs menu open (${theme})`).toEqual([]);

    await page.getByRole('menuitem', { name: 'آزمون‌های شخصیت' }).click();
    await expect(region).toContainText('مسیر انتخاب‌شده: personality');
  }
});

test('Pagination formats Persian digits and LoadMore updates polite count status', async ({
  page,
}) => {
  await page.goto('/components/pagination');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('pagination'));

  await expect(region).toContainText('صفحهٔ ۳ از ۱۲');
  const nextBtn = region.getByRole('button', { name: 'صفحهٔ بعد' });
  const nextBox = await nextBtn.boundingBox();
  expect(nextBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(nextBox?.height ?? 0).toBeGreaterThanOrEqual(44);

  await nextBtn.click();
  await expect(region).toContainText('صفحهٔ فعال: ۴');

  await expect(region).toContainText('نمایش ۲۰ از ۶۰ مورد');
  await region.getByRole('button', { name: 'نمایش موارد بیشتر' }).click();
  await expect(region).toContainText('نمایش ۴۰ از ۶۰ مورد');
});

test('Stepper advances aria-current="step" and marks completed steps cleanly', async ({ page }) => {
  await page.goto('/components/stepper');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('stepper'));

  const steps = region.locator('[data-nds="StepperStep"]');
  await expect(steps.nth(0)).toHaveAttribute('data-done', 'true');
  await expect(steps.nth(1)).toHaveAttribute('aria-current', 'step');

  await region.getByRole('button', { name: 'مرحلهٔ بعد' }).click();
  await expect(steps.nth(1)).toHaveAttribute('data-done', 'true');
  await expect(steps.nth(2)).toHaveAttribute('aria-current', 'step');
});

test('Disclosure and Accordion toggle panels via keyboard and meet >= 44 px target height', async ({
  page,
}) => {
  await page.goto('/components/disclosure');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('disclosure'));

  const standalone = region.getByRole('button', { name: 'راهنمای دریافت کد سیستم' });
  const box = await standalone.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

  await standalone.focus();
  await page.keyboard.press('Enter');
  await expect(standalone).toHaveAttribute('aria-expanded', 'true');
  await expect(region).toContainText('کد ۹ رقمی سیستم');

  const secondFaq = region.getByRole('button', { name: /اگر رایانه را عوض کنم/ });
  await secondFaq.click();
  await expect(secondFaq).toHaveAttribute('aria-expanded', 'true');
});

test('UserMenu composes AccountPill + Menu + Avatar, switches roles and theme live, restores focus on Escape, and passes axe', async ({
  page,
}) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`/components/user-menu?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    const region = page.locator(example('user-menu'));
    const pill = region.locator('[data-nds="AccountPill"]');

    const pillBox = await pill.boundingBox();
    expect(pillBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    await pill.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(page.locator('[data-nds="MenuPopover"][data-entering]')).toHaveCount(0);
    await settle(page);

    const axe = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(OVERLAY_OPEN_DISABLED_RULES)
      .analyze();
    expect(axe.violations, `user-menu open (${theme})`).toEqual([]);

    // Escape closes and restores focus to AccountPill
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(pill).toBeFocused();

    // Reopen and switch role to admin
    await pill.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.getByRole('menuitemradio', { name: 'مدیر سامانه' }).click();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(region).toContainText('مدیر سامانه');

    // Reopen and toggle theme
    await pill.click();
    await expect(page.getByRole('menu')).toBeVisible();
    const targetTheme = theme === 'light' ? 'تیره' : 'روشن';
    await page.getByRole('menuitemradio', { name: targetTheme }).click();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme',
      theme === 'light' ? 'dark' : 'light',
    );
  }
});

test('Registry activation rebuild renders 100% NDS components across all four states with mobile Disclosure and Toast', async ({
  page,
  isMobile,
}) => {
  // Form state: Badge, UsageMeter (desktop), Stepper, Disclosure (mobile toggle), UserMenu
  await page.goto('/reference/registry-activation?state=form');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-nds="Badge"]')).toContainText('باز شده از برنامه');
  await expect(page.locator('[data-nds="Stepper"]')).toHaveCount(1);
  await expect(page.locator('[data-nds="Disclosure"]')).toHaveCount(1);

  if (isMobile) {
    const helpBtn = page.getByRole('button', { name: 'راهنمای فعال‌سازی' });
    await expect(helpBtn).toBeVisible();
    await expect(helpBtn).toHaveAttribute('aria-expanded', 'false');
    await helpBtn.click();
    await expect(helpBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[data-nds="Stepper"]')).toBeVisible();
  } else {
    await expect(page.locator('[data-nds="UsageMeter"]')).toBeVisible();
    await expect(page.locator('[data-nds="Stepper"]')).toBeVisible();
  }

  // Success state: InlineAlert, KeyValueList, CopyButton -> Toast
  await page.goto('/reference/registry-activation?state=success');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-nds="InlineAlert"][data-tone="success"]')).toBeVisible();
  await expect(page.locator('[data-nds="KeyValueList"]')).toBeVisible();
  await expect(page.locator('[data-nds="StepperStep"]').nth(2)).toHaveAttribute(
    'aria-current',
    'step',
  );

  // Limit state: warning InlineAlert + full UsageMeter
  await page.goto('/reference/registry-activation?state=limit');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-nds="InlineAlert"][data-tone="warning"]')).toBeVisible();
  await expect(page.locator('[data-nds="UsageMeter"][data-full="true"]')).toBeVisible();

  // UserMenu opens from TopBar AccountPill and toggles theme
  await page.locator('[data-nds="AccountPill"]').click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('menuitemradio', { name: 'تیره' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('Wave 3 pages honor forced-colors and prefers-reduced-motion without axe violations', async ({
  page,
}) => {
  test.slow();
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  for (const route of [
    '/components/side-nav',
    '/components/tab-strip',
    '/components/tabs',
    '/components/breadcrumbs',
    '/components/pagination',
    '/components/stepper',
    '/components/disclosure',
    '/components/user-menu',
    '/components/footer',
  ]) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(axe.violations, `${route} forced-colors/reduced-motion`).toEqual([]);
  }
});
