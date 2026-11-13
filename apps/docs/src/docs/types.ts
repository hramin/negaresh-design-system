import type { ReactNode } from 'react';

export type Product = 'R' | 'N' | 'T' | 'V';
export type Status = 'planned' | 'building' | 'review' | 'approved';

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentApi {
  /** Exported component name, e.g. `Button`. */
  name: string;
  props: PropRow[];
}

export interface ComponentDoc {
  slug: string;
  /** Persian page title. */
  title: string;
  /** Exported names documented on the page. */
  components: string[];
  summary: string;
  status: Status;
  products: Product[];
  /** React Aria base, if any. */
  base?: string;
  /** Live example at the top of the page. */
  Example: () => ReactNode;
  /** Every state rendered statically; this is what the visual snapshots capture. */
  Gallery: () => ReactNode;
  usage: { do: string[]; dont: string[] };
  api: ComponentApi[];
  keyboard?: { keys: string; action: string }[];
  a11y: string[];
  rtl: string[];
}
