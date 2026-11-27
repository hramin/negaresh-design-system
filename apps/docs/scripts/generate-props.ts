import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractDocsCatalog } from './extract-catalog.ts';
import { extractAllPackageProps } from './extract-props.ts';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function writeIfChanged(outFile: string, content: string, label: string) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const previous = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : null;
  if (previous !== content) {
    fs.writeFileSync(outFile, content, 'utf8');
    console.log(`@negaresh/docs: generated ${label}`);
  } else {
    console.log(`@negaresh/docs: ${label} up to date`);
  }
}

const propsManifest = extractAllPackageProps();
writeIfChanged(
  path.resolve(scriptDir, '../src/docs/generated/props.json'),
  `${JSON.stringify(propsManifest, null, 2)}\n`,
  `props.json (${Object.keys(propsManifest.components).length} symbols across ${propsManifest.packages.length} packages, TS ${propsManifest.tsVersion})`,
);

const catalog = extractDocsCatalog();
const catalogCount =
  catalog.components.length +
  catalog.charts.length +
  catalog.assessment.length +
  catalog.patterns.length;
writeIfChanged(
  path.resolve(scriptDir, '../src/docs/generated/catalog.json'),
  `${JSON.stringify(catalog, null, 2)}\n`,
  `catalog.json (${catalogCount} docs pages)`,
);
