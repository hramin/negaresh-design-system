import { expect, type Locator, type Page, test } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * P2 "done when": the reference page header and actions rebuilt from NDS components
 * without visual change. Compares the static page (reference/registry-activation) with
 * the rebuild (/reference/registry-activation) region by region.
 */
const REFERENCE = new URL('../../../reference/registry-activation/index.html', import.meta.url);
const MAX_DIFF_RATIO = 0.005; // 0.5 % of pixels may differ (anti-aliasing)

/**
 * Screenshots a region after pinning it to the same whole-pixel position on both pages,
 * so different content above it (fields arrive in P3) cannot shift its sub-pixel offset.
 * It keeps its own width, styles and inherited values.
 */
async function shot(locator: Locator, { pin = true } = {}): Promise<PNG> {
  if (!pin)
    return PNG.sync.read(await locator.screenshot({ animations: 'disabled', caret: 'hide' }));
  await locator.evaluate((el: HTMLElement) => {
    const { width } = el.getBoundingClientRect();
    Object.assign(el.style, {
      position: 'fixed',
      insetBlockStart: '0px',
      insetInlineStart: '0px',
      inlineSize: `${width}px`,
      zIndex: '1000',
    });
  });
  return PNG.sync.read(await locator.screenshot({ animations: 'disabled', caret: 'hide' }));
}

/** Crops a PNG to width × height starting at (dx, dy). */
function crop(src: PNG, dx: number, dy: number, width: number, height: number): PNG {
  const out = new PNG({ width, height });
  PNG.bitblt(src, out, dx, dy, width, height, 0, 0);
  return out;
}

/**
 * Pixel comparison that tolerates sub-pixel placement: the regions sit at different
 * fractional offsets when the content above them differs, which shifts anti-aliasing by
 * up to 1 px. Sizes may differ by 1 px; the best of the ±1 px alignments is used.
 */
function compare(a: PNG, b: PNG, name: string) {
  expect(
    Math.abs(a.width - b.width),
    `${name}: width ${a.width} vs ${b.width}`,
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(a.height - b.height),
    `${name}: height ${a.height} vs ${b.height}`,
  ).toBeLessThanOrEqual(1);
  const width = Math.min(a.width, b.width) - 1;
  const height = Math.min(a.height, b.height) - 1;
  let best = { pixels: Number.POSITIVE_INFINITY, diff: new PNG({ width, height }) };
  for (const dx of [0, 1]) {
    for (const dy of [0, 1]) {
      for (const [ax, ay] of [
        [0, 0],
        [1, 1],
        [1, 0],
        [0, 1],
      ] as const) {
        if (
          dx + width > b.width ||
          dy + height > b.height ||
          ax + width > a.width ||
          ay + height > a.height
        )
          continue;
        const diff = new PNG({ width, height });
        const pixels = pixelmatch(
          crop(a, ax, ay, width, height).data,
          crop(b, dx, dy, width, height).data,
          diff.data,
          width,
          height,
          {
            threshold: 0.1,
          },
        );
        if (pixels < best.pixels) best = { pixels, diff };
      }
    }
  }
  const ratio = best.pixels / (width * height);
  test.info().annotations.push({
    type: 'diff',
    description: `${name}: ${(ratio * 100).toFixed(3)} % (${best.pixels} px)`,
  });
  if (ratio > MAX_DIFF_RATIO) {
    test
      .info()
      .attach(`${name}-diff.png`, { body: PNG.sync.write(best.diff), contentType: 'image/png' });
  }
  expect(ratio, `${name}: ${best.pixels} px differ`).toBeLessThanOrEqual(MAX_DIFF_RATIO);
}

async function open(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  // Neutral pointer: hover states must not leak into the comparison.
  await page.mouse.move(0, 0);
}

const CASES: { state: 'form' | 'success' | 'limit'; original: string }[] = [
  { state: 'form', original: 'section[data-for="form error"] .surface__section--sunken' },
  { state: 'success', original: 'section[data-for="success"] .surface__section--sunken' },
  { state: 'limit', original: 'section[data-for="limit"] .surface__section--sunken' },
];

for (const theme of ['light', 'dark'] as const) {
  test(`header matches the reference (${theme})`, async ({ page }) => {
    await open(page, `${REFERENCE.href}?state=form&theme=${theme}&shot`);
    const original = await shot(page.locator('header.topbar'));
    await open(page, `/reference/registry-activation?theme=${theme}`);
    const rebuilt = await shot(page.locator('[data-region="header"]'));
    compare(original, rebuilt, `header-${theme}-${test.info().project.name}`);
  });

  for (const { state, original: selector } of CASES) {
    test(`actions match the reference (${state}, ${theme})`, async ({ page }, info) => {
      test.skip(info.project.name === 'mobile', 'Actions move to the sticky bottom bar on mobile');
      await open(page, `${REFERENCE.href}?state=${state}&theme=${theme}&shot`);
      const original = await shot(page.locator(selector));
      await open(page, `/reference/registry-activation?state=${state}&theme=${theme}`);
      const rebuilt = await shot(page.locator(`[data-actions="${state}"]`));
      compare(original, rebuilt, `actions-${state}-${theme}`);
    });
  }

  test(`mobile action bar matches the reference (${theme})`, async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'Mobile only');
    await open(page, `${REFERENCE.href}?state=form&theme=${theme}&shot`);
    // Translucent sticky bar: capture in place (pinning would change what shows through it).
    const original = await shot(page.locator('.mobile-bar'), { pin: false });
    await open(page, `/reference/registry-activation?theme=${theme}`);
    const rebuilt = await shot(page.locator('[data-region="mobile-bar"]'), {
      pin: false,
    });
    compare(original, rebuilt, `mobile-bar-${theme}`);
  });
}
