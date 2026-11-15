import { expect, type Locator, type Page, test } from '@playwright/test';
import { COMPONENT_SLUGS, THEMES } from './routes.ts';

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

const snap = (locator: Locator, name: string) =>
  expect(locator).toHaveScreenshot(name, {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.001,
  });

for (const theme of THEMES) {
  for (const slug of COMPONENT_SLUGS) {
    test(`gallery ${slug} (${theme})`, async ({ page }) => {
      await open(page, `/components/${slug}?theme=${theme}`);
      await snap(page.locator(`[data-gallery="${slug}"]`), `${slug}-${theme}.png`);
    });
  }

  test(`icon grid (${theme})`, async ({ page }) => {
    await open(page, `/foundations/icons?theme=${theme}`);
    await snap(page.locator('[data-gallery="icons"]'), `icons-${theme}.png`);
  });

  test.describe('interaction states', () => {
    test.skip(({ isMobile }) => isMobile, 'pointer and keyboard states are captured on desktop');

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
  });
}
