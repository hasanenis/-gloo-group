import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const templatePath = "C:/Users/hasan/Downloads/FaturaImportSablon.xlsx";
const outputDir = "C:/Users/hasan/Documents/igloo-construction/outputs/fatura-import-20260703";
const mode = process.argv[2] || "inspect";

async function loadWorkbook() {
  const input = await FileBlob.load(templatePath);
  return SpreadsheetFile.importXlsx(input);
}

async function saveBlob(blob, filename) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, filename), bytes);
}

async function inspectTemplate() {
  const workbook = await loadWorkbook();
  const overview = await workbook.inspect({
    kind: "workbook,sheet,table,region,definedName",
    maxChars: 12000,
    tableMaxRows: 12,
    tableMaxCols: 40,
    tableMaxCellChars: 120,
  });
  console.log("=== OVERVIEW ===");
  console.log(overview.ndjson);

  const sheets = await workbook.inspect({ kind: "sheet", include: "id,name" });
  console.log("=== SHEETS ===");
  console.log(sheets.ndjson);

  const active = workbook.worksheets.getItemAt(0);
  const used = active.getUsedRange();
  console.log("=== ACTIVE USED RANGE VALUES ===");
  console.log(JSON.stringify(used.values, null, 2));

  const preview = await workbook.render({
    sheetName: active.name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await saveBlob(preview, "template-preview.png");
  console.log(`preview=${path.join(outputDir, "template-preview.png")}`);
}

async function main() {
  if (mode === "inspect") {
    await inspectTemplate();
    return;
  }
  throw new Error(`Unknown mode: ${mode}`);
}

await main();
