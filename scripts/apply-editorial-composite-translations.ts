import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

type Draft = { segments: Array<{ source: string; draft: string }> };

const ROOT = process.cwd();
const editorialPath = path.join(ROOT, 'src', 'data', 'projectEditorialContent.ts');
const trDraft = JSON.parse(await readFile(path.join(ROOT, 'artifacts', 'translation-drafts', 'editor-tr-tllm.json'), 'utf8')) as Draft;
const arDraft = JSON.parse(await readFile(path.join(ROOT, 'artifacts', 'translation-drafts', 'editor-ar-tllm.json'), 'utf8')) as Draft;

function normalizeTr(value: string) {
  return value.trim()
    .replace(/teşvikli konut/giu, 'destekli promosyon konutu')
    .replace(/promosyonel konut/giu, 'promosyon konutu')
    .replace(/proje tipi/giu, 'proje türü')
    .replace(/ticari yüzeyler/giu, 'ticari alanlar');
}

const trBySource = new Map(trDraft.segments.map((segment) => [segment.source.trim(), normalizeTr(segment.draft)]));
const arBySource = new Map(arDraft.segments.map((segment) => [segment.source.trim(), segment.draft.trim()]));
const fileText = await readFile(editorialPath, 'utf8');
const source = ts.createSourceFile(editorialPath, fileText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const replacements: Array<{ start: number; end: number; text: string }> = [];

function literalText(node: ts.Expression) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : undefined;
}

function translated(sourceText: string, locale: 'tr' | 'ar') {
  const value = (locale === 'tr' ? trBySource : arBySource).get(sourceText.trim());
  const identityAllowed = /^(?:\d{4}|AADL|OPGI|R\+\d+|BAS MAZAGRAN)$/u.test(sourceText.trim());
  return value && (value !== sourceText || identityAllowed) ? value : undefined;
}

function quote(value: string) {
  return JSON.stringify(value);
}

function visit(node: ts.Node) {
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
    if (node.expression.text === 'fact' && node.arguments.length === 4) {
      const [labelEnNode, labelFrNode, valueEnNode, valueFrNode] = node.arguments;
      const labelEn = literalText(labelEnNode);
      const valueEn = literalText(valueEnNode);
      if (labelEn && valueEn) {
        const labelAr = translated(labelEn, 'ar');
        const labelTr = translated(labelEn, 'tr');
        const valueAr = translated(valueEn, 'ar');
        const valueTr = translated(valueEn, 'tr');
        if (labelAr && labelTr && valueAr && valueTr) {
          replacements.push({
            start: node.getStart(source),
            end: node.getEnd(),
            text: `fact4(${labelEnNode.getText(source)}, ${labelFrNode.getText(source)}, ${quote(labelAr)}, ${quote(labelTr)}, ${valueEnNode.getText(source)}, ${valueFrNode.getText(source)}, ${quote(valueAr)}, ${quote(valueTr)})`,
          });
        }
      }
    }

    if (node.expression.text === 'item' && node.arguments.length === 3) {
      const [iconNode, enNode, frNode] = node.arguments;
      const en = literalText(enNode);
      if (en) {
        const ar = translated(en, 'ar');
        const tr = translated(en, 'tr');
        if (ar && tr) {
          replacements.push({
            start: node.getStart(source),
            end: node.getEnd(),
            text: `item4(${iconNode.getText(source)}, ${enNode.getText(source)}, ${frNode.getText(source)}, ${quote(ar)}, ${quote(tr)})`,
          });
        }
      }
    }
  }
  ts.forEachChild(node, visit);
}

visit(source);
let updated = fileText;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  updated = updated.slice(0, replacement.start) + replacement.text + updated.slice(replacement.end);
}
await writeFile(editorialPath, updated, 'utf8');
process.stdout.write(`Applied ${replacements.length} fact/item composite translations.\n`);
