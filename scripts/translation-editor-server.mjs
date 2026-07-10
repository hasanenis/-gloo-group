import express from 'express';
import ts from 'typescript';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const port = Number(process.env.TRANSLATION_EDITOR_PORT || 3030);

// Every data/content file that can hold `{ en, fr, dz?/'ar-DZ'?, tr? }`
// literals or `localValue(en, fr, dz, tr)` calls.
const TARGET_FILES = [
  'src/data/homepageContent.ts',
  'src/data/projects.ts',
  'src/data/projectContent.generated.ts',
  'src/data/projectEditorialContent.ts',
  'src/data/batProjectModel.ts',
  'src/data/manualProjectImages.ts',
  'src/pages/ProjectDetail.tsx',
];

// UI-chrome strings live in Lingui .po catalogs, not TS objects.
const PO_LOCALES = ['en', 'fr', 'ar-DZ', 'tr'];
const PO_DIR = 'src/locales';

const LOCALE_KEYS = ['en', 'fr', 'dz', 'ar-DZ', 'tr'];
const AR_KEYS = new Set(['dz', 'ar-DZ']);

function isStringy(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

const LOCALE_LEAF_NAMES = new Set(['en', 'fr', 'dz', 'ar-DZ', 'tr']);
function canonicalLocaleKey(name) {
  return name === 'ar-DZ' ? 'dz' : name;
}

/**
 * Auto-discovers per-file "translation factory" helpers — e.g.
 * `const text = (en, fr) => ({ en, fr })` or
 * `const fact = (labelEn, labelFr, valueEn, valueFr) => ({ label: text(labelEn, labelFr), value: text(valueEn, valueFr) })` —
 * without hardcoding their names, so call sites like `text(...)`/`fact(...)`
 * are recognized as translatable just like plain object literals are.
 * Returns Map<helperName, { paramNames, fields: [{ path: string[], paramIndex }] }>.
 */
function resolveHelpers(source) {
  const raw = new Map(); // name -> { paramNames, bodyExpr }

  function bodyExprOf(fn) {
    if (ts.isArrowFunction(fn)) {
      return ts.isBlock(fn.body)
        ? fn.body.statements.find(ts.isReturnStatement)?.expression
        : ts.isParenthesizedExpression(fn.body)
          ? fn.body.expression
          : fn.body;
    }
    if (ts.isFunctionDeclaration(fn) && fn.body) {
      return fn.body.statements.find(ts.isReturnStatement)?.expression;
    }
    return undefined;
  }

  function collect(node) {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer && ts.isArrowFunction(decl.initializer)) {
          const body = bodyExprOf(decl.initializer);
          if (body) raw.set(decl.name.text, { paramNames: decl.initializer.parameters.map((p) => p.name.getText(source)), bodyExpr: body });
        }
      }
    }
    if (ts.isFunctionDeclaration(node) && node.name) {
      const body = bodyExprOf(node);
      if (body) raw.set(node.name.text, { paramNames: node.parameters.map((p) => p.name.getText(source)), bodyExpr: body });
    }
    ts.forEachChild(node, collect);
  }
  collect(source);

  const resolved = new Map();
  const inProgress = new Set();

  function resolve(name) {
    if (resolved.has(name)) return resolved.get(name);
    if (inProgress.has(name) || !raw.has(name)) return null;
    inProgress.add(name);

    const { paramNames, bodyExpr } = raw.get(name);
    const spec = bodyExpr && ts.isObjectLiteralExpression(bodyExpr) ? { paramNames, fields: [] } : null;

    if (spec) {
      for (const prop of bodyExpr.properties) {
        // `{ en, fr }` parses as ShorthandPropertyAssignment (name doubles
        // as the referenced identifier), while `{ 'ar-DZ': dz }` parses as
        // a regular PropertyAssignment — this file's helpers mix both.
        if (ts.isShorthandPropertyAssignment(prop)) {
          const propName = prop.name.text;
          const paramIndex = paramNames.indexOf(propName);
          if (paramIndex >= 0 && LOCALE_LEAF_NAMES.has(propName)) {
            spec.fields.push({ path: [canonicalLocaleKey(propName)], paramIndex });
          }
          continue;
        }

        if (!ts.isPropertyAssignment(prop)) continue;
        const propName = ts.isIdentifier(prop.name) ? prop.name.text : ts.isStringLiteral(prop.name) ? prop.name.text : null;
        if (!propName) continue;
        const init = prop.initializer;

        if (ts.isIdentifier(init)) {
          const paramIndex = paramNames.indexOf(init.text);
          if (paramIndex >= 0 && LOCALE_LEAF_NAMES.has(propName)) {
            spec.fields.push({ path: [canonicalLocaleKey(propName)], paramIndex });
          }
          continue;
        }

        if (ts.isCallExpression(init) && ts.isIdentifier(init.expression)) {
          const nested = resolve(init.expression.text);
          if (!nested) continue;
          for (const field of nested.fields) {
            const nestedArg = init.arguments[field.paramIndex];
            if (nestedArg && ts.isIdentifier(nestedArg)) {
              const outerIndex = paramNames.indexOf(nestedArg.text);
              if (outerIndex >= 0) {
                spec.fields.push({ path: [propName, ...field.path], paramIndex: outerIndex });
              }
            }
          }
        }
      }
    }

    inProgress.delete(name);
    resolved.set(name, spec);
    return spec;
  }

  for (const name of raw.keys()) resolve(name);
  return resolved;
}

