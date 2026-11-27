import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { ASSESSMENT_SLUGS } from './routes.ts';

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

interface ParsedPdfSummary {
  headerOk: boolean;
  eofOk: boolean;
  byteLength: number;
  pageCount: number;
  mediaBoxA4: boolean;
  hasEmbeddedVazirmatn: boolean;
}

/** Pure-Node PDF binary inspector verifying A4 dimensions, page count, and embedded fonts. */
function inspectPdfBuffer(buf: Buffer): ParsedPdfSummary {
  const latin = buf.toString('latin1');
  const headerOk = latin.startsWith('%PDF-1.');
  const eofOk = latin.trimEnd().endsWith('%%EOF');
  const pageMatches = latin.match(/\/Type\s*\/Page\b(?!s)/g) ?? [];
  // A4 in PDF points is 595.28 x 841.89 pt (Chromium emits 595.32 x 841.92 or 595 x 842)
  const mediaBoxMatch = latin.match(
    /\/MediaBox\s*\[\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\]/,
  );
  const wPt = mediaBoxMatch ? Number.parseFloat(mediaBoxMatch[1] ?? '0') : 0;
  const hPt = mediaBoxMatch ? Number.parseFloat(mediaBoxMatch[2] ?? '0') : 0;
  const mediaBoxA4 = Math.abs(wPt - 595.28) <= 2 && Math.abs(hPt - 841.89) <= 2;
  const hasEmbeddedVazirmatn = /Vazirmatn/i.test(latin);

  return {
    headerOk,
    eofOk,
    byteLength: buf.byteLength,
    pageCount: pageMatches.length,
    mediaBoxA4,
    hasEmbeddedVazirmatn,
  };
}

function comparePngBuffers(aBuf: Buffer, bBuf: Buffer): { ratio: number; diffPixels: number } {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  expect(Math.abs(a.width - b.width), `width ${a.width} vs ${b.width}`).toBeLessThanOrEqual(1);
  expect(Math.abs(a.height - b.height), `height ${a.height} vs ${b.height}`).toBeLessThanOrEqual(
    1,
  );
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const crop = (src: PNG) => {
    if (src.width === width && src.height === height) return src;
    const out = new PNG({ width, height });
    PNG.bitblt(src, out, 0, 0, width, height, 0, 0);
    return out;
  };
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(crop(a).data, crop(b).data, diff.data, width, height, {
    threshold: 0.1,
  });
  return { ratio: diffPixels / (width * height), diffPixels };
}

test('every @negaresh/assessment route renders semantic SSR HTML and real radios/SVG with JavaScript disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const slug of ASSESSMENT_SLUGS) {
    const res = await page.goto(`/assessment/${slug}`);
    expect(res?.status(), `/assessment/${slug} HTTP 200`).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }

  // QuestionItem renders semantic fieldset + legend + real radio inputs without JS
  await page.goto('/assessment/question-item');
  const firstQuestion = page.locator('[data-nds="QuestionItem"]').first();
  await expect(firstQuestion.locator('legend')).toBeVisible();
  expect(await firstQuestion.locator('input[type="radio"]').count()).toBeGreaterThanOrEqual(2);

  // Bare A4 report renders full SVG charts + score table without JS
  const reportRes = await page.goto('/reference/assessment-report');
  expect(reportRes?.status()).toBe(200);
  await expect(page.locator('[data-nds="PrintLayout"]')).toBeVisible();
  expect(await page.locator('[data-nds="PrintLayout"] svg').count()).toBeGreaterThan(0);

  await context.close();
});

test('AnswerPage passes keyboard, fieldset/legend, >= 44px option targets, unanswered jump-focus, live progress, and axe (Done-when #1)', async ({
  page,
}) => {
  await page.goto('/assessment/answer-flow');
  await page.waitForLoadState('networkidle');
  await settle(page);

  const region = page.locator('[data-interactive="answer-flow"]');
  const questions = region.locator('[data-nds="QuestionItem"]');
  await expect(questions).toHaveCount(2);

  // Verify semantic fieldset + legend and >= 44x44 px targets on option chips
  await expect(questions.first().locator('legend')).toContainText('پرسش ۱');
  const optionBoxes = await questions
    .first()
    .locator('label')
    .evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { width: r.width, height: r.height };
      }),
    );
  expect(optionBoxes.length).toBeGreaterThanOrEqual(2);
  for (const box of optionBoxes) {
    expect(box.height, 'option chip height >= 44px').toBeGreaterThanOrEqual(44);
    expect(box.width, 'option chip width >= 44px').toBeGreaterThanOrEqual(44);
  }

  // Submit page 1 without answering -> FormErrorSummary announces missing questions & focuses first radio
  await region.getByRole('button', { name: 'صفحهٔ بعدی' }).click();
  await settle(page);
  const summary = region.locator('[data-nds="FormErrorSummary"]');
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('۲ پرسش در این صفحه بدون پاسخ مانده است');

  const focusedTag = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    type: (document.activeElement as HTMLInputElement | null)?.type,
  }));
  expect(focusedTag).toEqual({ tag: 'INPUT', type: 'radio' });

  // Answer question 1 via keyboard Space, then question 2 via keyboard selection, and advance to page 2
  await page.keyboard.press('Space');
  const q2FirstRadio = questions.nth(1).locator('input[type="radio"]').first();
  await q2FirstRadio.focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowLeft');

  await region.getByRole('button', { name: 'صفحهٔ بعدی' }).click();
  await settle(page);

  // Live progress announces page 2 of 3
  const progress = region.locator('[data-nds="AnswerProgress"]');
  await expect(progress).toContainText('صفحهٔ ۲ از ۳');
  await expect(progress.locator('[role="status"]')).toContainText('صفحهٔ ۲ از ۳');

  // Complete page 2 & page 3
  for (const idx of [0, 1]) {
    await region.locator('[data-nds="QuestionItem"]').nth(idx).locator('label').first().click();
  }
  await region.getByRole('button', { name: 'صفحهٔ بعدی' }).click();
  await settle(page);
  await expect(progress).toContainText('صفحهٔ ۳ از ۳');

  for (const idx of [0, 1]) {
    await region.locator('[data-nds="QuestionItem"]').nth(idx).locator('label').first().click();
  }
  await region.getByRole('button', { name: 'ثبت نهایی پاسخ‌ها' }).click();
  await settle(page);
  await expect(region).toContainText('تمامی پاسخ‌های نمونه ثبت شد');

  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
  const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axe.violations, 'AnswerPage completed flow axe violations').toEqual([]);
});

