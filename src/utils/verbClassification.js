const REGULAR_MODELS = {
  ar: "hablar",
  er: "temer",
  ir: "partir"
};

const PRESENT_ENDINGS = {
  ar: ["o", "as", "a", "amos", "an"],
  er: ["o", "es", "e", "emos", "en"],
  ir: ["o", "es", "e", "imos", "en"]
};

export const VERB_KIND_OPTIONS = [
  { id: "ar", label: "I спряжение", hint: "-ar" },
  { id: "er", label: "II спряжение", hint: "-er" },
  { id: "ir", label: "III спряжение", hint: "-ir" },
  { id: "irregular", label: "Неправильные", hint: "особая модель" }
];

const withoutAccents = (value) => value.normalize("NFD").replace(/\p{M}/gu, "");
const consonants = (value) => withoutAccents(value || "").replace(/[aeiou]/gi, "");

export function getVerbFamily(lemma) {
  const ending = lemma.toLocaleLowerCase("es").slice(-2);
  return Object.hasOwn(REGULAR_MODELS, ending) ? ending : null;
}

export function getVerbKind(lemma, table) {
  const family = getVerbFamily(lemma);
  return family && table?.model === REGULAR_MODELS[family] ? family : "irregular";
}

export function isVowelChangingVerb(lemma, table) {
  const family = getVerbFamily(lemma);
  const endings = family && PRESENT_ENDINGS[family];
  const forms = table?.indicative?.Presente;
  if (!family || !endings || !Array.isArray(forms) || forms.length !== endings.length) return false;

  const stem = lemma.slice(0, -2);
  const roots = forms.map((form, index) => form.endsWith(endings[index]) ? form.slice(0, -endings[index].length) : null);
  const changedStem = roots[0];
  return Boolean(
    changedStem
    && roots[3] === stem
    && [0, 1, 2, 4].every((index) => roots[index] === changedStem)
    && changedStem !== stem
    && consonants(changedStem) === consonants(stem)
  );
}

export function getVerbColorKind(lemma, table) {
  if (getVerbKind(lemma, table) !== "irregular") return "regular";
  return isVowelChangingVerb(lemma, table) ? "vowel-change" : "irregular";
}
