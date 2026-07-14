import lexicon from "../src/data/lexicon.json" with { type: "json" };
import { patternCategories, patterns } from "../src/data/patterns.js";
import { sentenceBank } from "../src/data/sentenceBank.js";

const clean = (value) => String(value || "").replace(/[\t\r\n]+/g, " ").replace(/\s+/g, " ").trim();

const joinTags = (...values) => [...new Set(values.flatMap((value) => clean(value).split(/\s*;\s*/u)).filter(Boolean))].join("; ");

function splitTranslation(value) {
  const [translation = "", ...additional] = clean(value).split(/\s*;\s*/u);
  return { translation, additionalTranslation:additional.join("; ") };
}

function lexicalTerm(item) {
  const lemma = clean(item.lemma);
  if (!/^существительное/iu.test(item.type) || /^(?:el|la)\s+/iu.test(lemma)) return lemma;
  const article = clean(item.forms).match(/(?:^|[;,]\s*)(el|la)\s+/iu)?.[1];
  return article ? `${article.toLowerCase()} ${lemma}` : lemma;
}

const candidates = [
  ...lexicon.map((item) => ({
    kind:"lexicon",
    term:lexicalTerm(item),
    definition:clean(item.translation),
    tags:joinTags(item.type, item.tag),
    transcription:"",
    ...splitTranslation(item.translation),
    examples:item.example && item.exampleRu ? `${clean(item.example)} — ${clean(item.exampleRu)}` : ""
  })),
  ...patterns.map((pattern) => ({
    kind:"pattern",
    term:clean(pattern.template),
    definition:clean(pattern.translation),
    tags:joinTags("паттерн", patternCategories.find((category) => category.id === pattern.category)?.label, pattern.function),
    transcription:"",
    translation:clean(pattern.translation),
    additionalTranslation:"",
    examples:pattern.examples.map(([es, ru]) => `${clean(es)} — ${clean(ru)}`).join("\n")
  })),
  ...sentenceBank.map((sentence) => ({
    kind:"phrase",
    term:clean(sentence.es),
    definition:clean(sentence.ru),
    tags:joinTags("фраза", sentence.focus),
    transcription:"",
    translation:clean(sentence.ru),
    additionalTranslation:"",
    examples:""
  }))
];

const seenTerms = new Set();
export const quizletRows = candidates.filter((row) => {
  if (!row.term || !row.definition) return false;
  const key = row.term.toLocaleLowerCase("es");
  if (seenTerms.has(key)) return false;
  seenTerms.add(key);
  return true;
});

export const quizletCounts = quizletRows.reduce((counts, row) => ({ ...counts, [row.kind]:counts[row.kind] + 1 }), { lexicon:0, pattern:0, phrase:0 });

export const polyglotRows = quizletRows.map((row) => ({
  learned:"",
  tags:row.tags,
  word:row.term,
  transcription:row.transcription,
  translation:row.translation,
  additionalTranslation:row.additionalTranslation,
  examples:row.examples,
  kind:row.kind
}));
