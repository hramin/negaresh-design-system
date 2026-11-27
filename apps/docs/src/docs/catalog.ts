import rawCatalog from './generated/catalog.json';
import type { Product, Status } from './types.ts';

export type DocSection = 'components' | 'charts' | 'assessment' | 'patterns';

export interface CatalogDocItem {
  section: DocSection;
  slug: string;
  title: string;
  summary: string;
  components: readonly string[];
  status: Status;
  products: readonly Product[];
  base?: string;
}

interface CatalogJson {
  components: readonly CatalogDocItem[];
  charts: readonly CatalogDocItem[];
  assessment: readonly CatalogDocItem[];
  patterns: readonly CatalogDocItem[];
}

const catalog = rawCatalog as CatalogJson;

export const COMPONENT_CATALOG = catalog.components;
export const CHART_CATALOG = catalog.charts;
export const ASSESSMENT_CATALOG = catalog.assessment;
export const PATTERN_CATALOG = catalog.patterns;

export const ALL_CATALOG_DOCS: readonly CatalogDocItem[] = [
  ...COMPONENT_CATALOG,
  ...CHART_CATALOG,
  ...ASSESSMENT_CATALOG,
  ...PATTERN_CATALOG,
];
