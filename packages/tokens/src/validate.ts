/**
 * DTCG 2025.10 validation for the NDS token sources.
 *
 * Checks the structure and value shape of every token, that aliases resolve to a token
 * of the same type, that colour `hex` fallbacks agree with their sRGB components, and
 * that light and dark semantic files define the same names (D-82: every semantic token
 * has two values).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { componentsToHex } from './values.ts';

export const TOKEN_TYPES = new Set([
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'shadow',
  'strokeStyle',
  'border',
  'transition',
  'gradient',
  'typography',
]);

const GROUP_PROPS = new Set([
  '$type',
  '$description',
  '$extensions',
  '$deprecated',
  '$schema',
  '$extends',
]);
const TOKEN_PROPS = new Set(['$value', '$type', '$description', '$extensions', '$deprecated']);
const COLOR_SPACES = new Set([
  'srgb',
  'srgb-linear',
  'hsl',
  'hwb',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'display-p3',
  'a98-rgb',
  'prophoto-rgb',
  'rec2020',
  'xyz-d65',
  'xyz-d50',
]);
const FONT_WEIGHT_KEYWORDS = new Set([
  'thin',
  'hairline',
  'extra-light',
  'ultra-light',
  'light',
  'normal',
  'regular',
  'book',
  'medium',
  'semi-bold',
  'demi-bold',
  'bold',
  'extra-bold',
  'ultra-bold',
  'black',
  'heavy',
  'extra-black',
  'ultra-black',
]);

export interface SourceToken {
  path: string;
  file: string;
  type: string | undefined;
  value: unknown;
}

export interface SourceFile {
  file: string;
  json: unknown;
}

const ALIAS = /^\{([^{}]+)\}$/;
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function readSources(dir: string): SourceFile[] {
  const files: string[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.tokens.json')) files.push(p);
    }
  };
  walk(dir);
  return files.map((file) => ({
    file: relative(dir, file),
    json: JSON.parse(readFileSync(file, 'utf8')) as unknown,
  }));
}

function collect(src: SourceFile, errors: string[]): SourceToken[] {
  const out: SourceToken[] = [];
  const visit = (node: unknown, path: string[], inherited: string | undefined) => {
    const where = `${src.file}: ${path.join('.') || '(root)'}`;
    if (!isObj(node)) {
      errors.push(`${where}: expected a group or token object`);
      return;
    }
    const type = typeof node.$type === 'string' ? node.$type : inherited;
    if (
      node.$type !== undefined &&
      (typeof node.$type !== 'string' || !TOKEN_TYPES.has(node.$type))
    ) {
      errors.push(`${where}: unknown $type ${JSON.stringify(node.$type)}`);
    }
    if ('$value' in node) {
      for (const k of Object.keys(node)) {
        if (!TOKEN_PROPS.has(k)) errors.push(`${where}: unexpected property "${k}" on a token`);
      }
      if (node.$description !== undefined && typeof node.$description !== 'string') {
        errors.push(`${where}: $description must be a string`);
      }
      out.push({ path: path.join('.'), file: src.file, type, value: node.$value });
      return;
    }
    for (const [k, child] of Object.entries(node)) {
      if (k.startsWith('$')) {
        if (!GROUP_PROPS.has(k)) errors.push(`${where}: unexpected property "${k}" on a group`);
        continue;
      }
      if (/[{}.]/.test(k)) errors.push(`${where}: name "${k}" must not contain {, } or .`);
      visit(child, [...path, k], type);
    }
  };
  visit(src.json, [], undefined);
  return out;
}

function checkColor(v: unknown, where: string, errors: string[]) {
  if (!isObj(v)) return errors.push(`${where}: colour must be an object {colorSpace, components}`);
  if (typeof v.colorSpace !== 'string' || !COLOR_SPACES.has(v.colorSpace)) {
    errors.push(`${where}: unknown colorSpace ${JSON.stringify(v.colorSpace)}`);
  }
  const comps = v.components;
  if (
    !Array.isArray(comps) ||
    comps.length !== 3 ||
    !comps.every((c) => isNum(c) || c === 'none')
  ) {
    return errors.push(`${where}: components must be 3 numbers (or "none")`);
  }
  if (
    v.alpha !== undefined &&
    !(v.alpha === 'none' || (isNum(v.alpha) && v.alpha >= 0 && v.alpha <= 1))
  ) {
    errors.push(`${where}: alpha must be between 0 and 1`);
  }
  if (v.hex !== undefined) {
    if (typeof v.hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(v.hex)) {
      return errors.push(`${where}: hex must be #RRGGBB`);
    }
    if (v.colorSpace === 'srgb') {
      const hex = v.hex;
      const computed = componentsToHex(comps as number[]);
      const diff = [1, 3, 5].some(
        (i) =>
          Math.abs(
            Number.parseInt(computed.slice(i, i + 2), 16) -
              Number.parseInt(hex.slice(i, i + 2), 16),
          ) > 1,
      );
      if (diff) errors.push(`${where}: hex ${v.hex} does not match components (${computed})`);
    }
  }
}

function checkDimension(v: unknown, where: string, errors: string[], units = ['px', 'rem']) {
  if (!isObj(v) || !isNum(v.value) || typeof v.unit !== 'string' || !units.includes(v.unit)) {
    errors.push(`${where}: expected {value: number, unit: ${units.join('|')}}`);
  }
}

function checkValue(type: string | undefined, v: unknown, where: string, errors: string[]) {
  switch (type) {
    case undefined:
      errors.push(`${where}: token has no $type (own or inherited)`);
      return;
    case 'color':
      return void checkColor(v, where, errors);
    case 'dimension':
      return checkDimension(v, where, errors);
    case 'duration':
      return checkDimension(v, where, errors, ['ms', 's']);
    case 'number':
      if (!isNum(v)) errors.push(`${where}: expected a number`);
      return;
    case 'fontWeight':
      if (
        !(
          (isNum(v) && v >= 1 && v <= 1000) ||
          (typeof v === 'string' && FONT_WEIGHT_KEYWORDS.has(v))
        )
      ) {
        errors.push(`${where}: fontWeight must be 1–1000 or a keyword`);
      }
      return;
    case 'fontFamily':
      if (
        !(typeof v === 'string' && v.length > 0) &&
        !(Array.isArray(v) && v.length > 0 && v.every((f) => typeof f === 'string' && f.length > 0))
      ) {
        errors.push(`${where}: fontFamily must be a string or a non-empty string array`);
      }
      return;
    case 'cubicBezier':
      if (
        !Array.isArray(v) ||
        v.length !== 4 ||
        !v.every(isNum) ||
        (v[0] as number) < 0 ||
        (v[0] as number) > 1 ||
        (v[2] as number) < 0 ||
        (v[2] as number) > 1
      ) {
        errors.push(`${where}: cubicBezier must be [x1, y1, x2, y2] with x in 0–1`);
      }
      return;
    case 'shadow': {
      const list = Array.isArray(v) ? v : [v];
      for (const s of list) {
        if (!isObj(s)) {
          errors.push(`${where}: shadow must be an object`);
          continue;
        }
        if (typeof s.color === 'string' && ALIAS.test(s.color)) {
          // alias checked with the others
        } else checkColor(s.color, `${where}.color`, errors);
        for (const k of ['offsetX', 'offsetY', 'blur', 'spread']) {
          const d = s[k];
          if (!(typeof d === 'string' && ALIAS.test(d))) checkDimension(d, `${where}.${k}`, errors);
        }
      }
      return;
    }
    default:
      // Composite types not used yet; accept objects.
      if (!isObj(v) && !Array.isArray(v)) errors.push(`${where}: unexpected value for ${type}`);
  }
}

/** Validates all source files; returns a list of human-readable errors (empty = valid). */
export function validateSources(sources: readonly SourceFile[]): string[] {
  const errors: string[] = [];
  const tokens = sources.flatMap((s) => collect(s, errors));

  // Same path may appear in light and dark semantic files only.
  const byPath = new Map<string, SourceToken[]>();
  for (const t of tokens) byPath.set(t.path, [...(byPath.get(t.path) ?? []), t]);
  for (const [path, list] of byPath) {
    const files = list.map((t) => t.file);
    const modePair =
      list.length === 2 && files.every((f) => /semantic\/color\.(light|dark)\./.test(f));
    if (list.length > 1 && !modePair)
      errors.push(`${path}: defined more than once (${files.join(', ')})`);
    if (modePair && list[0]?.type !== list[1]?.type)
      errors.push(`${path}: $type differs between light and dark`);
  }

  // Light and dark define the same semantic names.
  const semantic = (mode: string) =>
    new Set(tokens.filter((t) => t.file.includes(`semantic/color.${mode}.`)).map((t) => t.path));
  const light = semantic('light');
  const dark = semantic('dark');
  for (const p of light) if (!dark.has(p)) errors.push(`${p}: missing in dark mode`);
  for (const p of dark) if (!light.has(p)) errors.push(`${p}: missing in light mode`);

  for (const t of tokens) {
    const where = `${t.file}: ${t.path}`;
    if (typeof t.value === 'string' && ALIAS.test(t.value)) {
      const ref = ALIAS.exec(t.value)?.[1] ?? '';
      const target = byPath.get(ref)?.[0];
      if (!target) errors.push(`${where}: alias {${ref}} does not resolve`);
      else if (target.type !== t.type) {
        errors.push(`${where}: alias {${ref}} is ${target.type}, expected ${t.type}`);
      }
      continue;
    }
    checkValue(t.type, t.value, where, errors);
  }
  return errors;
}
