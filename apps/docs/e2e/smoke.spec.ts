import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ROUTES, THEMES, withTheme } from './routes.ts';

for (const route of ROUTES) {
  for (const theme of THEMES) {
    test.describe(`${route} (${theme})`, () => {
      test('renders on the server, RTL, in the requested theme', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('response', (r) => {
          if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
        });
        page.on('console', (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        const response = await page.goto(withTheme(route, theme));
        expect(response?.status()).toBe(200);
        const html = page.locator('html');
        await expect(html).toHaveAttribute('dir', 'rtl');
        await expect(html).toHaveAttribute('lang', 'fa');
        await expect(html).toHaveAttribute('data-theme', theme);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.waitForLoadState('networkidle');
        expect(errors, 'no console errors or hydration warnings').toEqual([]);
        // Mobile is its own composition: nothing may push the page wider than the viewport.
        const [scrollWidth, clientWidth] = await page.evaluate(() => [
          document.documentElement.scrollWidth,
          document.documentElement.clientWidth,
        ]);
        expect(scrollWidth, 'no horizontal page scroll').toBeLessThanOrEqual(clientWidth);
      });

      test('has no axe violations', async ({ page }) => {
        if (route === '/tokens') test.slow();
        await page.goto(withTheme(route, theme));
        await page.waitForLoadState('networkidle');
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();
        const summary = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
        }));
        expect(summary).toEqual([]);
      });
    });
  }
}

test('works without JavaScript', async ({ browser }) => {
  test.slow();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  await context.close();
});

test('theme switch persists in a cookie and survives reload', async ({ page }) => {
  await page.goto('/foundations/color');
  await page.waitForLoadState('networkidle');
  await page.getByRole('radio', { name: 'تیره' }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('radio', { name: 'تیره' })).toBeChecked();
  // The switch needs hydration (it writes a cookie); wait before interacting again.
  await page.waitForLoadState('networkidle');
  await page.getByRole('radio', { name: 'سیستم' }).check();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
  await page.reload();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
});

test('unknown routes return 404', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('React Aria popover dismiss label is localized to Persian in the browser', async ({
  page,
}) => {
  await page.goto('/reference/registry-activation');
  await page.waitForLoadState('networkidle');
  await page.locator('[data-nds="AccountPill"]').click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(
    page.locator('[data-nds="MenuPopover"] button[aria-label="بستن"]').first(),
  ).toBeAttached();
  await expect(page.locator('[data-nds="MenuPopover"] button[aria-label="Dismiss"]')).toHaveCount(
    0,
  );
});
