/**
 * DTCG 2025.10 value → CSS value. Pure functions; used by the Style Dictionary
 * transforms in sd.config.ts and by tests.
 */

export interface DtcgColor {
  colorSpace: string;
  components: (number | 'none')[];
  alpha?: number | 'none';
  hex?: string;
}

export interface DtcgDimension {
  value: number;
  unit: 'px' | 'rem';
}

export interface DtcgDuration {
  value: number;
  unit: 'ms' | 's';
}

export interface DtcgShadow {
  color: DtcgColor | string;
  offsetX: DtcgDimension | string;
  offsetY: DtcgDimension | string;
  blur: DtcgDimension | string;
  spread: DtcgDimension | string;
  inset?: boolean;
}

/** Root font size used to express font sizes in rem (base 16 px, docs/foundations/typography.md). */
export const ROOT_FONT_SIZE = 16;

const trim = (n: number) => Number.parseFloat(n.toFixed(4)).toString();

export function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m?.[1]) throw new Error(`Invalid hex colour "${hex}"`);
  const n = Number.parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** sRGB components (0–1) → `#RRGGBB`. */
export function componentsToHex(components: readonly (number | 'none')[]): string {
  return `#${components
    .slice(0, 3)
    .map((c) => {
      const v = c === 'none' ? 0 : Math.round(Math.min(1, Math.max(0, c)) * 255);
      return v.toString(16).padStart(2, '0');
    })
    .join('')
    .toUpperCase()}`;
}

export function colorToCss(value: DtcgColor | string): string {
  if (typeof value === 'string') return value;
  if (value.colorSpace !== 'srgb') {
    throw new Error(`Only srgb colours are supported so far (got ${value.colorSpace}).`);
  }
  const hex = (value.hex ?? componentsToHex(value.components)).toUpperCase();
  const alpha = value.alpha === undefined || value.alpha === 'none' ? 1 : value.alpha;
  if (alpha >= 1) return hex;
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r} ${g} ${b} / ${trim(alpha)})`;
}

export function dimensionToCss(
  value: DtcgDimension | string,
  opts: { rem?: boolean } = {},
): string {
  if (typeof value === 'string') return value;
  if (value.value === 0) return '0';
  if (opts.rem && value.unit === 'px') return `${trim(value.value / ROOT_FONT_SIZE)}rem`;
  return `${trim(value.value)}${value.unit}`;
}

export function durationToCss(value: DtcgDuration | string): string {
  if (typeof value === 'string') return value;
  return `${trim(value.value)}${value.unit}`;
}

export function cubicBezierToCss(value: readonly number[] | string): string {
  if (typeof value === 'string') return value;
  return `cubic-bezier(${value.map(trim).join(', ')})`;
}

export function fontFamilyToCss(value: readonly string[] | string): string {
  const list = typeof value === 'string' ? [value] : value;
  return list
    .map((f) => (/^[a-z-]+$/i.test(f) && !/\s/.test(f) ? f : `"${f.replaceAll('"', '\\"')}"`))
    .join(', ');
}

export function shadowToCss(value: DtcgShadow | DtcgShadow[] | string): string {
  if (typeof value === 'string') return value;
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((s) =>
      [
        s.inset ? 'inset' : '',
        dimensionToCss(s.offsetX),
        dimensionToCss(s.offsetY),
        dimensionToCss(s.blur),
        dimensionToCss(s.spread),
        colorToCss(s.color),
      ]
        .filter(Boolean)
        .join(' '),
    )
    .join(', ');
}