/**
 * Walks a source file and returns every `{ en: "...", fr?: "...", ... }`
 * object literal plus every call to an auto-discovered translation helper
 * (see `resolveHelpers`), in stable pre-order traversal order. Re-run on
 * every request against fresh file text so string-literal edits never
 * invalidate earlier indices (the traversal order/count only changes if
 * someone adds/removes an entry by hand, not when we rewrite a string's
 * contents).
 */
function scanFile(fileText, fileName) {
  const source = ts.createSourceFile(fileName, fileText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const helperSpecs = resolveHelpers(source);
  const entries = [];

  function labelFor(node) {
    let current = node.parent;
    while (current) {
      if (ts.isPropertyAssignment(current) && ts.isIdentifier(current.name)) {
        return current.name.text;
      }
      if (ts.isVariableDeclaration(current) && ts.isIdentifier(current.name)) {
        return current.name.text;
      }
      if (ts.isCallExpression(current) && ts.isIdentifier(current.expression)) {
        return current.expression.text;
      }
      current = current.parent;
    }
    return '(root)';
  }

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const props = {};
      for (const prop of node.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const name = ts.isIdentifier(prop.name)
          ? prop.name.text
          : ts.isStringLiteral(prop.name)
            ? prop.name.text
            : null;
        if (!name) continue;
        if (!isStringy(prop.initializer)) continue;
        props[name] = {
          propStart: prop.getStart(source),
          propEnd: prop.getEnd(),
          valueStart: prop.initializer.getStart(source),
          valueEnd: prop.initializer.getEnd(),
          text: prop.initializer.text,
        };
      }

      if (props.en) {
        entries.push({
          kind: 'object',
          label: labelFor(node),
          objectStart: node.getStart(source),
          objectEnd: node.getEnd(),
          props,
        });
      }
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && helperSpecs.get(node.expression.text)) {
      const spec = helperSpecs.get(node.expression.text);
      const argCount = node.arguments.length;
      const groups = new Map(); // groupKey -> fields[]
      for (const field of spec.fields) {
        const groupKey = field.path.slice(0, -1).join('.');
        const localeKey = field.path[field.path.length - 1];
        if (!groups.has(groupKey)) groups.set(groupKey, {});
        groups.get(groupKey)[localeKey] = field.paramIndex;
      }

      for (const [groupKey, localeToParamIndex] of groups.entries()) {
        if (localeToParamIndex.en == null) continue; // every real entry needs an English source
        const props = {};
        for (const [localeKey, paramIndex] of Object.entries(localeToParamIndex)) {
          const arg = node.arguments[paramIndex];
          props[localeKey] =
            paramIndex < argCount && arg && isStringy(arg)
              ? { valueStart: arg.getStart(source), valueEnd: arg.getEnd(), text: arg.text, paramIndex }
              : { paramIndex }; // declared by the helper but not supplied at this call site
        }
        entries.push({
          kind: 'call',
          label: labelFor(node) + '()' + (groupKey ? ' · ' + groupKey : ''),
          objectStart: node.getStart(source),
          objectEnd: node.getEnd(),
          props,
          callArgCount: argCount,
          lastArgEnd: argCount > 0 ? node.arguments[argCount - 1].getEnd() : node.getEnd() - 1,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return entries;
}

function quoteFor(text) {
  return text.includes("'") && !text.includes('"') ? '"' : "'";
}

function escapeForQuote(text, quote) {
  return text.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote);
}

function serializeStringLiteral(text) {
  const quote = quoteFor(text);
  return quote + escapeForQuote(text, quote) + quote;
}

function indentOf(fileText, pos) {
  let lineStart = pos;
  while (lineStart > 0 && fileText[lineStart - 1] !== '\n') lineStart -= 1;
  let indent = '';
  for (let index = lineStart; index < fileText.length; index += 1) {
    const char = fileText[index];
    if (char === ' ' || char === '\t') indent += char;
    else break;
  }
  return indent;
}

/**
 * Applies one field edit to a single entry, returning the new file text.
 * Only ever touches one property's source span (or inserts a new
 * property/argument) — every other byte of the file is untouched.
 */
function applyEdit(fileText, entry, locale, value) {
  const arKey = entry.props['ar-DZ'] ? 'ar-DZ' : entry.props.dz ? 'dz' : locale === 'dz' ? 'dz' : 'ar-DZ';
  const key = AR_KEYS.has(locale) ? arKey : locale;
  const existing = entry.props[key];

  if (existing && existing.valueStart != null) {
    const literal = serializeStringLiteral(value);
    return fileText.slice(0, existing.valueStart) + literal + fileText.slice(existing.valueEnd);
  }

  if (entry.kind === 'call') {
    if (!existing) {
      throw new Error('Bu yardımcı fonksiyon bu dili desteklemiyor (parametre listesinde yok).');
    }
    // Positional helper call (e.g. text4(en, fr, dz, tr)) — JS can't skip a
    // positional argument, so any gap between the currently-supplied
    // arguments and the target locale's slot must be filled with a literal
    // `undefined`, never invented text (that would silently duplicate
    // English into an untranslated locale slot).
    const gapCount = existing.paramIndex - entry.callArgCount;
    const segments = [];
    for (let i = 0; i < gapCount; i += 1) segments.push('undefined');
    segments.push(serializeStringLiteral(value));
    return fileText.slice(0, entry.lastArgEnd) + ', ' + segments.join(', ') + fileText.slice(entry.lastArgEnd);
  }

  // Object literal missing this locale key — insert right after the last
  // present locale key (en/fr/dz|ar-DZ/tr canonical order), matching
  // indentation of the `en` property.
  const order = ['en', 'fr', 'dz', 'ar-DZ', 'tr'];
  const present = order.filter((name) => entry.props[name]);
  const lastKey = present[present.length - 1] ?? 'en';
  const anchor = entry.props[lastKey];
  const indent = indentOf(fileText, entry.props.en.propStart);
  const literal = serializeStringLiteral(value);
  const serializedKey = key.includes('-') ? JSON.stringify(key) : key;
  const insertion = `,\n${indent}${serializedKey}: ${literal}`;
  return fileText.slice(0, anchor.propEnd) + insertion + fileText.slice(anchor.propEnd);
}

async function readEntries(relPath) {
  const absPath = path.join(rootDir, relPath);
  const fileText = await fs.readFile(absPath, 'utf8');
  const entries = scanFile(fileText, absPath);
  return entries.map((entry, index) => ({
    id: `${relPath}#${index}`,
    file: relPath,
    kind: entry.kind,
    label: entry.label,
    en: entry.props.en?.text ?? '',
    fr: entry.props.fr?.text ?? '',
    dz: entry.props.dz?.text ?? entry.props['ar-DZ']?.text ?? '',
    tr: entry.props.tr?.text ?? '',
  }));
}

// --- Lingui .po catalog handling (UI chrome strings) -----------------

function parsePo(text) {
  const entries = [];
  const regex = /msgid "((?:[^"\\]|\\.)*)"\s*\nmsgstr "((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = regex.exec(text))) {
    const msgid = match[1];
    if (msgid === '') continue; // header block
    entries.push({ msgid, msgstr: match[2].replace(/\\"/g, '"'), start: match.index, end: match.index + match[0].length });
  }
  return entries;
}

async function readPoCatalogs() {
  const catalogs = {};
  for (const locale of PO_LOCALES) {
    const absPath = path.join(rootDir, PO_DIR, locale, 'messages.po');
    try {
      const text = await fs.readFile(absPath, 'utf8');
      catalogs[locale] = parsePo(text);
    } catch {
      catalogs[locale] = [];
    }
  }

  const byMsgid = new Map();
  for (const locale of PO_LOCALES) {
    for (const entry of catalogs[locale]) {
      if (!byMsgid.has(entry.msgid)) byMsgid.set(entry.msgid, { msgid: entry.msgid });
      byMsgid.get(entry.msgid)[locale] = entry.msgstr;
    }
  }
  return Array.from(byMsgid.values());
}

async function writePoEntry(locale, msgid, value) {
  const absPath = path.join(rootDir, PO_DIR, locale, 'messages.po');
  const text = await fs.readFile(absPath, 'utf8');
  const escaped = msgid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(msgid "${escaped}"\\s*\\nmsgstr ")((?:[^"\\\\]|\\\\.)*)(")`);
  const newValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (!regex.test(text)) throw new Error(`msgid not found in ${locale}: ${msgid}`);
  const updated = text.replace(regex, `$1${newValue}$3`);
  await fs.writeFile(absPath, updated, 'utf8');
}

// --- Server ------------------------------------------------------------

const app = express();
app.use(express.json({ limit: '5mb' }));

app.get('/api/entries', async (_req, res) => {
  const groups = {};
  for (const relPath of TARGET_FILES) {
    try {
      groups[relPath] = await readEntries(relPath);
    } catch (error) {
      groups[relPath] = { error: String(error?.message ?? error) };
    }
  }
  res.json(groups);
});

function syntaxErrorCount(fileText, fileName) {
  const source = ts.createSourceFile(fileName, fileText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  return source.parseDiagnostics?.length ?? 0;
}

app.post('/api/entries/save', async (req, res) => {
  const { file, index, locale, value } = req.body ?? {};
  if (!TARGET_FILES.includes(file)) return res.status(400).json({ error: 'Unknown file' });
  if (!LOCALE_KEYS.includes(locale)) return res.status(400).json({ error: 'Unknown locale' });

  try {
    const absPath = path.join(rootDir, file);
    const fileText = await fs.readFile(absPath, 'utf8');
    const entries = scanFile(fileText, absPath);
    const entry = entries[index];
    if (!entry) return res.status(404).json({ error: 'Entry not found (file structure changed — reload)' });

    const updatedText = applyEdit(fileText, entry, locale, String(value ?? ''));

    // Never let an edit corrupt the file: if applying it introduces new
    // parse errors, refuse to write. (An earlier span-math bug once wrote an
    // unquoted `ar-DZ:` key and every subsequent save compounded the damage —
    // this guard makes that whole failure class impossible.)
    if (syntaxErrorCount(updatedText, absPath) > syntaxErrorCount(fileText, absPath)) {
      return res.status(500).json({
        error: 'Kaydetme iptal edildi: bu değişiklik dosyada sözdizimi hatası oluşturacaktı. Sayfayı yenileyip tekrar deneyin.',
      });
    }

    await fs.writeFile(absPath, updatedText, 'utf8');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: String(error?.message ?? error) });
  }
});

app.get('/api/po', async (_req, res) => {
  try {
    res.json(await readPoCatalogs());
  } catch (error) {
    res.status(500).json({ error: String(error?.message ?? error) });
  }
});

app.post('/api/po/save', async (req, res) => {
  const { locale, msgid, value } = req.body ?? {};
  if (!PO_LOCALES.includes(locale)) return res.status(400).json({ error: 'Unknown locale' });
  try {
    await writePoEntry(locale, msgid, String(value ?? ''));
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: String(error?.message ?? error) });
  }
});

