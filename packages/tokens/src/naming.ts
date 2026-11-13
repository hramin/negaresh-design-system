/**
 * Maps a DTCG token path to its CSS custom property name (without the leading `--`).
 * Naming rule (docs/03-architecture.md): `--nds-{group}-{role}[-{state}]`.
 * Short group names follow the approved reference page (reference/registry-activation).
 *
 * Returns `null` for tokens that are never emitted as CSS variables
 * (primitive colour ramps: components must use semantic roles).
 */
export function cssName(path: readonly string[]): string | null {
  const [head, second, ...rest] = path;
  const tail = (parts: readonly (string | undefined)[]) =>
    ['nds', ...parts.filter((p): p is string => p !== undefined)].join('-');

  switch (head) {
    case 'color': {
      // Semantic colour roles live at color.{bg|fg|border|accent|focus|success|…}.{role}
      if (second === undefined) return null;
      if (PRIMITIVE_COLOR_FAMILIES.has(second)) return null;
      if (second === 'ravanma') return tail(['ravanma', ...rest]);
      return tail([second, ...rest]);
    }
    case 'font': {
      if (second === 'family') return tail(['font', ...rest]);
      if (second === 'size') return tail(['text', ...rest]);
      if (second === 'lineHeight') return tail(['leading', ...rest]);
      if (second === 'weight') return tail(['weight', ...rest]);
      return null;
    }
    case 'size': {
      // size.control.md → --nds-control-md, size.touch → --nds-touch
      return tail([second, ...rest]);
    }
    case 'duration':
      return tail(['dur', second, ...rest]);
    case 'easing':
      return second === 'standard' ? 'nds-ease' : tail(['ease', second, ...rest]);
    case 'border':
      // Border widths; colour borders are color.border.*
      return tail(['border-width', second, ...rest]);
    case 'component':
      // component.button.radius → --nds-button-radius
      return tail([second, ...rest]);
    case 'space':
    case 'radius':
    case 'shadow':
    case 'breakpoint':
    case 'z':
      return tail([head, second, ...rest]);
    default:
      return null;
  }
}

export const PRIMITIVE_COLOR_FAMILIES: ReadonlySet<string> = new Set([
  'sand',
  'ink',
  'teal',
  'mauve',
  'ochre',
  'sage',
  'clay',
  'slate',
  'rose',
]);

/** Token tier, derived from where the token lives. */
export type Tier = 'primitive' | 'semantic' | 'component' | 'theme';

export function tierOf(path: readonly string[], filePath: string): Tier {
  if (path[0] === 'component') return 'component';
  if (filePath.includes('/themes/')) return 'theme';
  if (filePath.includes('/semantic/')) return 'semantic';
  return 'primitive';
}
