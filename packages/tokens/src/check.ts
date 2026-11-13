/**
 * `pnpm tokens:check`: DTCG validation of tokens/**\/*.tokens.json, then the WCAG
 * contrast report for the company theme. Exits non-zero on any error or failing pair.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TOKENS_DIR } from '../sd.config.ts';
import { collectTokens, semanticColors } from './build.ts';
import { checkContrast, contrastMarkdown } from './contrast.ts';
import { readSources, validateSources } from './validate.ts';

const errors = validateSources(readSources(TOKENS_DIR));
if (errors.length > 0) {
  console.error(`DTCG validation failed (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('DTCG validation: ok');

const results = checkContrast(semanticColors(await collectTokens('company')));
writeFileSync(
  fileURLToPath(new URL('../dist/contrast.md', import.meta.url)),
  contrastMarkdown(results, 'company'),
);
const failed = results.filter((r) => !r.pass);
for (const r of failed) {
  console.error(
    `FAIL ${r.mode}: ${r.fg} (${r.fgHex}) on ${r.bg} (${r.bgHex}) = ${r.ratio.toFixed(2)}:1, needs ${r.min}:1 (${r.use})`,
  );
}
if (failed.length > 0) process.exit(1);
console.log(`Contrast: ${results.length} pairs pass (light + dark). Report: dist/contrast.md`);
