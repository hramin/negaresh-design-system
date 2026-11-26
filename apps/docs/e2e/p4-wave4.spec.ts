import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

const example = (name: string) => `[data-interactive="${name}"]`;

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * When a modal sheet/dialog/menu is open, React Aria's `ariaHideOutside` hides background
 * landmarks (`<main>`, `<h1>`). Resting-page landmark coverage is enforced in `smoke.spec.ts`.
 */
const OVERLAY_OPEN_DISABLED_RULES = ['landmark-one-main', 'page-has-heading-one'];

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

test('DataTable supports sorting, selection + BulkActionBar, column visibility menu, density, Wave 1 states, and mobile stacked cards without overflow', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/data-table');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('data-table'));

  // Density toggle
  await region.getByRole('radio', { name: 'فشرده' }).click();
  await expect(region.locator('[data-nds="DataTable"]')).toHaveAttribute('data-density', 'compact');

  // BulkActionBar starts with 1 selected item -> clear selection hides it
  await expect(region.locator('[data-nds="BulkActionBar"]')).toContainText('۱ مورد انتخاب‌شده');
  await region.getByRole('button', { name: 'لغو انتخاب' }).click();
  await expect(region.locator('[data-nds="BulkActionBar"]')).toHaveCount(0);

  // Select first row checkbox (>= 44x44 target) -> BulkActionBar reappears
  const firstRowCheckbox = region.locator('[data-nds="SelectionCheckbox"]').nth(1);
  await expect(firstRowCheckbox).toBeVisible();
  await settle(page);
  const cbBox = await firstRowCheckbox.boundingBox();
  expect(cbBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(cbBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  await firstRowCheckbox.click();
  await expect(region.locator('[data-nds="BulkActionBar"]')).toBeVisible();

  // Open column visibility menu and pass axe while open
  const colsBtn = region.getByRole('button', { name: 'ستون‌ها' });
  await colsBtn.click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.locator('[data-nds="MenuPopover"][data-entering]')).toHaveCount(0);
  await settle(page);

  const axeMenu = await new AxeBuilder({ page })
    .withTags(AXE_TAGS)
    .disableRules(OVERLAY_OPEN_DISABLED_RULES)
    .analyze();
  expect(axeMenu.violations, 'DataTable columns menu open').toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);

  // Switch through Wave 1 states: loading, empty, error
  await region.getByRole('radio', { name: 'بارگذاری' }).click();
  await expect(region.locator('[data-nds="Skeleton"]')).toBeVisible();
  await region.getByRole('radio', { name: 'خالی' }).click();
  await expect(region.locator('[data-nds="EmptyState"]')).toBeVisible();
  await region.getByRole('radio', { name: 'خطا' }).click();
  await expect(region.locator('[data-nds="ErrorState"]')).toBeVisible();
  await region.getByRole('button', { name: 'تلاش دوباره' }).click();
  await expect(region.locator('[data-nds="DataTable"] table')).toBeVisible();

  if (isMobile) {
    // Stacked mobile cards have zero horizontal page overflow
    const [scrollWidth, clientWidth] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  }
});

test('FilterBar removes active chips, resets filters, and opens mobile Sheet drawer cleanly with axe 0 violations', async ({
  page,
  isMobile,
}) => {
  await page.goto('/components/filter-bar');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('filter-bar'));

  await expect(region).toContainText('وضعیت: فعال');
  await expect(region).toContainText('محصول: نگارش تست هوش ۴');

  if (isMobile) {
    const mobileBtn = region.getByRole('button', { name: /^فیلترها/ });
    await expect(mobileBtn).toBeVisible();
    await settle(page);
    const btnBox = await mobileBtn.boundingBox();
    expect(btnBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    await mobileBtn.click();
    await expect(page.locator('[data-nds="Sheet"]')).toBeVisible();
    await expect(page.locator('[data-nds="SheetModal"][data-entering]')).toHaveCount(0);
    await settle(page);

    const axeSheet = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(OVERLAY_OPEN_DISABLED_RULES)
      .analyze();
    expect(axeSheet.violations, 'FilterBar mobile Sheet open').toEqual([]);

    await page.getByRole('button', { name: 'اعمال فیلترها' }).click();
    await expect(page.locator('[data-nds="Sheet"]')).toHaveCount(0);
  }

  // Reset all filters
  await region.getByRole('button', { name: 'پاک کردن فیلترها' }).click();
  await expect(region).not.toContainText('وضعیت: فعال');
});

test('BulkActionBar updates Persian selected count, selects all, and clears selection cleanly', async ({
  page,
}) => {
  await page.goto('/components/bulk-action-bar');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('bulk-action-bar'));

  await expect(region.getByRole('toolbar')).toContainText('۳ مورد انتخاب‌شده');
  await region.getByRole('button', { name: 'انتخاب همه' }).click();
  await expect(region.getByRole('toolbar')).toContainText('۱۲ مورد انتخاب‌شده');

  const clearBtn = region.getByRole('button', { name: 'لغو انتخاب' });
  await expect(clearBtn).toBeVisible();
  await settle(page);
  const box = await clearBtn.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  const hitHeight = await clearBtn.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const after = getComputedStyle(el, '::after');
    const top = Number.parseFloat(after.top) || 0;
    const bottom = Number.parseFloat(after.bottom) || 0;
    return rect.height - top - bottom;
  });
  expect(hitHeight).toBeGreaterThanOrEqual(44);
  await clearBtn.click();
  await expect(region.getByRole('toolbar')).toHaveCount(0);
});

