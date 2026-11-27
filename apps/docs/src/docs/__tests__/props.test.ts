import { describe, expect, it } from 'vitest';
import { extractAllPackageProps } from '../../../scripts/extract-props.ts';
import { ASSESSMENT_DOCS } from '../assessment/registry.tsx';
import { CHART_DOCS } from '../charts/registry.tsx';
import generatedProps from '../generated/props.json';
import { PATTERN_DOCS } from '../patterns/registry.tsx';
import { buildImportSnippet, getAutoComponentApis, PROPS_GENERATOR_META } from '../props.ts';
import { COMPONENT_DOCS } from '../registry.tsx';

describe('Automated TypeScript Props Tables (D-93)', () => {
  it('generated props.json stays in exact sync with live TypeScript AST across all 5 packages', () => {
    const live = extractAllPackageProps();
    expect(generatedProps).toEqual(live);
  });

  it('covers all 5 workspace component packages', () => {
    expect(PROPS_GENERATOR_META.packages).toEqual([
      '@negaresh/react',
      '@negaresh/charts',
      '@negaresh/assessment',
      '@negaresh/patterns',
      '@negaresh/keycloak-theme',
    ]);
    expect(PROPS_GENERATOR_META.totalSymbols).toBeGreaterThanOrEqual(230);
  });

  it('extracts props for every documented symbol across components, charts, assessment, and patterns', () => {
    const allDocs = [...COMPONENT_DOCS, ...CHART_DOCS, ...ASSESSMENT_DOCS, ...PATTERN_DOCS];
    const missing: string[] = [];
    for (const doc of allDocs) {
      const apis = getAutoComponentApis(doc.components);
      const found = new Set(apis.map((a) => a.name));
      for (const symbol of doc.components) {
        if (!found.has(symbol)) {
          missing.push(`${doc.slug}:${symbol}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('extracts union branches cleanly for ChoiceCard and StatusBadge without duplicate union members', () => {
    const [choiceCard, statusBadge] = getAutoComponentApis(['ChoiceCard', 'StatusBadge']);
    expect(choiceCard?.props.find((p) => p.name === 'control')?.type).toContain('"checkbox"');
    const statusProp = statusBadge?.props.find((p) => p.name === 'status');
    expect(statusProp?.required).toBe(true);
    const parts = statusProp?.type.split(' | ') ?? [];
    expect(new Set(parts).size).toBe(parts.length);
  });

  it('builds copyable grouped import snippets by owning package', () => {
    expect(buildImportSnippet(['Button', 'IconButton'])).toBe(
      "import { Button, IconButton } from '@negaresh/react';",
    );
    expect(buildImportSnippet(['IntervalBar'])).toBe(
      "import { IntervalBar } from '@negaresh/charts';",
    );
    expect(buildImportSnippet(['QuestionItem'])).toBe(
      "import { QuestionItem } from '@negaresh/assessment';",
    );
    expect(buildImportSnippet(['ProductCard'])).toBe(
      "import { ProductCard } from '@negaresh/patterns';",
    );
    expect(buildImportSnippet(['PhoneSignIn'])).toBe(
      "import { PhoneSignIn } from '@negaresh/keycloak-theme';",
    );
  });
});
