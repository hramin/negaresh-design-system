import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export interface GeneratedPropRow {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface GeneratedComponentApi {
  /** Exported symbol name, e.g. `Button`, `DataTable`, `IntervalBar`. */
  name: string;
  /** Workspace package owning the export, e.g. `@negaresh/react`. */
  packageName: string;
  /** Whether the export is a React component or a helper function/hook. */
  kind: 'component' | 'function';
  /** TSDoc summary of the component or function itself. */
  description?: string;
  /** Extracted props (for components) or parameters (for functions). */
  props: GeneratedPropRow[];
}

export interface GeneratedPropsManifest {
  generator: 'typescript-compiler-api';
  tsVersion: string;
  packages: readonly string[];
  components: Record<string, GeneratedComponentApi>;
}

const PACKAGES: readonly { name: string; entry: string }[] = [
  { name: '@negaresh/react', entry: 'packages/react/src/index.ts' },
  { name: '@negaresh/charts', entry: 'packages/charts/src/index.ts' },
  { name: '@negaresh/assessment', entry: 'packages/assessment/src/index.ts' },
  { name: '@negaresh/patterns', entry: 'packages/patterns/src/index.ts' },
  { name: '@negaresh/keycloak-theme', entry: 'packages/keycloak-theme/src/index.ts' },
];

/**
 * Standard fallback descriptions for common React / ARIA props when a base
 * declaration does not carry an explicit TSDoc comment.
 */
const STANDARD_PROP_DESCRIPTIONS: Record<string, string> = {
  children: 'محتوای درونی کامپوننت.',
  className: 'کلاس CSS اضافی که فقط روی عنصر ریشه اعمال می‌شود.',
  ref: 'ارجاع (ref) به عنصر DOM زیرین.',
  id: 'شناسهٔ یکتای عنصر در DOM.',
  slot: 'نام جایگاه (slot) برای ترکیب با کانتینرهای React Aria.',
  'aria-label': 'برچسب دسترس‌پذیر برای صفحه‌خوان‌ها.',
  'aria-labelledby': 'شناسهٔ عنصری که برچسب این کنترل است.',
  'aria-describedby': 'شناسهٔ عنصر توضیحی یا پیام خطای مرتبط.',
  'aria-controls': 'شناسهٔ عنصری که توسط این کنترل هدایت می‌شود.',
  'aria-expanded': 'وضعیت باز یا بسته بودن محتوای وابسته برای صفحه‌خوان.',
  'aria-haspopup': 'نوع پنجرهٔ بازشو مرتبط با این دکمه.',
  isDisabled: 'غیرفعال کردن کنترل و جلوگیری از تعامل.',
  isReadOnly: 'حالت فقط‌خواندنی (قابل فوکوس ولی بدون تغییر مقدار).',
  isRequired: 'الزامی بودن مقدار در اعتبارسنجی فرم.',
  isInvalid: 'نشان دادن وضعیت خطا و فعال کردن استایل نامعتبر.',
  isPending: 'نشان دادن وضعیت در حال انجام با حفظ فوکوس و اعلام به صفحه‌خوان.',
  isSelected: 'وضعیت انتخاب کنترل‌شده.',
  defaultSelected: 'وضعیت انتخاب اولیه در حالت غیرکنترل‌شده.',
  isOpen: 'وضعیت باز بودن کنترل‌شدهٔ لایهٔ شناور.',
  defaultOpen: 'وضعیت باز بودن اولیه در حالت غیرکنترل‌شده.',
  onOpenChange: 'فراخوانی هنگام باز یا بسته شدن لایهٔ شناور.',
  onPress: 'فراخوانی هنگام فشردن با ماوس، لمس یا کیبورد.',
  onChange: 'فراخوانی هنگام تغییر مقدار یا انتخاب.',
  autoFocus: 'انتقال خودکار فوکوس هنگام نصب عنصر.',
  name: 'نام فیلد هنگام ارسال فرم HTML.',
  value: 'مقدار کنترل‌شدهٔ فیلد یا گزینه.',
  defaultValue: 'مقدار اولیه در حالت غیرکنترل‌شده.',
  placeholder: 'متن راهنمای کم‌رنگ درون فیلد خالی.',
  type: 'نوع دکمه یا ورودی HTML.',
  form: 'شناسهٔ فرمی که این کنترل به آن متصل است.',
  href: 'نشانی مقصد پیوند.',
  target: 'هدف باز شدن پیوند (مثلاً _blank).',
  rel: 'رابطهٔ پیوند (برای پیوندهای بیرونی به‌طور امن تنظیم می‌شود).',
  routerOptions: 'گزینه‌های اختیاری مسیریاب برای پیوندهای React Aria.',
  validationBehavior: 'رفتار اعتبارسنجی فرم (`native` یا `aria`).',
  validate: 'تابع اعتبارسنجی سفارشی برای بازگرداندن پیام خطا.',
  selectedKey: 'کلید انتخاب‌شده در حالت کنترل‌شده.',
  defaultSelectedKey: 'کلید انتخاب اولیه در حالت غیرکنترل‌شده.',
  selectedKeys: 'مجموعه کلیدهای انتخاب‌شده در حالت کنترل‌شده.',
  defaultSelectedKeys: 'مجموعه کلیدهای انتخاب اولیه در حالت غیرکنترل‌شده.',
  disabledKeys: 'کلیدهای غیرفعال که قابل انتخاب نیستند.',
  onSelectionChange: 'فراخوانی هنگام تغییر انتخاب در مجموعه.',
  textValue: 'متن ساده برای تایپ‌جست‌وجو (typeahead) و دسترس‌پذیری.',
  onAction: 'فراخوانی هنگام اجرای یک آیتم از فهرست یا منو.',
  onRemove: 'فراخوانی هنگام حذف برچسب یا آیتم.',
  placement: 'جایگذاری منطقی لایهٔ شناور نسبت به محرک (سازگار با RTL).',
  offset: 'فاصلهٔ پیکسلی لایهٔ شناور از محرک.',
  delay: 'تأخیر باز شدن به میلی‌ثانیه.',
  closeDelay: 'تأخیر بسته شدن به میلی‌ثانیه.',
  minValue: 'کمترین مقدار عددی مجاز.',
  maxValue: 'بیشترین مقدار عددی مجاز.',
  step: 'گام افزایش یا کاهش مقدار.',
  formatOptions: 'تنظیمات قالب‌بندی عدد بر پایهٔ Intl.NumberFormat.',
  selectionMode: 'حالت انتخاب (`none`، `single` یا `multiple`).',
  disallowEmptySelection: 'جلوگیری از خالی ماندن انتخاب در گروه.',
  orientation: 'چیدمان افقی یا عمودی.',
};

/** Common DOM props to keep even if a component inherits wide HTMLAttributes. */
const KEPT_WIDE_DOM_PROPS = new Set([
  'id',
  'className',
  'children',
  'ref',
  'role',
  'tabIndex',
  'dir',
  'lang',
  'href',
  'target',
  'rel',
  'type',
  'name',
  'value',
  'defaultValue',
  'disabled',
  'placeholder',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-current',
  'aria-expanded',
  'aria-controls',
  'aria-haspopup',
]);

function normalizeWhitespace(text: string): string {
  return text.replaceAll(/\s+/g, ' ').trim();
}

function cleanTypeString(raw: string): string {
  let cleaned = normalizeWhitespace(raw);
  // Strip `| undefined` added by exactOptionalPropertyTypes for optional props.
  cleaned = cleaned.replaceAll(/\s*\|\s*undefined\b/g, '');
  cleaned = cleaned.replaceAll(/\bundefined\s*\|\s*/g, '');
  // Normalize verbose React namespace prefixes for readability.
  cleaned = cleaned.replaceAll(/\bReact\./g, '');
  cleaned = cleaned.replaceAll(/import\([^)]+\)\./g, '');
  // Compact redundant spaces inside generics / parens.
  cleaned = cleaned.replaceAll(/\(\s+/g, '(').replaceAll(/\s+\)/g, ')');
  // Unwrap redundant outer parentheses around a single arrow function type.
  if (cleaned.startsWith('((') && cleaned.endsWith(')') && !cleaned.includes(') |')) {
    let depth = 0;
    let balancedOuter = true;
    for (let i = 0; i < cleaned.length - 1; i++) {
      if (cleaned[i] === '(') depth++;
      else if (cleaned[i] === ')') depth--;
      if (depth === 0) {
        balancedOuter = false;
        break;
      }
    }
    if (balancedOuter) cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
}

function splitTopLevelUnion(typeStr: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  let quote: string | null = null;
  for (let i = 0; i < typeStr.length; i++) {
    const ch = typeStr[i]!;
    if (quote) {
      current += ch;
      if (ch === quote && typeStr[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{' || ch === '<') {
      depth++;
      current += ch;
    } else if (ch === ')' || ch === ']' || ch === '}' || ch === '>') {
      depth = Math.max(0, depth - 1);
      current += ch;
    } else if (ch === '|' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) parts.push(trimmed);
      current = '';
    } else {
      current += ch;
    }
  }
  const tail = current.trim();
  if (tail) parts.push(tail);
  return parts;
}

function mergeTypeStrings(types: Iterable<string>): string {
  const unique = new Set<string>();
  for (const t of types) {
    for (const part of splitTopLevelUnion(cleanTypeString(t))) {
      if (part && part !== 'undefined') unique.add(part);
    }
  }
  return [...unique].join(' | ') || 'unknown';
}

function isLiteralDefault(value: string): boolean {
  const v = value.trim();
  return (
    /^'[^']*'$/.test(v) ||
    /^"[^"]*"$/.test(v) ||
    /^-?\d+(?:\.\d+)?$/.test(v) ||
    v === 'true' ||
    v === 'false' ||
    v === 'null' ||
    v === '[]' ||
    v === '{}'
  );
}

function extractDefaultFromDoc(doc: string, jsDocTags: readonly ts.JSDocTagInfo[]): string | undefined {
  for (const tag of jsDocTags) {
    if (tag.name === 'default' || tag.name === 'defaultValue') {
      const value = ts.displayPartsToString(tag.text).trim();
      if (value && isLiteralDefault(value)) return value;
    }
  }
  const backtickMatch =
    doc.match(/\b[Dd]efault(?:s\s+to)?\s*[:=]?\s*`([^`]+)`/) ??
    doc.match(/\(default\s+`([^`]+)`\)/i);
  if (backtickMatch?.[1]) {
    const candidate = backtickMatch[1].trim();
    if (isLiteralDefault(candidate)) return candidate;
  }
  const quoteMatch = doc.match(/\b[Dd]efault(?:s\s+to)?\s+['"]([^'"]+)['"]/);
  if (quoteMatch?.[1]) return `'${quoteMatch[1].trim()}'`;
  return undefined;
}