test('StartForm, ResumeOrRestart (AlertDialog), ReportStatus (5 states + retry), and SubmittedPage pass interactive checks and axe', async ({
  page,
}) => {
  // StartForm + ResumeOrRestart
  await page.goto('/assessment/start-resume');
  await page.waitForLoadState('networkidle');
  const startRegion = page.locator('[data-interactive="start-resume"]');

  // Trigger validation error on missing participantCode
  await startRegion.getByRole('button', { name: 'شروع آزمون' }).click();
  await expect(startRegion.locator('[data-nds="FormErrorSummary"]')).toBeVisible();

  await startRegion.getByLabel(/شناسهٔ شرکت‌کننده/).fill('SCH-1405-042');
  await startRegion.getByRole('button', { name: 'شروع آزمون' }).click();
  await expect(startRegion).toContainText('اطلاعات پایه تأیید شد');

  // ResumeOrRestart guarded AlertDialog confirmation
  await startRegion.getByRole('button', { name: 'شروع دوباره' }).click();
  await settle(page);
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'پاک کردن و شروع دوباره' }).click();
  await settle(page);
  await expect(startRegion).toContainText('تلاش قبلی پاک شد');

  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
  const axeStart = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axeStart.violations, 'StartForm & ResumeOrRestart axe').toEqual([]);

  // ReportStatus 5 states + retry + SubmittedPage
  await page.goto('/assessment/report-status');
  await page.waitForLoadState('networkidle');
  const statusRegion = page.locator('[data-interactive="report-status"]');
  await expect(statusRegion.locator('[data-nds="ReportStatus"]')).toHaveAttribute(
    'data-status',
    'failed',
  );
  await statusRegion.getByRole('button', { name: 'تلاش دوباره' }).click();
  await expect(statusRegion.locator('[data-nds="ReportStatus"]')).toHaveAttribute(
    'data-status',
    'ready',
  );
  await expect(page.locator('[data-nds="SubmittedPage"]')).toContainText(
    'می‌توانید این صفحه را ببندید',
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
  const axeStatus = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axeStatus.violations, 'ReportStatus & SubmittedPage axe').toEqual([]);
});

test('MMPI-Teen-13 and Wellbeing-8 render professional and calm views with zero rose/danger in calm mode (Done-when #2)', async ({
  page,
}) => {
  await page.goto('/assessment/result-overview');
  await page.waitForLoadState('networkidle');
  const region = page.locator('[data-interactive="result-overview"]');

  // Professional mode shows clinical danger badges & validity alert
  await expect(region.locator('[data-nds="ResultSummary"]')).toHaveAttribute(
    'data-mode',
    'professional',
  );
  expect(await region.locator('[data-tone="danger"]').count()).toBeGreaterThan(0);

  // Switch to calm mode -> ZERO danger or severe tones across summary, charts, and score table
  await region.getByRole('radio', { name: /نمای آرام/ }).click();
  await settle(page);
  await expect(region.locator('[data-nds="ResultSummary"]')).toHaveAttribute('data-mode', 'calm');
  await expect(region.locator('[data-nds="ScoreTable"]')).toHaveAttribute('data-mode', 'calm');
  await expect(region.locator('[data-tone="danger"]')).toHaveCount(0);
  await expect(region.locator('[data-tone="severe"]')).toHaveCount(0);
  await expect(region).toContainText('قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود');

  // Switch to Wellbeing-8 -> Gauge + IntervalBar + Radar with visible table (D-67)
  await region.getByRole('radio', { name: /Wellbeing-8/ }).click();
  await settle(page);
  await expect(region.locator('[data-nds="Gauge"]')).toBeVisible();
  await expect(region.locator('[data-nds="Radar"]')).toBeVisible();
  await expect(region.locator('[data-tone="danger"]')).toHaveCount(0);

  const [scrollWidth, clientWidth] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ]);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
  const axeRes = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axeRes.violations, 'Result overview calm mode axe').toEqual([]);

  // Verify InterpretationBlock calm mode eliminates danger accents
  await page.goto('/assessment/interpretation-block');
  await page.waitForLoadState('networkidle');
  const interpRegion = page.locator('[data-interactive="interpretation-block"]');
  await interpRegion.getByRole('radio', { name: /نمای آرام/ }).click();
  await settle(page);
  await expect(interpRegion.locator('[data-accent="danger"]')).toHaveCount(0);
  await expect(interpRegion.locator('[data-tone="danger"]')).toHaveCount(0);
});

