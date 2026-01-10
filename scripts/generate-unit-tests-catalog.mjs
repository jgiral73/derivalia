import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const srcRoot = path.join(repoRoot, 'apps', 'api', 'src');
const docsPath = path.join(repoRoot, 'docs', 'testing', 'unit-tests-catalog.md');

const specFiles = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      specFiles.push(full);
    }
  }
}

walk(srcRoot);

const groups = new Map();

for (const file of specFiles) {
  const relToSrc = path.relative(srcRoot, file).replace(/\\/g, '/');
  const dir = path.dirname(relToSrc);
  const fileName = path.basename(relToSrc);
  const content = fs.readFileSync(file, 'utf8');
  const cases = Array.from(
    content.matchAll(/\bit(?:\.only)?\s*\(\s*(['"`])([^'"`]+)\1/g),
  ).map((match) => match[2]);

  const entries = groups.get(dir) ?? [];
  entries.push({ fileName, cases });
  groups.set(dir, entries);
}

const lines = [];
lines.push('# Cataleg de tests unitaris (API)');
lines.push('');
lines.push('## Resum');
lines.push('');
lines.push("Aquest document recull tots els tests unitaris creats a l'API. Els tests viuen sota");
lines.push('`apps/api/src` i segueixen el patro `*.spec.ts`.');
lines.push('');

const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));

for (const [group, entries] of sortedGroups) {
  const folderPath = `apps/api/src/${group}`;
  lines.push(`## ${group}`);
  lines.push('');
  lines.push(`- Carpeta: \`${folderPath}\``);

  const sorted = entries
    .slice()
    .sort((a, b) => a.fileName.localeCompare(b.fileName));

  for (const entry of sorted) {
    lines.push(`- \`${entry.fileName}\``);
    if (entry.cases.length > 0) {
      lines.push('  - Casos:');
      for (const testCase of entry.cases) {
        lines.push(`    - ${testCase}`);
      }
    }
  }
  lines.push('');
}

lines.push('## Execucio');
lines.push('');
lines.push('```bash');
lines.push('cd apps/api');
lines.push('npm test');
lines.push('```');
lines.push('');
lines.push('## Automatitzacio');
lines.push('');
lines.push('Aquest cataleg es genera automaticament amb:');
lines.push('');
lines.push('```bash');
lines.push('cd apps/api');
lines.push('npm run test:catalog');
lines.push('```');
lines.push('');
lines.push('Es recomana executar-lo en CI i fallar si hi ha canvis pendents.');

fs.writeFileSync(docsPath, lines.join('\n'));
console.log(`Wrote ${docsPath}`);
