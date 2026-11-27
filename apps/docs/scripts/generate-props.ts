import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractAllPackageProps } from './extract-props.ts';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(scriptDir, '../src/docs/generated/props.json');

const manifest = extractAllPackageProps();
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
const previous = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : null;

if (previous !== serialized) {
  fs.writeFileSync(outFile, serialized, 'utf8');
  console.log(
    `@negaresh/docs: generated props.json (${Object.keys(manifest.components).length} symbols across ${manifest.packages.length} packages, TS ${manifest.tsVersion})`,
  );
} else {
  console.log(
    `@negaresh/docs: props.json up to date (${Object.keys(manifest.components).length} symbols, TS ${manifest.tsVersion})`,
  );
}
