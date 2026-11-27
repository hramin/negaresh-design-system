import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core on a rendered container in jsdom. Layout-dependent rules
 * (color-contrast, target-size, region) are verified in Playwright on real pages.
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
