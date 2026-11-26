import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

test('OTPField normalizes Persian/Arabic/Latin digits, handles SMS paste, keyboard navigation, and resend countdown', async ({
  page,
}) => {
  await page.goto('/components/otp-field');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('otp-field'));
  const group = region.getByRole('group', { name: 'کد تأیید پیامکی' });
  await expect(group).toHaveAttribute('dir', 'ltr');

  const slots = group.getByRole('textbox');
  await expect(slots).toHaveCount(6);
  await expect(slots.nth(0)).toHaveAttribute('autocomplete', 'one-time-code');
  await expect(slots.nth(0)).not.toHaveAttribute('maxlength', /.+/);

  // Visual LTR digit ordering inside an RTL document
  const firstBox = await slots.nth(0).boundingBox();
  const lastBox = await slots.nth(5).boundingBox();
  expect((firstBox?.x ?? 0)).toBeLessThan(lastBox?.x ?? 0);

  // Type mixed Persian, Arabic-Indic, and Latin digits
  await slots.nth(0).click();
  await page.keyboard.type('۴٨2۹٠6');
  await expect(region).toContainText('482906');

  // ArrowLeft, Backspace, and Home/End navigation
  await page.keyboard.press('ArrowLeft');
  await expect(slots.nth(4)).toBeFocused();
  await page.keyboard.press('Backspace');
  await expect(slots.nth(4)).toHaveValue('');
  await page.keyboard.press('Home');
  await expect(slots.nth(0)).toBeFocused();
  await page.keyboard.press('End');
  await expect(slots.nth(5)).toBeFocused();

  // Paste full Persian SMS message into slot 2 -> distributes digits 987654 from slot 0
  await slots.nth(2).focus();
  await slots.nth(2).evaluate((el) => {
    const dt = new DataTransfer();
    dt.setData('text/plain', 'کد ورود نگارش: ۹۸۷۶۵۴');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  await expect(slots.nth(0)).toHaveValue('9');
  await expect(slots.nth(5)).toHaveValue('4');
  await expect(region).toContainText('987654');

  // Resend button starts Persian countdown
  await region.getByRole('button', { name: 'ارسال دوبارهٔ کد' }).click();
  await expect(region).toContainText(/ارسال دوباره تا .* ثانیهٔ دیگر/);
});

test('FileUpload validates file type and size in Persian and supports adding and removing files', async ({
  page,
}) => {
  await page.goto('/components/file-upload');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('file-upload'));
  const fileInput = region.locator('input[type="file"]');

  // Reject disallowed file type
  await fileInput.setInputFiles({
    name: 'manual.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4'),
  });
  await expect(region.getByRole('alert')).toContainText('قالب پروندهٔ «manual.pdf» مجاز نیست');

  // Reject oversized file (> 2 MiB)
  await fileInput.setInputFiles({
    name: 'huge.csv',
    mimeType: 'text/csv',
    buffer: Buffer.alloc(2 * 1024 * 1024 + 128, 65),
  });
  await expect(region.getByRole('alert')).toContainText('حجم پروندهٔ «huge.csv» بیشتر از سقف مجاز');

  // Accept valid CSV file
  await fileInput.setInputFiles({
    name: 'batch-1405.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('N25AG-EMV0K\nA12BC-D34EF\n'),
  });
  await expect(region).toContainText('batch-1405.csv');
  await expect(region).toContainText('تعداد پرونده‌های انتخاب‌شده: ۲');

  // Remove the newly added file via its localized button
  await region.getByRole('button', { name: 'حذف پروندهٔ «batch-1405.csv»' }).click();
  await expect(region).not.toContainText('batch-1405.csv');
  await expect(region).toContainText('تعداد پرونده‌های انتخاب‌شده: ۱');
});

test('TanStack Form + Zod guide validates fields in Persian, focuses first invalid input, and submits cleanly', async ({
  page,
}) => {
  await page.goto('/guides/tanstack-form-zod');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('tanstack-form-zod'));

  // Empty submit triggers Persian Zod errors, FormErrorSummary, and focuses first invalid input
  await region.getByRole('button', { name: 'بررسی و ثبت درخواست' }).click();
  const summary = region.locator('[data-nds="FormErrorSummary"]');
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('نام و نام خانوادگی باید دست‌کم ۳ نویسه باشد.');
  await expect(region.locator('#tsf-fullname')).toBeFocused();

  // Fill every field validly using Persian digits where applicable
  await region.locator('#tsf-fullname').fill('سارا احمدی');
  await region.locator('#tsf-phone').fill('۰۹۱۲۱۲۳۴۵۶۷');
  await region.locator('#tsf-serial').fill('n25ag emv0k');
  await region.locator('#tsf-otp').click();
  await page.keyboard.type('۴۸۲۹۱۶');
  await region.getByRole('radio', { name: /مجوز کلینیک/ }).click({ force: true });
  await region.locator('input[type="file"]').setInputFiles({
    name: 'invoice.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('serial,count\nN25AG-EMV0K,5\n'),
  });

  await region.getByRole('button', { name: 'بررسی و ثبت درخواست' }).click();
  const success = region.getByTestId('tsf-success');
  await expect(success).toBeVisible();
  await expect(success).toContainText('+989121234567');
  await expect(success).toContainText('N25AGEMV0K');
  await expect(success).toContainText('invoice.csv');

  // Reset clears the result
  await region.getByRole('button', { name: 'بازنشانی فرم' }).click();
  await expect(success).toHaveCount(0);
});

