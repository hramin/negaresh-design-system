import { describe, expect, it } from 'vitest';
import { TOKENS_DIR } from '../sd.config.ts';
import { readSources, type SourceFile, validateSources } from './validate.ts';

const color = (hex: string, components: number[]) => ({ colorSpace: 'srgb', components, hex });
const file = (name: string, json: unknown): SourceFile => ({ file: name, json });

describe('DTCG validation', () => {
  it('accepts the repository sources', () => {
    expect(validateSources(readSources(TOKENS_DIR))).toEqual([]);
  });

  it('rejects malformed tokens', () => {
    const errors = validateSources([
      file('primitive/a.tokens.json', {
        color: {
          $type: 'color',
          ok: { $value: color('#FFFFFF', [1, 1, 1]) },
          wrongHex: { $value: color('#000000', [1, 1, 1]) },
          badSpace: { $value: { colorSpace: 'cmyk', components: [0, 0, 0] } },
          badComponents: { $value: { colorSpace: 'srgb', components: [0, 0] } },
          badAlpha: { $value: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 2 } },
          badHex: { $value: { colorSpace: 'srgb', components: [0, 0, 0], hex: 'black' } },
          notObject: { $value: '#fff' },
          'bad.name': { $value: color('#FFFFFF', [1, 1, 1]) },
        },
        space: { $type: 'dimension', bad: { $value: { value: 4, unit: 'em' } } },
        dur: { $type: 'duration', bad: { $value: { value: 1, unit: 'px' } } },
        n: { $type: 'number', bad: { $value: 'x' } },
        w: { $type: 'fontWeight', bad: { $value: 1200 }, ok: { $value: 'bold' } },
        f: { $type: 'fontFamily', bad: { $value: [] }, ok: { $value: 'Vazirmatn' } },
        e: { $type: 'cubicBezier', bad: { $value: [2, 0, 0, 1] } },
        s: {
          $type: 'shadow',
          bad: { $value: 'x' },
          badParts: {
            $value: { color: '{color.ok}', offsetX: 1, offsetY: '{space.bad}', blur: 0, spread: 0 },
          },
        },
        untyped: { $value: 1 },
        weird: { $type: 'colour', t: { $value: 1 } },
        extra: { $type: 'number', t: { $value: 1, foo: 1, $description: 3 } },
        group: { $foo: 1, leaf: 'nope' },
        alias: {
          $type: 'number',
          missing: { $value: '{nope.nope}' },
          wrongType: { $value: '{color.ok}' },
        },
        comp: { $type: 'border', bad: { $value: 3 } },
      }),
    ]);
    const has = (re: RegExp) =>
      expect(
        errors.some((e) => re.test(e)),
        re.source,
      ).toBe(true);
    has(/wrongHex: hex #000000 does not match/);
    has(/badSpace: unknown colorSpace/);
    has(/badComponents: components must be 3/);
    has(/badAlpha: alpha must be/);
    has(/badHex: hex must be/);
    has(/notObject: colour must be an object/);
    has(/must not contain/);
    has(/space\.bad: expected \{value/);
    has(/dur\.bad: expected/);
    has(/n\.bad: expected a number/);
    has(/w\.bad: fontWeight/);
    has(/f\.bad: fontFamily/);
    has(/e\.bad: cubicBezier/);
    has(/s\.bad: shadow must be an object/);
    has(/s\.badParts\.offsetX: expected/);
    has(/untyped: token has no \$type/);
    has(/unknown \$type "colour"/);
    has(/unexpected property "foo" on a token/);
    has(/\$description must be a string/);
    has(/unexpected property "\$foo" on a group/);
    has(/group\.leaf: expected a group or token object/);
    has(/alias \{nope\.nope\} does not resolve/);
    has(/alias \{color\.ok\} is color, expected number/);
    has(/comp\.bad: unexpected value for border/);
    expect(errors.some((e) => /color\.ok|w\.ok|f\.ok/.test(e) && !/alias/.test(e))).toBe(false);
  });

  it('requires light and dark to match and forbids duplicates', () => {
    const errors = validateSources([
      file('semantic/color.light.tokens.json', {
        color: {
          $type: 'color',
          a: { $value: color('#FFFFFF', [1, 1, 1]) },
          b: { $value: color('#FFFFFF', [1, 1, 1]) },
        },
      }),
      file('semantic/color.dark.tokens.json', {
        color: {
          a: { $type: 'number', $value: 1 },
          c: { $type: 'color', $value: color('#FFFFFF', [1, 1, 1]) },
        },
      }),
      file('primitive/x.tokens.json', {
        color: { $type: 'color', c: { $value: color('#FFFFFF', [1, 1, 1]) } },
      }),
    ]);
    expect(errors).toEqual(
      expect.arrayContaining([
        'color.a: $type differs between light and dark',
        'color.b: missing in dark mode',
        'color.c: missing in light mode',
        expect.stringMatching(/^color\.c: defined more than once/),
      ]),
    );
  });

  it('rejects a non-object root', () => {
    expect(validateSources([file('x.tokens.json', [])])).toEqual([
      'x.tokens.json: (root): expected a group or token object',
    ]);
  });
});
