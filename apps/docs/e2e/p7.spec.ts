import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { P7_ROUTES, THEMES, withTheme } from './routes.ts';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * When a modal Dialog is open, React Aria's `ariaHideOutside` marks `<main>` and `<h1>`
 * behind the backdrop as `aria-hidden="true"`. Matches `p4-wave2.spec.ts`.
 */
const MODAL_OPEN_DISABLED_RULES = ['landmark-one-main', 'page-has-heading-one'];

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
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  const response = await page.goto(url);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await settle(page);
  expect(errors, `no runtime/HTTP/hydration errors on ${url}`).toEqual([]);
}

async function expectNoAxe(page: Page, disabledRules: string[] = []) {
  await settle(page);
  let builder = new AxeBuilder({ page }).withTags(AXE_TAGS);
  if (disabledRules.length > 0) {
    builder = builder.disableRules(disabledRules);
  }
  const results = await builder.analyze();
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
  }));
  expect(summary).toEqual([]);
}

async function expectNoOverflow(page: Page, label: string) {
  await settle(page);
  const [scrollWidth, clientWidth] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ]);
  expect(scrollWidth, `${label} horizontal overflow`).toBeLessThanOrEqual(clientWidth);
}

async function expectTouchTargets44(page: Page, rootSelector: string, label: string) {
  await settle(page);
  const undersized = await page.evaluate((selector) => {
    const root = document.querySelector(selector);
    if (!root) return [];
    const controls = Array.from(root.querySelectorAll('button, [role="button"]')).filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
    });
    return controls
      .filter((el) => {
        if (el.getAttribute('data-nds') === 'SkipLink') return false;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const borderX =
          (Number.parseFloat(style.borderLeftWidth) || 0) +
          (Number.parseFloat(style.borderRightWidth) || 0);
        const borderY =
          (Number.parseFloat(style.borderTopWidth) || 0) +
          (Number.parseFloat(style.borderBottomWidth) || 0);
        let effW = rect.width;
        let effH = rect.height;
        for (const pseudo of ['::before', '::after'] as const) {
          const ps = window.getComputedStyle(el, pseudo);
          if (ps.content !== 'none' && ps.content !== '') {
            const pw = Number.parseFloat(ps.width) || 0;
            const ph = Number.parseFloat(ps.height) || 0;
            if (pw > 0) effW = Math.max(effW, pw + borderX);
            if (ph > 0) effH = Math.max(effH, ph + borderY);
          }
        }
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

test.describe('P7 · All new docs routes (light & dark, RTL, overflow, 44px targets, axe)', () => {
  for (const route of P7_ROUTES) {
    for (const theme of THEMES) {
      test(`${route} (${theme}) passes SSR, RTL, overflow, 44px targets, and axe`, async ({
        page,
      }) => {
        await openAndSettle(page, withTheme(route, theme));
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
        await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoOverflow(page, `${route} (${theme})`);
        await expectTouchTargets44(page, '[data-docs-topbar]', `${route} topbar (${theme})`);
        await expectTouchTargets44(page, 'main', `${route} main (${theme})`);
        await expectNoAxe(page);
      });
    }
  }
});

test.describe('P7 · Persian Search (Ctrl+K modal, Arabic/Persian normalisation, JS-disabled SSR)', () => {
  test('opens via Ctrl+K, normalises Arabic Yeh/Kaf & ZWNJ, navigates by keyboard, and passes axe', async ({
    page,
  }) => {
    await openAndSettle(page, '/?theme=light');
    await page.keyboard.press('Control+k');
    await settle(page);

    const dialog = page.locator('[data-nds="Dialog"]');
    await expect(dialog).toBeVisible();

    const searchInput = dialog.getByRole('searchbox');
    await expect(searchInput).toBeFocused();
    // Arabic Yeh (ي) + missing ZWNJ must still match Persian «فعال‌سازی».
    await searchInput.fill('فعالسازي');
    await settle(page);

    await expect(page.getByTestId('docs-search-status')).toContainText('نتیجه پیدا شد');
    const results = page.getByTestId('docs-search-results').locator('button');
    expect(await results.count()).toBeGreaterThan(0);
    await expectNoAxe(page, MODAL_OPEN_DISABLED_RULES);

    // Verify Arabic Kaf (ك) matches Persian «کارت».
    await searchInput.fill('كارت');
    await settle(page);
    await expect(page.getByTestId('docs-search-results')).toContainText('کارت');

    // Keyboard arrow + Enter navigates and closes modal.
    await searchInput.fill('IntervalBar');
    await settle(page);
    await page.keyboard.press('Enter');
    await page.waitForURL('**/charts/interval-bar');
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('IntervalBar');
  });

  test('SSR /search works without JavaScript enabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const res = await page.goto('/search?q=%D9%81%D8%B9%D8%A7%D9%84%D8%B3%D8%A7%D8%B2%D9%8A');
    expect(res?.status()).toBe(200);
    await expect(page.getByTestId('ssr-search-results')).toBeVisible();
    expect(await page.getByTestId('ssr-search-results').locator('li').count()).toBeGreaterThan(0);

    const resDecision = await page.goto('/search?q=D-93');
    expect(resDecision?.status()).toBe(200);
    await expect(page.getByTestId('ssr-search-results')).toContainText('D-93');
    await context.close();
  });
});

test.describe('P7 · Auto-generated TypeScript Props Tables across all 5 packages (D-93)', () => {
  const SAMPLES = [
    { route: '/components/button', symbol: 'Button', pkg: '@negaresh/react', prop: 'variant' },
    { route: '/charts/interval-bar', symbol: 'IntervalBar', pkg: '@negaresh/charts', prop: 'domain' },
    {
      route: '/assessment/question-item',
      symbol: 'QuestionItem',
      pkg: '@negaresh/assessment',
      prop: 'stem',
    },
    {
      route: '/patterns/commerce-catalog',
      symbol: 'ProductCard',
      pkg: '@negaresh/patterns',
      prop: 'product',
    },
    {
      route: '/patterns/identity-sign-in',
      symbol: 'PhoneSignIn',
      pkg: '@negaresh/keycloak-theme',
      prop: 'defaultPhone',
    },
  ] as const;

  for (const s of SAMPLES) {
    test(`${s.route} renders auto-generated TS props table for ${s.symbol} (${s.pkg})`, async ({
      page,
    }) => {
      await openAndSettle(page, `${s.route}?theme=light`);
      const block = page.locator(`[data-props-table="${s.symbol}"]`);
      await expect(block).toBeVisible();
      await expect(block).toContainText(s.pkg);
      await expect(block).toContainText(s.prop);
      await expectNoOverflow(page, `${s.route} props`);
      await expectNoAxe(page);
    });
  }
});

test.describe('P7 · Interactive Playground (props, light/dark/split, density, RTL/LTR, viewport)', () => {
  test('mutates live props, toggles split theme, compact density, LTR, and 390px viewport', async ({
    page,
  }) => {
    await openAndSettle(page, '/playground?preset=button&theme=light');
    const lightCanvas = page.getByTestId('playground-canvas-light');
    await expect(lightCanvas).toBeVisible();
    await expect(lightCanvas).toContainText('ساخت کد فعال‌سازی');

    // Mutate button label live
    const labelInput = page.getByLabel('برچسب دکمه');
    await labelInput.fill('ثبت سفارش نهایی');
    await settle(page);
    await expect(lightCanvas).toContainText('ثبت سفارش نهایی');

    // Switch to split light+dark preview
    await page.getByRole('radio', { name: 'هم‌زمان' }).click();
    await settle(page);
    await expect(page.getByTestId('playground-canvas-light')).toBeVisible();
    await expect(page.getByTestId('playground-canvas-dark')).toBeVisible();

    // Switch to compact density + LTR + 390px viewport
    await page.getByRole('radio', { name: 'فشرده' }).click();
    await page.getByRole('radio', { name: 'LTR' }).click();
    await page.getByRole('radio', { name: '۳۹۰px' }).click();
    await settle(page);
    await expect(page.getByTestId('playground-canvas-dark')).toHaveAttribute(
      'data-density',
      'compact',
    );
    await expect(page.getByTestId('playground-canvas-dark')).toHaveAttribute('dir', 'ltr');

    await expectNoOverflow(page, 'playground interactive');
    await expectNoAxe(page);
  });

  test('renders multi-package presets cleanly via URL search params', async ({ page }) => {
    test.slow();
    for (const preset of ['interval-bar', 'question-item', 'product-card', 'phone-signin']) {
      await openAndSettle(page, `/playground?preset=${preset}&theme=dark&canvasTheme=dark`);
      await expect(page.getByTestId('playground-canvas-dark')).toBeVisible();
      await expectNoOverflow(page, `playground preset ${preset}`);
      await expectNoAxe(page);
    }
  });
});

test.describe('P7 · Brand manifest extension, migrated Badge, forced-colors, and Web Vitals', () => {
  test('Brand manifest injects sidebar navigation and resolves dynamic brand routes', async ({
    page,
  }) => {
    await openAndSettle(page, '/brands?theme=light');
    await expect(page.locator('nav')).toContainText('معماری بستهٔ برند روانما');
    await expect(page.locator('nav')).toContainText('نمای کلی بستهٔ نمونهٔ برند');

    await page.locator('nav').getByRole('link', { name: 'نمای کلی بستهٔ نمونهٔ برند' }).click();
    await page.waitForURL('**/brands/sample-dummy/overview');
    await settle(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'نمای کلی بستهٔ نمونهٔ برند',
    );
    await expectNoAxe(page);
  });

  test('/foundations/color renders migrated @negaresh/react Badge for contrast rows', async ({
    page,
  }) => {
    await openAndSettle(page, '/foundations/color?theme=light');
    const badges = page.locator('[data-nds="Badge"]');
    expect(await badges.count()).toBeGreaterThan(20);
    await expectNoAxe(page);
  });

  test('respects forced-colors and prefers-reduced-motion on /playground and /decisions', async ({
    page,
  }) => {
    test.slow();
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    for (const route of ['/playground?theme=dark', '/decisions?theme=dark']) {
      await openAndSettle(page, route);
      // Under simulated forced-colors, OS system color keywords cannot be evaluated by axe color-contrast;
      // normal light/dark color-contrast runs in the route suites above.
      const results = await new AxeBuilder({ page })
        .withTags(AXE_TAGS)
        .disableRules(['color-contrast'])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  });

  test('meets LCP (< 2.5 s) and CLS (< 0.1) performance budgets on key docs routes', async ({
    page,
  }) => {
    test.slow();
    const budgetRoutes = ['/', '/start', '/components/button', '/playground', '/products/registry'];
    for (const route of budgetRoutes) {
      await page.addInitScript(() => {
        const w = window as unknown as { __ndsLcp?: number; __ndsCls?: number };
        w.__ndsLcp = 0;
        w.__ndsCls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            w.__ndsLcp = Math.max(w.__ndsLcp ?? 0, entry.startTime);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const ls = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!ls.hadRecentInput) {
              w.__ndsCls = (w.__ndsCls ?? 0) + (ls.value ?? 0);
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });

      await openAndSettle(page, `${route}?theme=light`);
      const vitals = await page.evaluate(() => {
        const w = window as unknown as { __ndsLcp?: number; __ndsCls?: number };
        return { lcp: w.__ndsLcp ?? 0, cls: w.__ndsCls ?? 0 };
      });
      expect(vitals.lcp, `${route} LCP ms`).toBeLessThan(2500);
      expect(vitals.cls, `${route} CLS`).toBeLessThan(0.1);
    }
  });
});
