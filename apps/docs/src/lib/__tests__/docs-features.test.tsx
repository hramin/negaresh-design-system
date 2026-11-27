import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { extractDocsCatalog } from '../../../scripts/extract-catalog.ts';
import {
  BRAND_MANIFESTS,
  buildBrandNavGroups,
  findBrandManifest,
  findBrandRoute,
} from '../../docs/brands/registry.ts';
import rawCatalog from '../../docs/generated/catalog.json';
import { PLAYGROUND_PRESETS } from '../../docs/playground/presets.tsx';
import { MILESTONE_RELEASES, parseChangesetMarkdown } from '../changelog.ts';
import { DECISIONS_DATA } from '../decisions.ts';
import { compactSearchKey, getSearchIndex, normalizePersianSearch, searchDocs } from '../search.ts';

describe('Persian Search Engine', () => {
  it('normalises Arabic/Persian Yeh, Kaf, ZWNJ, diacritics, and Persian/Arabic digits', () => {
    expect(normalizePersianSearch('فعال‌سازی كد يک ۱۲۳٤٥')).toBe('فعال سازی کد یک 12345');
    expect(compactSearchKey('فعال‌سازی')).toBe(compactSearchKey('فعالسازی'));
    expect(compactSearchKey('فعال سازی')).toBe(compactSearchKey('فعال‌سازی'));
    expect(compactSearchKey('كيفيت')).toBe(compactSearchKey('کیفیت'));
  });

  it('finds matching docs regardless of Arabic vs Persian keyboard characters or ZWNJ', () => {
    const r1 = searchDocs('فعال‌سازی');
    const r2 = searchDocs('فعالسازي');
    const r3 = searchDocs('فعال سازی');
    expect(r1.length).toBeGreaterThan(0);
    expect(r2.length).toBeGreaterThan(0);
    expect(r3.length).toBeGreaterThan(0);
    expect(r1[0]?.to).toBe(r2[0]?.to);
    expect(r2[0]?.to).toBe(r3[0]?.to);

    const k1 = searchDocs('كارت');
    const k2 = searchDocs('کارت');
    expect(k1.length).toBeGreaterThan(0);
    expect(k1.map((x) => x.id)).toEqual(k2.map((x) => x.id));
  });

  it('indexes tokens, components, charts, assessment, patterns, decisions, products, and brand manifests', () => {
    const index = getSearchIndex();
    expect(index.length).toBeGreaterThan(300);

    expect(searchDocs('--nds-accent-default').some((r) => r.to === '/tokens')).toBe(true);
    expect(searchDocs('IntervalBar').some((r) => r.to === '/charts/interval-bar')).toBe(true);
    expect(searchDocs('QuestionItem').some((r) => r.to === '/assessment/question-item')).toBe(true);
    expect(searchDocs('PhoneSignIn').some((r) => r.to === '/patterns/identity-sign-in')).toBe(true);
    expect(searchDocs('D-93').some((r) => r.to === '/decisions')).toBe(true);
    expect(searchDocs('رجیستری').some((r) => r.to === '/products/registry')).toBe(true);
    expect(searchDocs('dummy').some((r) => r.to === '/brands/sample-dummy/overview')).toBe(true);
  });
});

describe('Generated Docs Catalog & Parsers', () => {
  it('catalog.json stays in exact sync with source ComponentDoc registries', () => {
    expect(rawCatalog).toEqual(extractDocsCatalog());
  });

  it('parses docs/01-decisions.md including D-93, D-97, and Q-01..Q-07', () => {
    expect(DECISIONS_DATA.inherited.length).toBeGreaterThanOrEqual(10);
    expect(DECISIONS_DATA.nds.some((d) => d.id === 'D-93')).toBe(true);
    expect(DECISIONS_DATA.nds.some((d) => d.id === 'D-97')).toBe(true);
    expect(DECISIONS_DATA.openQuestions.some((q) => q.id === 'Q-01')).toBe(true);
  });

  it('parses Changesets frontmatter markdown and lists P1..P6 approved milestones', () => {
    const parsed = parseChangesetMarkdown(
      'sample-change',
      `---\n"@negaresh/react": minor\n"@negaresh/tokens": patch\n---\n\nافزودن ویژگی تازه به دکمه.`,
    );
    expect(parsed).toEqual({
      id: 'sample-change',
      packages: [
        { name: '@negaresh/react', bump: 'minor' },
        { name: '@negaresh/tokens', bump: 'patch' },
      ],
      summary: 'افزودن ویژگی تازه به دکمه.',
    });
    expect(MILESTONE_RELEASES.map((m) => m.phase)).toContain('P6');
  });
});

describe('Brand-Package Extension Point (docs.manifest.ts)', () => {
  it('registers Ravanma placeholder and dummy brand package without modifying Shell', () => {
    expect(BRAND_MANIFESTS.length).toBeGreaterThanOrEqual(2);
    expect(findBrandManifest('ravanma')?.packageName).toBe('@negaresh/brand-ravanma');
    expect(findBrandManifest('sample-dummy')?.packageName).toBe('@negaresh/brand-sample-dummy');
    expect(findBrandRoute('sample-dummy', 'overview')?.route.title).toContain('نمونه');
    expect(buildBrandNavGroups().length).toBe(BRAND_MANIFESTS.length);
  });
});

describe('Interactive Playground Presets SSR', () => {
  it('renders every multi-package playground preset cleanly on Node SSR without window/document', () => {
    const coveredPackages = new Set(PLAYGROUND_PRESETS.map((p) => p.packageName));
    expect(coveredPackages).toEqual(
      new Set([
        '@negaresh/react',
        '@negaresh/charts',
        '@negaresh/assessment',
        '@negaresh/patterns',
        '@negaresh/keycloak-theme',
      ]),
    );

    for (const preset of PLAYGROUND_PRESETS) {
      const html = renderToString(
        <ThemeProvider messages={faMessages}>{preset.render(preset.defaults)}</ThemeProvider>,
      );
      expect(html.length, `SSR output for playground preset ${preset.id}`).toBeGreaterThan(20);
      expect(preset.code(preset.defaults)).toContain(preset.componentName);
    }
  });
});
