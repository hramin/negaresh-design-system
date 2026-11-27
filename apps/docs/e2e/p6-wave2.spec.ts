import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { THEMES, withTheme } from './routes.ts';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const WAVE2_PATTERN_SLUGS = ['identity-sign-in', 'identity-security'] as const;

const KEYCLOAK_SCREENS = [
  'phone-signin',
  'phone-otp',
  'password-signin',
  'forgot-password',
  'register',
  'verify-mobile',
  'two-factor-setup',
  'error',
  'info',
] as const;

const settle = async (page: Page) => {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Number.POSITIVE_INFINITY)
        .map((a) => a.finished),
    ),
  );
};

async function openAndSettle(page: Page, url: string) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  const response = await page.goto(url);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
  expect(errors, `no runtime errors on ${url}`).toEqual([]);
}

async function expectNoAxe(page: Page) {
  await settle(page);
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
  }));
  expect(summary).toEqual([]);
}

async function expectTouchTargets44(page: Page, rootSelector: string, label: string) {
  await settle(page);
  const undersized = await page.evaluate((selector) => {
    const root = document.querySelector(selector);
    if (!root) return [];
    const controls = Array.from(root.querySelectorAll('button, a[href]')).filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
    });
    return controls
      .filter((el) => {
        // Ignore inline anchor links inside running prose or SkipLink off-screen.
        if (el.getAttribute('data-nds') === 'SkipLink') return false;
        const rect = el.getBoundingClientRect();
        const after = window.getComputedStyle(el, '::after');
        const hasAfter = after.content !== 'none' && after.content !== '';
        const afterW = hasAfter ? Number.parseFloat(after.width) || 0 : 0;
        const afterH = hasAfter ? Number.parseFloat(after.height) || 0 : 0;
        const effW = Math.max(rect.width, afterW);
        const effH = Math.max(rect.height, afterH);
        return effW < 43.5 || effH < 43.5;
      })
      .map((el) => ({
        tag: el.tagName,
        text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
      }));
  }, rootSelector);
  expect(undersized, `${label} interactive targets < 44px`).toEqual([]);
}

test.describe('P6 Wave 2 · Docs galleries, overflow, touch targets, and axe', () => {
  for (const slug of WAVE2_PATTERN_SLUGS) {
    for (const theme of THEMES) {
      test(`/patterns/${slug} (${theme}) has no overflow, >=44px targets, and 0 axe violations`, async ({
        page,
      }) => {
        await openAndSettle(page, withTheme(`/patterns/${slug}`, theme));
        await expect(page.locator(`[data-gallery="pattern-${slug}"]`)).toBeVisible();

        const [scrollWidth, clientWidth] = await page.evaluate(() => [
          document.documentElement.scrollWidth,
          document.documentElement.clientWidth,
        ]);
        expect(scrollWidth, `${slug} (${theme}) horizontal overflow`).toBeLessThanOrEqual(
          clientWidth,
        );

        await expectTouchTargets44(page, `[data-gallery="pattern-${slug}"]`, `${slug} (${theme})`);
        await expectNoAxe(page);
      });
    }
  }
});

test.describe('P6 Wave 2 · Full-bleed Keycloak screens (all 8 flows, light & dark)', () => {
  for (const screen of KEYCLOAK_SCREENS) {
    for (const theme of THEMES) {
      test(`/reference/keycloak-login?screen=${screen} (${theme}) passes RTL, overflow, 44px, and axe`, async ({
        page,
      }) => {
        await openAndSettle(page, withTheme(`/reference/keycloak-login?screen=${screen}`, theme));
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
        await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('[data-nds="AuthShell"]')).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        const [scrollWidth, clientWidth] = await page.evaluate(() => [
          document.documentElement.scrollWidth,
          document.documentElement.clientWidth,
        ]);
        expect(scrollWidth, `${screen} (${theme}) overflow`).toBeLessThanOrEqual(clientWidth);

        await expectTouchTargets44(page, '[data-nds="AuthShell"]', `${screen} (${theme})`);
        await expectNoAxe(page);
      });
    }
  }
});

test.describe('P6 Wave 2 · Interactive journeys, LTR isolation, forced-colors, and reduced-motion', () => {
  test('PhoneSignIn normalises Persian digits, transitions to OTP, and keeps inputs LTR', async ({
    page,
  }) => {
    await openAndSettle(page, '/reference/keycloak-login?screen=phone-signin&theme=light');
    const phoneInput = page.getByLabel(/شمارهٔ موبایل/);
    await expect(phoneInput).toHaveAttribute('dir', 'ltr');
    await phoneInput.fill('۰۹۱۲۳۴۵۶۷۸۹');
    await page.getByRole('button', { name: 'دریافت کد تأیید' }).click();
    await settle(page);

    await expect(page.getByRole('heading', { level: 1 })).toContainText('تأیید شمارهٔ موبایل');
    const otpInput = page.locator('input[inputmode="numeric"]').first();
    await expect(otpInput).toBeVisible();
    await expectNoAxe(page);
  });

  test('PasswordSignIn isolates email LTR and reveals password cleanly', async ({ page }) => {
    await openAndSettle(page, '/reference/keycloak-login?screen=password-signin&theme=light');
    const emailInput = page.getByLabel(/ایمیل یا نام کاربری/);
    await expect(emailInput).toHaveAttribute('dir', 'ltr');

    const passInput = page.getByLabel(/^رمز عبور/);
    await expect(passInput).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'نمایش گذرواژه' }).click();
    await settle(page);
    await expect(passInput).toHaveAttribute('type', 'text');
    await expectNoAxe(page);
  });

  test('TwoFactorSetup isolates manual base32 secret LTR and toggles visibility', async ({
    page,
  }) => {
    await openAndSettle(page, '/reference/keycloak-login?screen=two-factor-setup&theme=dark');
    const code = page.locator('[data-nds="Code"]').first();
    await expect(code).toContainText('JBSW Y3DP EHPK 3PXP');
    const dir = await code.evaluate((el) => window.getComputedStyle(el).direction);
    expect(dir).toBe('ltr');

    await page.getByRole('button', { name: 'پنهان کردن کلید دستی' }).click();
    await settle(page);
    await expect(page.getByRole('button', { name: 'نمایش کلید دستی' })).toBeVisible();
    await expectNoAxe(page);
  });

  test('respects forced-colors and prefers-reduced-motion without axe regressions', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openAndSettle(page, '/reference/keycloak-login?screen=two-factor-setup&theme=dark');
    await expect(page.locator('[data-nds="TwoFactorSetup"]')).toBeVisible();
    // Under simulated forced-colors, OS system color keywords cannot be evaluated by axe color-contrast;
    // normal light/dark color-contrast runs in the route suites above.
    const results = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