function extractDefaultsFromParameter(paramDecl: ts.ParameterDeclaration): Map<string, string> {
  const defaults = new Map<string, string>();
  if (!ts.isObjectBindingPattern(paramDecl.name)) return defaults;
  for (const element of paramDecl.name.elements) {
    if (!element.initializer) continue;
    const propName = element.propertyName
      ? ts.isIdentifier(element.propertyName) || ts.isStringLiteral(element.propertyName)
        ? element.propertyName.text
        : element.propertyName.getText()
      : ts.isIdentifier(element.name)
        ? element.name.text
        : undefined;
    if (!propName) continue;
    const initText = normalizeWhitespace(element.initializer.getText());
    if (initText && initText.length <= 48 && !initText.includes('\n')) {
      defaults.set(propName, initText);
    }
  }
  return defaults;
}

function getFunctionDeclarationForSymbol(symbol: ts.Symbol): ts.SignatureDeclaration | undefined {
  const decls = symbol.getDeclarations() ?? [];
  for (const decl of decls) {
    if (ts.isFunctionDeclaration(decl) || ts.isFunctionExpression(decl) || ts.isArrowFunction(decl)) {
      return decl;
    }
    if (ts.isVariableDeclaration(decl) && decl.initializer) {
      if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) {
        return decl.initializer;
      }
      if (ts.isCallExpression(decl.initializer)) {
        const firstArg = decl.initializer.arguments[0];
        if (firstArg && (ts.isArrowFunction(firstArg) || ts.isFunctionExpression(firstArg))) {
          return firstArg;
        }
      }
    }
  }
  return undefined;
}