app.get('/', (_req, res) => {
  res.type('html').send(html);
});

app.listen(port, () => {
  console.log(`Translation editor: http://localhost:${port}`);
});

const html = `<!doctype html>
<html lang="tr" data-dir="ltr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Igloo — Çeviri Editörü</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #f4f4f2; color: #1a1a1a; }
  header { position: sticky; top: 0; z-index: 5; background: #111; color: #fff; padding: 14px 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  header h1 { font-size: 15px; margin: 0; font-weight: 600; letter-spacing: 0.02em; }
  header input[type="search"] { flex: 1; min-width: 220px; padding: 8px 12px; border-radius: 6px; border: none; font-size: 13px; }
  header .tabs { display: flex; gap: 6px; }
  header .tabs button { background: #262626; color: #ccc; border: none; padding: 7px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; }
  header .tabs button.active { background: #e1251b; color: #fff; }
  main { padding: 18px; max-width: 1400px; margin: 0 auto; }
  .file-group { background: #fff; border-radius: 10px; margin-bottom: 16px; overflow: hidden; border: 1px solid #e4e4e0; }
  .file-group summary { cursor: pointer; padding: 12px 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #555; background: #fafaf8; list-style: none; display: flex; justify-content: space-between; }
  .file-group summary::-webkit-details-marker { display: none; }
  .file-group summary .count { color: #999; font-weight: 500; text-transform: none; letter-spacing: normal; }
  .entry { padding: 14px 16px; border-top: 1px solid #eee; display: grid; grid-template-columns: 220px 1fr; gap: 14px; }
  .entry .label { font-size: 11px; color: #999; font-weight: 600; padding-top: 6px; word-break: break-word; }
  .entry .en-ref { font-size: 13px; color: #333; background: #f7f7f5; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; white-space: pre-wrap; }
  .field-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
  .field-row .badge { flex: 0 0 34px; font-size: 10px; font-weight: 700; color: #888; padding-top: 9px; }
  .field-row textarea { flex: 1; min-height: 40px; resize: vertical; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; font-family: inherit; line-height: 1.45; }
  .field-row textarea.ar { direction: rtl; font-family: "IBM Plex Sans Arabic", Tahoma, sans-serif; }
  .field-row .status { flex: 0 0 18px; padding-top: 10px; font-size: 13px; }
  .status.saved { color: #1a9d5b; }
  .status.saving { color: #999; }
  .status.error { color: #d33; }
  .hidden { display: none !important; }
  .empty { padding: 24px; text-align: center; color: #999; font-size: 13px; }
</style>
</head>
<body>
<header>
  <h1>Igloo — Çeviri Editörü</h1>
  <input type="search" id="search" placeholder="Metin ara (EN)…" />
  <div class="tabs" id="tabs">
    <button data-tab="content" class="active">İçerik (sayfalar)</button>
    <button data-tab="ui">Arayüz metinleri</button>
  </div>
</header>
<main>
  <div id="content-view"></div>
  <div id="ui-view" class="hidden"></div>
</main>
<script>
const \$ = (sel, root = document) => root.querySelector(sel);
const \$\$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

let contentGroups = {};
let poEntries = [];
let currentTab = 'content';

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function fieldRow(labelText, cssClass, value, onSave) {
  const row = document.createElement('div');
  row.className = 'field-row';
  row.innerHTML = '<span class="badge">' + labelText + '</span>' +
    '<textarea class="' + cssClass + '"></textarea>' +
    '<span class="status"></span>';
  const textarea = row.querySelector('textarea');
  const status = row.querySelector('.status');
  textarea.value = value || '';

  const save = debounce(async () => {
    status.textContent = '⏳';
    status.className = 'status saving';
    try {
      await onSave(textarea.value);
      status.textContent = '✓';
      status.className = 'status saved';
      setTimeout(() => { if (status.textContent === '✓') status.textContent = ''; }, 1500);
    } catch (error) {
      status.textContent = '✗';
      status.className = 'status error';
      status.title = String(error);
    }
  }, 500);

  textarea.addEventListener('input', save);
  return row;
}

function renderContent(filterText) {
  const view = \$('#content-view');
  view.innerHTML = '';
  const filter = (filterText || '').toLowerCase();

  for (const [file, entries] of Object.entries(contentGroups)) {
    if (entries.error) continue;
    const filtered = filter
      ? entries.filter((e) => e.en.toLowerCase().includes(filter) || e.label.toLowerCase().includes(filter))
      : entries;
    if (!filtered.length) continue;

    const details = document.createElement('details');
    details.className = 'file-group';
    details.open = Boolean(filter);
    const summary = document.createElement('summary');
    summary.innerHTML = '<span>' + file + '</span><span class="count">' + filtered.length + ' metin</span>';
    details.appendChild(summary);

    filtered.forEach((entry) => {
      const wrap = document.createElement('div');
      wrap.className = 'entry';
      const originalIndex = entries.indexOf(entry);

      const left = document.createElement('div');
      left.className = 'label';
      left.textContent = entry.label;
      wrap.appendChild(left);

      const right = document.createElement('div');

      const saveField = (locale) => async (value) => {
        const response = await fetch('/api/entries/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file, index: originalIndex, locale, value }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Kaydetme hatası');
      };

      right.appendChild(fieldRow('EN', 'en', entry.en, saveField('en')));
      right.appendChild(fieldRow('FR', 'fr', entry.fr, saveField('fr')));
      right.appendChild(fieldRow('TR', 'tr', entry.tr, saveField('tr')));
      right.appendChild(fieldRow('AR', 'ar', entry.dz, saveField('dz')));

      wrap.appendChild(right);
      details.appendChild(wrap);
    });

    view.appendChild(details);
  }

  if (!view.children.length) {
    view.innerHTML = '<div class="empty">Sonuç yok.</div>';
  }
}

function renderUi(filterText) {
  const view = \$('#ui-view');
  view.innerHTML = '';
  const filter = (filterText || '').toLowerCase();
  const filtered = filter
    ? poEntries.filter((e) => (e.en || '').toLowerCase().includes(filter) || e.msgid.toLowerCase().includes(filter))
    : poEntries;

  if (!filtered.length) {
    view.innerHTML = '<div class="empty">Sonuç yok.</div>';
    return;
  }

  const details = document.createElement('details');
  details.className = 'file-group';
  details.open = true;
  const summary = document.createElement('summary');
  summary.innerHTML = '<span>Arayüz metinleri (nav, butonlar, etiketler)</span><span class="count">' + filtered.length + ' metin</span>';
  details.appendChild(summary);

  filtered.forEach((entry) => {
    const wrap = document.createElement('div');
    wrap.className = 'entry';
    const left = document.createElement('div');
    left.className = 'label';
    left.textContent = entry.msgid;
    wrap.appendChild(left);

    const right = document.createElement('div');

    const saveField = (locale) => async (value) => {
      const response = await fetch('/api/po/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, msgid: entry.msgid, value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kaydetme hatası');
    };

    right.appendChild(fieldRow('EN', 'en', entry.en, saveField('en')));
    right.appendChild(fieldRow('FR', 'fr', entry.fr, saveField('fr')));
    right.appendChild(fieldRow('TR', 'tr', entry.tr, saveField('tr')));
    right.appendChild(fieldRow('AR', 'ar', entry['ar-DZ'], saveField('ar-DZ')));

    wrap.appendChild(right);
    details.appendChild(wrap);
  });

  view.appendChild(details);
}

function applyFilter() {
  const filterText = \$('#search').value;
  if (currentTab === 'content') renderContent(filterText);
  else renderUi(filterText);
}

\$('#search').addEventListener('input', debounce(applyFilter, 150));

\$\$('#tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    \$\$('#tabs button').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    currentTab = button.dataset.tab;
    \$('#content-view').classList.toggle('hidden', currentTab !== 'content');
    \$('#ui-view').classList.toggle('hidden', currentTab !== 'ui');
    applyFilter();
  });
});

async function load() {
  const [contentRes, poRes] = await Promise.all([
    fetch('/api/entries').then((r) => r.json()),
    fetch('/api/po').then((r) => r.json()),
  ]);
  contentGroups = contentRes;
  poEntries = poRes;
  renderContent('');
  renderUi('');
}

load();
</script>
</body>
</html>`;
