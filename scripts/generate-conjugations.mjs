import fs from "node:fs";
import path from "node:path";
import conjugateEsp from "@jirimracek/conjugate-esp";
import lexicon from "../src/data/lexicon.json" with { type:"json" };

const { Conjugator } = conjugateEsp;
const conjugator = new Conjugator("2010");
const verbs = lexicon.filter((item) => item.type.toLowerCase().includes("глагол"));
const activePersonIndexes = [0, 1, 2, 3, 5];
const selectActivePeople = (forms) => activePersonIndexes.map((index) => forms[index] ?? "—");

const data = Object.fromEntries(verbs.map((item) => {
  const regional = conjugator.conjugateSync(item.lemma, "canarias");
  const formal = conjugator.conjugateSync(item.lemma, "formal");
  if (!Array.isArray(regional) || !Array.isArray(formal)) throw new Error(`Не удалось спрягать ${item.lemma}`);
  const full = regional.find((result) => !result.info.defective) || regional[0];
  const formalFull = formal.find((result) => !result.info.defective) || formal[0];
  const table = full.conjugation;
  const formalImperative = formalFull.conjugation.Imperativo;
  return [item.lemma, {
    sourceId:item.id,
    model:full.info.model,
    nonFinite:table.Impersonal,
    indicative:Object.fromEntries(Object.entries(table.Indicativo).map(([tense, forms]) => [tense, selectActivePeople(forms)])),
    subjunctive:Object.fromEntries(Object.entries(table.Subjuntivo).map(([tense, forms]) => [tense, selectActivePeople(forms)])),
    imperative:{
      Afirmativo:[table.Imperativo.Afirmativo[1], formalImperative.Afirmativo[1], formalImperative.Afirmativo[4]],
      Negativo:[table.Imperativo.Negativo[1], formalImperative.Negativo[1], formalImperative.Negativo[4]]
    },
    specialForms:item.lemma === "haber" ? ["hay"] : []
  }];
}));

if (Object.keys(data).length !== verbs.length) throw new Error(`Ожидалось ${verbs.length} таблиц, получено ${Object.keys(data).length}`);
for (const [verb, table] of Object.entries(data)) {
  if (Object.keys(table.indicative).length !== 10 || Object.keys(table.subjunctive).length !== 8) throw new Error(`Неполная таблица: ${verb}`);
}

const output = path.resolve("src/data/conjugations.json");
fs.writeFileSync(output, `${JSON.stringify(data)}\n`);
console.log(`Сгенерировано ${verbs.length} полных таблиц спряжения → ${output}`);