test('List / GridList toggles selection and supports keyboard navigation', async ({ page }) => {
  await page.goto('/components/list');
  await page.waitForLoadState('networkidle');
  const region = page.locator(example('list'));

  await expect(region).toContainText('انتخاب‌شده: ۱ مورد');
  const secondCheckbox = region.locator('[data-nds="SelectionCheckbox"]').nth(1);
  await expect(secondCheckbox).toBeVisible();
  await settle(page);
  const box = await secondCheckbox.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  await secondCheckbox.click();
  await expect(region).toContainText('انتخاب‌شده: ۲ مورد');
});

test('StatTile, Timeline, and DiffView render Persian formatting, Jalali dates, and mode toggle cleanly', async ({
  page,
}) => {
  await page.goto('/components/stat-tile');
  await page.waitForLoadState('networkidle');
  const statRegion = page.locator(example('stat-tile'));
  await expect(statRegion).toContainText('۱٬۲۴۸');
  await expect(statRegion).toContainText('۱۴٬۸۵۰٬۰۰۰ تومان');
  await expect(statRegion.locator('[data-nds-slot="sparkline"]').first()).toBeVisible();

  await page.goto('/components/timeline');
  await page.waitForLoadState('networkidle');
  const tlRegion = page.locator(example('timeline'));
  await expect(tlRegion).toContainText('آبان ۱۴۰۵');
  await expect(tlRegion).toContainText('882859354');

  await page.goto('/components/diff-view');
  await page.waitForLoadState('networkidle');
  const diffRegion = page.locator(example('diff-view'));
  await expect(diffRegion.locator('[data-nds="DiffView"]')).toHaveAttribute('data-mode', 'unified');
  await diffRegion.getByRole('radio', { name: 'کنار هم' }).click();
  await expect(diffRegion.locator('[data-nds="DiffView"]')).toHaveAttribute('data-mode', 'split');
});

test('Sample Admin Serials List filters, selects into BulkActionBar, navigates to Detail, opens Sheet/AlertDialog, and passes axe in both themes', async ({
  page,
  isMobile,
}) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`/reference/admin-serials?theme=${theme}`);
    await page.waitForLoadState('networkidle');
    await settle(page);

    // Zero horizontal overflow
    const [listScrollW, listClientW] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(listScrollW, `admin list overflow (${theme})`).toBeLessThanOrEqual(listClientW);

    // Mobile adapts SideNav -> TabStrip
    const tabStrip = page.locator('[data-nds="TabStrip"]');
    if (isMobile) {
      await expect(tabStrip).toBeVisible();
    } else {
      await expect(tabStrip).toBeHidden();
    }

    // Select a serial row -> BulkActionBar appears -> open destructive AlertDialog
    const firstRowCb = page.locator('[data-nds="SelectionCheckbox"]').nth(1);
    await expect(firstRowCb).toBeVisible();
    await expect(async () => {
      if ((await page.locator('[data-nds="BulkActionBar"]').count()) === 0) {
        await firstRowCb.click();
      }
      await expect(page.locator('[data-nds="BulkActionBar"]')).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 10000 });
    await page.getByRole('button', { name: 'ابطال انتخاب‌شده‌ها' }).click();
    await expect(page.locator('[data-nds="AlertDialog"]')).toBeVisible();
    await expect(page.locator('[data-nds="AlertDialogModal"][data-entering]')).toHaveCount(0);
    await settle(page);

    const axeAlert = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(OVERLAY_OPEN_DISABLED_RULES)
      .analyze();
    expect(axeAlert.violations, `admin list AlertDialog open (${theme})`).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(page.locator('[data-nds="AlertDialog"]')).toHaveCount(0);

    // Navigate to Serial Detail page by clicking N25AG-EMV0K
    await page.getByRole('link', { name: 'N25AG-EMV0K' }).click();
    await page.waitForURL('**/reference/admin-serials/N25AG-EMV0K*');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('N25AG-EMV0K');
    await expect(page.locator('[data-nds="UsageMeter"]')).toBeVisible();
    await expect(page.locator('[data-nds="KeyValueList"]')).toBeVisible();
    await expect(page.locator('[data-nds="Timeline"]')).toBeVisible();
    await expect(page.locator('[data-nds="DiffView"]')).toBeVisible();

    // Open limit editor Sheet and verify axe while open
    await page.getByRole('button', { name: 'تغییر سقف فعال‌سازی' }).click();
    await expect(page.locator('[data-nds="Sheet"]')).toBeVisible();
    await expect(page.locator('[data-nds="SheetModal"][data-entering]')).toHaveCount(0);
    await settle(page);

    const axeSheet = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .disableRules(OVERLAY_OPEN_DISABLED_RULES)
      .analyze();
    expect(axeSheet.violations, `admin detail Sheet open (${theme})`).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(page.locator('[data-nds="Sheet"]')).toHaveCount(0);

    // Switch to full Diff tab
    await page.getByRole('tab', { name: 'مقایسهٔ تغییرات' }).click();
    await expect(page.locator('[data-nds="DiffView"]')).toHaveAttribute('data-mode', 'split');
  }
});
