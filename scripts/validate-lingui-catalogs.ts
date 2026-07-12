import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const LOCALES = ['en', 'fr', 'ar-DZ', 'tr'] as const;
type Locale = (typeof LOCALES)[number];

type CatalogEntry = {
  id: string;
  str: string;
};

const MOJIBAKE = /(?:Ã.|Ã‚.|Ã¢.|Ã˜.|Ã™.|ï¿½)/u;

function placeholders(value: string) {
  return [...value.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/gu)].map((match) => match[1]).sort().join(',');
}

function decodePoString(token: string) {
  return JSON.parse(token) as string;
}

function parsePoCatalog(content: string): CatalogEntry[] {
  const entries: CatalogEntry[] = [];
  let current: CatalogEntry | null = null;
  let field: 'id' | 'str' | null = null;

  const flush = () => {
    if (current) entries.push(current);
    current = null;
    field = null;
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }

    if (line.startsWith('#')) continue;

    if (line.startsWith('msgid ')) {
      if (current && (current.id !== '' || current.str !== '')) {
        flush();
      }
      current = current ?? { id: '', str: '' };
      current.id = decodePoString(line.slice(6));
      field = 'id';
      continue;
    }

    if (line.startsWith('msgstr ')) {
      current = current ?? { id: '', str: '' };
      current.str = decodePoString(line.slice(7));
      field = 'str';
      continue;
    }

    if (line.startsWith('"')) {
      if (!current || !field) continue;
      current[field] += decodePoString(line);
    }
  }

  flush();
  return entries;
}

async function readCatalog(locale: Locale) {
  const filePath = path.join(ROOT, 'src', 'locales', locale, 'messages.po');
  const content = await readFile(filePath, 'utf8');
  const entries = parsePoCatalog(content);
  const messages = new Map<string, string>();

  for (const entry of entries) {
    if (!entry.id) continue;
    if (messages.has(entry.id)) {
      throw new Error(`Duplicate msgid in ${locale}: ${entry.id}`);
    }
    messages.set(entry.id, entry.str);
  }

  return messages;
}

function formatSample(values: string[], limit = 8) {
  return values.slice(0, limit).join(', ') + (values.length > limit ? ` … (+${values.length - limit} more)` : '');
}

async function main() {
  const catalogs = new Map<Locale, Map<string, string>>();
  for (const locale of LOCALES) {
    catalogs.set(locale, await readCatalog(locale));
  }

  const source = catalogs.get('en');
  if (!source) {
    throw new Error('Missing source Lingui catalog for en');
  }

  const sourceIds = [...source.keys()];
  const problems: string[] = [];

  for (const locale of LOCALES.slice(1)) {
    const catalog = catalogs.get(locale);
    if (!catalog) {
      problems.push(`${locale}: catalog missing`);
      continue;
    }

    const missingIds = sourceIds.filter((id) => !catalog.has(id) || !catalog.get(id)?.trim());
    const extraIds = [...catalog.keys()].filter((id) => !source.has(id));

    if (missingIds.length) {
      problems.push(`${locale}: missing ${missingIds.length} ids (${formatSample(missingIds)})`);
    }
    if (extraIds.length) {
      problems.push(`${locale}: has ${extraIds.length} extra ids (${formatSample(extraIds)})`);
    }

    for (const id of sourceIds) {
      const sourceValue = source.get(id) ?? '';
      const targetValue = catalog.get(id) ?? '';
      if (MOJIBAKE.test(targetValue)) {
        problems.push(`${locale}: mojibake in ${id}`);
      }
      if (targetValue.trim() && placeholders(sourceValue) !== placeholders(targetValue)) {
        problems.push(`${locale}: placeholder mismatch in ${id}`);
      }
    }
  }

  if (problems.length) {
    throw new Error(`Lingui catalog validation failed:\n- ${problems.join('\n- ')}`);
  }

  process.stdout.write(`Lingui catalogs validated for ${LOCALES.length} locales.\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
