import { describe, expect, it } from 'vitest';
import { allIcons } from './all.ts';
import { iconChevronEnd, iconCopy, iconHelp } from './index.ts';

describe('icons', () => {
  it('ships at least 60 uniquely named icons', () => {
    expect(allIcons.length).toBeGreaterThanOrEqual(60);
    expect(new Set(allIcons.map((i) => i.name)).size).toBe(allIcons.length);
  });

  it('contains only SVG shape elements (no wrappers, scripts, styles or fills)', () => {
    for (const icon of allIcons) {
      expect(icon.body, icon.name).toMatch(
        /^(<(path|circle|rect|line|polyline|polygon|ellipse)\b[^<>]*\/>)+$/,
      );
      expect(icon.body, icon.name).not.toMatch(
        /fill="(?!currentColor")|stroke=|style=|on\w+=|<script|<svg/,
      );
    }
  });

  it('marks directional icons as mirrored', () => {
    expect(iconChevronEnd.mirrored).toBe(true);
    expect(iconCopy.mirrored).toBe(false);
    const mirrored = allIcons.filter((i) => i.mirrored).map((i) => i.name);
    expect(mirrored).toEqual(
      expect.arrayContaining([
        'arrowEnd',
        'arrowStart',
        'chevronEnd',
        'chevronStart',
        'send',
        'undo',
        'redo',
      ]),
    );
    expect(mirrored).not.toContain('clock');
    expect(mirrored).not.toContain('check');
  });

  it('keeps the NDS glyphs from the reference page', () => {
    expect(iconHelp.body).toContain('M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3');
  });
});