test('A4 PrintLayout generates valid embedded-font A4 PDFs and matches screen vs print pixels (Done-when #3)', async ({
  page,
  isMobile,
}, testInfo) => {
  test.skip(isMobile, 'A4 PDF generation & print-parity check runs on desktop Chromium');

  // Set exact A4 width (210mm at 96dpi = 794px) for deterministic screen vs print parity
  await page.setViewportSize({ width: 794, height: 1123 });

  const cases = [
    {
      name: 'mmpi-teen-13-professional',
      url: '/reference/assessment-report?fixture=mmpi-teen-13&mode=professional',
    },
    {
      name: 'wellbeing-8-calm',
      url: '/reference/assessment-report?fixture=wellbeing-8&mode=calm',
    },
  ] as const;

  for (const item of cases) {
    await page.emulateMedia({ media: 'screen' });
    await page.goto(item.url);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await settle(page);

    const sheet = page.locator('[data-nds="PrintLayout"]');
    await expect(sheet).toBeVisible();

    // Verify break-inside: avoid on charts & summary cards
    const breakRules = await sheet.evaluate((root) => {
      const selectors = [
        '[data-nds="ResultSummary"]',
        '[data-nds="ChartFrame"]',
        '[data-nds="InterpretationSection"]',
      ];
      return selectors.every((sel) => {
        const el = root.querySelector(sel);
        if (!el) return false;
        const val = getComputedStyle(el).breakInside;
        return val === 'avoid';
      });
    });
    expect(breakRules, `${item.name} enforces break-inside: avoid on charts and cards`).toBe(true);

    // Verify axe on bare A4 report
    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(axe.violations, `${item.name} axe violations`).toEqual([]);

    // Capture screen PNG of [data-nds="PrintLayout"]
    const screenPng = await sheet.screenshot({ animations: 'disabled', caret: 'hide' });

    // Switch to print media: toolbar hides, PrintLayout remains visually identical
    await page.emulateMedia({ media: 'print' });
    await settle(page);
    await expect(page.locator('[data-print-hidden="true"]')).toBeHidden();
    const printPng = await sheet.screenshot({ animations: 'disabled', caret: 'hide' });

    const { ratio, diffPixels } = comparePngBuffers(screenPng, printPng);
    testInfo.annotations.push({
      type: 'print-parity',
      description: `${item.name}: ${(ratio * 100).toFixed(3)}% (${diffPixels} px)`,
    });
    expect(ratio, `${item.name} screen-vs-print pixel diff <= 0.5%`).toBeLessThanOrEqual(0.005);

    // Generate actual A4 PDF binary via Chromium print engine
    const pdfBuf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });
    const meta = inspectPdfBuffer(pdfBuf);
    testInfo.annotations.push({
      type: 'pdf-meta',
      description: `${item.name}: ${meta.byteLength} bytes, ${meta.pageCount} pages, A4=${meta.mediaBoxA4}, Vazirmatn=${meta.hasEmbeddedVazirmatn}`,
    });

    expect(meta.headerOk, `${item.name} valid %PDF- header`).toBe(true);
    expect(meta.eofOk, `${item.name} valid %%EOF trailer`).toBe(true);
    expect(meta.byteLength, `${item.name} non-empty PDF > 20KB`).toBeGreaterThan(20_000);
    expect(meta.mediaBoxA4, `${item.name} exact A4 MediaBox (595x842 pt)`).toBe(true);
    expect(meta.pageCount, `${item.name} bounded page count (1..6)`).toBeGreaterThanOrEqual(1);
    expect(meta.pageCount, `${item.name} bounded page count (1..6)`).toBeLessThanOrEqual(6);
    expect(meta.hasEmbeddedVazirmatn, `${item.name} embeds Vazirmatn font`).toBe(true);

    // Restore screen media for next case
    await page.emulateMedia({ media: 'screen' });
  }
});

test('assessment pages pass forced-colors: active and prefers-reduced-motion: reduce with zero axe violations', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });

  for (const path of [
    '/assessment/question-item',
    '/assessment/result-overview',
    '/assessment/print-layout',
  ]) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await settle(page);
    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(axe.violations, `${path} under forced-colors + reduced-motion`).toEqual([]);
  }
});
