import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe on a rendered container. jsdom has no layout engine, so colour contrast and
 * target-size rules run in the Playwright suite on real pages instead.
 */
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      'target-size': { enabled: false },
      region: { enabled: false },
    },
  });
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`),
  ).toEqual([]);
}
