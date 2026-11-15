import { test } from '@playwright/test';
import { ROUTES, THEMES, withTheme } from './routes.ts';

// Review screenshots for the owner (not a visual-regression gate yet; that needs the
// fixed Docker image with fonts, docs/quality.md). Run with SCREENSHOTS=1.
test.skip(!process.env.SCREENSHOTS, 'set SCREENSHOTS=1 to capture review screenshots');
test.use({ deviceScaleFactor: 2 });

for (const route of ROUTES) {
  for (const theme of THEMES) {
    test(`screenshot ${route} ${theme}`, async ({ page }, info) => {
      await page.goto(withTheme(route, theme));
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      const name = route === '/' ? 'overview' : route.slice(1).replaceAll(/[/?=&]/g, '-');
      await page.screenshot({
        path: `screenshots/${name}-${info.project.name}-${theme}.png`,
        fullPage: false,
      });
    });
  }
}
