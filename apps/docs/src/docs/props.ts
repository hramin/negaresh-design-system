import generatedProps from './generated/props.json';

export interface AutoPropRow {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface AutoComponentApi {
  name: string;
  packageName: string;
  kind: 'component' | 'function';
  description?: string;
  props: readonly AutoPropRow[];
}

interface PropsManifestJson {
  generator: string;
  tsVersion: string;
  packages: readonly string[];
  components: Record<string, AutoComponentApi>;
}

const manifest = generatedProps as PropsManifestJson;

export const PROPS_GENERATOR_META = {
  generator: manifest.generator,
  tsVersion: manifest.tsVersion,
  packages: manifest.packages,
  totalSymbols: Object.keys(manifest.components).length,
} as const;

/** Looks up auto-generated TypeScript props for an exported NDS symbol. */
export function getAutoComponentApi(name: string): AutoComponentApi | undefined {
  return manifest.components[name];
}

/** Returns auto-generated TypeScript APIs for every documented symbol on a page. */
export function getAutoComponentApis(names: readonly string[]): AutoComponentApi[] {
  const result: AutoComponentApi[] = [];
  for (const name of names) {
    const api = manifest.components[name];
    if (api) result.push(api);
  }
  return result;
}

/** Returns every extracted symbol across all 5 workspace packages. */
export function getAllAutoComponentApis(): AutoComponentApi[] {
  return Object.values(manifest.components);
}

/** Groups symbol names by owning package for copyable import snippets. */
export function buildImportSnippet(names: readonly string[]): string {
  const byPkg = new Map<string, string[]>();
  for (const name of names) {
    const pkg = manifest.components[name]?.packageName ?? '@negaresh/react';
    const list = byPkg.get(pkg) ?? [];
    list.push(name);
    byPkg.set(pkg, list);
  }
  return [...byPkg.entries()]
    .map(([pkg, syms]) => `import { ${syms.join(', ')} } from '${pkg}';`)
    .join('\n');
}