test('Registry activation rebuild validates serials, handles error/limit/success flows, and passes axe', async ({
  page,
}, info) => {
  const isMobile = info.project.name === 'mobile';
  const submitButton = () =>
    isMobile
      ? page.locator('[data-region="mobile-bar"]').getByRole('button', { name: 'ساخت کد فعال‌سازی' })
      : page.locator('[data-actions="form"]').getByRole('button', { name: 'ساخت کد فعال‌سازی' });

  // 1. Deep-linked ?state=error shows the reference wrong-product error immediately
  await page.goto('/reference/registry-activation?state=error');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-nds="FormErrorSummary"]')).toContainText(
    'این سریال برای «نگارش تست هوش ۴» نیست',
  );

  // 2. Empty serial -> Persian error + focus moves to #registry-serial
  const serialInput = page.locator('#registry-serial');
  await serialInput.fill('');
  await submitButton().click();
  await expect(page.locator('[data-nds="FormErrorSummary"]')).toContainText('سریال را وارد کنید.');
  await expect(serialInput).toBeFocused();

  // 3. LIMIT-00000 transitions to limit state with P3 ChoiceCard gateway picker
  await serialInput.fill('limit 00000');
  await submitButton().click();
  await expect(page.locator('[data-reference-rebuild]')).toHaveAttribute(
    'data-registry-state',
    'limit',
  );
  await expect(page.locator('main')).toContainText('سقف فعال‌سازی این سریال پر شده است');
  await expect(page.locator('main')).toContainText('۹۵٬۰۰۰ تومان');

  await page.getByRole('radio', { name: 'زرین‌پال' }).click({ force: true });
  const payButton = isMobile
    ? page.locator('[data-region="mobile-bar"]').getByRole('button', { name: /پرداخت/ })
    : page.locator('[data-actions="limit"]').getByRole('button', { name: /پرداخت و ساخت کد/ });
  await payButton.click();
  await expect(page.locator('main')).toContainText('زرین‌پال');

  const limitAxe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  expect(limitAxe.violations).toEqual([]);

  // 4. Deep-linked ?s=&code= with lowercase/Persian serial normalizes and transitions to success
  await page.goto('/reference/registry-activation?s=n25ag%20emv0k&code=991122334');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#registry-serial')).toHaveValue('N25AG-EMV0K');
  await expect(page.locator('#registry-syscode')).toHaveValue('991122334');

  await submitButton().click();
  await expect(page.locator('[data-reference-rebuild]')).toHaveAttribute(
    'data-registry-state',
    'success',
  );
  await expect(page.locator('#rb-activation-code')).toHaveText('4417 9082 6153');
  await expect(page.locator('main')).toContainText('۲۲ آبان ۱۴۰۵، ساعت ۱۷:۰۴');

  const successAxe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  expect(successAxe.violations).toEqual([]);
});

test('Wave 4 controls keep >= 44 px targets and visible focus under forced colors and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });

  // OTPField slots >= 44x44 and visible focus
  await page.goto('/components/otp-field');
  await page.waitForLoadState('networkidle');
  const firstSlot = page
    .locator(example('otp-field'))
    .getByRole('group', { name: 'کد تأیید پیامکی' })
    .getByRole('textbox')
    .first();
  await firstSlot.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(firstSlot).toHaveAttribute('data-focus-visible', 'true');
  const slotMetrics = await firstSlot.evaluate((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      outlineStyle: s.outlineStyle,
      outlineWidth: Number.parseFloat(s.outlineWidth),
      width: r.width,
      height: r.height,
    };
  });
  expect(slotMetrics.outlineStyle).not.toBe('none');
  expect(slotMetrics.outlineWidth).toBeGreaterThan(0);
  expect(slotMetrics.width).toBeGreaterThanOrEqual(44);
  expect(slotMetrics.height).toBeGreaterThanOrEqual(44);

  // FileUpload choose and remove buttons >= 44x44
  await page.goto('/components/file-upload');
  await page.waitForLoadState('networkidle');
  const chooseBtn = page
    .locator(example('file-upload'))
    .locator('[data-nds="DropZone"] [data-nds="Button"]')
    .first();
  const removeBtn = page
    .locator(example('file-upload'))
    .getByRole('button', { name: /حذف پروندهٔ/ })
    .first();
  const chooseRect = await chooseBtn.boundingBox();
  const removeRect = await removeBtn.boundingBox();
  expect(chooseRect?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(chooseRect?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(removeRect?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(removeRect?.height ?? 0).toBeGreaterThanOrEqual(44);
});
