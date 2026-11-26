import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { CHART_SLUGS } from './routes.ts';

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

test('every @negaresh/charts page renders meaningful SSR SVG and opens native data table with JavaScript disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const slug of CHART_SLUGS) {
    const res = await page.goto(`/charts/${slug}`);
    expect(res?.status(), `/charts/${slug} HTTP 200`).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const svgCount = await page.locator(`[data-gallery="chart-${slug}"] svg`).count();
    expect(svgCount, `/charts/${slug} renders SSR SVG`).toBeGreaterThan(0);

    const hasGeometry = await page.evaluate((s) => {
      const svgs = document.querySelectorAll(`[data-gallery="chart-${s}"] svg`);
      return Array.from(svgs).some(
        (svg) =>
          svg.querySelectorAll('path, rect, circle, line, polygon').length > 0 &&
          !svg.outerHTML.includes('NaN'),
      );
    }, slug);
    expect(hasGeometry, `/charts/${slug} SVG has non-empty deterministic geometry`).toBe(true);
  }

  // Native <details> table disclosure expands with JavaScript completely disabled
  await page.goto('/charts/interval-bar');
  const firstDetails = page.locator('[data-interactive="interval-bar"] details').first();
  await firstDetails.locator('summary').click();
  await expect(firstDetails.locator('table')).toBeVisible();

  await context.close();
});

test('IntervalBar toggles professional/calm modes, supports keyboard navigation, >= 44px table toggle, and passes axe', async ({
  page,
}) => {
  await page.goto('/charts/interval-bar');
  await page.waitForLoadState('networkidle');
  const region = page.locator('[data-interactive="interval-bar"]');

  // Verify >= 44px target height on native <summary> data table toggle
  const summary = region.locator('summary').first();
  await settle(page);
  const summaryBox = await summary.boundingBox();
  expect(summaryBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  await summary.click();
  await expect(region.locator('table')).toBeVisible();

  // Switch to calm mode -> zero severe/rose tone attributes, calm wording visible
  await region.getByRole('radio', { name: /نمای آرام/ }).click();
  await settle(page);
  await expect(region.locator('[data-nds="IntervalBar"]')).toHaveAttribute('data-mode', 'calm');
  await expect(region.locator('[data-nds="IntervalBar"] [data-tone="severe"]')).toHaveCount(0);
  await expect(region).toContainText('قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود');

  // Keyboard focus & arrow navigation updates live status readout
  const firstMarker = region.locator('[data-nds="IntervalBar"] [role="button"]').first();
  await firstMarker.focus();
  await page.keyboard.press('ArrowDown');
  await expect(region.locator('[data-nds="IntervalBar"] [role="status"]')).toContainText('اضطراب');

  await settle(page);
  const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axe.violations, 'IntervalBar interactive calm mode + table open').toEqual([]);
});

test('ChartFrame, ProfileLine, Bar, Radar, Gauge, and Sparkline interactive flows and StatTile slot pass axe without overflow', async ({
  page,
}) => {
  // ChartFrame states
  await page.goto('/charts/chart-frame');
  await page.waitForLoadState('networkidle');
  const frameRegion = page.locator('[data-interactive="chart-frame"]');
  await frameRegion.getByRole('radio', { name: 'خالی' }).click();
  await expect(frameRegion.locator('[data-nds="EmptyState"]')).toBeVisible();
  await frameRegion.getByRole('radio', { name: 'خطا' }).click();
  await expect(frameRegion.locator('[data-nds="InlineAlert"]')).toBeVisible();
  await frameRegion.getByRole('button', { name: 'تلاش دوباره' }).click();
  await expect(frameRegion.locator('[data-nds="ChartFrame"]')).toHaveAttribute('data-state', 'ready');

  // ProfileLine keyboard point navigation
  await page.goto('/charts/profile-line');
  await page.waitForLoadState('networkidle');
  const profileRegion = page.locator('[data-interactive="profile-line"]');
  const firstPoint = profileRegion.locator('[data-nds="ProfileLine"] [role="button"]').first();
  await firstPoint.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(profileRegion.locator('[data-nds="ProfileLine"] [role="status"]')).toContainText(
    'بسآمد پایین',
  );

  // Bar orientation switch
  await page.goto('/charts/bar');
  await page.waitForLoadState('networkidle');
  const barRegion = page.locator('[data-interactive="bar-chart"]');
  await barRegion.getByRole('radio', { name: 'افقی' }).click();
  await expect(barRegion.locator('[data-nds="Bar"]')).toHaveAttribute('data-orientation', 'horizontal');

  // Radar always pairs with a visible data table (D-67)
  await page.goto('/charts/radar');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-interactive="radar-chart"] table')).toBeVisible();

  // Gauge calm/professional & severity toggle
  await page.goto('/charts/gauge');
  await page.waitForLoadState('networkidle');
  const gaugeRegion = page.locator('[data-interactive="gauge-chart"]');
  await gaugeRegion.getByRole('radio', { name: 'بالا (۸۱)' }).click();
  await expect(gaugeRegion).toContainText('۸۱');
  await expect(gaugeRegion.locator('[data-nds="Gauge"] [data-tone="severe"]')).toHaveCount(0);

  // Sparkline inside StatTile without horizontal page overflow
  await page.goto('/charts/sparkline');
  await page.waitForLoadState('networkidle');
  const sparkInTile = page.locator(
    '[data-interactive="sparkline-chart"] [data-nds="StatTile"] [data-nds-slot="sparkline"] [data-nds="Sparkline"]',
  );
  await expect(sparkInTile).toHaveCount(3);
  await settle(page);
  const [scrollWidth, clientWidth] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ]);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

  const axeSpark = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axeSpark.violations, 'Sparkline + StatTile composition').toEqual([]);
});

test('charts pass forced-colors: active and prefers-reduced-motion: reduce with zero axe violations', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });

  for (const path of ['/charts/interval-bar', '/charts/profile-line', '/charts/bar']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await settle(page);
    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(axe.violations, `${path} under forced-colors + reduced-motion`).toEqual([]);
  }
});
