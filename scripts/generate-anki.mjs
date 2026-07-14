import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import packageJson from "../package.json" with { type: "json" };
import lexicon from "../src/data/lexicon.json" with { type: "json" };
import { patterns } from "../src/data/patterns.js";
import { sentenceBank } from "../src/data/sentenceBank.js";
import { quizletCounts, quizletRows } from "./quizlet-data.mjs";

const version = packageJson.version.replace(/\.0\.0$/, "").replace(/\.0$/, "");
const outputDirectory = path.resolve("public/downloads");
const output = path.join(outputDirectory, `MDSI-es-419-v${version}.apkg`);
const manifestPath = path.resolve("src/data/ankiManifest.json");
const input = path.join(os.tmpdir(), `mdsi-anki-${process.pid}.json`);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(input, JSON.stringify({ version, lexicon, sentences: sentenceBank, patterns }));

const result = spawnSync("python3", [path.resolve("scripts/package-anki.py"), input, output], { encoding:"utf8" });
fs.rmSync(input, { force:true });
if (result.status !== 0) throw new Error(result.stderr || result.stdout || "Не удалось собрать Anki-пакет");

const report = JSON.parse(result.stdout.trim().split("\n").at(-1));
const manifest = {
  version,
  filename:path.basename(output),
  quizletFilename:`MDSI-es-419-v${version}-Quizlet.txt`,
  polyglotFilename:`MDSI-es-419-v${version}-Polyglot.xlsx`,
  quizletCards:quizletRows.length,
  polyglotCards:quizletRows.length,
  quizletLexicalCards:quizletCounts.lexicon,
  quizletPhraseCards:quizletCounts.phrase,
  quizletPatternCards:quizletCounts.pattern,
  lexicalNotes:lexicon.length,
  lexicalCards:lexicon.length * 2,
  phraseCards:sentenceBank.length,
  patternCards:patterns.length,
  totalNotes:report.notes,
  totalCards:report.cards,
  deckCount:3,
  standard:"es-419"
};
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Anki: ${manifest.totalCards} карточки → ${output}`);
