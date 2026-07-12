import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, 'src');
const LOCALES = ['en', 'fr', 'tr', 'ar-DZ'] as const;
const USER_FACING_ATTRIBUTES = new Set(['aria-label', 'aria-description', 'alt', 'placeholder', 'title']);

type Finding = { file: string; line: number; kind: 'jsx-text' | 'attribute'; value: string };

async function filesIn(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(target);
    return /\.(?:ts|tsx)$/u.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}

function lineFor(sourceFile: ts.SourceFile, position: number) {
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

function shouldInspect(file: string) {
  const normalized = file.replace(/\\/gu, '/');
  return !normalized.includes('/locales/')
    && !normalized.includes('/i18n/messages.ts')
    && !normalized.endsWith('.bak.tsx')
    && !normalized.endsWith('.generated.ts');
}

function collectFindings(file: string, content: string) {
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const findings: Finding[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isJsxText(node)) {
      const value = node.getText(sourceFile).replace(/\s+/gu, ' ').trim();
      if (/[\p{L}]{2,}/u.test(value)) {
        findings.push({ file: path.relative(ROOT, file), line: lineFor(sourceFile, node.getStart(sourceFile)), kind: 'jsx-text', value });
      }
    }
    if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && USER_FACING_ATTRIBUTES.has(node.name.text) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const value = node.initializer.text.trim();
      if (/[\p{L}]{2,}/u.test(value)) {
        findings.push({ file: path.relative(ROOT, file), line: lineFor(sourceFile, node.getStart(sourceFile)), kind: 'attribute', value });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return findings;
}

async function poMessages(locale: (typeof LOCALES)[number]) {
  const content = await readFile(path.join(SOURCE_ROOT, 'locales', locale, 'messages.po'), 'utf8');
  const result = new Map<string, string>();
  let id = '';
  for (const block of content.split(/\r?\n\r?\n/gu)) {
    const idMatch = block.match(/^msgid "(.*)"$/mu);
    const valueMatch = block.match(/^msgstr "(.*)"$/mu);
    if (!idMatch || !valueMatch || !idMatch[1]) continue;
    id = JSON.parse(`"${idMatch[1]}"`) as string;
    result.set(id, JSON.parse(`"${valueMatch[1]}"`) as string);
  }
  return result;
}

async function main() {
  const sourceFiles = (await filesIn(SOURCE_ROOT)).filter(shouldInspect);
  const findings = (await Promise.all(sourceFiles.map(async (file) => collectFindings(file, await readFile(file, 'utf8'))))).flat();
  const catalogs = await Promise.all(LOCALES.map(async (locale) => [locale, await poMessages(locale)] as const));
  const source = new Map(catalogs).get('en') ?? new Map<string, string>();
  const coverage = Object.fromEntries(catalogs.map(([locale, catalog]) => [locale, {
    total: source.size,
    translated: locale === 'en' ? source.size : [...source.keys()].filter((id) => catalog.get(id)?.trim()).length,
    missing: locale === 'en' ? 0 : [...source.keys()].filter((id) => !catalog.get(id)?.trim()).length,
  }]));

  const report = { generatedAt: new Date().toISOString(), coverage, hardCodedCandidates: findings };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
