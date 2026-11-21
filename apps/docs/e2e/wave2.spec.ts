import { expect, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

test('select supports single and multiple selection with Persian popover dismiss label', async ({
  page,
}) => {
  await page.goto('/components/select');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('select'));

  // Single select
  const singleTrigger = region.getByRole('button', { name: /استان ارسال/ });
  await singleTrigger.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await expect(
    page.locator('[data-nds="SelectPopover"] button[aria-label="بستن"]').first(),
  ).toBeAttached();
  await expect(
    page.locator('[data-nds="SelectPopover"] button[aria-label="Dismiss"]'),
  ).toHaveCount(0);
  await page.getByRole('option', { name: 'اصفهان' }).click();
  await expect(singleTrigger).toContainText('اصفهان');

  // Multiple select + Persian count summary
  const multiTrigger = region.getByRole('button', { name: /حوزه‌های تخصصی/ });
  await multiTrigger.click();
  await page.getByRole('option', { name: 'روان‌شناسی کودک' }).click();
  await expect(multiTrigger).toContainText('روان‌شناسی بالینی، روان‌شناسی کودک');
  await page.getByRole('option', { name: 'روان‌شناسی تربیتی' }).click();
  await expect(multiTrigger).toContainText('۳ مورد انتخاب‌شده');
  await page.keyboard.press('Escape');
});

test('combobox supports async filtering and creating a new option via keyboard', async ({
  page,
}) => {
  await page.goto('/components/combobox');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('combobox'));
  const input = region.getByRole('combobox');

  await input.click();
  await input.fill('روان‌سنجی نوجوان');
  const createOption = page.getByRole('option', { name: /افزودن «روان‌سنجی نوجوان»/ });
  await expect(createOption).toBeVisible();
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('روان‌سنجی نوجوان');
  await expect(region).toContainText('custom-5');
});

test('checkbox supports indeterminate parent toggling all child channels', async ({ page }) => {
  await page.goto('/components/checkbox');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('checkbox'));
  const selectAllInput = region.getByRole('checkbox', {
    name: 'انتخاب همهٔ کانال‌های اطلاع‌رسانی',
  });
  const selectAllLabel = region.locator('label', {
    hasText: 'انتخاب همهٔ کانال‌های اطلاع‌رسانی',
  });
  await expect(selectAllInput).toHaveJSProperty('indeterminate', true);

  await selectAllLabel.click();
  await expect(selectAllInput).toBeChecked();
  await expect(region.getByRole('checkbox', { name: 'ایمیل' })).toBeChecked();
  await expect(region.getByRole('checkbox', { name: 'اعلان داخل پنل' })).toBeChecked();

  await selectAllLabel.click();
  await expect(selectAllInput).not.toBeChecked();
  await expect(region.getByRole('checkbox', { name: 'پیامک' })).not.toBeChecked();
});

test('radio group and segmented control support RTL keyboard navigation', async ({ page }) => {
  await page.goto('/components/radio-group');
  await page.waitForLoadState('networkidle');
  const proRadio = page.locator(example('radio-group')).getByRole('radio', { name: 'نمای حرفه‌ای' });
  const calmRadio = page.locator(example('radio-group')).getByRole('radio', { name: 'نمای آرام' });
  await proRadio.focus();
  await page.keyboard.press('ArrowDown');
  await expect(calmRadio).toBeChecked();

  await page.goto('/components/segmented-control');
  await page.waitForLoadState('networkidle');
  const segRegion = page.locator(example('segmented-control'));
  const proSeg = segRegion.getByRole('radio', { name: 'حرفه‌ای' });
  const calmSeg = segRegion.getByRole('radio', { name: 'آرام' });
  await proSeg.focus();
  // RTL: ArrowLeft advances toward inline-end.
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Space');
  await expect(calmSeg).toHaveAttribute('aria-checked', 'true');
  await expect(segRegion).toContainText('نمای فعال: آرام');
});

test('choice card renders Toman and free pricing and toggles radio and checkbox cards', async ({
  page,
}) => {
  await page.goto('/components/choice-card');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('choice-card'));
  await expect(region).toContainText('رایگان');
  await expect(region).toContainText('۳۵۰٬۰۰۰ تومان');

  const starterInput = region.getByRole('radio', { name: /نسخهٔ آشنایی/ });
  await region.locator('label', { hasText: 'نسخهٔ آشنایی' }).click();
  await expect(starterInput).toBeChecked();

  const printBrandInput = region.getByRole('checkbox', { name: /سربرگ اختصاصی چاپ/ });
  await region.locator('label', { hasText: 'سربرگ اختصاصی چاپ' }).click();
  await expect(printBrandInput).toBeChecked();
});

test('switch toggles via keyboard and updates live text', async ({ page }) => {
  await page.goto('/components/switch');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('switch'));
  const toggle = region.getByRole('switch', { name: 'ارسال خودکار گزارش' });
  await expect(toggle).toBeChecked();
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).not.toBeChecked();
  await expect(region).toContainText('خاموش');
});

test('tag group removes tags with localized button and tag field adds/deduplicates/removes', async ({
  page,
}) => {
  await page.goto('/components/tag-group');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('tag-group'));

  await region.getByRole('button', { name: 'حذف روان‌سنجی' }).click();
  await expect(region.getByRole('row', { name: 'روان‌سنجی', exact: true })).toHaveCount(0);

  const tagField = region.locator('[data-nds="TagField"]');
  const input = tagField.getByRole('textbox', { name: 'کلیدواژه‌های مقاله' });
  await input.fill('شخصیت');
  await input.press('Enter');
  await expect(tagField.getByRole('alert')).toContainText('قبلاً افزوده شده');

  await input.fill('نوجوان');
  await input.press('Enter');
  await expect(tagField.getByRole('row', { name: 'نوجوان', exact: true })).toBeVisible();

  await input.press('Backspace');
  await expect(tagField.getByRole('row', { name: 'نوجوان', exact: true })).toHaveCount(0);
});

test('wave 2 controls maintain 44 px targets and visible focus under forced colors and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/components/select');
  await page.waitForLoadState('networkidle');
  const trigger = page.locator(example('select')).getByRole('button', { name: /استان ارسال/ });
  await trigger.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(trigger).toHaveAttribute('data-focus-visible', 'true');
  const metrics = await trigger.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      height: el.getBoundingClientRect().height,
    };
  });
  expect(metrics.outlineStyle).not.toBe('none');
  expect(metrics.outlineWidth).toBeGreaterThan(0);
  expect(metrics.height).toBeGreaterThanOrEqual(44);
});
