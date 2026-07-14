import fs from "node:fs";
import path from "node:path";
import packageJson from "../package.json" with { type: "json" };
import { quizletRows } from "./quizlet-data.mjs";

const version = packageJson.version.replace(/\.0\.0$/, "").replace(/\.0$/, "");
const outputDirectory = path.resolve("public/downloads");
const output = path.join(outputDirectory, `MDSI-es-419-v${version}-Quizlet.txt`);

fs.mkdirSync(outputDirectory, { recursive:true });
fs.writeFileSync(output, `${quizletRows.map((row) => `${row.term}\t${row.definition}`).join("\n")}\n`, "utf8");
console.log(`Quizlet: ${quizletRows.length} карточки → ${output}`);
