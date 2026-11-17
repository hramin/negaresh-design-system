import { expect, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

test('text field supports editing and Persian character counts', async ({ page }) => {
  await page.goto('/components/text-field');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('text-field'));
  const input = region.getByRole('textbox');
  await input.fill('نگرش');
  await expect(input).toHaveValue('نگرش');
  await expect(region).toContainText('۴ از ۴۰ نویسه');
  await expect(input).toHaveAccessibleName('نام سازمان');
  await expect(input).toHaveAccessibleDescription(/همین نام/);
});

test('textarea grows and shrinks while retaining multiline editing', async ({ page }) => {
  await page.goto('/components/text-area');
  await page.waitForLoadState('networkidle');
  const input = page.locator(example('text-area')).getByRole('textbox');
  await input.fill('یادداشت');
  const initial = await input.evaluate((element) => element.getBoundingClientRect().height);
  await input.fill(Array.from({ length: 12 }, () => 'توضیح درخواست').join('\n'));
  await expect
    .poll(() => input.evaluate((element) => element.getBoundingClientRect().height))
    .toBeGreaterThan(initial);
  await input.fill('کوتاه');
  await expect
    .poll(() => input.evaluate((element) => element.getBoundingClientRect().height))
    .toBeLessThanOrEqual(initial + 1);
});

test('search clear preserves focus and supports keyboard clearing', async ({ page }) => {
  await page.goto('/components/search-field');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('search-field'));
  const input = region.getByRole('searchbox');
  await input.fill('سریال');
  await region.getByRole('button', { name: 'پاک کردن جست‌وجو' }).click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await input.fill('راهنما');
  await input.press('Escape');
  await expect(input).toHaveValue('');
});

test('phone accepts Persian digits and preserves incomplete editing', async ({ page }) => {
  await page.goto('/components/phone-field');
  await page.waitForLoadState('networkidle');
  const input = page.locator(example('phone-field')).getByRole('textbox').first();
  await input.fill('۰۹');
  await expect(input).not.toHaveValue('');
  await input.fill('۰۹۱۲۱۲۳۴۵۶۷');
  await expect(input).toHaveAttribute('dir', 'ltr');
  await expect(input).not.toHaveValue(/[۰-۹٠-٩]/);
  await input.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Backspace');
  await expect(input).toHaveValue('');
});

test('phone preserves middle editing while normalizing Persian and Arabic digits', async ({
  page,
}) => {
  await page.goto('/components/phone-field');
  await page.waitForLoadState('networkidle');
  const input = page.locator(example('phone-field')).getByRole('textbox').first();
  for (const digit of ['۳', '٣']) {
    await input.fill('09121234567');
    await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(2, 3));
    await page.keyboard.insertText(digit);
    await expect(input).toHaveValue('09321234567');
    await expect
      .poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart))
      .toBe(3);
    await input.press('Backspace');
    await expect(input).toHaveValue('0921234567');
  }
});

test('serial normalizes pasted values without changing lookalike characters', async ({ page }) => {
  await page.goto('/components/serial-field');
  await page.waitForLoadState('networkidle');
  const input = page.locator(example('serial-field')).getByRole('textbox').first();
  await input.fill('n25ag emv0k');
  await expect(input).toHaveValue('N25AG-EMV0K');
  await expect(input).toHaveAttribute('dir', 'ltr');
  await input.fill('oi1ls 01234');
  await expect(input).toHaveValue('OI1LS-01234');
});

test('serial separator deletion keeps subsequent edits beside the separator', async ({ page }) => {
  await page.goto('/components/serial-field');
  await page.waitForLoadState('networkidle');
  const input = page.locator(example('serial-field')).getByRole('textbox').first();
  await input.fill('ABCDE12345');
  await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(6, 6));
  await input.press('Backspace');
  await expect
    .poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart))
    .toBe(5);
  await input.press('Backspace');
  await expect(input).toHaveValue('ABCD1-2345');
  await input.fill('ABCDE12345');
  await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(5, 5));
  await input.press('Delete');
  await expect
    .poll(() => input.evaluate((element: HTMLInputElement) => element.selectionStart))
    .toBe(6);
  await input.press('Delete');
  await expect(input).toHaveValue('ABCDE-2345');
});

test('password reveal preserves the value and remains keyboard accessible', async ({ page }) => {
  await page.goto('/components/password-field');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('password-field'));
  const input = region.locator('input');
  await input.fill('Example-paste-42');
  await expect(input).toHaveAttribute('type', 'password');
  const reveal = region.getByRole('button', { name: 'نمایش گذرواژه' });
  await reveal.focus();
  await page.keyboard.press('Enter');
  await expect(input).toHaveAttribute('type', 'text');
  await expect(input).toHaveValue('Example-paste-42');
  await region.getByRole('button', { name: 'پنهان کردن گذرواژه' }).click();
  await expect(input).toHaveAttribute('type', 'password');
  await expect(input).toHaveValue('Example-paste-42');
});

test('native invalid submission focuses the first field; named server errors remain linked', async ({
  page,
}) => {
  await page.goto('/components/form');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('form'));
  const name = region.locator('#wave1-name');
  const email = region.locator('#wave1-email');
  const submit = region.getByRole('button', { name: 'ثبت درخواست آزمایشی' });
  await submit.click();
  await expect(name).toBeFocused();
  await name.fill('نگرش');
  await email.fill('example@negaresh.ir');
  await submit.click();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toBeFocused();
  const summary = region.locator('[data-nds="FormErrorSummary"]');
  await expect(summary).toContainText('این نشانی قبلاً ثبت شده است');
  await summary.getByRole('link').click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAccessibleDescription(/این نشانی قبلاً ثبت شده است/);
});

test('field focus and pending state remain usable with forced colors and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/components/text-field');
  await page.waitForLoadState('networkidle');
  const input = page.locator(example('text-field')).getByRole('textbox');
  await input.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(input).toHaveAttribute('data-focus-visible', 'true');
  const focus = await input.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outline: style.outlineStyle,
      width: Number.parseFloat(style.outlineWidth),
      height: element.getBoundingClientRect().height,
    };
  });
  expect(focus.outline).not.toBe('none');
  expect(focus.width).toBeGreaterThan(0);
  expect(focus.height).toBeGreaterThanOrEqual(44);
  const spinner = page.locator('[data-gallery="text-field"] [role="progressbar"] > span');
  await expect(spinner).toHaveCSS('animation-name', 'none');
});
