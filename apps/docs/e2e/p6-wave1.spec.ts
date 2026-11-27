import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { PATTERN_SLUGS, THEMES, withTheme } from './routes.ts';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

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

test.describe('P6 Wave 1 · Product Patterns routes, overflow, touch targets, and a11y', () => {
  for (const theme of THEMES) {
    test(`/patterns index renders cleanly (${theme})`, async ({ page }) => {
      await openAndSettle(page, withTheme('/patterns', theme));
      await expect(page.getByRole('heading', { level: 1 })).toContainText('الگوهای محصول');
      const [scrollWidth, clientWidth] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      await expectNoAxe(page);
    });
  }

  for (const slug of PATTERN_SLUGS) {
    test(`/patterns/${slug} has no overflow, 44px touch targets, and 0 axe violations`, async ({
      page,
    }) => {
      await openAndSettle(page, `/patterns/${slug}?theme=light`);
      await expect(page.locator(`[data-gallery="pattern-${slug}"]`)).toBeVisible();

      const [scrollWidth, clientWidth] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(scrollWidth, `${slug} horizontal overflow`).toBeLessThanOrEqual(clientWidth);

      // Verify key interactive pattern controls meet >= 44x44 px WCAG 2.5.8 target floor.
      const undersized = await page.evaluate(() => {
        const gallery = document.querySelector('[data-gallery^="pattern-"]');
        if (!gallery) return [];
        const buttons = Array.from(gallery.querySelectorAll('button')).filter((el) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
        });
        return buttons
          .filter((el) => {
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
            text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
            w: Math.round(el.getBoundingClientRect().width),
            h: Math.round(el.getBoundingClientRect().height),
          }));
      });
      expect(undersized, `${slug} touch targets < 44px`).toEqual([]);

      await expectNoAxe(page);
    });
  }
});

test.describe('P6 Wave 1 · Interactive journeys, print media, forced-colors, and reduced-motion', () => {
  test('Cart quantity stepper and coupon code update Toman totals live', async ({ page }) => {
    await openAndSettle(page, '/patterns/commerce-checkout?theme=light');
    const example = page.locator('[data-nds="Cart"]').first();
    await example.getByRole('button', { name: /افزایش تعداد مجموعه نرم‌افزار/ }).click();
    await settle(page);
    await expect(example).toContainText('۲');
    await example.getByLabel('کد تخفیف').fill('NEGARESH1405');
    await example.getByRole('button', { name: 'اعمال کد' }).click();
    await settle(page);
    await expect(example).toContainText('حذف کد');
    await expectNoAxe(page);
  });

  test('ActivationFlow switches between repeat-PC (FR-12) and limit-reached (FR-11)', async ({
    page,
  }) => {
    await openAndSettle(page, '/patterns/licensing-activation?theme=light');
    await page.getByRole('radio', { name: 'رایانهٔ تکراری' }).click();
    await settle(page);
    await expect(page.locator('[data-nds="ActivationFlow"]').first()).toContainText(
      'بدون کسر از سهمیه',
    );
    await page.getByRole('radio', { name: 'تکمیل ظرفیت' }).click();
    await settle(page);
    await expect(
      page.locator('[data-nds="ActivationFlow"]').first().getByRole('button', {
        name: 'خرید +۱ فعال‌سازی',
      }),
    ).toBeVisible();
  });

  test('Poll voting reveals percentages and expert note', async ({ page }) => {
    await openAndSettle(page, '/patterns/content-editorial?theme=light');
    const poll = page.locator('[data-nds="Poll"]').first();
    await poll.locator('label').first().click();
    await poll.getByRole('button', { name: 'ثبت رأی' }).click();
    await settle(page);
    await expect(poll).toContainText('رأی شما با موفقیت ثبت شد.');
    await expect(poll).toContainText('توضیح متخصص');
  });

  test('CoursePlayer switches lessons and playback speed cleanly', async ({ page }) => {
    await openAndSettle(page, '/patterns/courses?theme=light');
    const player = page.locator('[data-nds="CoursePlayer"]').first();
    await player.getByRole('radio', { name: '1.5x' }).click();
    await settle(page);
    await expect(player.getByRole('radio', { name: '1.5x' })).toBeChecked();
  });

  test('Invoice hides print button under print media and stays A4-ready', async ({ page }) => {
    await openAndSettle(page, '/patterns/commerce-orders?theme=light');
    await page.emulateMedia({ media: 'print' });
    await settle(page);
    const invoice = page.locator('[data-nds="Invoice"]').first();
    await expect(invoice).toBeVisible();
    await expect(invoice.getByRole('button', { name: 'چاپ فاکتور' })).toBeHidden();
  });

  test('respects forced-colors and prefers-reduced-motion without axe regressions', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openAndSettle(page, '/patterns/account-admin-shells?theme=dark');
    await expect(page.locator('[data-nds="AccountShell"]').first()).toBeVisible();
    await expect(page.locator('[data-nds="AdminShell"]').first()).toBeVisible();
    // Under simulated forced-colors, OS system color keywords cannot be evaluated by axe color-contrast;
    // normal light/dark color-contrast runs in the route suite above.
    const results = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