function isFromWideDomLibrary(propSymbol: ts.Symbol): boolean {
  const decls = propSymbol.getDeclarations() ?? [];
  if (decls.length === 0) return false;
  return decls.every((d) => {
    const file = d.getSourceFile().fileName;
    return file.includes('/node_modules/@types/react/') || file.includes('/typescript/lib/lib.dom');
  });
}

function isFromNdsSource(propSymbol: ts.Symbol): boolean {
  const decls = propSymbol.getDeclarations() ?? [];
  return decls.some((d) => d.getSourceFile().fileName.includes('/packages/'));
}

function isJsxReturnType(returnType: ts.Type, checker: ts.TypeChecker): boolean {
  const text = checker.typeToString(returnType);
  return (
    text.includes('Element') ||
    text.includes('ReactNode') ||
    text.includes('ReactPortal') ||
    text === 'JSX.Element'
  );
}

function collectPropertiesFromType(
  propsType: ts.Type,
  checker: ts.TypeChecker,
  location: ts.Node,
  destructuringDefaults: Map<string, string>,
): GeneratedPropRow[] {
  // Expand unions (e.g. ChoiceCardProps, StatusBadgeProps, CardProps) so branch-specific props stay visible.
  const branches = propsType.isUnion()
    ? propsType.types.filter((t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)))
    : [propsType];

  interface MergedProp {
    name: string;
    types: Set<string>;
    requiredCount: number;
    branchCount: number;
    defaultVal?: string;
    description: string;
    fromNds: boolean;
    fromWideDom: boolean;
    order: number;
  }

  const merged = new Map<string, MergedProp>();
  let orderCounter = 0;

  for (const branch of branches) {
    const props = branch.getProperties();
    for (const propSym of props) {
      const name = propSym.getName();
      if (name.startsWith('__')) continue;
      const propType = checker.getTypeOfSymbolAtLocation(propSym, location);
      const formattedType = cleanTypeString(
        checker.typeToString(
          propType,
          location,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
        ),
      );
      const isOptional = Boolean(propSym.flags & ts.SymbolFlags.Optional);
      const docText = normalizeWhitespace(ts.displayPartsToString(propSym.getDocumentationComment(checker)));
      const jsDocTags = propSym.getJsDocTags(checker);
      const defaultVal =
        destructuringDefaults.get(name) ?? extractDefaultFromDoc(docText, jsDocTags);
      const fromNds = isFromNdsSource(propSym);
      const fromWideDom = isFromWideDomLibrary(propSym);

      const existing = merged.get(name);
      if (existing) {
        existing.types.add(formattedType);
        existing.branchCount += 1;
        if (!isOptional) existing.requiredCount += 1;
        if (!existing.defaultVal && defaultVal) existing.defaultVal = defaultVal;
        if (!existing.description && docText) existing.description = docText;
        existing.fromNds = existing.fromNds || fromNds;
        existing.fromWideDom = existing.fromWideDom && fromWideDom;
      } else {
        merged.set(name, {
          name,
          types: new Set([formattedType]),
          requiredCount: isOptional ? 0 : 1,
          branchCount: 1,
          ...(defaultVal !== undefined ? { defaultVal } : {}),
          description: docText,
          fromNds,
          fromWideDom,
          order: orderCounter++,
        });
      }
    }
  }

  const allEntries = [...merged.values()];
  const hasWideDomDump = allEntries.length > 45;

  const filtered = allEntries.filter((entry) => {
    if (entry.name === 'key') return false;
    if (entry.name.startsWith('data-')) return entry.fromNds;
    if (hasWideDomDump && entry.fromWideDom && !entry.fromNds) {
      return KEPT_WIDE_DOM_PROPS.has(entry.name);
    }
    return true;
  });

  // Keep source order, with `className` and `ref` neatly at the end.
  filtered.sort((a, b) => {
    const rank = (n: string) => (n === 'className' ? 2 : n === 'ref' ? 3 : 0);
    const diff = rank(a.name) - rank(b.name);
    return diff !== 0 ? diff : a.order - b.order;
  });

  return filtered.map((entry) => {
    const combinedType = mergeTypeStrings(entry.types);
    const required = entry.requiredCount === branches.length && entry.branchCount === branches.length;
    const description =
      entry.description || STANDARD_PROP_DESCRIPTIONS[entry.name] || '—';
    return {
      name: entry.name,
      type: combinedType,
      required,
      ...(entry.defaultVal !== undefined ? { default: entry.defaultVal } : {}),
      description,
    };
  });
}

