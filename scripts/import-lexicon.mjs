import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

const input = path.resolve("content/es-419/lexico_es_500_v01.xlsx");
const output = path.resolve("src/data/lexicon.json");
const workbook = XLSX.readFile(input);
const worksheet = workbook.Sheets["Léxico 500"];

if (!worksheet) throw new Error("Не найден лист «Léxico 500»");

const sourceRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
const rows = sourceRows.map((row) => ({
  id: `es-${String(row["№"]).padStart(4, "0")}`,
  rank: Number(row["№"]),
  lemma: row["Español"],
  type: row["Часть речи / тип"],
  translation: row["Перевод"],
  forms: row["Формы / варианты"],
  example: row["Пример"],
  exampleRu: row["Перевод примера"],
  tag: row["Метка"],
  language: "es-419",
  status: "prototype"
}));

if (rows.length !== 500) throw new Error(`Ожидалось 500 строк, получено ${rows.length}`);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(rows, null, 2)}\n`);
console.log(`Импортировано ${rows.length} единиц → ${output}`);
