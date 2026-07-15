export const PERSONS = ["yo", "tú", "él / ella / usted", "nosotros / nosotras", "ellos / ellas / ustedes"];
export const IMPERATIVE_PERSONS = ["tú", "usted", "ustedes"];

export const INDICATIVE_TENSES = [
  ["Presente", "Presente", "Настоящее"],
  ["PreteritoImperfecto", "Pretérito imperfecto", "Прошедшее незавершённое"],
  ["PreteritoIndefinido", "Pretérito indefinido", "Прошедшее завершённое"],
  ["FuturoImperfecto", "Futuro simple", "Будущее"],
  ["CondicionalSimple", "Condicional simple", "Условное"],
  ["PreteritoPerfecto", "Pretérito perfecto", "Прошедшее сложное"],
  ["PreteritoPluscuamperfecto", "Pretérito pluscuamperfecto", "Предпрошедшее"],
  ["PreteritoAnterior", "Pretérito anterior", "Предшествующее прошедшее"],
  ["FuturoPerfecto", "Futuro perfecto", "Будущее сложное"],
  ["CondicionalCompuesto", "Condicional compuesto", "Условное сложное"]
];

export const SUBJUNCTIVE_TENSES = [
  ["Presente", "Presente", "Настоящее"],
  ["PreteritoImperfectoRa", "Pretérito imperfecto · -ra", "Прошедшее · форма -ra"],
  ["PreteritoImperfectoSe", "Pretérito imperfecto · -se", "Прошедшее · форма -se"],
  ["FuturoImperfecto", "Futuro simple", "Будущее"],
  ["PreteritoPerfecto", "Pretérito perfecto", "Прошедшее сложное"],
  ["PreteritoPluscuamperfectoRa", "Pluscuamperfecto · -ra", "Предпрошедшее · форма -ra"],
  ["PreteritoPluscuamperfectoSe", "Pluscuamperfecto · -se", "Предпрошедшее · форма -se"],
  ["FuturoPerfecto", "Futuro perfecto", "Будущее сложное"]
];

export const IMPERATIVE_TENSES = [
  ["Afirmativo", "Afirmativo", "Утвердительное"],
  ["Negativo", "Negativo", "Отрицательное"]
];

const MOODS = {
  indicative: { label: "Indicativo", ru: "изъявительное", source: "indicative", persons: PERSONS },
  subjunctive: { label: "Subjuntivo", ru: "сослагательное", source: "subjunctive", persons: PERSONS },
  imperative: { label: "Imperativo", ru: "повелительное", source: "imperative", persons: IMPERATIVE_PERSONS }
};

export const TENSE_OPTIONS = [
  ...INDICATIVE_TENSES.map(([key, label, ru]) => ({ id: `indicative.${key}`, mood: "indicative", key, label, ru, moodLabel: MOODS.indicative.label, moodRu: MOODS.indicative.ru, source: MOODS.indicative.source, persons: MOODS.indicative.persons })),
  ...SUBJUNCTIVE_TENSES.map(([key, label, ru]) => ({ id: `subjunctive.${key}`, mood: "subjunctive", key, label, ru, moodLabel: MOODS.subjunctive.label, moodRu: MOODS.subjunctive.ru, source: MOODS.subjunctive.source, persons: MOODS.subjunctive.persons })),
  ...IMPERATIVE_TENSES.map(([key, label, ru]) => ({ id: `imperative.${key}`, mood: "imperative", key, label, ru, moodLabel: MOODS.imperative.label, moodRu: MOODS.imperative.ru, source: MOODS.imperative.source, persons: MOODS.imperative.persons }))
];

export const CORE_TENSE_IDS = [
  "indicative.Presente",
  "indicative.PreteritoIndefinido",
  "indicative.FuturoImperfecto",
  "indicative.CondicionalSimple",
  "subjunctive.Presente",
  "imperative.Afirmativo",
  "imperative.Negativo"
];

export function getTenseOption(id) {
  return TENSE_OPTIONS.find((item) => item.id === id) || TENSE_OPTIONS[0];
}

export function getTenseForms(table, optionOrId) {
  const option = typeof optionOrId === "string" ? getTenseOption(optionOrId) : optionOrId;
  return table?.[option.source]?.[option.key] || [];
}

export function TenseMiniTable({ option, forms, className = "" }) {
  return (
    <section className={`verb-tense-card ${className}`}>
      <header>
        <strong lang="es">{option.label}</strong>
        <span>{option.ru}</span>
      </header>
      <div className="verb-tense-rows">
        {option.persons.map((person, index) => (
          <div className="verb-tense-row" key={`${option.id}-${person}`}>
            <span>{person}</span>
            <b lang="es">{forms[index] || "—"}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VerbConjugationTables({ table, mode = "core" }) {
  const visible = mode === "all" ? TENSE_OPTIONS : TENSE_OPTIONS.filter((item) => CORE_TENSE_IDS.includes(item.id));
  return (
    <div className="verb-mood-list">
      {Object.entries(MOODS).map(([mood, meta]) => {
        const options = visible.filter((item) => item.mood === mood);
        if (!options.length) return null;
        return (
          <details className="verb-mood-group" key={mood} open={mood === "indicative"}>
            <summary>{meta.label} · {meta.ru}</summary>
            <div className="verb-tense-grid">
              {options.map((option) => <TenseMiniTable option={option} forms={getTenseForms(table, option)} key={option.id} />)}
            </div>
          </details>
        );
      })}
    </div>
  );
}
