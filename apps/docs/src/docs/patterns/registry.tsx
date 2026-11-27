import type { ComponentDoc } from '../types.ts';
import { commerceCatalogDoc, commerceCheckoutDoc, commerceOrdersDoc } from './commerce-docs.tsx';
import { contentEditorialDoc, contentExpertsDoc } from './content-docs.tsx';
import { accountAdminShellsDoc, coursesDoc } from './courses-shells-docs.tsx';
import { licensingActivationDoc, licensingAdminDoc } from './licensing-docs.tsx';
import { testPlatformCatalogDoc, testPlatformOrgDoc } from './test-platform-docs.tsx';

/** Registered `@negaresh/patterns` documentation pages (rendered at `/patterns/$slug`). */
export const PATTERN_DOCS: readonly ComponentDoc[] = [
  commerceCatalogDoc,
  commerceCheckoutDoc,
  commerceOrdersDoc,
  licensingActivationDoc,
  licensingAdminDoc,
  contentEditorialDoc,
  contentExpertsDoc,
  coursesDoc,
  accountAdminShellsDoc,
  testPlatformCatalogDoc,
  testPlatformOrgDoc,
];

export function findPatternDoc(slug: string): ComponentDoc | undefined {
  return PATTERN_DOCS.find((d) => d.slug === slug);
}