function extractComponentOrFunction(
  exportSym: ts.Symbol,
  packageName: string,
  checker: ts.TypeChecker,
  fallbackNode: ts.Node,
): GeneratedComponentApi | undefined {
  const name = exportSym.getName();
  const targetSym =
    exportSym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exportSym) : exportSym;

  const location = targetSym.valueDeclaration ?? targetSym.declarations?.[0] ?? fallbackNode;
  const symbolType = checker.getTypeOfSymbolAtLocation(targetSym, location);

  // Skip pure type aliases, constants, or non-callable objects (e.g. message dictionaries).
  const callSigs = symbolType.getCallSignatures();
  if (callSigs.length === 0) return undefined;

  const sig = callSigs[0]!;
  const returnType = sig.getReturnType();
  const isPascal = /^[A-Z]/.test(name);
  const looksLikeComponent = isPascal && isJsxReturnType(returnType, checker);

  const symDoc = normalizeWhitespace(
    ts.displayPartsToString(targetSym.getDocumentationComment(checker)),
  );

  if (looksLikeComponent) {
    const fnDecl = getFunctionDeclarationForSymbol(targetSym);
    const firstParam = sig.getParameters()[0];
    if (!firstParam) {
      return {
        name,
        packageName,
        kind: 'component',
        ...(symDoc ? { description: symDoc } : {}),
        props: [],
      };
    }

    const firstParamDecl = fnDecl?.parameters[0];
    const destructuringDefaults = firstParamDecl
      ? extractDefaultsFromParameter(firstParamDecl)
      : new Map<string, string>();

    const propsType = checker.getTypeOfSymbolAtLocation(firstParam, location);
    const props = collectPropertiesFromType(propsType, checker, location, destructuringDefaults);
    return {
      name,
      packageName,
      kind: 'component',
      ...(symDoc ? { description: symDoc } : {}),
      props,
    };
  }

  // Exported helper function or hook (e.g. `computeLineDiff`, `createToastQueue`, `useToast`).
  const params = sig.getParameters();
  const rows: GeneratedPropRow[] = params.map((param) => {
    const paramType = checker.getTypeOfSymbolAtLocation(param, location);
    const pDecl = param.valueDeclaration;
    const optional =
      Boolean(param.flags & ts.SymbolFlags.Optional) ||
      (pDecl !== undefined && ts.isParameter(pDecl) && Boolean(pDecl.questionToken || pDecl.initializer));
    const initDefault =
      pDecl !== undefined && ts.isParameter(pDecl) && pDecl.initializer
        ? normalizeWhitespace(pDecl.initializer.getText())
        : undefined;
    const pDoc = normalizeWhitespace(ts.displayPartsToString(param.getDocumentationComment(checker)));
    return {
      name: param.getName(),
      type: cleanTypeString(
        checker.typeToString(
          paramType,
          location,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
        ),
      ),
      required: !optional,
      ...(initDefault ? { default: initDefault } : {}),
      description: pDoc || 'پارامتر ورودی تابع.',
    };
  });

  const retStr = cleanTypeString(
    checker.typeToString(
      returnType,
      location,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    ),
  );
  rows.push({
    name: 'returns',
    type: retStr,
    required: false,
    description: 'مقدار بازگشتی تابع.',
  });

  return {
    name,
    packageName,
    kind: 'function',
    ...(symDoc ? { description: symDoc } : {}),
    props: rows,
  };
}

