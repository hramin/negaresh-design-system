import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

test('InlineAlert dismisses cleanly, restores, and maintains a >= 44px dismiss target', async ({
  page,
}) => {
  await page.goto('/components/inline-alert');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('inline-alert'));
  const alert = region.locator('[data-nds="InlineAlert"]');
  await expect(alert).toBeVisible();

  const dismissBtn = region.getByRole('button', { name: 'بستن پیام' });
  const box = await dismissBtn.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

  await dismissBtn.click();
  await expect(alert).toHaveCount(0);
  await expect(region).toContainText('پیام بسته شد.');

  await region.getByRole('button', { name: 'نمایش دوبارهٔ پیام' }).click();
  await expect(alert).toBeVisible();
});

test('Banner dismisses cleanly, restores, and maintains a >= 44px dismiss target', async ({
  page,
}) => {
  await page.goto('/components/banner');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('banner'));
  const banner = region.locator('[data-nds="Banner"]');
  await expect(banner).toBeVisible();

  const dismissBtn = region.getByRole('button', { name: 'بستن اعلان صفحه' });
  const box = await dismissBtn.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

  await dismissBtn.click();
  await expect(banner).toHaveCount(0);
  await expect(region).toContainText('بنر صفحه بسته شد.');

  await region.getByRole('button', { name: 'نمایش دوبارهٔ بنر' }).click();
  await expect(banner).toBeVisible();
});

test('Toast enqueues floating notifications with overlay shadow, runs actions, dismisses in Persian, and passes axe while open', async ({
  page,
}) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`/components/toast?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    const region = page.locator(example('toast'));

    // Open semantic toast with action
    await region.getByRole('button', { name: 'اعلان با اقدام' }).click();
    const toastRegion = page.locator('[data-nds="ToastRegion"]');
    await expect(toastRegion).toBeVisible();
    const liveToast = toastRegion.locator('[data-nds="Toast"]').first();
    await expect(liveToast).toContainText('سریال باطل شد');
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));

    // Floating overlay shadow must be applied on Toast (D-77)
    const shadow = await liveToast.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).not.toBe('none');

    // Touch targets >= 44x44 on action and close buttons
    const actionBtn = liveToast.getByRole('button', { name: 'بازگردانی' });
    const closeBtn = liveToast.getByRole('button', { name: 'بستن' });
    const actionBox = await actionBtn.boundingBox();
    const closeBox = await closeBtn.boundingBox();
    expect(actionBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(closeBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(closeBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    // Zero axe WCAG 2.2 AA violations while live toast is open
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(axe.violations).toEqual([]);

    // Trigger action -> closes toast and updates page output
    await actionBtn.click();
    await expect(region).toContainText('عملیات بازگردانی اجرا شد.');
    await expect(toastRegion.locator('[data-nds="Toast"]')).toHaveCount(0);

    // Open neutral inverse toast and close via Persian dismiss button
    await region.getByRole('button', { name: 'اعلان خنثی' }).click();
    await expect(toastRegion.locator('[data-nds="Toast"]')).toContainText('کد فعال‌سازی کپی شد');
    await toastRegion.getByRole('button', { name: 'بستن' }).click();
    await expect(toastRegion.locator('[data-nds="Toast"]')).toHaveCount(0);
  }
});

test('ProgressBar, UsageMeter, Spinner/GlobalLoadingBar, Skeleton, and ErrorPage interactive controls work in Persian', async ({
  page,
}) => {
  // ProgressBar
  await page.goto('/components/progress-meter');
  await page.waitForLoadState('networkidle');
  const progressRegion = page.locator(example('progress-meter'));
  const progressBar = progressRegion.getByRole('progressbar');
  await expect(progressBar).toHaveAttribute('aria-valuenow', '40');
  await progressRegion.getByRole('button', { name: 'افزایش ۲۰٪' }).click();
  await expect(progressBar).toHaveAttribute('aria-valuenow', '60');
  await expect(progressBar).toHaveAttribute('aria-valuetext', /۶۰/);

  // UsageMeter reaches full state with Persian text + data-full
  await page.goto('/components/usage-meter');
  await page.waitForLoadState('networkidle');
  const usageRegion = page.locator(example('usage-meter'));
  const meter = usageRegion.getByRole('meter');
  await expect(meter).toHaveAttribute('aria-valuetext', '۱ از ۳');
  const consumeBtn = usageRegion.getByRole('button', { name: 'مصرف ۱ ظرفیت' });
  await consumeBtn.click();
  await consumeBtn.click();
  await expect(meter).toHaveAttribute('data-full', 'true');
  await expect(meter).toHaveAttribute('aria-valuetext', /۳ از ۳.*سقف پر شده است/);

  // GlobalLoadingBar toggle
  await page.goto('/components/spinner');
  await page.waitForLoadState('networkidle');
  const spinnerRegion = page.locator(example('spinner'));
  await expect(spinnerRegion.getByRole('progressbar')).toBeVisible();
  await spinnerRegion.getByRole('button', { name: 'توقف نوار بارگذاری' }).click();
  await expect(spinnerRegion.getByRole('progressbar')).toHaveCount(0);

  // Skeleton toggle
  await page.goto('/components/skeleton');
  await page.waitForLoadState('networkidle');
  const skeletonRegion = page.locator(example('skeleton'));
  await expect(skeletonRegion.locator('[data-nds="Skeleton"]').first()).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await skeletonRegion.getByRole('button', { name: 'نمایش محتوای واقعی' }).click();
  await expect(skeletonRegion).toContainText('نگارش تست هوش ۴');

  // ErrorPage presets
  await page.goto('/components/error-page');
  await page.waitForLoadState('networkidle');
  const errorRegion = page.locator(example('error-page'));
  await expect(errorRegion).toContainText('صفحهٔ مورد نظر پیدا نشد');
  await errorRegion.getByRole('radio', { name: '۵۰۰' }).click();
  await expect(errorRegion).toContainText('مشکلی در سرور پیش آمده است');
  await expect(errorRegion).toContainText('ERR-1405-8821');
  await errorRegion.getByRole('radio', { name: 'به‌روزرسانی' }).click();
  await expect(errorRegion).toContainText('سامانه در حال به‌روزرسانی است');
});

test('Wave 1 components honor forced-colors and prefers-reduced-motion without axe violations', async ({
  page,
}) => {
  test.slow();
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  for (const route of [
    '/components/inline-alert',
    '/components/toast',
    '/components/usage-meter',
    '/components/skeleton',
    '/components/error-page',
  ]) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(axe.violations, `${route} forced-colors/reduced-motion`).toEqual([]);
  }
});
