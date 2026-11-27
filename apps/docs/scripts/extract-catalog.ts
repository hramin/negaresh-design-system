import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import type { Product, Status } from '../src/docs/types.ts';

export type DocSection = 'components' | 'charts' | 'assessment' | 'patterns';

export interface CatalogDocItem {
  section: DocSection;
  slug: string;
  title: string;
  summary: string;
  components: string[];
  status: Status;
  products: Product[];
  base?: string;
}

export interface GeneratedDocsCatalog {
  components: CatalogDocItem[];
  charts: CatalogDocItem[];
  assessment: CatalogDocItem[];
  patterns: CatalogDocItem[];
}

const REGISTRIES: readonly { section: DocSection; file: string; exportConst: string }[] = [
  { section: 'components', file: 'apps/docs/src/docs/registry.tsx', exportConst: 'COMPONENT_DOCS' },
  { section: 'charts', file: 'apps/docs/src/docs/charts/registry.tsx', exportConst: 'CHART_DOCS' },
  {
    section: 'assessment',
    file: 'apps/docs/src/docs/assessment/registry.tsx',
    exportConst: 'ASSESSMENT_DOCS',
  },
  {
    section: 'patterns',
    file: 'apps/docs/src/docs/patterns/registry.tsx',
    exportConst: 'PATTERN_DOCS',
  },
];

function readStringLiteral(node: ts.Expression): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function readStringArray(node: ts.Expression): string[] {
  if (!ts.isArrayLiteralExpression(node)) return [];
  const out: string[] = [];
  for (const el of node.elements) {
    const val = readStringLiteral(el);
    if (val !== undefined) out.push(val);
  }
  return out;
}

function extractDocObjectFromFile(
  filePath: string,
  exportName: string,
  section: DocSection,
): CatalogDocItem {
  const src = fs.readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  let found: ts.ObjectLiteralExpression | undefined;

  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === exportName &&
      node.initializer
    ) {
      let expr: ts.Expression = node.initializer;
      while (ts.isAsExpression(expr) || ts.isSatisfiesExpression(expr)) {
        expr = expr.expression;
      }
      if (ts.isObjectLiteralExpression(expr)) {
        found = expr;
      }
    }
    if (!found) ts.forEachChild(node, visit);
  }
  visit(sf);

  if (!found) {
    throw new Error(`Could not find ComponentDoc object "${exportName}" in ${filePath}`);
  }

  let slug = '';
  let title = '';
  let summary = '';
  let status: Status = 'approved';
  let components: string[] = [];
  let products: Product[] = [];
  let base: string | undefined;

  for (const prop of found.properties) {
    if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) continue;
    const key = prop.name.text;
    if (key === 'slug') slug = readStringLiteral(prop.initializer) ?? '';
    else if (key === 'title') title = readStringLiteral(prop.initializer) ?? '';
    else if (key === 'summary') summary = readStringLiteral(prop.initializer) ?? '';
    else if (key === 'status') {
      const s = readStringLiteral(prop.initializer);
      if (s === 'planned' || s === 'building' || s === 'review' || s === 'approved') status = s;
    } else if (key === 'components') components = readStringArray(prop.initializer);
    else if (key === 'products') products = readStringArray(prop.initializer) as Product[];
    else if (key === 'base') base = readStringLiteral(prop.initializer);
  }

  if (!slug || !title) {
    throw new Error(`Incomplete ComponentDoc metadata for "${exportName}" in ${filePath}`);
  }

  return {
    section,
    slug,
    title,
    summary,
    components,
    status,
    products,
    ...(base ? { base } : {}),
  };
}

function parseRegistry(
  registryPath: string,
  exportConst: string,
  section: DocSection,
): CatalogDocItem[] {
  const src = fs.readFileSync(registryPath, 'utf8');
  const sf = ts.createSourceFile(
    registryPath,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const regDir = path.dirname(registryPath);
  const importMap = new Map<string, string>();
  const orderedIds: string[] = [];

  for (const stmt of sf.statements) {
    if (ts.isImportDeclaration(stmt) && stmt.importClause?.namedBindings) {
      const spec = readStringLiteral(stmt.moduleSpecifier);
      if (!spec?.startsWith('.')) continue;
      const targetFile = path.resolve(regDir, spec);
      if (ts.isNamedImports(stmt.importClause.namedBindings)) {
        for (const el of stmt.importClause.namedBindings.elements) {
          importMap.set(el.name.text, targetFile);
        }
      }
    }
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text === exportConst &&
          decl.initializer &&
          ts.isArrayLiteralExpression(decl.initializer)
        ) {
          for (const el of decl.initializer.elements) {
            if (ts.isIdentifier(el)) orderedIds.push(el.text);
          }
        }
      }
    }
  }

  return orderedIds.map((id) => {
    const file = importMap.get(id);
    if (!file) throw new Error(`Missing import for "${id}" in ${registryPath}`);
    return extractDocObjectFromFile(file, id, section);
  });
}

/**
 * Extracts lightweight navigation and search metadata for all 101 docs pages
 * without pulling heavy interactive JSX galleries into the root Shell bundle.
 */
export function extractDocsCatalog(repoRoot?: string): GeneratedDocsCatalog {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const root = repoRoot ?? path.resolve(scriptDir, '../../..');

  const out: GeneratedDocsCatalog = {
    components: [],
    charts: [],
    assessment: [],
    patterns: [],
  };

  for (const reg of REGISTRIES) {
    out[reg.section] = parseRegistry(path.join(root, reg.file), reg.exportConst, reg.section);
  }
  return out;
}
