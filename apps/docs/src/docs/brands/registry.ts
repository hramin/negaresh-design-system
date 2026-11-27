import {
  type BrandManifestRoute,
  type DocsManifest,
  docsManifest as ravanmaDocsManifest,
} from '@negaresh/brand-ravanma/docs.manifest';
import { dummyBrandDocsManifest } from './dummy-brand/docs.manifest.ts';

export type { BrandManifestRoute, DocsManifest };

/**
 * Registered brand-package documentation manifests (`docs.manifest.ts`).
 * Adding a new brand package requires only appending its manifest here; navigation,
 * route resolution (`/brands/$brand/$slug`), and Persian search update automatically.
 */
export const BRAND_MANIFESTS: readonly DocsManifest[] = [
  ravanmaDocsManifest,
  dummyBrandDocsManifest,
];

export function findBrandManifest(brandId: string): DocsManifest | undefined {
  return BRAND_MANIFESTS.find((m) => m.brandId === brandId);
}

export function findBrandRoute(
  brandId: string,
  slug: string,
): { manifest: DocsManifest; route: BrandManifestRoute } | undefined {
  const manifest = findBrandManifest(brandId);
  if (!manifest) return undefined;
  const route = manifest.routes.find((r) => r.slug === slug);
  if (!route) return undefined;
  return { manifest, route };
}

export function buildBrandNavGroups(): {
  title: string;
  items: { to: string; params: { brand: string; slug: string }; label: string }[];
}[] {
  return BRAND_MANIFESTS.map((manifest) => ({
    title: manifest.navGroup,
    items: manifest.routes.map((route) => ({
      to: '/brands/$brand/$slug',
      params: { brand: manifest.brandId, slug: route.slug },
      label: route.title,
    })),
  }));
}