/**
 * Runs the TypeScript 6.0 Compiler API over all 5 NDS component packages and returns
 * a deterministic props manifest sorted by export name (D-93).
 */
export function extractAllPackageProps(repoRoot?: string): GeneratedPropsManifest {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const root = repoRoot ?? path.resolve(scriptDir, '../../..');
  const docsTsConfigPath = path.join(root, 'apps/docs/tsconfig.json');

  const configFile = ts.readConfigFile(docsTsConfigPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(
      `Failed to read ${docsTsConfigPath}: ${ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n')}`,
    );
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(docsTsConfigPath),
  );

  const entryPaths = PACKAGES.map((p) => path.join(root, p.entry));
  const program = ts.createProgram({
    rootNames: entryPaths,
    options: {
      ...parsed.options,
      noEmit: true,
      skipLibCheck: true,
    },
  });

  const checker = program.getTypeChecker();
  const components: Record<string, GeneratedComponentApi> = {};

  for (const pkg of PACKAGES) {
    const absEntry = path.join(root, pkg.entry);
    const sourceFile = program.getSourceFile(absEntry);
    if (!sourceFile) {
      throw new Error(`Could not load entry point for ${pkg.name}: ${absEntry}`);
    }
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) {
      throw new Error(`Could not resolve module symbol for ${pkg.name}: ${absEntry}`);
    }
    const exports = checker.getExportsOfModule(moduleSymbol);
    for (const exportSym of exports) {
      const api = extractComponentOrFunction(exportSym, pkg.name, checker, sourceFile);
      if (api) {
        components[api.name] = api;
      }
    }
  }

  // Deterministic alphabetical key order for zero-noise diffs.
  const sortedComponents: Record<string, GeneratedComponentApi> = {};
  for (const key of Object.keys(components).sort((a, b) => a.localeCompare(b))) {
    sortedComponents[key] = components[key]!;
  }

  return {
    generator: 'typescript-compiler-api',
    tsVersion: ts.version,
    packages: PACKAGES.map((p) => p.name),
    components: sortedComponents,
  };
}
